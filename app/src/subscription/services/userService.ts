import api from "@/shared/api/axios";

export const userData = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editUser = async (id: string, data: any) => {
  try {
    const response = await api.put(`/users/${id}/subscription`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error editing user:", error.response?.data || error.message || error);
    throw error;
  }
};


