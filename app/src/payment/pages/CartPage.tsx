"use client"

import { Link } from "react-router-dom"
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Tag, AlertTriangle, X, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { cartService } from "../services"
import type { CartSummary } from "../services/cartService"
import PendingPaymentModal from "../components/PendingPaymentModal"

export default function CartPage() {
  const [cartData, setCartData] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<number | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [cancelingPending, setCancelingPending] = useState(false)
  const [courseAccessError, setCourseAccessError] = useState<{
    message: string;
    coursesWithAccess: Array<{id: number; title: string}>;
  } | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      const data = await cartService.getCartSummary()
      setCartData(data)
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartData(null)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (courseId: number) => {
    try {
      setRemoving(courseId)
      await cartService.removeCourseFromCart(courseId)
      await loadCart() // Recargar carrito
    } catch (error) {
      console.error('Error removing course:', error)
    } finally {
      setRemoving(null)
    }
  }

  const clearCart = async () => {
    try {
      await cartService.clearCart()
      await loadCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const proceedToPayment = async () => {
    try {
      setProcessingPayment(true)
      setCourseAccessError(null) // Limpiar errores previos
      const preference = await cartService.createPaymentPreference()
      // Redirigir a MercadoPago
      window.location.href = preference.initPoint
    } catch (error: any) {
      console.error('Error creating payment preference:', error)
      
      // Verificar si es error de carrito pendiente
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message;
        const errorData = error.response?.data?.data;
        
        if (errorMessage?.includes('carrito pendiente') || errorMessage?.includes('Ya existe un carrito pendiente')) {
          setShowPendingModal(true);
          return;
        }
        
        // Verificar si es error de cursos con acceso previo
        if (errorMessage?.includes('Ya tienes acceso a los siguientes cursos') && errorData?.coursesWithAccess) {
          setCourseAccessError({
            message: errorMessage,
            coursesWithAccess: errorData.coursesWithAccess
          });
          return;
        }
      }
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleCancelPendingAndContinue = async () => {
    try {
      setCancelingPending(true);
      
      // Cancelar el carrito pendiente
      await cartService.cancelPendingCart();
      
      // Cerrar modal
      setShowPendingModal(false);
      
      // Intentar proceder al pago nuevamente
      await proceedToPayment();
      
    } catch (error) {
      console.error('Error cancelando carrito pendiente:', error);
      setShowPendingModal(false);
    } finally {
      setCancelingPending(false);
    }
  };

  const handleCloseModal = () => {
    setShowPendingModal(false);
  };

  const handleRemoveCoursesWithAccess = async () => {
    if (!courseAccessError?.coursesWithAccess) return;

    try {
      // Eliminar cada curso del carrito
      for (const course of courseAccessError.coursesWithAccess) {
        await cartService.removeCourseFromCart(course.id);
      }
      
      // Recargar el carrito
      await loadCart();
      
      // Limpiar el error
      setCourseAccessError(null);
      
    } catch (error) {
      console.error('Error eliminando cursos del carrito:', error);
    }
  };

  const handleDismissCourseAccessError = () => {
    setCourseAccessError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg" style={{ color: "#0c154c" }}>Cargando carrito...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!cartData || cartData.courses.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Link to="/">
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-transparent hover:bg-gray-100 h-10 px-4 py-2 mb-6 hover:opacity-80" style={{ color: "#1d4ed8" }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a cursos
              </button>
            </Link>

            <div className="p-8 rounded-full w-32 h-32 mx-auto mb-6" style={{ backgroundColor: "#42d7c7" }}>
              <ShoppingBag className="w-16 h-16" style={{ color: "#0c154c" }} />
            </div>

            <h1 className="text-3xl font-bold mb-4" style={{ color: "#0c154c" }}>
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">¡Explora nuestros cursos y encuentra el perfecto para ti!</p>

            <Link to="/">
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 px-4 py-2 text-white" style={{ backgroundColor: "#1d4ed8" }}>
                Ver Cursos
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Ahora sabemos que cartData no es null
  const totalSavings = cartData.summary.totalSavings

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff6ff" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-transparent hover:bg-gray-100 h-10 px-4 py-2 mb-4 hover:opacity-80" style={{ color: "#1d4ed8" }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </button>
          </Link>

          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0c154c" }}>
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {cartData.summary.courseCount} {cartData.summary.courseCount === 1 ? "curso" : "cursos"} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.courses.map((item) => {
              const hasActiveDiscount = item.course.discountApplied !== null

              return (
                <div
                  key={item.cartCourseId}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2"
                  style={{ borderColor: "#42d7c7" }}
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Course Image */}
                      <div className="relative flex-shrink-0">
                        <div 
                          className="w-[120px] h-[80px] rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: "#1d4ed8" }}
                        >
                          {item.course.title.substring(0, 2).toUpperCase()}
                        </div>
                        {hasActiveDiscount && (
                          <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border-0" style={{ backgroundColor: "#02ffff", color: "#0c154c" }}>
                            <Tag className="w-3 h-3 mr-1" />
                            {item.course.discountApplied?.percentage}% OFF
                          </span>
                        )}
                      </div>

                      {/* Course Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2" style={{ color: "#0c154c" }}>
                          {item.course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.course.description || "Descripción del curso"}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Price */}
                          <div className="flex items-center gap-3">
                            {hasActiveDiscount ? (
                              <>
                                <span className="text-lg line-through text-gray-400">
                                  ${item.course.originalPrice}
                                </span>
                                <span className="text-2xl font-bold" style={{ color: "#1d4ed8" }}>
                                  ${item.course.finalPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold" style={{ color: "#1d4ed8" }}>
                                ${item.course.finalPrice}
                              </span>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.course.id)}
                            disabled={removing === item.course.id}
                            className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-transparent hover:bg-red-50 h-10 px-4 py-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {removing === item.course.id ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-24 border-2" style={{ borderColor: "#42d7c7" }}>
              <div className="p-6 pb-0 text-white" style={{ backgroundColor: "#0c154c" }}>
                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-xl">
                  <ShoppingBag className="w-5 h-5" />
                  Resumen del Pedido
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Course List */}
                <div className="space-y-3">
                  {cartData.courses.map((item) => (
                    <div
                      key={item.cartCourseId}
                      className="flex justify-between items-center text-sm p-3 rounded-lg"
                      style={{ backgroundColor: "#eff6ff" }}
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="font-medium truncate" style={{ color: "#0c154c" }}>
                          {item.course.title}
                        </div>
                      </div>
                      <div className="font-bold" style={{ color: "#1d4ed8" }}>
                        ${item.course.finalPrice}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px w-full bg-gray-200" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartData.summary.courseCount} cursos)</span>
                    <span>${cartData.summary.totalOriginal}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuentos aplicados</span>
                      <span>-${totalSavings}</span>
                    </div>
                  )}

                  <div className="h-px w-full bg-gray-200" />

                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: "#0c154c" }}>Total</span>
                    <span style={{ color: "#1d4ed8" }}>
                      ${cartData.summary.totalWithDiscounts}
                    </span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#02ffff" }}>
                    <p className="text-sm font-medium" style={{ color: "#0c154c" }}>
                      ¡Ahorras ${totalSavings}!
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 space-y-3">
                <button
                  onClick={proceedToPayment}
                  disabled={processingPayment}
                  className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 px-4 py-2 text-white"
                  style={{ backgroundColor: "#1d4ed8" }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {processingPayment ? "Procesando..." : "Proceder al Pago"}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors border border-gray-300 bg-transparent hover:bg-gray-50 h-10 px-4 py-2"
                  style={{ borderColor: "#42d7c7", color: "#1d4ed8" }}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de pago pendiente */}
        <PendingPaymentModal
          isOpen={showPendingModal}
          onClose={handleCloseModal}
          onContinue={handleCancelPendingAndContinue}
          loading={cancelingPending}
        />

        {/* Modal de error de cursos con acceso */}
        {courseAccessError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fef3c7" }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: "#d97706" }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "#0c154c" }}>
                  Cursos ya adquiridos
                </h3>
              </div>

              <p className="text-gray-600 mb-4">
                Ya tienes acceso a algunos cursos en tu carrito. No puedes comprar cursos que ya posees.
              </p>

              {/* Lista de cursos con acceso */}
              <div className="space-y-2 mb-6">
                {courseAccessError.coursesWithAccess.map((course) => (
                  <div 
                    key={course.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ backgroundColor: "#eff6ff", borderColor: "#42d7c7" }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: "#1d4ed8" }} />
                    <span className="font-medium" style={{ color: "#0c154c" }}>
                      {course.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveCoursesWithAccess}
                  className="flex-1 inline-flex items-center justify-center rounded-md font-medium transition-colors h-10 px-4 py-2 text-white"
                  style={{ backgroundColor: "#1d4ed8" }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar del carrito
                </button>
                <button
                  onClick={handleDismissCourseAccessError}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors border border-gray-300 bg-transparent hover:bg-gray-50 h-10 px-4 py-2"
                  style={{ color: "#6b7280" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
