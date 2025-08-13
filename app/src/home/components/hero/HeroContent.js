import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';
import ActionButton from '../buttons/ActionButton';
export default function HeroContent({ headerSection }) {
    const fadeIn = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(50px)' },
        config: { duration: 800 }
    });
    return (_jsxs("div", { className: "relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("div", { className: "absolute inset-0", style: {
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0-20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    } }) }), _jsx("div", { className: "relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8", children: _jsx(animated.div, { style: fadeIn, className: "text-center", children: _jsxs("div", { className: "flex flex-col items-center justify-center space-y-10", children: [_jsx(motion.h1, { className: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight max-w-4xl", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.8 }, children: _jsx("span", { className: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent", children: headerSection.title }) }), _jsxs(motion.div, { className: "relative inline-block", initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.8 }, children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" }), _jsx("h2", { className: "pl-6 text-xl sm:text-2xl lg:text-3xl text-gray-700 text-left font-bold", children: _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: headerSection.slogan }) })] }), _jsx(motion.p, { className: "text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl font-medium", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6, duration: 0.8 }, children: headerSection.about }), _jsx(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8, duration: 0.8 }, children: _jsx(ActionButton, { href: headerSection.buttonLink, children: headerSection.buttonName }) }), _jsx(motion.div, { className: "flex items-center justify-center space-x-8 pt-8", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.0, duration: 0.8 }, children: [1, 2, 3].map((_, i) => (_jsx(motion.div, { className: "w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full", animate: {
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }, transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    } }, i))) })] }) }) })] }));
}
