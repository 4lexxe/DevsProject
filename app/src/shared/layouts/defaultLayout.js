import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../notification/NotificationBubble';
import useSocket from '../hooks/useSocket';
export default function DefaultLayout() {
    const { backendOnline } = useSocket();
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-white", children: [_jsx(NotificationBubble, {}), _jsxs("main", { className: "flex-grow w-full", children: [_jsx(Navbar, {}), backendOnline ? (_jsx(Outlet, {})) : (_jsx("div", { className: "flex justify-center items-center h-[50vh] text-red-600 text-center px-4", children: _jsx("p", { className: "text-sm sm:text-base", children: "El servidor no est\u00E1 disponible. Por favor, intenta m\u00E1s tarde." }) }))] }), _jsx(Footer, {})] }));
}
