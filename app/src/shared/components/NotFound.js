import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cat } from 'lucide-react';
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center p-4 bg-white", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center", children: [_jsx("div", { className: "mb-8", children: _jsx(motion.div, { animate: {
                            rotate: [0, -10, 10, -10, 0],
                        }, transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }, children: _jsx(Cat, { size: 120, className: "mx-auto text-blue-500  " }) }) }), _jsx(motion.h1, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: "text-8xl font-light mb-4 text-blue-500", children: "404" }), _jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, className: "text-xl text-blue-400 mb-8", children: "Lo sentimos, la p\u00E1gina que buscas no existe." }), _jsx(motion.button, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => navigate('/'), className: "px-6 py-3 bg-blue-900 text-white rounded-lg \r\n                     hover:bg-blue-950 transition-colors duration-200\r\n                     focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2", children: "Volver al inicio" })] }) }));
};
export default NotFound;
