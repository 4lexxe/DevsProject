import React, { FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent) => void;
  placeholder?: string;
}

export default function SearchBar({ searchQuery, setSearchQuery, handleSearch, placeholder }: SearchBarProps) {
  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder={placeholder || "Buscar cursos, recursos..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-5 py-2.5 rounded-full border border-blue-200 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
      >
        <Search className="h-5 w-5 text-blue-500" />
      </button>
    </form>
  );
}