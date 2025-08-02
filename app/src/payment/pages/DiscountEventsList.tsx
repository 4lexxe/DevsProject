"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { discountEventService, DiscountEvent } from "../services/discountEventService"

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#42d7c7" }}></div>
          <span style={{ color: "#0c154c" }}>Cargando eventos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#0c154c" }}>
              Eventos de Descuento
            </h1>
            <p className="text-gray-600">Gestiona los eventos de descuento para tus cursos</p>
          </div>
          <button
            onClick={() => navigate('/discount-events/create')}
            className="text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: "#42d7c7" }}
          >
            <span className="flex items-center gap-2">
              <span>+</span>
              Crear Evento
            </span>
          </button>
        </div>

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

        {/* Events List */}
        {discountEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#0c154c" }}>
              No hay eventos de descuento
            </h3>
            <p className="text-gray-600 mb-4">Crea tu primer evento de descuento para empezar</p>
            <button
              onClick={() => navigate('/discount-events/create')}
              className="text-white font-semibold py-2 px-4 rounded-lg"
              style={{ backgroundColor: "#42d7c7" }}
            >
              Crear Evento
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {discountEvents.map((event) => (
              <div
                key={event.id}
                className="border-2 rounded-lg overflow-hidden bg-white"
                style={{ borderColor: "#42d7c7" }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold" style={{ color: "#0c154c" }}>
                          {event.event}
                        </h3>
                        {isEventActive(event) ? (
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: "#02ffff", color: "#0c154c" }}
                          >
                            ✨ Activo
                          </span>
                        ) : event.isActive ? (
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: "#fbbf24", color: "#0c154c" }}
                          >
                            ⏳ Programado
                          </span>
                        ) : (
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: "#f87171", color: "white" }}
                          >
                            ❌ Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: "#0c154c" }}>Descuento:</span>
                          <p className="text-lg font-bold" style={{ color: "#42d7c7" }}>{event.value}%</p>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: "#0c154c" }}>Inicio:</span>
                          <p className="text-gray-600">{formatDate(event.startDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: "#0c154c" }}>Fin:</span>
                          <p className="text-gray-600">{formatDate(event.endDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: "#0c154c" }}>Curso ID:</span>
                          <p className="text-gray-600">{event.courseId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/discount-events/edit?id=${event.id}`)}
                        className="p-2 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "#42d7c7", color: "#42d7c7" }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleToggleActive(event.id, event.isActive)}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          event.isActive 
                            ? 'hover:bg-yellow-50' 
                            : 'hover:bg-green-50'
                        }`}
                        style={{ 
                          borderColor: event.isActive ? "#fbbf24" : "#10b981",
                          color: event.isActive ? "#fbbf24" : "#10b981"
                        }}
                        title={event.isActive ? "Desactivar" : "Activar"}
                      >
                        {event.isActive ? "⏸️" : "▶️"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="p-2 rounded-lg border-2 hover:bg-red-50 transition-colors"
                        style={{ borderColor: "#ef4444", color: "#ef4444" }}
                        title="Eliminar"
                      >
                        🗑️
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
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#42d7c7", color: "#42d7c7" }}
            >
              Anterior
            </button>
            <span className="px-4 py-2 font-medium" style={{ color: "#0c154c" }}>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#42d7c7", color: "#42d7c7" }}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#0c154c" }}>
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este evento de descuento? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 px-4 rounded-lg border-2 font-medium"
                  style={{ borderColor: "#d1d5db", color: "#6b7280" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2 px-4 rounded-lg font-medium text-white"
                  style={{ backgroundColor: "#ef4444" }}
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
