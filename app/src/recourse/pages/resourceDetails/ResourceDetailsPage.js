import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceService } from '../../services/resource.service';
import { toast } from 'react-hot-toast';
import ResourceHeader from '../../navigation/ResourceDetailHeader';
import ResourceContent from '../../components/ResourceContent';
import ResourceInfo from '../../components/ResourceInfo';
import ResourceActions from '../../components/ResourceActions';
import Comment from '../../components/Comment';
const ResourceDetailsPage = () => {
    const { id } = useParams();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchResourceDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                if (!id) {
                    setError('ID de recurso no válido');
                    return;
                }
                const resourceData = await ResourceService.getResourceById(Number(id));
                setResource(resourceData);
            }
            catch (err) {
                console.error('Error fetching resource details:', err);
                setError('Error al cargar el recurso. Por favor, intenta nuevamente.');
            }
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchResourceDetails();
        }
    }, [id]);
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Enlace copiado al portapapeles');
        }
        catch (err) {
            console.error('Error al copiar el enlace:', err);
            toast.error('Error al copiar el enlace');
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-800" }) }));
    }
    if (error || !resource) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white p-6", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md", children: _jsx("p", { className: "text-red-700", children: error || 'Recurso no encontrado' }) }) }) }));
    }
    // Crear el objeto resourceUser a partir de la información que ya viene en el recurso
    const resourceUser = resource.user ? {
        id: resource.user.id,
        name: resource.user.name,
        avatar: resource.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.user.name || `Usuario ${resource.user.id}`)}&background=random`
    } : null;
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx(ResourceHeader, { resource: resource }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [_jsx(ResourceContent, { resource: resource }), _jsx(ResourceInfo, { resource: resource, user: resourceUser }), resource.id !== undefined && resource.userId !== undefined && (_jsx(ResourceActions, { resourceId: resource.id, ownerId: resource.userId, onShare: handleShare })), resource.id !== undefined && (_jsx("div", { className: "p-6", children: _jsx(Comment, { resourceId: resource.id }) }))] })] }) }));
};
export default ResourceDetailsPage;
