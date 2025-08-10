import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle, BookOpen, Zap, Gift } from 'lucide-react';
import { addCourseToCart } from '@/course/services/cartService';
import { 
  checkIfCourseFree, 
  checkCourseAccess, 
  grantFreeCourseAccess, 
  directPurchaseCourse 
} from '@/course/services/directPurchaseService';

interface PurchaseButtonsProps {
  courseId: string;
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discount?: {
      id: number;
      event: string;
      description: string;
      value: number;
      startDate: string;
      endDate: string;
    } | null;
    discountValue: number;
    savings: number;
    isFree: boolean;
    priceDisplay: string;
  };
  className?: string;
}

const PurchaseButtons: React.FC<PurchaseButtonsProps> = ({ 
  courseId, 
  pricing,
  className = "" 
}) => {
  console.log('🎯 PurchaseButtons recibió props - courseId:', courseId, 'tipo:', typeof courseId, 'pricing:', pricing);
  const [loading, setLoading] = useState(false);
  const [directPurchaseLoading, setDirectPurchaseLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isFree, setIsFree] = useState(pricing?.isFree || false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Verificar acceso al curso al cargar el componente
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const accessResponse = await checkCourseAccess(courseId);
        setHasAccess(accessResponse.hasAccess);
        
        // Si no tiene acceso y no sabemos si es gratis, verificar
        if (!accessResponse.hasAccess && pricing?.isFree === undefined) {
          const freeResponse = await checkIfCourseFree(courseId);
          setIsFree(freeResponse.isFree);
        }
      } catch (error) {
        console.error('Error checking course access:', error);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [courseId, pricing?.isFree]);

  // Comentario: Se eliminó el auto-grant de cursos gratuitos
  // Ahora el usuario debe hacer clic en "Obtener curso GRATIS" para obtener acceso

  const handleAddToCart = async () => {
    console.log('🛒 handleAddToCart - courseId:', courseId, 'tipo:', typeof courseId);
    
    try {
      setLoading(true);
      setError(null);
      
      if (!courseId || courseId === 'undefined') {
        console.error('❌ courseId inválido en handleAddToCart:', courseId);
        setError('ID del curso no válido');
        return;
      }
      
      console.log('📞 Llamando addCourseToCart con ID:', courseId);
      await addCourseToCart(parseInt(courseId));
      console.log('✅ Curso agregado al carrito exitosamente');
      
      setAddedToCart(true);
      
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error: any) {
      console.error('❌ Error adding course to cart:', error);
      
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage?.includes('ya está en el carrito')) {
          setError('Ya está en tu carrito');
        } else if (errorMessage?.includes('Ya tienes acceso a este curso')) {
          setHasAccess(true);
          setError(null);
        } else {
          setError('Error de validación');
        }
      } else if (error.response?.status === 401) {
        setError('Inicia sesión para continuar');
      } else {
        setError('Error al agregar al carrito');
      }
      
      setTimeout(() => {
        setError(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPurchase = async () => {
    console.log('🔍 handleDirectPurchase - courseId:', courseId, 'tipo:', typeof courseId);
    
    try {
      setDirectPurchaseLoading(true);
      setError(null);
      
      if (!courseId || courseId === 'undefined') {
        console.error('❌ courseId inválido en handleDirectPurchase:', courseId);
        setError('ID del curso no válido');
        return;
      }
      
      if (isFree) {
        console.log('📞 Llamando grantFreeCourseAccess con ID:', courseId);
        await grantFreeCourseAccess(courseId);
        setHasAccess(true);
      } else {
        console.log('📞 Llamando directPurchaseCourse con ID:', courseId);
        const response = await directPurchaseCourse(courseId);
        console.log('✅ Respuesta completa de directPurchaseCourse:', response);
        console.log('🔍 initPoint recibido:', response.initPoint, 'tipo:', typeof response.initPoint);
        
        // Validar initPoint antes de redirigir
        if (!response.initPoint || response.initPoint === 'undefined' || response.initPoint.includes('undefined')) {
          console.error('❌ initPoint inválido recibido:', response.initPoint);
          setError('Error: URL de pago inválida');
          return;
        }
        
        console.log('🚀 Redirigiendo a:', response.initPoint);
        // Redirigir a MercadoPago igual que el carrito
        window.location.href = response.initPoint;
      }
    } catch (error: any) {
      console.error('❌ Error in direct purchase:', error);
      
      if (error.response?.status === 401) {
        setError('Inicia sesión para continuar');
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage?.includes('Ya tienes acceso')) {
          setHasAccess(true);
          setError(null);
        } else {
          setError('Error de validación');
        }
      } else {
        setError('Error en la compra');
      }
      
      setTimeout(() => {
        setError(null);
      }, 4000);
    } finally {
      setDirectPurchaseLoading(false);
    }
  };

  // Si está verificando acceso, mostrar loading
  if (checkingAccess) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-center py-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Verificando acceso...</span>
        </div>
      </div>
    );
  }

  // Si ya tiene acceso al curso
  if (hasAccess) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-green-500 text-white"
        >
          <BookOpen className="w-5 h-5" />
          Ya tienes acceso a este curso
        </button>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          onClick={() => setError(null)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </button>
      </div>
    );
  }

  // Si el curso es gratuito
  if (isFree) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          onClick={handleDirectPurchase}
          disabled={directPurchaseLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105"
        >
          {directPurchaseLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Agregando a tus cursos...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              Obtener curso GRATIS
            </>
          )}
        </button>
      </div>
    );
  }

  // Botones para cursos de pago
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Botón de compra directa */}
      <button
        onClick={handleDirectPurchase}
        disabled={directPurchaseLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white hover:scale-105"
      >
        {directPurchaseLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando compra...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            {pricing?.isFree ? 'Obtener Gratis' : `Comprar ahora ${pricing?.priceDisplay || '$0.00'}`}
          </>
        )}
      </button>

      {/* Botón agregar al carrito */}
      {addedToCart ? (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-500 text-white"
        >
          <Check className="w-5 h-5" />
          Agregado al carrito
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Agregando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default PurchaseButtons;