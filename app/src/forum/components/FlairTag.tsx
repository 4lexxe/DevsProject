import React, { useState } from 'react';
import { BsTagFill } from 'react-icons/bs';
import FlairTagSelection from './FlairTagSelection';

enum FlairType {
    ROLE_BASED = 'role_based',
    ACHIEVEMENT = 'achievement',
    POST = 'post',
    CUSTOM = 'custom'
  }

export interface ForumFlair {
  id: number;
  name: string;
  description: string;
  icon?: string;
  type: FlairType;
  color: string;
  isActive: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface FlairTagSelectorProps {
  selectedFlairId?: number | null;
  onFlairSelect: (flairId: number | null) => void;
  isNSFW: boolean;
  onNSFWChange: (isNSFW: boolean) => void;
  isSpoiler: boolean;
  onSpoilerChange: (isSpoiler: boolean) => void;
  flairs: ForumFlair[];
}

const FlairTagSelector: React.FC<FlairTagSelectorProps> = ({
  selectedFlairId,
  onFlairSelect,
  isNSFW,
  onNSFWChange,
  isSpoiler,
  onSpoilerChange,
  flairs
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedFlair = flairs.find(f => f.id === selectedFlairId);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
      >
        <BsTagFill className="w-4 h-4 mr-1.5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {selectedFlair || isNSFW || isSpoiler ? (
            <>
              {selectedFlair && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs mr-2"
                  style={{ 
                    backgroundColor: selectedFlair.color || '#E2E8F0',
                    color: '#1F2937' 
                  }}
                >
                  {selectedFlair.icon && <span className="mr-1">{selectedFlair.icon}</span>}
                  {selectedFlair.name}
                </span>
              )}
              {isNSFW && <span className="mr-2">🔞 NSFW</span>}
              {isSpoiler && <span className="mr-2">⚠️ Spoiler</span>}
            </>
          ) : (
            'Agregar flair y etiquetas'
          )}
        </span>
      </button>

      <FlairTagSelection
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFlairSelect={onFlairSelect}
        onNSFWChange={onNSFWChange}
        onSpoilerChange={onSpoilerChange}
        isNSFW={isNSFW}
        isSpoiler={isSpoiler}
        selectedFlairId={selectedFlairId}
      />
    </div>
  );
};


export default FlairTagSelector;