import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { ResourceService } from "../../services/resource.service";
import ResourceListHeader from "../../navigation/ResourceListHeader";
import ResourceCard from "../../components/ResourceCard";
const ResourceListPage = () => {
    const [resources, setResources] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Obtener recursos y ordenarlos por fecha de creación (más reciente primero)
    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Obteniendo recursos públicos...');
            const data = await ResourceService.getResources();
            // Los recursos ya incluyen la información del usuario del backend
            let resourceArray = [];
            if (Array.isArray(data)) {
                resourceArray = data;
            }
            else if (data && Array.isArray(data.data)) {
                resourceArray = data.data;
            }
            else {
                console.warn('Estructura de datos inesperada:', data);
                resourceArray = [];
            }
            const sortedResources = resourceArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setResources(sortedResources);
            // Extraer información del usuario directamente de los recursos (ya incluida por el backend)
            const userInfoMap = {};
            sortedResources.forEach(resource => {
                if (resource.user) {
                    userInfoMap[resource.userId] = {
                        id: resource.user.id,
                        name: resource.user.name,
                        avatar: resource.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.user.name || `Usuario ${resource.user.id}`)}&background=random`,
                    };
                }
                else {
                    // Si por alguna razón no viene la información del usuario, crear datos básicos
                    userInfoMap[resource.userId] = {
                        id: resource.userId,
                        name: `Usuario ${resource.userId}`,
                        avatar: `https://ui-avatars.com/api/?name=Usuario+${resource.userId}&background=random`,
                    };
                }
            });
            setUsers(userInfoMap);
            console.log('✅ Recursos y usuarios procesados correctamente');
            setLoading(false);
        }
        catch (err) {
            console.error("❌ Error fetching resources:", err);
            setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchResources();
    }, [fetchResources]);
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24", children: [_jsx(ResourceListHeader, {}), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-fade-in", children: error })), loading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-gray-900" }) })) : resources.length === 0 ? (_jsx("div", { className: "text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100", children: _jsx("p", { className: "text-gray-500 text-lg", children: "No hay recursos disponibles." }) })) : (_jsx("div", { className: "grid gap-8", children: resources.map((resource) => (_jsx(ResourceCard, { resource: resource, user: users[resource.userId] }, resource.id))) }))] }) }));
};
export default ResourceListPage;
