import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
const CollaboratorsSection = () => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (!token) {
            console.error('GitHub token is not defined');
            return;
        }
        fetch('https://api.github.com/repos/4lexxe/DevsProject/contributors', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
            const filteredCollaborators = data.filter((collaborator) => collaborator.contributions > 1);
            setCollaborators(filteredCollaborators);
            setLoading(false);
        })
            .catch((error) => {
            console.error('Error fetching contributors:', error);
            setLoading(false);
        });
    }, []);
    return (_jsx("section", { className: "py-6 sm:py-12 bg-gradient-to-b from-gray-50 to-white", id: "collaborators", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center mb-6 sm:mb-8", children: [_jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-900", children: "Nuestros Contruibuidores" }), _jsx("p", { className: "mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto", children: "Conoce al equipo de desarrolladores que hacen posible este proyecto" })] }), loading ? (_jsx("div", { className: "flex justify-center items-center min-h-[200px]", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" }) })) : (_jsx(motion.div, { className: "flex flex-wrap justify-center gap-4 items-center", children: collaborators.length > 0 ? (collaborators.map((collaborator) => (_jsxs(motion.div, { whileHover: { scale: 1.1 }, className: "group relative w-[100px] sm:w-[140px] text-center", children: [_jsx("div", { className: "relative", children: _jsx("img", { src: collaborator.avatar_url, alt: collaborator.username || collaborator.login, className: "w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300 object-cover mx-auto" }) }), _jsx("h3", { className: "text-sm sm:text-base font-semibold text-gray-900 mt-2 truncate px-1", children: collaborator.username || collaborator.login }), _jsxs("div", { className: "flex justify-center space-x-2 mt-2", children: [_jsx(motion.a, { whileHover: { scale: 1.2 }, href: collaborator.html_url, target: "_blank", rel: "noopener noreferrer", className: "text-gray-600 hover:text-blue-600 transition-colors duration-200", children: _jsx(Github, { className: "h-4 w-4" }) }), _jsx(motion.a, { whileHover: { scale: 1.2 }, href: `${collaborator.html_url}?tab=repositories`, target: "_blank", rel: "noopener noreferrer", className: "text-gray-600 hover:text-blue-600 transition-colors duration-200", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] })] }, collaborator.login)))) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-center py-8", children: _jsx("p", { className: "text-base text-gray-600", children: "No se encontraron contribuidores." }) })) }))] }) }));
};
export default CollaboratorsSection;
