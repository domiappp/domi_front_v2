// SkeletonCardComercio.tsx
import React from "react";

export const SkeletonCardComercio: React.FC = () => {
  return (
    <article className="
      relative flex flex-col 
      overflow-hidden rounded-2xl 
      bg-white/95 pb-3 
      shadow-2xl ring-1 ring-slate-100
    ">
      {/* Botón favorito */}
      <div
        className="
          absolute right-2 top-2 z-10 
          grid h-9 w-9 place-items-center 
          rounded-full bg-white/90 backdrop-blur-md 
          shadow-md ring-1 ring-slate-200
        "
      >
        <div className="skeleton h-4 w-4 rounded-full" />
      </div>

      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <div className="skeleton h-full w-full" />

        {/* Gradiente igual al real */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Pill de estado */}
        <div className="absolute left-2 bottom-2">
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="min-w-0 px-3 sm:px-4 pt-2 flex flex-col gap-2">

        {/* Nombre */}
        <div className="skeleton h-4 w-5/6 rounded" />

        {/* Segunda línea del nombre (simula wrap) */}
        <div className="skeleton h-3 w-2/3 rounded" />

        {/* Rating */}
        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="skeleton h-3 w-16 rounded-full" />
            <div className="skeleton h-3 w-8 rounded" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 px-3 sm:px-4 flex items-center justify-between gap-2">
        
        {/* Ubicación */}
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
            <div className="skeleton h-3.5 w-3.5 rounded-full" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>

        {/* Botón acción (chevron circular) */}
        <div className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#FF783B] to-[#FF4D3B] shadow-md">
          <div className="skeleton h-4 w-4 rounded-full bg-white/60" />
        </div>
      </div>
    </article>
  );
};
