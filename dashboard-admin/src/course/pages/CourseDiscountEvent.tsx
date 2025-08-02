"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useSearchParams } from "react-router-dom"
import { discountEventSchema, DiscountEventFormData } from "../validations/discountEvent"
import { discountEventService } from "../services/discountEventService"
import { getCourses } from "../../course/services/courseServices"
import {
  DiscountEventHeader,
  AlertNotifications,
  CourseSelectionSection,
  DiscountEventFormFields,
  DiscountEventPreview,
  LoadingSpinner,
  SubmitButtons
} from "../components/CourseDiscountEvent"

interface Course {
  id: number;
  title: string;
}

export default function DiscountEventsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
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
    reset,
  } = useForm<DiscountEventFormData>({
    resolver: zodResolver(discountEventSchema),
    defaultValues: {
      isActive: true,
    },
  })

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
      
      // Cargar los cursos asociados al evento
      const eventCourses = await discountEventService.getCoursesForDiscountEvent(parseInt(editId))
      const courseIds = eventCourses.courses?.map((course: any) => course.id) || []
      
      // Rellenar el formulario con los datos existentes
      setSelectedCourses(courseIds)
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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setError(null)

    // Validar que se hayan seleccionado cursos
    if (selectedCourses.length === 0) {
      setError('Debes seleccionar al menos un curso')
      setIsSubmitting(false)
      return
    }

    try {
      // Preparar datos sin courseId
      const eventData = {
        event: data.event,
        description: data.description,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive
      }

      if (isEditing) {
        // Actualizar evento con cursos asociados de forma atómica
        await discountEventService.updateDiscountEventWithCourses(parseInt(editId!), eventData, selectedCourses)
        
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate('/courses/discount-events')
        }, 1500)
      } else {
        // Crear evento con cursos asociados
        await discountEventService.createDiscountEventWithCourses(eventData, selectedCourses)
        
        setSubmitSuccess(true)
        reset()
        setSelectedCourses([])
        setTimeout(() => setSubmitSuccess(false), 3000)
        navigate('/courses/discount-events')
      }
    } catch (error: any) {
      console.error('Error al guardar evento de descuento:', error)
      setError(error.message || 'Error al guardar el evento de descuento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const handleSelectAllCourses = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([])
    } else {
      setSelectedCourses(courses.map(course => course.id))
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
      <div className="container mx-auto px-4 py-8">
        <DiscountEventHeader isEditing={isEditing} />
        
        <AlertNotifications 
          submitSuccess={submitSuccess}
          error={error}
          isEditing={isEditing}
        />

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
                  <CourseSelectionSection
                    courses={courses}
                    selectedCourses={selectedCourses}
                    onCourseToggle={handleCourseToggle}
                    onSelectAllCourses={handleSelectAllCourses}
                  />

                  <DiscountEventFormFields
                    register={register}
                    errors={errors}
                  />

                  <SubmitButtons
                    isEditing={isEditing}
                    isSubmitting={isSubmitting}
                    onCancel={() => navigate('/courses/discount-events')}
                  />
                </form>
              </div>
            </div>
          </div>

          <DiscountEventPreview
            selectedCourses={selectedCourses}
            courses={courses}
          />
        </div>
      </div>
    </div>
  )
}
