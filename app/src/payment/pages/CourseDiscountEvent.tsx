"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useSearchParams } from "react-router-dom"
import { discountEventSchema, DiscountEventFormData } from "../validations/discountEvent"
import { discountEventService } from "../services/discountEventService"
import { getCourses } from "../../course/services/courseServices"

interface Course {
  id: number;
  title: string;
}

export default function DiscountEventsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditing = !!editId

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<DiscountEventFormData>({
    resolver: zodResolver(discountEventSchema),
    defaultValues: {
      isActive: true,
    },
  })

  const watchedStartDate = watch("startDate")
  const watchedEndDate = watch("endDate")

  useEffect(() => {
    loadCourses()
    if (isEditing) {
      loadDiscountEvent()
    } else {
      setLoading(false)
    }
  }, [isEditing, editId])

  const loadCourses = async () => {
    try {
      const coursesData = await getCourses()
      setCourses(coursesData || [])
    } catch (error) {
      console.error('Error loading courses:', error)
      setError('Error al cargar los cursos')
    }
  }

  const loadDiscountEvent = async () => {
    if (!editId) return
    
    try {
      setLoading(true)
      const discountEvent = await discountEventService.getDiscountEventById(parseInt(editId))
      
      // Convertir las fechas string a Date objects
      const startDate = new Date(discountEvent.startDate)
      const endDate = new Date(discountEvent.endDate)
      
      // Rellenar el formulario con los datos existentes
      setValue('courseId', discountEvent.courseId.toString())
      setValue('event', discountEvent.event)
      setValue('description', discountEvent.description)
      setValue('value', discountEvent.value)
      setValue('startDate', startDate)
      setValue('endDate', endDate)
      setValue('isActive', discountEvent.isActive)
    } catch (error) {
      console.error('Error loading discount event:', error)
      setError('Error al cargar el evento de descuento')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: DiscountEventFormData) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setError(null)

    try {
      if (isEditing) {
        await discountEventService.updateDiscountEvent(parseInt(editId!), data)
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate('/discount-events')
        }, 1500)
      } else {
        await discountEventService.createDiscountEvent(data)
        setSubmitSuccess(true)
        reset()
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch (error: any) {
      console.error('Error al guardar evento de descuento:', error)
      setError(error.message || 'Error al guardar el evento de descuento')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#42d7c7" }}></div>
          <span style={{ color: "#0c154c" }}>Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0c154c" }}>
            {isEditing ? 'Editar Evento de Descuento' : 'Crear Evento de Descuento'}
          </h1>
          <p className="text-gray-600">
            {isEditing 
              ? 'Modifica los detalles del evento de descuento'
              : 'Configura descuentos especiales para tus cursos con fechas de inicio y fin'
            }
          </p>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <div
            className="mb-6 p-4 rounded-lg border-2 flex items-center gap-2"
            style={{ borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#42d7c7" }}></div>
            <span style={{ color: "#0c154c" }}>
              {isEditing 
                ? '¡Evento de descuento actualizado exitosamente!' 
                : '¡Evento de descuento creado exitosamente!'
              }
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg border-2 flex items-center gap-2"
            style={{ borderColor: "#ef4444", backgroundColor: "#fef2f2" }}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
            <span style={{ color: "#dc2626" }}>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: "#42d7c7" }}>
              <div className="p-6 text-white" style={{ backgroundColor: "#0c154c" }}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">+</span>
                  Información del Evento
                </h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Course Selection */}
                  <div className="space-y-2">
                    <label htmlFor="courseId" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                      Curso *
                    </label>
                    <select
                      id="courseId"
                      className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: "#42d7c7" }}
                      {...register("courseId")}
                    >
                      <option value="">Selecciona un curso</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {errors.courseId && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.courseId.message}
                      </p>
                    )}
                  </div>

                  {/* Event Name */}
                  <div className="space-y-2">
                    <label htmlFor="event" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                      Nombre del Evento *
                    </label>
                    <input
                      id="event"
                      type="text"
                      placeholder="ej. Black Friday 2024"
                      className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: "#42d7c7" }}
                      {...register("event")}
                    />
                    {errors.event && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.event.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe el evento de descuento..."
                      rows={4}
                      className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                      style={{ borderColor: "#42d7c7" }}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Discount Value */}
                  <div className="space-y-2">
                    <label htmlFor="value" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                      Porcentaje de Descuento (%) *
                    </label>
                    <input
                      id="value"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="30"
                      className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: "#42d7c7" }}
                      {...register("value", { valueAsNumber: true })}
                    />
                    {errors.value && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.value.message}
                      </p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                        Fecha de Inicio *
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: "#42d7c7" }}
                        {...register("startDate", { valueAsDate: true })}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <label htmlFor="endDate" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                        Fecha de Fin *
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: "#42d7c7" }}
                        {...register("endDate", { valueAsDate: true })}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
                    <input
                      id="isActive"
                      type="checkbox"
                      defaultChecked={true}
                      className="w-5 h-5 rounded border-2 focus:ring-2 focus:ring-blue-500"
                      style={{ accentColor: "#42d7c7" }}
                      {...register("isActive")}
                    />
                    <div className="space-y-1">
                      <label htmlFor="isActive" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
                        Evento Activo
                      </label>
                      <p className="text-sm text-gray-600">El evento estará disponible para aplicar descuentos</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => navigate('/discount-events')}
                        className="flex-1 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 transition-all duration-300 hover:bg-gray-50"
                        style={{ borderColor: "#d1d5db" }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${isEditing ? 'flex-1' : 'w-full'} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{ backgroundColor: "#42d7c7" }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {isEditing ? 'Actualizando Evento...' : 'Creando Evento...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>💾</span>
                          {isEditing ? 'Actualizar Evento de Descuento' : 'Crear Evento de Descuento'}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview/Info Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border-2 rounded-lg overflow-hidden" style={{ borderColor: "#42d7c7" }}>
              <div className="p-4 text-white" style={{ backgroundColor: "#1d4ed8" }}>
                <h3 className="text-lg font-semibold">Vista Previa</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: "#0c154c" }}>
                      Información del Evento
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Los descuentos se aplicarán automáticamente</p>
                      <p>• Solo activo durante el rango de fechas</p>
                      <p>• Se puede activar/desactivar manualmente</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
                    <h5 className="font-medium mb-2" style={{ color: "#1d4ed8" }}>
                      Ejemplo de Badge
                    </h5>
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#02ffff", color: "#0c154c" }}
                    >
                      <span className="mr-1">✨</span>
                      30% OFF
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
                      Campos Requeridos
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Curso</li>
                      <li>• Nombre del evento</li>
                      <li>• Descripción</li>
                      <li>• Porcentaje de descuento</li>
                      <li>• Fechas de inicio y fin</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg border" style={{ borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }}>
                    <p className="text-sm" style={{ color: "#0c154c" }}>
                      <strong>Nota:</strong> La fecha de fin debe ser posterior a la fecha de inicio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
