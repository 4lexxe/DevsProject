import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, SlidersHorizontal } from "lucide-react";
import { ResourceService } from "../../recourse/services/resource.service";
import Fuse from "fuse.js";

interface SearchResult {
  id: number;
  title: string;
  type: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  author?: string;
  tags?: string[];
}

const ITEMS_PER_PAGE = 10;

const ResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [localResults, setLocalResults] = useState<SearchResult[]>([]);

  // Initialize Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(results, {
      keys: ["title", "description", "type", "tags"],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [results]);

  // Handle local search with FuseJS
  useEffect(() => {
    if (searchInput.trim() && results.length > 0) {
      const searchResults = fuse.search(searchInput);
      setLocalResults(searchResults.map(result => result.item));
    } else {
      setLocalResults(results);
    }
  }, [searchInput, fuse, results]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const response = await ResourceService.getResources({
          q: query,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        setResults(response.results);
        setTotalResults(response.total);
        setLocalResults(response.results); // Initialize local results
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
      setCurrentPage(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Display either local filtered results or original results
  const displayResults = localResults.length > 0 ? localResults : results;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-white border border-gray-300 hover:bg-gray-50">
                  All Types
                </button>
                <button className="px-3 py-1 text-sm rounded-full bg-white border border-gray-300 hover:bg-gray-50">
                  Date
                </button>
                <button className="px-3 py-1 text-sm rounded-full bg-white border border-gray-300 hover:bg-gray-50">
                  Relevance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {displayResults.length} results for "{searchInput || query}"
            </h2>
          </div>
        )}

        {/* Results Grid */}
        <div className="space-y-6">
          {displayResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={
                      result.coverImage ||
                      "https://api.dicebear.com/7.x/initials/svg?seed=Default"
                    }
                    alt={result.title}
                    className="w-24 h-24 rounded-lg object-cover bg-gray-100"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.type} • {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {result.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                  {result.tags && result.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!isLoading && query && displayResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters to find what you're looking for
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalResults > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * ITEMS_PER_PAGE >= totalResults}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;