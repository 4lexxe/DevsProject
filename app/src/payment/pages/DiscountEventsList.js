"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { discountEventService } from "../services/discountEventService";
export default function DiscountEventsListPage() {
    const [discountEvents, setDiscountEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        loadDiscountEvents();
    }, [page]);
    const loadDiscountEvents = async () => {
        try {
            setLoading(true);
            const response = await discountEventService.getAllDiscountEvents({
                page,
                limit: 10
            });
            setDiscountEvents(response.data);
            setTotalPages(response.pagination.totalPages);
            setError(null);
        }
        catch (error) {
            console.error('Error loading discount events:', error);
            setError('Error al cargar los eventos de descuento');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        try {
            await discountEventService.deleteDiscountEvent(id);
            setDeleteConfirm(null);
            loadDiscountEvents();
        }
        catch (error) {
            console.error('Error deleting discount event:', error);
            setError('Error al eliminar el evento de descuento');
        }
    };
    const handleToggleActive = async (id, isActive) => {
        try {
            if (isActive) {
                await discountEventService.deactivateDiscountEvent(id);
            }
            else {
                await discountEventService.activateDiscountEvent(id);
            }
            loadDiscountEvents();
        }
        catch (error) {
            console.error('Error toggling discount event:', error);
            setError('Error al cambiar el estado del evento');
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const isEventActive = (event) => {
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return event.isActive && now >= startDate && now <= endDate;
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2", style: { borderColor: "#42d7c7" } }), _jsx("span", { style: { color: "#0c154c" }, children: "Cargando eventos..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold mb-2", style: { color: "#0c154c" }, children: "Eventos de Descuento" }), _jsx("p", { className: "text-gray-600", children: "Gestiona los eventos de descuento para tus cursos" })] }), _jsx("button", { onClick: () => navigate('/discount-events/create'), className: "text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:opacity-90", style: { backgroundColor: "#42d7c7" }, children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { children: "+" }), "Crear Evento"] }) })] }), error && (_jsxs("div", { className: "mb-6 p-4 rounded-lg border-2 flex items-center gap-2", style: { borderColor: "#ef4444", backgroundColor: "#fef2f2" }, children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: "#ef4444" } }), _jsx("span", { style: { color: "#dc2626" }, children: error })] })), discountEvents.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCC5" }), _jsx("h3", { className: "text-xl font-semibold mb-2", style: { color: "#0c154c" }, children: "No hay eventos de descuento" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Crea tu primer evento de descuento para empezar" }), _jsx("button", { onClick: () => navigate('/discount-events/create'), className: "text-white font-semibold py-2 px-4 rounded-lg", style: { backgroundColor: "#42d7c7" }, children: "Crear Evento" })] })) : (_jsx("div", { className: "grid gap-6", children: discountEvents.map((event) => (_jsx("div", { className: "border-2 rounded-lg overflow-hidden bg-white", style: { borderColor: "#42d7c7" }, children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-xl font-semibold", style: { color: "#0c154c" }, children: event.event }), isEventActive(event) ? (_jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium", style: { backgroundColor: "#02ffff", color: "#0c154c" }, children: "\u2728 Activo" })) : event.isActive ? (_jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium", style: { backgroundColor: "#fbbf24", color: "#0c154c" }, children: "\u23F3 Programado" })) : (_jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium", style: { backgroundColor: "#f87171", color: "white" }, children: "\u274C Inactivo" }))] }), _jsx("p", { className: "text-gray-600 mb-3", children: event.description }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", style: { color: "#0c154c" }, children: "Descuento:" }), _jsxs("p", { className: "text-lg font-bold", style: { color: "#42d7c7" }, children: [event.value, "%"] })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", style: { color: "#0c154c" }, children: "Inicio:" }), _jsx("p", { className: "text-gray-600", children: formatDate(event.startDate) })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", style: { color: "#0c154c" }, children: "Fin:" }), _jsx("p", { className: "text-gray-600", children: formatDate(event.endDate) })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", style: { color: "#0c154c" }, children: "Curso ID:" }), _jsx("p", { className: "text-gray-600", children: event.courseId })] })] })] }), _jsxs("div", { className: "flex gap-2 ml-4", children: [_jsx("button", { onClick: () => navigate(`/discount-events/edit?id=${event.id}`), className: "p-2 rounded-lg border-2 hover:bg-gray-50 transition-colors", style: { borderColor: "#42d7c7", color: "#42d7c7" }, title: "Editar", children: "\u270F\uFE0F" }), _jsx("button", { onClick: () => handleToggleActive(event.id, event.isActive), className: `p-2 rounded-lg border-2 transition-colors ${event.isActive
                                                    ? 'hover:bg-yellow-50'
                                                    : 'hover:bg-green-50'}`, style: {
                                                    borderColor: event.isActive ? "#fbbf24" : "#10b981",
                                                    color: event.isActive ? "#fbbf24" : "#10b981"
                                                }, title: event.isActive ? "Desactivar" : "Activar", children: event.isActive ? "⏸️" : "▶️" }), _jsx("button", { onClick: () => setDeleteConfirm(event.id), className: "p-2 rounded-lg border-2 hover:bg-red-50 transition-colors", style: { borderColor: "#ef4444", color: "#ef4444" }, title: "Eliminar", children: "\uD83D\uDDD1\uFE0F" })] })] }) }) }, event.id))) })), totalPages > 1 && (_jsxs("div", { className: "flex justify-center mt-8 gap-2", children: [_jsx("button", { onClick: () => setPage(page - 1), disabled: page === 1, className: "px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed", style: { borderColor: "#42d7c7", color: "#42d7c7" }, children: "Anterior" }), _jsxs("span", { className: "px-4 py-2 font-medium", style: { color: "#0c154c" }, children: ["P\u00E1gina ", page, " de ", totalPages] }), _jsx("button", { onClick: () => setPage(page + 1), disabled: page === totalPages, className: "px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed", style: { borderColor: "#42d7c7", color: "#42d7c7" }, children: "Siguiente" })] })), deleteConfirm && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full mx-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", style: { color: "#0c154c" }, children: "Confirmar Eliminaci\u00F3n" }), _jsx("p", { className: "text-gray-600 mb-6", children: "\u00BFEst\u00E1s seguro de que quieres eliminar este evento de descuento? Esta acci\u00F3n no se puede deshacer." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setDeleteConfirm(null), className: "flex-1 py-2 px-4 rounded-lg border-2 font-medium", style: { borderColor: "#d1d5db", color: "#6b7280" }, children: "Cancelar" }), _jsx("button", { onClick: () => handleDelete(deleteConfirm), className: "flex-1 py-2 px-4 rounded-lg font-medium text-white", style: { backgroundColor: "#ef4444" }, children: "Eliminar" })] })] }) }))] }) }));
}
