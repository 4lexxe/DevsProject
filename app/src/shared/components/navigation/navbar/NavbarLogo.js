import { jsx as _jsx } from "react/jsx-runtime";
export const NavbarLogo = ({ onNavigate }) => {
    return (_jsx("div", { className: "flex-shrink-0 transition-transform duration-200 hover:scale-105", children: _jsx("a", { href: "/", className: "flex items-center space-x-2", onClick: (e) => {
                e.preventDefault();
                onNavigate();
            }, children: _jsx("div", { className: "h-16 w-16 mx-auto", children: _jsx("img", { src: "https://i.ibb.co/dQ09SsH/logoDev2.png", alt: "Devs Project Logo", className: "h-full w-full object-contain" }) }) }) }));
};
