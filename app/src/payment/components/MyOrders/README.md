# Componentes de MyOrders

Esta carpeta contiene los componentes modularizados para la página de órdenes y pagos del usuario.

## Estructura de Componentes

###  `OrderCard.tsx`
**Propósito**: Muestra la información completa de una orden individual
- Información de la orden (ID, fechas, estado)
- Lista de cursos incluidos
- Resumen de precios y descuentos
- Alertas de expiración
- Botones de acción (pagar, cancelar)

**Props**:
```typescript
interface OrderCardProps {
  order: Order;
  onPayment: (initPoint?: string) => void;
  onCancel: (orderId: string) => void;
  cancellingOrder: string | null;
}
```

###  `PaymentCard.tsx`
**Propósito**: Muestra la información de un pago individual
- Detalles del pago (ID, monto, fecha)
- Método de pago utilizado
- Estado del pago
- Items comprados

**Props**:
```typescript
interface PaymentCardProps {
  payment: PaymentInfo;
}
```

###  `PaymentInfoModal.tsx`
**Propósito**: Modal detallado con información completa de un pago
- Información completa del pago
- Datos del comprador
- Método de pago detallado
- Estado y fechas

**Props**:
```typescript
interface PaymentInfoModalProps {
  payment: PaymentInfo | null;
  isOpen: boolean;
  onClose: () => void;
}
```

###  `TabNavigation.tsx`
**Propósito**: Navegación entre las pestañas de órdenes y pagos
- Diseño consistente con el sistema de diseño
- Estados activo e inactivo
- Iconos descriptivos

**Props**:
```typescript
interface TabNavigationProps {
  activeTab: 'orders' | 'payments';
  onTabChange: (tab: 'orders' | 'payments') => void;
}
```

###  `EmptyState.tsx`
**Propósito**: Estado vacío reutilizable para órdenes y pagos
- Diseño consistente para ambos tipos
- Call-to-action para explorar cursos
- Iconos diferenciados

**Props**:
```typescript
interface EmptyStateProps {
  type: 'orders' | 'payments';
}
```

## Características Principales

###  **Diseño Consistente**
- Todos los componentes siguen el mismo sistema de colores
- Responsive design para móviles y desktop
- Animaciones y transiciones fluidas

###  **Funcionalidad**
- **OrderCard**: Manejo completo del ciclo de vida de órdenes
- **PaymentCard**: Visualización clara de información de pagos
- **Alertas inteligentes**: Notificaciones de expiración y urgencia
- **Estados de carga**: Indicadores visuales para acciones async

###  **Reutilización**
- Componentes independientes y reutilizables
- Props bien definidas y tipadas
- Funciones utilitarias encapsuladas

###  **Responsive**
- Layout adaptable a diferentes tamaños de pantalla
- Optimización para móviles
- Comportamiento táctil mejorado

## Uso

```typescript
import { 
  OrderCard, 
  PaymentCard, 
  PaymentInfoModal, 
  TabNavigation, 
  EmptyState 
} from '../components/MyOrders';

// En tu componente principal
<TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

{activeTab === 'orders' ? (
  orders.length === 0 ? (
    <EmptyState type="orders" />
  ) : (
    orders.map(order => (
      <OrderCard 
        key={order.id}
        order={order}
        onPayment={handlePayment}
        onCancel={handleCancelOrder}
        cancellingOrder={cancellingOrder}
      />
    ))
  )
) : (
  // Similar para payments...
)}
```

## Beneficios de la Modularización

1. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Los componentes pueden usarse en otras partes de la aplicación
3. **Testing**: Más fácil escribir tests unitarios para cada componente
4. **Desarrollo en equipo**: Diferentes desarrolladores pueden trabajar en componentes distintos
5. **Performance**: Lazy loading y memoización más sencilla
