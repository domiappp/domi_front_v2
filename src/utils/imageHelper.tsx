// utils/compressToWebP.ts
import imageCompression from "browser-image-compression";
import type { Options as ImageCompressionOptions } from "browser-image-compression";

export type CompressResult = {
  file: File;       // archivo WebP comprimido
  blobUrl: string;  // URL de vista previa
  originalKB: number;
  compressedKB: number;
};

export type CompressOptions = {
  targetKB?: number;        // default 80
  maxWidthOrHeight?: number; // default 1600
  minQuality?: number;      // default 0.5
  qualityStep?: number;     // default 0.08
  maxIterations?: number;   // default 4
};

const DEFAULTS: Required<CompressOptions> = {
  targetKB: 80,
  maxWidthOrHeight: 1600,
  minQuality: 0.5,
  qualityStep: 0.08,
  maxIterations: 4,
};

export async function compressToWebP(
  file: File,
  opts: CompressOptions = {}
): Promise<CompressResult> {
  const cfg = { ...DEFAULTS, ...opts };
  const targetBytes = cfg.targetKB * 1024;

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen.");
  }

  let quality = 0.86;
  let maxSide = cfg.maxWidthOrHeight;

  const doPass = async (q: number, widthOrHeight: number) => {
    const options: ImageCompressionOptions = {
      maxSizeMB: cfg.targetKB / 1024,
      maxWidthOrHeight: widthOrHeight,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: q,
    };
    return imageCompression(file, options);
  };

  let compressed = await doPass(quality, maxSide);
  let i = 0;

  while (compressed.size > targetBytes && i < cfg.maxIterations) {
    i++;
    quality = Math.max(cfg.minQuality, quality - cfg.qualityStep);

    if (quality <= cfg.minQuality && maxSide > 900) {
      maxSide = Math.floor(maxSide * 0.85);
    }

    compressed = await doPass(quality, maxSide);
  }

  const outFile = new File([compressed], ensureWebPExt(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return {
    file: outFile,
    blobUrl: URL.createObjectURL(outFile),
    originalKB: Math.round(file.size / 1024),
    compressedKB: Math.round(outFile.size / 1024),
  };
}

function ensureWebPExt(name: string) {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base}.webp`;
}
