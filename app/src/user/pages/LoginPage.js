import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LoginForm from "../components/login/LoginForm";
import withAuthCheck from "../hoc/WithAuthCheck";
import { Link } from "react-router-dom";
function LoginPage() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-100", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow-md p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-2", children: "Iniciar Sesi\u00F3n" }), _jsx("p", { className: "text-center text-gray-600 mb-6", children: "Ingresa tus credenciales para acceder" }), _jsx(LoginForm, {}), _jsx("div", { className: "mt-4 text-center", children: _jsx("a", { href: "#", className: "text-sm text-blue-600 hover:underline", children: "\u00BFOlvidaste tu contrase\u00F1a?" }) }), _jsx(Link, { to: "/register", className: "text-blue-600 hover:underline", children: "No tienes cuenta? Reg\u00EDstrate" })] }) }));
}
export default withAuthCheck(LoginPage); // Envuelve la página con el HOC
