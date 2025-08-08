import { jsx as _jsx } from "react/jsx-runtime";
const ShortAnswer = ({ value, onChange }) => {
    return (_jsx("div", { className: "space-y-4", children: _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: "Escribe tu respuesta aqu\u00ED...", className: "w-full p-4 rounded-lg border-2 border-slate-200 focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all duration-300" }) }));
};
export default ShortAnswer;
