import React, { useState } from 'react';
import { type CareerType } from '../../services/careerTypeService';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';

interface CareerTypeListProps {
  careerTypes: CareerType[];
  onEdit: (careerType: CareerType) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const CareerTypeList: React.FC<CareerTypeListProps> = ({
  careerTypes,
  onEdit,
  onDelete,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCareerTypes = careerTypes.filter(careerType =>
    careerType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    careerType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (careerTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <FontelloIcon
            name="icon-briefcase"
            className="text-3xl text-gray-400"
            fallback={
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No hay tipos de carrera disponibles</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Crea tu primer tipo de carrera para clasificar los cursos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <FontelloIcon
          name="icon-search"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          fallback={
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <input
          type="text"
          placeholder="Buscar tipos de carrera..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
        />
      </div>

      <div className="lg:hidden space-y-3">
        {filteredCareerTypes.map((careerType) => (
          <div 
            key={careerType.id} 
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {careerType.icon ? (
                        <span className="text-base">{careerType.icon}</span>
                      ) : (
                        <FontelloIcon
                          name="icon-briefcase"
                          className="text-base text-gray-700 dark:text-gray-300"
                          fallback={
                            <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {careerType.name}
                        </h3>
                        {careerType.isActive ? (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {careerType.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onEdit(careerType)}
                  disabled={loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FontelloIcon name="icon-edit" className="text-sm" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que quieres eliminar el tipo de carrera "${careerType.name}"?`)) {
                      onDelete(careerType.id!);
                    }
                  }}
                  disabled={loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FontelloIcon name="icon-trash" className="text-sm" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo de Carrera
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCareerTypes.map((careerType) => (
                <tr key={careerType.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {careerType.icon ? (
                          <span className="text-sm">{careerType.icon}</span>
                        ) : (
                          <FontelloIcon name="icon-briefcase" className="text-sm text-gray-700 dark:text-gray-300" />
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {careerType.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                      {careerType.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {careerType.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(careerType)}
                        disabled={loading}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <FontelloIcon name="icon-edit" className="text-xs" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de que quieres eliminar el tipo de carrera "${careerType.name}"?`)) {
                            onDelete(careerType.id!);
                          }
                        }}
                        disabled={loading}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <FontelloIcon name="icon-trash" className="text-xs" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareerTypeList;
