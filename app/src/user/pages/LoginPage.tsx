import type React from "react";
import LoginForm from "../components/login/LoginForm";
import withAuthCheck from "../hoc/WithAuthCheck";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Iniciar Sesión</h2>
        <p className="text-center text-gray-600 mb-6">Ingresa tus credenciales para acceder</p>
        
        <LoginForm />

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      <Link to="/register" className="text-blue-600 hover:underline">
          No tienes cuenta? Regístrate
      </Link>
      </div>

    </div>
  );
}

export default withAuthCheck(LoginPage); // Envuelve la página con el HOC