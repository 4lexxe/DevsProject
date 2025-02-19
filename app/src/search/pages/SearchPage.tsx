import { useState } from "react";
import { ArrowLeft, Search, MoreHorizontal } from "lucide-react";

const RECENT_SEARCHES = [
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=FI",
    title: "Facultad de Ingeniería - U.N.Ju.",
    notifications: "Más de 9 nuevas",
  },
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=OW",
    title: "Overwatch Latinoamerica",
    notifications: "Más de 9 nuevas",
  },
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=FI",
    title: "FI - Facultad de Ingeniería - UNJu",
    notifications: "Más de 9 nuevas",
  },
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=AV",
    title: "Agus Vazquez",
    isOnline: true,
  },
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
    title: "Momichis Corp x Lomomos Corp.",
    notifications: "Más de 9 nuevas",
  },
  {
    image: "https://api.dicebear.com/7.x/initials/svg?seed=OW",
    title: "Overwatch",
    notifications: "4 nuevas",
    isVerified: true,
  },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = RECENT_SEARCHES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
        <button 
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Search Results */}
      <div className="animate-fade-in">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-900">Recientes</h2>
            <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              Ver todo
            </a>
          </div>
          <div className="space-y-1">
            {filteredResults.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {item.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      {item.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </div>
                    {item.notifications && (
                      <span className="text-sm text-blue-600">{item.notifications}</span>
                    )}
                  </div>
                </div>
                <button className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;