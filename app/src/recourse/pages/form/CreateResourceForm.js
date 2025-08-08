import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, PlusCircle, AlertCircle, FileText, Package, Image, Link2, AlignLeft, Eye, EyeOff, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResourceService } from '../../services/resource.service';
import { resourceSchema } from '../../validations/resourceValidation';
import NSFWDetectionService from '../../services/nsfwDetection.service';
import ResourceTypeSelector from '../../components/ResourceTypeSelector';
import ResourceUrlInput from '../../components/ResourceUrlInput';
import ResourceVisibilityToggle from '../../components/ResourceVisibilityToggle';
import InputFile from '../../components/InputFile';
import { useAuth } from '@/user/contexts/AuthContext';
const ResourceForm = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const resourceId = id ? parseInt(id) : undefined;
    const isEditMode = !!resourceId;
    const [isLoading, setIsLoading] = useState(isEditMode);
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting, isValid } } = useForm({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: '',
            description: '',
            url: '',
            type: 'video',
            isVisible: true,
            coverImage: '',
        },
        mode: 'onChange'
    });
    const [explicitContentWarning, setExplicitContentWarning] = React.useState('');
    // Valores observados
    const type = watch('type');
    const title = watch('title');
    const description = watch('description');
    const url = watch('url');
    const coverImage = watch('coverImage');
    const isVisible = watch('isVisible');
    // Efecto para cargar recurso existente en modo edición
    // Verificar autenticación antes de cargar el formulario
    useEffect(() => {
        if (isLoading)
            return; // Esperar a que termine la verificación de autenticación
        if (!user) {
            toast.error('Debes iniciar sesión para acceder a esta página.');
            navigate('/login', { replace: true });
        }
    }, [user, isLoading, navigate]);
    // Cargar recurso existente en modo edición
    useEffect(() => {
        if (!isEditMode || !user)
            return;
        const loadResource = async () => {
            try {
                const resource = await ResourceService.getResourceById(resourceId);
                // Verificar si el usuario es el propietario
                if (resource.userId !== user.id) {
                    toast.error('No tienes permisos para editar este recurso.');
                    console.error('No tienes permisos para editar este recurso.');
                    console.log('Recurso:', resource);
                    console.log('Usuario:', user);
                    navigate('/recursos', { replace: true });
                    return;
                }
                // Cargar datos del recurso en el formulario
                reset({
                    ...resource,
                    coverImage: resource.coverImage || '',
                    isVisible: resource.isVisible ?? true,
                });
            }
            catch (error) {
                console.error('Error al cargar recurso:', error);
                toast.error('Error al cargar el recurso.');
                navigate('/recursos', { replace: true });
            }
            finally {
                setIsLoading(false);
            }
        };
        loadResource();
    }, [isEditMode, user, resourceId, reset, navigate]);
    // Cargar modelo NSFW
    useEffect(() => {
        const initNSFW = async () => {
            await NSFWDetectionService.loadModel();
        };
        initNSFW();
    }, []);
    // Resetear advertencias cuando cambia el tipo
    useEffect(() => {
        setExplicitContentWarning('');
    }, [type]);
    // Manejo de imagen de portada
    const handleCoverImageChange = useCallback(async (fileUrl) => {
        if (!fileUrl) {
            setValue('coverImage', '');
            setExplicitContentWarning('');
            return;
        }
        try {
            const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
            if (isExplicit)
                throw new Error('Contenido explícito detectado');
            setValue('coverImage', fileUrl, { shouldValidate: true });
            setExplicitContentWarning('');
        }
        catch (error) {
            console.error('Error en imagen de portada:', error);
            toast.error('Contenido inapropiado detectado');
            setExplicitContentWarning('¡Advertencia! Contenido explícito en la imagen de portada');
        }
    }, [setValue]);
    // Manejo de URL/imagen principal
    const handleUrlChange = useCallback(async (fileUrl) => {
        if (!fileUrl) {
            setValue('url', '');
            setExplicitContentWarning('');
            return;
        }
        try {
            if (type === 'image') {
                const isExplicit = await NSFWDetectionService.checkExplicitContent(fileUrl);
                if (isExplicit)
                    throw new Error('Contenido explícito detectado');
            }
            setValue('url', fileUrl, { shouldValidate: true });
            setExplicitContentWarning('');
        }
        catch (error) {
            console.error('Error en URL/imagen:', error);
            toast.error('Contenido inapropiado detectado');
            setExplicitContentWarning('¡Advertencia! Contenido explícito detectado');
        }
    }, [setValue, type]);
    // Envío del formulario
    const onSubmit = useCallback(async (data) => {
        try {
            // Validaciones NSFW
            if (type === 'image' && data.url) {
                const isUrlExplicit = await NSFWDetectionService.checkExplicitContent(data.url);
                if (isUrlExplicit)
                    throw new Error('Contenido explícito en URL');
            }
            if (data.coverImage) {
                const isCoverExplicit = await NSFWDetectionService.checkExplicitContent(data.coverImage);
                if (isCoverExplicit)
                    throw new Error('Contenido explícito en portada');
            }
            // Operación crear/actualizar
            if (isEditMode) {
                await ResourceService.updateResource(resourceId, data);
                toast.success('Recurso actualizado correctamente');
            }
            else {
                const userId = 1; // Obtener de autenticación en producción
                const createdResource = await ResourceService.createResource({ ...data, userId });
                navigate(`/resources/${createdResource.id}`);
                toast.success('Recurso creado correctamente');
                return;
            }
            navigate(`/resources/${resourceId}`);
        }
        catch (error) {
            console.error('Error al guardar:', error);
            toast.error(error instanceof Error ? error.message : 'Error al guardar el recurso');
        }
    }, [isEditMode, resourceId, navigate, type]);
    // Resetear formulario
    const handleReset = useCallback(() => {
        reset();
        setExplicitContentWarning('');
    }, [reset]);
    // Componentes dinámicos
    const renderUrlInput = useMemo(() => {
        if (type === 'image') {
            return (_jsx(InputFile, { value: url, onChange: handleUrlChange, error: errors.url?.message, disabled: isEditMode }));
        }
        return (_jsx(ResourceUrlInput, { url: url, onChange: (e) => setValue('url', e.target.value, { shouldValidate: true }), error: errors.url?.message }));
    }, [type, url, errors.url?.message, handleUrlChange, setValue, isEditMode]);
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-8", children: [_jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate(-1), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5 text-gray-500" }) }), _jsx("h1", { className: "text-xl font-bold text-gray-900 flex items-center gap-2", children: isEditMode ? (_jsxs(_Fragment, { children: [_jsx(Edit, { className: "w-5 h-5 text-blue-500" }), " Editar Recurso"] })) : (_jsxs(_Fragment, { children: [_jsx(PlusCircle, { className: "w-5 h-5 text-green-500" }), " Crear Nuevo Recurso"] })) })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6", children: [explicitContentWarning && (_jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2", role: "alert", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }), _jsxs("span", { children: [_jsx("strong", { className: "font-bold", children: "\u00A1Advertencia!" }), ' ', _jsx("span", { className: "block sm:inline", children: explicitContentWarning })] })] })), _jsxs("div", { children: [_jsxs("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-gray-400" }), " T\u00EDtulo *"] }), _jsx("input", { type: "text", id: "title", ...register('title'), maxLength: 55, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", disabled: isSubmitting }), _jsxs("div", { className: "flex justify-between mt-1", children: [errors.title ? (_jsxs("p", { className: "text-red-500 text-sm flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), " ", errors.title.message] })) : (_jsx("div", {})), _jsxs("span", { className: "text-xs text-gray-500", children: [title?.length || 0, "/55"] })] })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "type", className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: [_jsx(Package, { className: "w-5 h-5 text-gray-400" }), " Tipo de Recurso"] }), _jsx(ResourceTypeSelector, { type: type, onChange: (e) => setValue('type', e.target.value, { shouldValidate: true }), disabled: isSubmitting || isEditMode })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "url", className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: type === 'image' ? (_jsxs(_Fragment, { children: [_jsx(Image, { className: "w-5 h-5 text-gray-400" }), " Subir Imagen"] })) : (_jsxs(_Fragment, { children: [_jsx(Link2, { className: "w-5 h-5 text-gray-400" }), " URL del Recurso"] })) }), renderUrlInput] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: [_jsx(AlignLeft, { className: "w-5 h-5 text-gray-400" }), " Descripci\u00F3n"] }), _jsx("textarea", { id: "description", ...register('description'), maxLength: 500, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", disabled: isSubmitting, rows: 4 }), _jsxs("div", { className: "flex justify-between mt-1", children: [errors.description ? (_jsxs("p", { className: "text-red-500 text-sm flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), " ", errors.description.message] })) : (_jsx("div", {})), _jsxs("span", { className: "text-xs text-gray-500", children: [description?.length || 0, "/500"] })] })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "coverImage", className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: [_jsx(Image, { className: "w-5 h-5 text-gray-400" }), " Imagen de Portada"] }), _jsx(InputFile, { value: coverImage, onChange: handleCoverImageChange, error: errors.coverImage?.message, disabled: isSubmitting })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 flex items-center gap-2", children: [isVisible ? (_jsx(Eye, { className: "w-5 h-5 text-gray-400" })) : (_jsx(EyeOff, { className: "w-5 h-5 text-gray-400" })), ' ', "Visibilidad"] }), _jsx(ResourceVisibilityToggle, { isVisible: isVisible, onChange: (value) => setValue('isVisible', value, { shouldValidate: true }), disabled: isSubmitting })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsxs("button", { type: "button", onClick: () => {
                                    handleReset();
                                    navigate(-1);
                                }, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2", disabled: isSubmitting, children: [_jsx(XCircle, { className: "w-5 h-5 text-gray-500" }), " Cancelar"] }), _jsx("button", { type: "submit", disabled: isSubmitting || !isValid, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2", children: isSubmitting ? (isEditMode ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), " Actualizando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), " Creando..."] }))) : isEditMode ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-5 h-5" }), " Actualizar Recurso"] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-5 h-5" }), " Crear Recurso"] })) })] })] })] }));
};
export default ResourceForm;
