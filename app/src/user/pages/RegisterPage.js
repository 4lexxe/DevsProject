import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm";
import withAuthCheck from "../hoc/WithAuthCheck";
function RegisterPage() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-100", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow-md p-8 mt-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-6", children: "Registro" }), _jsx(RegisterForm, {}), _jsxs("p", { className: "mt-6 text-center text-sm text-gray-600", children: ["\u00BFYa tienes una cuenta?", " ", _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:underline", children: "Inicia sesi\u00F3n aqu\u00ED" })] })] }) }));
}
export default withAuthCheck(RegisterPage); // Envuelve la página con el HOC
