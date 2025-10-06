import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

type InputSearchProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
};

const InputSearch: React.FC<InputSearchProps> = ({
  placeholder = "Buscar...",
  onSearch,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch?.(q);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit(e);
    if (e.key === "Escape") setQuery("");
  };

  // Atajo Ctrl/⌘ + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={`w-full mx-auto max-w-[24rem] ${className}`}
      role="search"
      aria-label="Buscador"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2 rounded-2xl h-12 bg-white ring-1 ring-[#F2F2F2] shadow-sm">
          {/* Icono search con fondo naranja */}
          <div className="bg-[#FEBB48] flex rounded-2xl justify-center items-center h-full w-14">
            <Search className="h-5 w-5 text-white shrink-0" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            inputMode="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="peer w-full bg-transparent placeholder:text-[#999999] focus:outline-none text-base leading-6 text-[#333333]"
            aria-label={placeholder}
          />

          {/* Botón limpiar */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex h-7 w-7 items-center justify-center rounded-xl text-[#666666] hover:text-[#333333] hover:bg-[#F2F2F2] active:scale-95 transition"
              aria-label="Limpiar búsqueda"
              title="Limpiar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InputSearch;
