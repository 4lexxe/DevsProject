import React from 'react';
import AddResourceButton from '../components/AddResourceButton';

const ResourceListHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
      <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
        Recursos Educativos
      </h1>
      <AddResourceButton />
    </div>
  );
};

export default ResourceListHeader;