import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getCareerTypeById, createCareerType, updateCareerType } from '../services/careerTypeService'
import { ICareerTypeFormData } from '../interfaces/CareerType'
import CareerTypeForm from '../components/CareerTypeForm'

const CareerTypeFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)

  const { data: careerType, isLoading } = useQuery({
    queryKey: ['career-type', id],
    queryFn: () => getCareerTypeById(id!),
    enabled: isEditing,
  })

  const createMutation = useMutation({
    mutationFn: createCareerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-types'] })
      toast.success('Tipo de carrera creado exitosamente')
      navigate('/career-types')
    },
    onError: (error) => {
      console.error('Error al crear:', error)
      toast.error('Error al crear el tipo de carrera')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: ICareerTypeFormData) => updateCareerType(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-types'] })
      queryClient.invalidateQueries({ queryKey: ['career-type', id] })
      toast.success('Tipo de carrera actualizado exitosamente')
      navigate('/career-types')
    },
    onError: (error) => {
      console.error('Error al actualizar:', error)
      toast.error('Error al actualizar el tipo de carrera')
    }
  })

  const handleSubmit = (data: ICareerTypeFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    navigate('/career-types')
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <CareerTypeForm
        careerType={careerType}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

export default CareerTypeFormPage