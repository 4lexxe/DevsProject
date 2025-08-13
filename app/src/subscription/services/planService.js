import api from "@/shared/api/axios";
export const getActivePlans = async () => {
    try {
        const response = await api.get('/plans/active');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching active plans:", error);
        throw error;
    }
};
export const getPlanById = async (id) => {
    try {
        const response = await api.get(`/plans/${id}/subscription`);
        return response.data.data;
    }
    catch (error) {
        console.error("Error fetching plan by ID:", error);
        throw error;
    }
};
