import React, { useState, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Busca un comercio o servicio...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchTerm.trim());
    },
    [onSearch, searchTerm]
  );

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative w-full">
        {/* Icono dentro a la izquierda */}
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="w-4 h-4" />
        </span>

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          className="
            w-full
            pl-9 pr-28
            py-2.5
            rounded-full
            border border-slate-200
            bg-white
            text-sm
            shadow-sm
            placeholder:text-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-orange-500/70
            focus:border-transparent
            transition
          "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar"
        />

        {/* Botón dentro del input, a la derecha */}
        <button
          type="submit"
          className="
            absolute
            inset-y-1
            right-1
            px-4
            text-xs sm:text-sm
            rounded-full
            bg-[color:var(--brand-orange,#FF6B00)]
            text-white
            font-semibold
            shadow-sm
            hover:bg-orange-600
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
            focus-visible:ring-orange-500
            active:scale-[0.97]
            transition
            flex items-center gap-1
          "
        >
          <span className="hidden sm:inline">Buscar</span>
          <Search className="w-4 h-4 sm:w-4 sm:h-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
