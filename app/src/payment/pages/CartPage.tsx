"use client"

import { Link, useNavigate } from "react-router-dom"
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Tag, AlertTriangle, X, BookOpen, Loader2, Heart, Star, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { cartService } from "../services"
import { cancelPendingOrder } from "@/course/services/directPurchaseService"
import type { CartSummary } from "../services/cartService"
import PendingOrderModal from "@/course/components/CourseDetail/PendingOrderModal"

export default function CartPage() {
  const navigate = useNavigate()
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
  const [pendingOrderData, setPendingOrderData] = useState<{
    orderId: string;
    orderType: string;
    expirationDate?: string;
    courseName?: string;
  } | null>(null)
  const [showPendingOrderModal, setShowPendingOrderModal] = useState(false)

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
      setPendingOrderData(null) // Limpiar errores previos
      setShowPendingOrderModal(false) // Cerrar modal previo
      const preference = await cartService.createPaymentPreference()
      // Redirigir a MercadoPago
      window.location.href = preference.initPoint
    } catch (error: any) {
      console.error('Error creating payment preference:', error)
      
      // Verificar si es error de carrito pendiente
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message;
        const errorData = error.response?.data?.errors; // Usar errors en lugar de data
        
        console.log('🔍 Cart Error 422 - errorMessage:', errorMessage);
        console.log('🔍 Cart Error 422 - errorData (errors):', errorData);
        
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
        
        // Verificar si es error de órdenes pendientes usando errorType
        if (errorData?.errorType === 'PENDING_ORDER') {
          console.log('🔍 Detectado error de orden pendiente en carrito');
          
          // Tomar la primera orden pendiente
          const firstOrder = errorData.orderDetails?.[0];
          const firstCourse = errorData.coursesWithPendingOrders?.[0];
          
          if (firstOrder && firstCourse) {
            setPendingOrderData({
              orderId: firstOrder.orderId,
              orderType: firstOrder.type,
              expirationDate: firstOrder.expirationDate,
              courseName: firstCourse.title
            });
            setShowPendingOrderModal(true);
          }
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

  const handleRemoveCoursesWithPendingOrders = async () => {
    if (!pendingOrderData) return;

    try {
      // Eliminar cada curso del carrito que tiene órdenes pendientes
      // Para este caso, necesitamos el courseId que deberíamos almacenar en pendingOrderData
      // Por ahora, removemos todos los cursos del carrito
      await cartService.clearCart();
      
      // Recargar el carrito
      await loadCart();
      
      // Limpiar el modal
      setPendingOrderData(null);
      setShowPendingOrderModal(false);
      
    } catch (error) {
      console.error('Error eliminando cursos con órdenes pendientes del carrito:', error);
    }
  };

  const handleCancelPendingOrder = async () => {
    if (!pendingOrderData) return;

    try {
      // Cancelar la orden pendiente
      if (pendingOrderData.orderType === 'cart') {
        await cartService.cancelPendingCart();
      } else {
        await cancelPendingOrder(pendingOrderData.orderId);
      }
      
      // Limpiar el modal
      setPendingOrderData(null);
      setShowPendingOrderModal(false);

      // Reintentar la compra automáticamente
      proceedToPayment();
    } catch (error) {
      console.error('Error cancelando orden pendiente:', error);
      setPendingOrderData(null);
      setShowPendingOrderModal(false);
    }
  };

  const handleViewPendingOrders = () => {
    // Cerrar modal
    setPendingOrderData(null);
    setShowPendingOrderModal(false);
    
    // Navegar a la página de órdenes
    navigate('/user/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <ShoppingBag className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cargando tu carrito</h3>
              <p className="text-gray-600">Preparando tus cursos seleccionados...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cartData || cartData.courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <Link to="/cursos">
              <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 bg-white h-12 px-6 py-2 mb-8 shadow-sm border-2 text-gray-800 hover:shadow-md" style={{borderColor: "rgb(66, 215, 199)"}}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Explorar Cursos
              </button>
            </Link>

            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              ¡Descubre cursos increíbles y comienza tu viaje de aprendizaje hoy mismo!
            </p>

            <div className="space-y-4">
              <Link to="/cursos">
                <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-8 py-2 bg-white border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-gray-800" style={{borderColor: "rgb(66, 215, 199)"}}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Ver Todos los Cursos
                </button>
              </Link>
              
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center bg-white border-2 rounded-lg px-4 py-2 text-sm text-gray-600" style={{borderColor: "rgb(66, 215, 199)"}}>
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Acceso de por vida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Ahora sabemos que cartData no es null
  const totalSavings = cartData.summary.totalSavings

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/cursos">
            <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 bg-white hover:bg-blue-50 h-10 sm:h-12 px-4 sm:px-6 py-2 mb-4 sm:mb-6 shadow-sm border border-blue-200 text-blue-600 hover:text-blue-700 hover:shadow-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Continuar comprando</span>
              <span className="sm:hidden">Volver</span>
            </button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Mi Carrito
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingBag className="w-4 h-4" />
                <p className="text-sm sm:text-base">
                  {cartData.summary.courseCount} {cartData.summary.courseCount === 1 ? "curso" : "cursos"} seleccionado{cartData.summary.courseCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            
            {totalSavings > 0 && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg px-4 py-2 text-center">
                <p className="text-sm font-medium text-green-800">¡Estás ahorrando!</p>
                <p className="text-lg font-bold text-green-600">${totalSavings}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cartData.courses.map((item) => {
              const hasActiveDiscount = item.course.discountApplied !== null

              return (
                <div
                  key={item.cartCourseId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex gap-3">
                      {/* Course Image - Smaller for mobile */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-12 sm:w-24 sm:h-14 rounded-lg overflow-hidden">
                          {item.course.image ? (
                            <img
                              src={item.course.image}
                              alt={item.course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-600 to-cyan-600">
                              {item.course.title.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        {hasActiveDiscount && (
                          <div className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-xs font-bold" style={{backgroundColor: "rgb(66, 215, 199)", color: "#0c154c"}}>
                            {item.course.discountApplied?.percentage}
                          </div>
                        )}
                      </div>

                      {/* Course Details - Simplified */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800 truncate">
                          {item.course.title}
                        </h3>
                        
                        {/* Category badge - smaller */}
                        <div className="mb-2">
                          <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            {item.course.title || "Curso"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Price - Simplified */}
                          <div className="flex items-center gap-2">
                            {hasActiveDiscount ? (
                              <>
                                <span className="text-xs line-through text-gray-400">
                                  ${item.course.originalPrice}
                                </span>
                                <span className="text-lg font-bold text-gray-800">
                                  ${item.course.finalPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-800">
                                ${item.course.finalPrice}
                              </span>
                            )}
                          </div>

                          {/* Remove Button - Smaller */}
                          <button
                            onClick={() => removeFromCart(item.course.id)}
                            disabled={removing === item.course.id}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          >
                            {removing === item.course.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
            <div className="bg-white rounded-xl shadow-lg sticky top-6 border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 bg-white border-b-2" style={{borderColor: "rgb(66, 215, 199)", color: "#0c154c"}}>
                <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Resumen del Pedido
                </h3>
                <p className="text-sm mt-1" style={{color: "#0c154c", opacity: 0.8}}>
                  {cartData.summary.courseCount} {cartData.summary.courseCount === 1 ? "artículo" : "artículos"}
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Course List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartData.courses.map((item) => (
                    <div
                      key={item.cartCourseId}
                      className="flex justify-between items-start text-sm p-2 sm:p-3 rounded-lg border transition-all duration-300 bg-white"
                      style={{borderColor: "rgb(66, 215, 199)"}}
                    >
                      <div className="flex-1 min-w-0 mr-3">
                         <div className="font-semibold truncate mb-1 text-gray-800">
                           {item.course.title}
                         </div>
                         {item.course.discountApplied && (
                           <div className="text-xs text-green-600 font-medium">
                             {item.course.discountApplied.percentage}% descuento
                           </div>
                         )}
                       </div>
                       <div className="text-right">
                         {item.course.discountApplied ? (
                           <>
                             <div className="text-xs line-through text-gray-400">
                               ${item.course.originalPrice}
                             </div>
                             <div className="font-bold text-gray-800">
                               ${item.course.finalPrice}
                             </div>
                           </>
                         ) : (
                           <div className="font-bold text-gray-800">
                             ${item.course.finalPrice}
                           </div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({cartData.summary.courseCount} cursos)</span>
                      <span className="font-medium">${cartData.summary.totalOriginal}</span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">Valor descontado</span>
                        <span className="text-green-600 font-bold">-${totalSavings}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-2xl text-blue-600">
                          ${cartData.summary.totalWithDiscounts}
                        </span>
                      </div>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="mt-4 text-center p-3 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-bold text-green-800">
                          ¡Estás ahorrando ${totalSavings}!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0 space-y-3 bg-gray-50">
                <button
                  onClick={proceedToPayment}
                  disabled={processingPayment}
                  className="w-full inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-4 py-2 bg-white border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{borderColor: "rgb(66, 215, 199)", color: "#0c154c"}}
                >
                  {processingPayment ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2" />
                  )}
                  {processingPayment ? "Procesando..." : "Proceder al Pago"}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 h-10 px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Modal de error de cursos con acceso */}
        {courseAccessError && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 transform transition-all duration-300 scale-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Cursos ya adquiridos
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Ya tienes acceso a algunos cursos en tu carrito. No puedes comprar cursos que ya posees.
                  </p>
                </div>
              </div>

              {/* Lista de cursos con acceso */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {courseAccessError.coursesWithAccess.map((course) => (
                  <div 
                    key={course.id}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800 flex-1">
                      {course.title}
                    </span>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Adquirido
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRemoveCoursesWithAccess}
                  className="flex-1 inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 h-12 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar del carrito
                </button>
                <button
                  onClick={handleDismissCourseAccessError}
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 h-12 px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Cerrar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de orden pendiente usando componente reutilizable */}
        {pendingOrderData && (
          <PendingOrderModal 
            isOpen={showPendingOrderModal}
            onClose={() => setShowPendingOrderModal(false)}
            orderData={pendingOrderData}
            errorMessage="Tienes una orden pendiente de pago para este curso. Puedes completar el pago o cancelar la orden."
            onOrderCancelled={() => {
              setPendingOrderData(null);
              setShowPendingOrderModal(false);
              proceedToPayment(); // Reintentar automáticamente
            }}
          />
        )}
      </div>
    </div>
  )
}
