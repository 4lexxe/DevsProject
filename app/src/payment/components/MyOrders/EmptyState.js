import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { FileText, CreditCard } from 'lucide-react';
const EmptyState = ({ type }) => {
    const isOrders = type === 'orders';
    return (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "mb-4", children: isOrders ? (_jsx(FileText, { className: "h-16 w-16 mx-auto text-gray-400" })) : (_jsx(CreditCard, { className: "h-16 w-16 mx-auto text-gray-400" })) }), _jsx("h2", { className: "text-2xl font-bold mb-4", style: { color: "#0c154c" }, children: isOrders ? "No tienes órdenes aún" : "No tienes pagos registrados" }), _jsx("p", { className: "text-gray-600", children: "Cuando realices tu primera compra, aparecer\u00E1 aqu\u00ED" }), _jsx(Link, { to: "/courses", className: "inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4", style: { backgroundColor: "#1d4ed8" }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1e40af", onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8", children: "Explorar Cursos" })] }));
};
export default EmptyState;
