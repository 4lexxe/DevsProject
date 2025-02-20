import { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResourceService } from "../../recourse/services/resource.service";

interface SearchResult {
  id: number; // Asegúrate de que los resultados tengan un campo único como 'id'
  title: string;
  type: string;
  coverImage?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search_results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await ResourceService.getResources({
          q: searchQuery.trim(),
          limit: ITEMS_PER_PAGE,
        });

        // Eliminar duplicados basándonos en el ID único
        const uniqueResults: SearchResult[] = response.results.filter(
          (newResult: SearchResult, index: number, self: SearchResult[]) =>
            index === self.findIndex((result: SearchResult) => result.id === newResult.id)
        );

        setSuggestions(uniqueResults);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Suggestions ({suggestions.length})
            </h2>
          </div>
        )}
        <div className="space-y-2">
          {suggestions.map((item, index) => (
            <div
              key={item.id} // Usa el ID único como clave
              className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer group animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              onClick={() => {
                setSearchQuery(item.title);
                handleSearch();
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    item.coverImage ||
                    "https://api.dicebear.com/7.x/initials/svg?seed=Default"
                  }
                  alt={item.title}
                  className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoading && searchQuery && suggestions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No suggestions found
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;