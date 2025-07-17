import { Link } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm";

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mt-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Registro de Admin</h2>
        
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
