import React from "react";
import { Link } from "react-router-dom";
import { Lock, LogIn, ShoppingCart, ArrowLeft } from "lucide-react";

interface ContentAccessBlockedProps {
  courseId: string;
  courseTitle?: string;
  coursePrice?: number;
  requiresAuth?: boolean;
  requiresAccess?: boolean;
  isAuthenticated?: boolean;
}

const ContentAccessBlocked: React.FC<ContentAccessBlockedProps> = ({
  courseId,
  courseTitle,
  coursePrice,
  requiresAuth,
  requiresAccess,
  isAuthenticated,
}) => {
  // Determinar el estado: no autenticado vs autenticado pero sin acceso
  const needsLogin = requiresAuth && !isAuthenticated;
  const needsPurchase = requiresAuth && isAuthenticated && requiresAccess;

  return (
    <div className="flex-1 transition-all duration-500 ease-in-out">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`p-8 text-white relative overflow-hidden ${
          needsLogin 
            ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
            : "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"
        }`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
              {needsLogin ? <LogIn className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {needsLogin ? "Inicio de Sesión Requerido" : "Contenido Bloqueado"}
              </h1>
              <p className="text-sm md:text-base opacity-90">
                {needsLogin
                  ? "Debes iniciar sesión para acceder a este contenido"
                  : "No tienes acceso a este contenido. Debes comprar el curso primero."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            {needsLogin ? (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6">
                    <LogIn className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Inicia sesión para continuar
                  </h2>
                  <p className="text-gray-600 text-lg mb-8">
                    Necesitas estar autenticado para acceder a este contenido del curso.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center space-x-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold"
                  >
                    <span>Crear Cuenta</span>
                  </Link>
                  <Link
                    to={`/course/${courseId}`}
                    className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver al Curso</span>
                  </Link>
                </div>
              </>
            ) : needsPurchase ? (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-6">
                    <Lock className="w-12 h-12 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Acceso Requerido
                  </h2>
                  <p className="text-gray-600 text-lg mb-4">
                    {courseTitle && (
                      <>
                        <span className="font-semibold text-gray-900">{courseTitle}</span>
                        <br />
                      </>
                    )}
                    Este es un curso de pago. Debes comprarlo para acceder a todo su contenido.
                  </p>
                  {coursePrice !== undefined && coursePrice > 0 && (
                    <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent mt-4">
                      ${coursePrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/course/${courseId}`}
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-8 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Ver Curso y Comprar</span>
                  </Link>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Explorar Cursos</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                    <Lock className="w-12 h-12 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Acceso Denegado
                  </h2>
                  <p className="text-gray-600 text-lg mb-4">
                    No tienes permiso para acceder a este contenido.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/course/${courseId}`}
                    className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver al Curso</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAccessBlocked;
