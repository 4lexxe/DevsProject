import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CareerTypeForm from './CareerTypeForm';
import { type CareerType, type CareerTypeCreateRequest } from '../../services/careerTypeService';

interface CareerTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CareerType | null;
  onSubmit: (careerTypeData: CareerTypeCreateRequest) => void;
  isEditing: boolean;
  loading: boolean;
}

const CareerTypeModal: React.FC<CareerTypeModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isEditing,
  loading
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <CareerTypeForm
                  initialData={initialData}
                  onSubmit={onSubmit}
                  onCancel={onClose}
                  isEditing={isEditing}
                  loading={loading}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CareerTypeModal;
