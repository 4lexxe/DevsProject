import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ResourceUrlInputProps {
  url: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ResourceUrlInput: React.FC<ResourceUrlInputProps> = ({ url, onChange, error }) => {
  return (
    <div>
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
        URL *
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {url && (
          <button
            type="button"
            onClick={() => window.open(url, '_blank')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ResourceUrlInput;