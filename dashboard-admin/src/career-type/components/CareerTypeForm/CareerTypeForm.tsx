import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X, Briefcase } from 'lucide-react'
import { careerTypeSchema } from '../../validations/careerTypeSchema'
import { ICareerTypeFormData, ICareerType } from '../../interfaces/CareerType'

interface CareerTypeFormProps {
  careerType?: ICareerType | null
  onSubmit: (data: ICareerTypeFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const CareerTypeForm = ({ careerType, onSubmit, onCancel, isLoading = false }: CareerTypeFormProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ICareerTypeFormData>({
    resolver: zodResolver(careerTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      isActive: true
    }
  })

  const watchedIsActive = watch('isActive')

  // Iconos disponibles para tipos de carrera
  const availableIcons = [
    { name: 'Briefcase', icon: '💼', value: 'briefcase' },
    { name: 'Computer', icon: '💻', value: 'computer' },
    { name: 'Design', icon: '🎨', value: 'design' },
    { name: 'Marketing', icon: '📈', value: 'marketing' },
    { name: 'Engineering', icon: '⚙️', value: 'engineering' },
    { name: 'Healthcare', icon: '🏥', value: 'healthcare' },
    { name: 'Education', icon: '📚', value: 'education' },
    { name: 'Finance', icon: '💰', value: 'finance' },
    { name: 'Science', icon: '🔬', value: 'science' },
    { name: 'Law', icon: '⚖️', value: 'law' },
    { name: 'Media', icon: '📺', value: 'media' },
    { name: 'Sports', icon: '⚽', value: 'sports' }
  ]

  useEffect(() => {
    if (careerType) {
      setValue('name', careerType.name)
      setValue('description', careerType.description)
      setValue('icon', careerType.icon || '')
      setValue('isActive', careerType.isActive)
      setSelectedIcon(careerType.icon || '')
    }
  }, [careerType, setValue])

  const handleIconSelect = (iconValue: string) => {
    setSelectedIcon(iconValue)
    setValue('icon', iconValue)
  }

  const onFormSubmit = (data: ICareerTypeFormData) => {
    onSubmit({
      ...data,
      icon: selectedIcon
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Briefcase className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {careerType ? 'Editar Tipo de Carrera' : 'Nuevo Tipo de Carrera'}
            </h2>
            <p className="text-gray-600">
              {careerType ? 'Modifica los datos del tipo de carrera' : 'Completa la información para crear un nuevo tipo de carrera'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Tipo de Carrera *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Tecnología, Diseño, Marketing..."
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe el tipo de carrera y las áreas que abarca..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Selección de Icono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icono (Opcional)
          </label>
          <div className="grid grid-cols-6 gap-3">
            {availableIcons.map((iconOption) => (
              <button
                key={iconOption.value}
                type="button"
                onClick={() => handleIconSelect(iconOption.value)}
                className={`p-3 border-2 rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  selectedIcon === iconOption.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{iconOption.icon}</div>
                <div className="text-xs text-gray-600">{iconOption.name}</div>
              </button>
            ))}
          </div>
          {selectedIcon && (
            <div className="mt-2 text-sm text-gray-600">
              Icono seleccionado: {availableIcons.find(i => i.value === selectedIcon)?.name}
            </div>
          )}
        </div>

        {/* Estado Activo */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Tipo de carrera activo
          </label>
        </div>

        {/* Estado visual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${watchedIsActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              Estado: {watchedIsActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {watchedIsActive 
              ? 'Este tipo de carrera estará disponible para asignar a cursos'
              : 'Este tipo de carrera no estará disponible para asignar a cursos'
            }
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Guardando...' : careerType ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CareerTypeForm