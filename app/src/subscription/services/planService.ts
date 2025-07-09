import api from "@/shared/api/axios";

export const getActivePlans = async () => {
  try {
    const response = await api.get('/plans/active');
    return response.data;
  } catch (error) {
    console.error("Error fetching active plans:", error);
    throw error;
  }
};

