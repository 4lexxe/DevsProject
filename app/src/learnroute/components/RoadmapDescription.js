import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, Target, Users } from "lucide-react";
export default function RoadmapDescription() {
    const features = [
        "Backend con Node.js y Express: Aprende a crear APIs RESTful, manejar autenticación, middleware y optimizar consultas con PostgreSQL y Sequelize.",
        "Frontend con React o Next.js: Construye interfaces dinámicas y optimizadas para SEO, utilizando SSR (Server-Side Rendering) y CSR (Client-Side Rendering).",
        "Bases de Datos con PostgreSQL: Domina consultas SQL, relaciones, transacciones y la integración con tu backend.",
        "Autenticación y Seguridad: Implementa autenticación con JWT, OAuth y mejores prácticas de seguridad en aplicaciones web.",
        "Despliegue y Escalabilidad: Aprende a desplegar tu aplicación en plataformas como Vercel, Railway o AWS, configurando entornos en producción.",
    ];
    const audience = [
        "Desarrolladores que quieren aprender fullstack desde cero.",
        "Programadores frontend que buscan profundizar en el backend.",
        "Backend developers que quieren mejorar en React o Next.js.",
        "Cualquier persona interesada en crear aplicaciones modernas y escalables.",
    ];
    return (_jsx("div", { className: "bg-white py-16 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-12", children: [_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Target, { className: "w-6 h-6 text-blue-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "\u00BFQu\u00E9 aprender\u00E1s?" })] }), _jsx("p", { className: "text-gray-600 mb-6", children: "Este roadmap est\u00E1 dise\u00F1ado para guiarte en el camino hacia convertirte en un desarrollador fullstack experto en PERN o Next.js. A lo largo del proceso, explorar\u00E1s:" }), _jsx("ul", { className: "space-y-4", children: features.map((feature, index) => (_jsxs("li", { className: "flex gap-3", children: [_jsx(CheckCircle2, { className: "w-6 h-6 text-green-500 flex-shrink-0" }), _jsx("span", { className: "text-gray-600", children: feature })] }, index))) })] }), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Users, { className: "w-6 h-6 text-blue-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "\u00BFPara qui\u00E9n es este roadmap?" })] }), _jsx("ul", { className: "space-y-3", children: audience.map((item, index) => (_jsxs("li", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-blue-600", children: "\u2714\uFE0F" }), _jsx("span", { className: "text-gray-600", children: item })] }, index))) })] }), _jsx("div", { className: "text-center pt-8", children: _jsx("p", { className: "text-xl font-semibold text-blue-600", children: "\uD83D\uDCCC \u00A1Empieza tu viaje hacia el desarrollo fullstack ahora!" }) })] }) }));
}
