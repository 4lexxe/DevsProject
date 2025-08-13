"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { discountEventSchema } from "../validations/discountEvent";
import { discountEventService } from "../services/discountEventService";
import { getCourses } from "../../course/services/courseServices";
export default function DiscountEventsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');
    const isEditing = !!editId;
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset, } = useForm({
        resolver: zodResolver(discountEventSchema),
        defaultValues: {
            isActive: true,
        },
    });
    const watchedStartDate = watch("startDate");
    const watchedEndDate = watch("endDate");
    useEffect(() => {
        loadCourses();
        if (isEditing) {
            loadDiscountEvent();
        }
        else {
            setLoading(false);
        }
    }, [isEditing, editId]);
    const loadCourses = async () => {
        try {
            const coursesData = await getCourses();
            setCourses(coursesData || []);
        }
        catch (error) {
            console.error('Error loading courses:', error);
            setError('Error al cargar los cursos');
        }
    };
    const loadDiscountEvent = async () => {
        if (!editId)
            return;
        try {
            setLoading(true);
            const discountEvent = await discountEventService.getDiscountEventById(parseInt(editId));
            // Convertir las fechas string a Date objects
            const startDate = new Date(discountEvent.startDate);
            const endDate = new Date(discountEvent.endDate);
            // Rellenar el formulario con los datos existentes
            setValue('courseId', discountEvent.courseId.toString());
            setValue('event', discountEvent.event);
            setValue('description', discountEvent.description);
            setValue('value', discountEvent.value);
            setValue('startDate', startDate);
            setValue('endDate', endDate);
            setValue('isActive', discountEvent.isActive);
        }
        catch (error) {
            console.error('Error loading discount event:', error);
            setError('Error al cargar el evento de descuento');
        }
        finally {
            setLoading(false);
        }
    };
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setError(null);
        try {
            if (isEditing) {
                await discountEventService.updateDiscountEvent(parseInt(editId), data);
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate('/discount-events');
                }, 1500);
            }
            else {
                await discountEventService.createDiscountEvent(data);
                setSubmitSuccess(true);
                reset();
                setTimeout(() => setSubmitSuccess(false), 3000);
            }
        }
        catch (error) {
            console.error('Error al guardar evento de descuento:', error);
            setError(error.message || 'Error al guardar el evento de descuento');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2", style: { borderColor: "#42d7c7" } }), _jsx("span", { style: { color: "#0c154c" }, children: "Cargando..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen", style: { backgroundColor: "#eff6ff" }, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", style: { color: "#0c154c" }, children: isEditing ? 'Editar Evento de Descuento' : 'Crear Evento de Descuento' }), _jsx("p", { className: "text-gray-600", children: isEditing
                                ? 'Modifica los detalles del evento de descuento'
                                : 'Configura descuentos especiales para tus cursos con fechas de inicio y fin' })] }), submitSuccess && (_jsxs("div", { className: "mb-6 p-4 rounded-lg border-2 flex items-center gap-2", style: { borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }, children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: "#42d7c7" } }), _jsx("span", { style: { color: "#0c154c" }, children: isEditing
                                ? '¡Evento de descuento actualizado exitosamente!'
                                : '¡Evento de descuento creado exitosamente!' })] })), error && (_jsxs("div", { className: "mb-6 p-4 rounded-lg border-2 flex items-center gap-2", style: { borderColor: "#ef4444", backgroundColor: "#fef2f2" }, children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: "#ef4444" } }), _jsx("span", { style: { color: "#dc2626" }, children: error })] })), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "border-2 rounded-lg overflow-hidden", style: { borderColor: "#42d7c7" }, children: [_jsx("div", { className: "p-6 text-white", style: { backgroundColor: "#0c154c" }, children: _jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "+" }), "Informaci\u00F3n del Evento"] }) }), _jsx("div", { className: "p-6", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "courseId", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Curso *" }), _jsxs("select", { id: "courseId", className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", style: { borderColor: "#42d7c7" }, ...register("courseId"), children: [_jsx("option", { value: "", children: "Selecciona un curso" }), courses.map((course) => (_jsx("option", { value: course.id, children: course.title }, course.id)))] }), errors.courseId && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.courseId.message] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "event", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Nombre del Evento *" }), _jsx("input", { id: "event", type: "text", placeholder: "ej. Black Friday 2024", className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", style: { borderColor: "#42d7c7" }, ...register("event") }), errors.event && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.event.message] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Descripci\u00F3n *" }), _jsx("textarea", { id: "description", placeholder: "Describe el evento de descuento...", rows: 4, className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical", style: { borderColor: "#42d7c7" }, ...register("description") }), errors.description && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.description.message] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "value", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Porcentaje de Descuento (%) *" }), _jsx("input", { id: "value", type: "number", min: "1", max: "100", placeholder: "30", className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", style: { borderColor: "#42d7c7" }, ...register("value", { valueAsNumber: true }) }), errors.value && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.value.message] }))] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "startDate", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Fecha de Inicio *" }), _jsx("input", { id: "startDate", type: "date", className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", style: { borderColor: "#42d7c7" }, ...register("startDate", { valueAsDate: true }) }), errors.startDate && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.startDate.message] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "endDate", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Fecha de Fin *" }), _jsx("input", { id: "endDate", type: "date", className: "w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", style: { borderColor: "#42d7c7" }, ...register("endDate", { valueAsDate: true }) }), errors.endDate && (_jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [_jsx("span", { className: "text-red-500", children: "\u26A0" }), errors.endDate.message] }))] })] }), _jsxs("div", { className: "flex items-center space-x-3 p-4 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: [_jsx("input", { id: "isActive", type: "checkbox", defaultChecked: true, className: "w-5 h-5 rounded border-2 focus:ring-2 focus:ring-blue-500", style: { accentColor: "#42d7c7" }, ...register("isActive") }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "isActive", className: "block text-sm font-medium", style: { color: "#0c154c" }, children: "Evento Activo" }), _jsx("p", { className: "text-sm text-gray-600", children: "El evento estar\u00E1 disponible para aplicar descuentos" })] })] }), _jsxs("div", { className: "flex gap-4", children: [isEditing && (_jsx("button", { type: "button", onClick: () => navigate('/discount-events'), className: "flex-1 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 transition-all duration-300 hover:bg-gray-50", style: { borderColor: "#d1d5db" }, children: "Cancelar" })), _jsx("button", { type: "submit", disabled: isSubmitting, className: `${isEditing ? 'flex-1' : 'w-full'} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`, style: { backgroundColor: "#42d7c7" }, children: isSubmitting ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), isEditing ? 'Actualizando Evento...' : 'Creando Evento...'] })) : (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { children: "\uD83D\uDCBE" }), isEditing ? 'Actualizar Evento de Descuento' : 'Crear Evento de Descuento'] })) })] })] }) })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "sticky top-24 border-2 rounded-lg overflow-hidden", style: { borderColor: "#42d7c7" }, children: [_jsx("div", { className: "p-4 text-white", style: { backgroundColor: "#1d4ed8" }, children: _jsx("h3", { className: "text-lg font-semibold", children: "Vista Previa" }) }), _jsx("div", { className: "p-6 space-y-4", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", style: { color: "#0c154c" }, children: "Informaci\u00F3n del Evento" }), _jsxs("div", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("p", { children: "\u2022 Los descuentos se aplicar\u00E1n autom\u00E1ticamente" }), _jsx("p", { children: "\u2022 Solo activo durante el rango de fechas" }), _jsx("p", { children: "\u2022 Se puede activar/desactivar manualmente" })] })] }), _jsxs("div", { className: "p-3 rounded-lg", style: { backgroundColor: "#eff6ff" }, children: [_jsx("h5", { className: "font-medium mb-2", style: { color: "#1d4ed8" }, children: "Ejemplo de Badge" }), _jsxs("div", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", style: { backgroundColor: "#02ffff", color: "#0c154c" }, children: [_jsx("span", { className: "mr-1", children: "\u2728" }), "30% OFF"] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", style: { color: "#0c154c" }, children: "Campos Requeridos" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Curso" }), _jsx("li", { children: "\u2022 Nombre del evento" }), _jsx("li", { children: "\u2022 Descripci\u00F3n" }), _jsx("li", { children: "\u2022 Porcentaje de descuento" }), _jsx("li", { children: "\u2022 Fechas de inicio y fin" })] })] }), _jsx("div", { className: "p-3 rounded-lg border", style: { borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }, children: _jsxs("p", { className: "text-sm", style: { color: "#0c154c" }, children: [_jsx("strong", { children: "Nota:" }), " La fecha de fin debe ser posterior a la fecha de inicio."] }) })] }) })] }) })] })] }) }));
}
