import axiosInstance from '@/shared/api/axios';
/**
 * Agrega un curso al carrito del usuario
 */
export const addCourseToCart = async (courseId) => {
    try {
        await axiosInstance.post('/cart/courses', { courseId });
    }
    catch (error) {
        console.error('Error adding course to cart:', error);
        throw error;
    }
};
/**
 * Verifica si un curso ya está en el carrito
 */
export const isCourseInCart = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/cart/courses/${courseId}/check`);
        return response.data.data.inCart;
    }
    catch (error) {
        console.error('Error checking if course is in cart:', error);
        return false;
    }
};
/**
 * Obtiene el número de cursos en el carrito
 */
export const getCartCount = async () => {
    try {
        const response = await axiosInstance.get('/cart/count');
        return response.data.data.count;
    }
    catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
};
