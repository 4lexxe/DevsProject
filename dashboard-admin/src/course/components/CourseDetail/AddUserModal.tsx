import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';
import { grantCourseAccess } from '../../services/courseAccessService';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [userId, setUserId] = useState('');
  const [accessType, setAccessType] = useState<'permanent' | 'temporary'>('permanent');
  const [expirationDate, setExpirationDate] = useState('');
  const [expirationDays, setExpirationDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || isNaN(Number(userId))) {
      toast.error('Por favor ingresa un ID de usuario válido');
      return;
    }

    if (accessType === 'temporary' && !expirationDate && !expirationDays) {
      toast.error('Por favor selecciona una fecha de expiración o días de duración');
      return;
    }

    try {
      setLoading(true);
      
      let expiresAt: string | undefined;
      if (accessType === 'temporary') {
        if (expirationDate) {
          expiresAt = new Date(expirationDate).toISOString();
        } else if (expirationDays) {
          const date = new Date();
          date.setDate(date.getDate() + expirationDays);
          expiresAt = date.toISOString();
        }
      }

      await grantCourseAccess({
        userId: Number(userId),
        courseId,
        expiresAt
      });

      toast.success(
        accessType === 'permanent' 
          ? 'Acceso permanente otorgado exitosamente'
          : `Acceso otorgado hasta ${expiresAt ? new Date(expiresAt).toLocaleDateString('es-ES') : ''}`
      );

      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['course-complete-info', courseId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-courses'] });

      // Reset form
      setUserId('');
      setAccessType('permanent');
      setExpirationDate('');
      setExpirationDays(30);
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al otorgar acceso';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUserId('');
      setAccessType('permanent');
      setExpirationDate('');
      setExpirationDays(30);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <FontelloIcon
                      name="icon-user-plus"
                      className="text-lg text-gray-700 dark:text-gray-300"
                      fallback={
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Agregar Usuario al Curso
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {courseTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                  <FontelloIcon name="icon-cancel" className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    ID del Usuario
                  </label>
                  <input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Ingresa el ID del usuario"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    disabled={loading}
                  />
                </div>

                {/* Access Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tipo de Acceso
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAccessType('permanent')}
                      disabled={loading}
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                        accessType === 'permanent'
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Permanente
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccessType('temporary')}
                      disabled={loading}
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                        accessType === 'temporary'
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      Temporal
                    </button>
                  </div>
                </div>

                {/* Expiration Options */}
                {accessType === 'temporary' && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Duración (días)
                      </label>
                      <input
                        type="number"
                        value={expirationDays}
                        onChange={(e) => setExpirationDays(Number(e.target.value))}
                        min="1"
                        placeholder="30"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                        disabled={loading}
                      />
                    </div>
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                      o
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Fecha de Expiración
                      </label>
                      <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Otorgando...' : 'Otorgar Acceso'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;
