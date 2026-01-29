"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { discountEventService, DiscountEvent } from "../services/discountEventService"
import { Calendar, Tag, Plus, Edit, Trash2, CheckCircle2, XCircle, Pause, Play, AlertCircle, ChevronLeft, ChevronRight, Percent } from "lucide-react"

export default function DiscountEventsListPage() {
  const [discountEvents, setDiscountEvents] = useState<DiscountEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    loadDiscountEvents()
  }, [page])

  const loadDiscountEvents = async () => {
    try {
      setLoading(true)
      const response = await discountEventService.getAllDiscountEvents({
        page,
        limit: 10
      })
      setDiscountEvents(response.data)
      setTotalPages(response.pagination.totalPages)
      setError(null)
    } catch (error: any) {
      console.error('Error loading discount events:', error)
      setError('Error al cargar los eventos de descuento')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await discountEventService.deleteDiscountEvent(id)
      setDeleteConfirm(null)
      loadDiscountEvents()
    } catch (error: any) {
      console.error('Error deleting discount event:', error)
      setError('Error al eliminar el evento de descuento')
    }
  }

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      if (isActive) {
        await discountEventService.deactivateDiscountEvent(id)
      } else {
        await discountEventService.activateDiscountEvent(id)
      }
      loadDiscountEvents()
    } catch (error: any) {
      console.error('Error toggling discount event:', error)
      setError('Error al cambiar el estado del evento')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isEventActive = (event: DiscountEvent) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    return event.isActive && now >= startDate && now <= endDate
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="text-gray-600">Cargando eventos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Eventos de Descuento
              </h1>
            </div>
            <p className="text-gray-600">Gestiona los eventos de descuento para tus cursos</p>
          </div>
          <button
            onClick={() => navigate('/courses/discount-event/create')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Evento
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Events List */}
        {discountEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              No hay eventos de descuento
            </h3>
            <p className="text-gray-600 mb-6">Crea tu primer evento de descuento para empezar</p>
            <button
              onClick={() => navigate('/courses/discount-event/create')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Evento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discountEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.event}
                        </h3>
                        {isEventActive(event) ? (
                          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-white bg-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </span>
                        ) : event.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-yellow-100 border border-yellow-300">
                            <Calendar className="w-3 h-3" />
                            Programado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-white bg-gray-500">
                            <XCircle className="w-3 h-3" />
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 block text-xs">Descuento</span>
                            <p className="text-base font-semibold text-gray-900">{event.value}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 block text-xs">Inicio</span>
                            <p className="text-sm font-medium text-gray-900">{formatDate(event.startDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 block text-xs">Fin</span>
                            <p className="text-sm font-medium text-gray-900">{formatDate(event.endDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500 block text-xs">Curso ID</span>
                            <p className="text-sm font-medium text-gray-900">{event.courseId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/courses/discount-event/edit?id=${event.id}`)}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(event.id, event.isActive)}
                        className={`p-2 rounded-lg border transition-colors ${
                          event.isActive 
                            ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50' 
                            : 'border-green-300 text-green-600 hover:bg-green-50'
                        }`}
                        title={event.isActive ? "Desactivar" : "Activar"}
                      >
                        {event.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-3">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <span className="px-4 py-2 font-medium text-gray-700 text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este evento de descuento? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2 px-4 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
