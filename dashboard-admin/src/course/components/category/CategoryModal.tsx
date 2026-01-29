import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryForm from './CategoryForm';
import { type Category, type CategoryCreateRequest } from '../../services/categoryService';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Category | null;
  onSubmit: (categoryData: CategoryCreateRequest) => void;
  isEditing: boolean;
  loading: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isEditing,
  loading
}) => {
  const handleSubmit = (categoryData: CategoryCreateRequest) => {
    onSubmit(categoryData);
  };

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
                <CategoryForm
                  initialData={initialData}
                  onSubmit={handleSubmit}
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

export default CategoryModal;
