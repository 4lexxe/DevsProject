import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { BsExclamationCircle, BsTagFill } from 'react-icons/bs';
import ForumFlairService, { ForumFlair, FlairType } from '../services/forumFlair.service';

interface FlairSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlairSelect: (flairId: number | null) => void;
  onNSFWChange: (isNSFW: boolean) => void;
  onSpoilerChange: (isSpoiler: boolean) => void;
  isNSFW: boolean;
  isSpoiler: boolean;
  selectedFlairId?: number | null;
}

const FlairSelectionModal: React.FC<FlairSelectionModalProps> = ({
  isOpen,
  onClose,
  onFlairSelect,
  onNSFWChange,
  onSpoilerChange,
  isNSFW,
  isSpoiler,
  selectedFlairId
}) => {
  const [flairs, setFlairs] = useState<ForumFlair[]>([]);
  const [filteredFlairs, setFilteredFlairs] = useState<ForumFlair[]>([]);
  const [displayedFlairs, setDisplayedFlairs] = useState<ForumFlair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllFlairs, setShowAllFlairs] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Load flairs on mount
  useEffect(() => {
    const fetchFlairs = async () => {
      try {
        setLoading(true);
        setError(null);
        const flairsData = await ForumFlairService.getFlairsByType(FlairType.POST);
        setFlairs(flairsData);
        setFilteredFlairs(flairsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flairs:', err);
        setError('No se pudieron cargar los distintivos. Por favor, inténtalo más tarde.');
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchFlairs();
      setShowAllFlairs(false); // Reset to show limited flairs when modal opens
    }
  }, [isOpen]);
  
  // Filter flairs based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = flairs.filter(flair => 
        flair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flair.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFlairs(filtered);
    } else {
      setFilteredFlairs(flairs);
    }
  }, [searchTerm, flairs]);
  
  // Limit displayed flairs based on showAllFlairs state
  useEffect(() => {
    if (showAllFlairs || searchTerm) {
      // Show all flairs when searching or when "show all" is enabled
      setDisplayedFlairs(filteredFlairs);
    } else {
      // Show only first 5 flairs
      setDisplayedFlairs(filteredFlairs.slice(0, 5));
    }
  }, [filteredFlairs, showAllFlairs, searchTerm]);
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Handler for toggling between limited and all flairs
  const handleToggleShowAllFlairs = () => {
    if (searchTerm) {
      // If there's a search term, just clear it
      setSearchTerm('');
      setShowAllFlairs(false);
    } else {
      // Otherwise toggle between showing all or limited flairs
      setShowAllFlairs(!showAllFlairs);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">Agregar flair y etiquetas</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <BsTagFill className="mr-2" />
              Flair
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar flairs..."
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-3 my-3 bg-red-50 text-red-700 rounded-lg">
                <p className="flex items-center">
                  <BsExclamationCircle className="w-5 h-5 mr-2" />
                  {error}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="no-flair"
                    name="flair"
                    checked={selectedFlairId === null}
                    onChange={() => onFlairSelect(null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="no-flair" className="ml-3 text-sm text-gray-700">
                    No flair
                  </label>
                </div>
                
                {displayedFlairs.length > 0 ? (
                  displayedFlairs.map((flair) => (
                    <div key={flair.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`flair-${flair.id}`}
                        name="flair"
                        checked={selectedFlairId === flair.id}
                        onChange={() => onFlairSelect(flair.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`flair-${flair.id}`} className="ml-3 flex items-center">
                        <span 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: flair.color || '#E2E8F0',
                            color: flair.color ? '#1F2937' : '#FFFFFF'
                          }}
                        >
                          {flair.icon && <span className="mr-1">{flair.icon}</span>}
                          {flair.name}
                        </span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-2">No se encontraron flairs</p>
                )}
                
                {filteredFlairs.length > 5 && (
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                    onClick={handleToggleShowAllFlairs}
                  >
                    {searchTerm 
                      ? "Limpiar búsqueda" 
                      : showAllFlairs 
                        ? "Mostrar menos flairs" 
                        : `Ver todos los flairs (${filteredFlairs.length})`}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Etiquetas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="text-lg">🔞</span>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="nsfw-toggle" className="font-medium text-gray-700">Not Safe For Work (NSFW)</label>
                    <p className="text-sm text-gray-500">Contiene contenido para adultos</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="nsfw-toggle"
                    checked={isNSFW}
                    onChange={(e) => onNSFWChange(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="spoiler-toggle" className="font-medium text-gray-700">Spoiler</label>
                    <p className="text-sm text-gray-500">Puede arruinar una sorpresa</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="spoiler-toggle"
                    checked={isSpoiler}
                    onChange={(e) => onSpoilerChange(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlairSelectionModal;