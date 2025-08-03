import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Briefcase, Users, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCareerTypes, deleteCareerType, createCareerType, updateCareerType } from '../services/careerTypeService'
import { ICareerType, ICareerTypeFormData } from '../interfaces/CareerType'
import CareerTypeTable from '../components/CareerTypeTable'
import CareerTypeForm from '../components/CareerTypeForm'

const CareerTypesPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingCareerType, setEditingCareerType] = useState<ICareerType | null>(null)
  const queryClient = useQueryClient()

  const { data: careerTypes = [], isLoading, error } = useQuery({
    queryKey: ['career-types'],
    queryFn: getCareerTypes,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCareerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-types'] })
      toast.success('Tipo de carrera eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar el tipo de carrera')
    }
  })

  const createMutation = useMutation({
    mutationFn: createCareerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-types'] })
      toast.success('Tipo de carrera creado exitosamente')
      handleCloseForm()
    },
    onError: (error) => {
      console.error('Error al crear:', error)
      toast.error('Error al crear el tipo de carrera')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: ICareerTypeFormData) => updateCareerType(editingCareerType!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-types'] })
      toast.success('Tipo de carrera actualizado exitosamente')
      handleCloseForm()
    },
    onError: (error) => {
      console.error('Error al actualizar:', error)
      toast.error('Error al actualizar el tipo de carrera')
    }
  })

  const handleEdit = (careerType: ICareerType) => {
    setEditingCareerType(careerType)
    setShowForm(true)
  }

  const handleDelete = (id: string, name: string) => {
    deleteMutation.mutate(id)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCareerType(null)
  }

  const handleFormSubmit = async (data: ICareerTypeFormData) => {
    if (editingCareerType) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar los tipos de carrera</p>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="space-y-6 p-6">
        <CareerTypeForm
          careerType={editingCareerType}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Tipos de Carrera</h1>
          <p className="text-gray-600">Administra los tipos de carrera disponibles en la plataforma</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Tipo de Carrera
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tipos</p>
              <p className="text-2xl font-bold text-gray-900">{careerTypes?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {careerTypes?.filter((type: ICareerType) => type.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {careerTypes?.filter((type: ICareerType) => !type.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Uso</p>
              <p className="text-2xl font-bold text-gray-900">
                {careerTypes?.filter((type: ICareerType) => type.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Types Table */}
      <CareerTypeTable
        careerTypes={careerTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}

export default CareerTypesPage