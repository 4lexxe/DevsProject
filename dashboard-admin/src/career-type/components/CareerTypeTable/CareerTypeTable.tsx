import { useState } from 'react'
import { Edit2, Trash2, Briefcase, Search, Filter } from 'lucide-react'
import { ICareerType } from '../../interfaces/CareerType'

interface CareerTypeTableProps {
  careerTypes: ICareerType[]
  onEdit: (careerType: ICareerType) => void
  onDelete: (id: string, name: string) => void
  isDeleting?: boolean
}

const CareerTypeTable = ({ careerTypes, onEdit, onDelete, isDeleting = false }: CareerTypeTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Iconos disponibles para mostrar
  const iconMap: { [key: string]: string } = {
    briefcase: '💼',
    computer: '💻',
    design: '🎨',
    marketing: '📈',
    engineering: '⚙️',
    healthcare: '🏥',
    education: '📚',
    finance: '💰',
    science: '🔬',
    law: '⚖️',
    media: '📺',
    sports: '⚽'
  }

  const filteredCareerTypes = careerTypes?.filter((careerType) => {
    const matchesSearch = careerType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         careerType.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && careerType.isActive) ||
                         (filterStatus === 'inactive' && !careerType.isActive)
    return matchesSearch && matchesFilter
  })

  const handleDelete = (careerType: ICareerType) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el tipo de carrera "${careerType.name}"?`)) {
      onDelete(careerType.id, careerType.name)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar tipos de carrera..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Carrera
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCareerTypes?.map((careerType) => (
                <tr key={careerType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          {careerType.icon && iconMap[careerType.icon] ? (
                            <span className="text-xl">{iconMap[careerType.icon]}</span>
                          ) : (
                            <Briefcase className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{careerType.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {careerType.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      careerType.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {careerType.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {careerType.createdAt 
                      ? new Date(careerType.createdAt).toLocaleDateString('es-ES')
                      : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(careerType)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Editar tipo de carrera"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(careerType)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Eliminar tipo de carrera"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCareerTypes?.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tipos de carrera</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron tipos de carrera con los filtros aplicados'
                : 'Comienza creando tu primer tipo de carrera'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CareerTypeTable