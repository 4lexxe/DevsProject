import React from 'react';

interface ResourceVisibilityToggleProps {
  isVisible: boolean;
  onChange: (isVisible: boolean) => void;
}

const ResourceVisibilityToggle: React.FC<ResourceVisibilityToggleProps> = ({
  isVisible,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor="isVisible" className="block text-sm font-medium text-gray-700">
        Visibilidad del recurso
      </label>
      <button
        type="button"
        onClick={() => onChange(!isVisible)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isVisible ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span className="sr-only">Visibilidad del recurso</span>
        <span
          className={`${
            isVisible ? 'translate-x-5' : 'translate-x-0'
          } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out`}
        />
      </button>
      <span className="ml-3 text-sm text-gray-700">
        {isVisible ? 'Visible' : 'No visible'}
      </span>
    </div>
  );
};

export default ResourceVisibilityToggle;