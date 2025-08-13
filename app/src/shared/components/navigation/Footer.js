import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Github, Youtube } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
const menuItems = {
    column1: [
        { label: "Inicio", href: "/" },
        { label: "Cursos", href: "/cursos" },
    ],
    column2: [
        { label: "Sobre Nosotros", href: "/sobre-nosotros" },
        { label: "Contacto", href: "/contacto" },
    ],
};
const socialLinks = [
    { icon: faDiscord, href: "https://discord.gg/sfkZkv5cZs", label: "Discord", isFontAwesome: true, color: "#171515" },
    { icon: faWhatsapp, href: "https://chat.whatsapp.com/ImICgrdizYG2elipsk7SwN", label: "WhatsApp", isFontAwesome: true, color: "#171515" },
    { icon: Github, href: "https://github.com/4lexxe/DevsProject", label: "GitHub", isFontAwesome: false, color: "#171515" },
    { icon: Youtube, href: "#", label: "YouTube", isFontAwesome: false, color: "#171515" },
];
export default function Footer() {
    return (_jsx("footer", { className: "bg-gray-50 py-8 sm:py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start", children: [_jsx("div", { className: "flex justify-center md:justify-start", children: _jsx("img", { src: "https://i.ibb.co/p1SH5jQ/logo-Devs-Vertical.png", alt: "Devs Project Logo", className: "h-12 w-auto" }) }), _jsx("div", { className: "hidden md:block", children: _jsx("ul", { className: "space-y-3", children: menuItems.column1.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, className: "text-sm text-gray-600 hover:text-gray-900 transition-colors", children: item.label }) }, item.label))) }) }), _jsx("div", { className: "hidden md:block", children: _jsx("ul", { className: "space-y-3", children: menuItems.column2.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, className: "text-sm text-gray-600 hover:text-gray-900 transition-colors", children: item.label }) }, item.label))) }) }), _jsx("div", { className: "flex space-x-6 justify-center md:justify-end", children: socialLinks.map(({ icon, href, label, isFontAwesome, color }) => (_jsx("a", { href: href, className: "", "aria-label": label, style: { color }, children: isFontAwesome ? (_jsx(FontAwesomeIcon, { icon: icon, className: "w-8 h-8" })) : (React.createElement(icon, { className: "w-8 h-8" })) }, label))) })] }), _jsxs("div", { className: "mt-8 grid grid-cols-2 gap-4 md:hidden", children: [_jsx("div", { children: _jsx("ul", { className: "space-y-3", children: menuItems.column1.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, className: "text-sm text-gray-600 hover:text-gray-900 transition-colors", children: item.label }) }, item.label))) }) }), _jsx("div", { children: _jsx("ul", { className: "space-y-3", children: menuItems.column2.map((item) => (_jsx("li", { children: _jsx("a", { href: item.href, className: "text-sm text-gray-600 hover:text-gray-900 transition-colors", children: item.label }) }, item.label))) }) })] }), _jsx("div", { className: "mt-8 pt-8 border-t border-gray-200", children: _jsxs("p", { className: "text-center text-xs text-gray-500", children: ["\u00A9 ", new Date().getFullYear(), " Devs Project. Todos los derechos reservados."] }) })] }) }));
}
