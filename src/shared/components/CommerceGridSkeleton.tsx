// src/shared/components/CommerceGridSkeleton.tsx
import React from "react";

const CommerceGridSkeleton: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] animate-fadeIn pointer-events-none">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-2 sm:p-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <article
            key={i}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white/95 pb-3 shadow-2xl ring-1 ring-slate-100"
          >
            {/* Botón favorito skeleton */}
            <div className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/95/90 shadow-md ring-1 ring-slate-200">
              <div className="skeleton h-4 w-4 rounded-full" />
            </div>

            {/* Imagen / header skeleton con mismo aspect ratio */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
              <div className="skeleton h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute left-2 bottom-2">
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
            </div>

            {/* Info principal (título + rating) */}
            <div className="min-w-0 px-3 sm:px-4 pt-2 flex flex-col gap-2">
              {/* título */}
              <div className="skeleton h-4 w-5/6 rounded" />
              {/* segunda línea opcional para simular nombre largo */}
              <div className="skeleton h-3 w-2/3 rounded" />

              {/* rating + opiniones */}
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="skeleton h-3 w-16 rounded-full" />
                  <div className="skeleton h-3 w-8 rounded" />
                  <div className="skeleton h-3 w-12 rounded" />
                </div>
              </div>
            </div>

            {/* Footer: ubicación + botón acción */}
            <div className="mt-3 px-3 sm:px-4 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1">
                  <div className="skeleton h-3.5 w-3.5 rounded-full" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
              </div>
              <div className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#FF783B] to-[#FF4D3B] shadow-md">
                <div className="skeleton h-4 w-4 rounded-full bg-white/60" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {text && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default CommerceGridSkeleton;
