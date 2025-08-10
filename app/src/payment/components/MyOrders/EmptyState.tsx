import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard } from 'lucide-react';

interface EmptyStateProps {
  type: 'orders' | 'payments';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const isOrders = type === 'orders';
  
  return (
    <div className="text-center py-16">
      <div className="mb-4">
        {isOrders ? (
          <FileText className="h-16 w-16 mx-auto text-gray-400" />
        ) : (
          <CreditCard className="h-16 w-16 mx-auto text-gray-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#0c154c" }}>
        {isOrders ? "No tienes órdenes aún" : "No tienes pagos registrados"}
      </h2>
      <p className="text-gray-600">
        Cuando realices tu primera compra, aparecerá aquí
      </p>
      <Link
        to="/courses"
        className="inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors mt-4"
        style={{ backgroundColor: "#1d4ed8" }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
      >
        Explorar Cursos
      </Link>
    </div>
  );
};

export default EmptyState;
