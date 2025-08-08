import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Brain, Rocket, Code, Zap } from 'lucide-react';
import ModuleContent from './ModuleContent';
export default function ModuleCard({ module, expandedContent, onToggleContent }) {
    const getModuleStyles = (type) => {
        if (type === 'fundamental') {
            return {
                gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
                icon: _jsx(Brain, { className: "w-20 h-20 text-white/10" }),
                badge: {
                    icon: _jsx(Zap, { className: "w-4 h-4" }),
                    text: 'Módulo Fundamental',
                    color: 'text-blue-100'
                }
            };
        }
        return {
            gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
            icon: _jsx(Rocket, { className: "w-20 h-20 text-white/10" }),
            badge: {
                icon: _jsx(Code, { className: "w-4 h-4" }),
                text: 'Módulo Avanzado',
                color: 'text-purple-100'
            }
        };
    };
    const styles = getModuleStyles(module.type);
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-sm overflow-hidden", children: [_jsxs("div", { className: `relative h-24 ${styles.gradient} flex items-center px-6`, children: [module.type === 'advanced' && (_jsx("div", { className: "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" })), _jsx("div", { className: "absolute right-0 top-0 h-full w-32 flex items-center justify-center", children: styles.icon }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: `flex items-center space-x-2 ${styles.badge.color} mb-1`, children: [styles.badge.icon, _jsx("span", { className: "text-sm", children: styles.badge.text })] }), _jsxs("h3", { className: "text-xl font-semibold text-white", children: [module.number, ". ", module.title] })] })] }), _jsx("div", { className: "p-6", children: _jsx(ModuleContent, { content: module.content, expandedContent: expandedContent, onToggleContent: onToggleContent }) })] }));
}
