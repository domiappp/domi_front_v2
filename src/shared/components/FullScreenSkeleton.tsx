// ContainerSkeleton.tsx
import React from "react";

const ContainerSkeleton: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col p-6 animate-fadeIn pointer-events-none">

      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-3 w-64 rounded" />
        </div>
        <div className="skeleton h-8 w-32 rounded-full hidden sm:block" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden"
          >
            <div className="skeleton h-28 w-full" />
            <div className="p-3 flex flex-col gap-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-24 rounded mt-1" />
              <div className="mt-1 flex items-center justify-between">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Texto opcional */}
      {text && (
        <p className="mt-6 text-center text-xs font-medium text-slate-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default ContainerSkeleton;
