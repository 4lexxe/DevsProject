import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingSpinner = () => {
    return (_jsx("div", { className: "flex flex-col justify-center items-center h-screen bg-gray-100", children: _jsxs("div", { className: "text-center", children: [_jsx("img", { src: "https://i.ibb.co/dQ09SsH/logoDev2.png", alt: "DEVs Project Logo", className: "w-48 h-auto mb-8" }), _jsx("div", { className: "flex gap-2 justify-center items-center", children: [0, 1, 2].map((index) => (_jsx("div", { className: "w-3 h-3 bg-cyan-400 rounded loading-dot", style: {
                            animationDelay: `${index * 0.16}s`,
                        } }, index))) }), _jsx("p", { className: "mt-4 text-gray-700", children: "Verificando" })] }) }));
};
export default LoadingSpinner;
