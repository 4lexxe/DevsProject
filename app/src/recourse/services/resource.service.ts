import api from '../../api/axios';
import { Resource, CreateResourceDTO, UpdateResourceDTO } from '../types/resource';

export const resourceService = {
  getAllResources: async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>('/resources');
    return response.data;
  },

  getResourceById: async (id: number): Promise<Resource> => {
    const response = await api.get<Resource>(`/resources/${id}`);
    return response.data;
  },

  createResource: async (resource: CreateResourceDTO): Promise<Resource> => {
    const response = await api.post<Resource>('/resources', resource);
    return response.data;
  },

  updateResource: async (id: number, resource: UpdateResourceDTO): Promise<Resource> => {
    const response = await api.put<Resource>(`/resources/${id}`, resource);
    return response.data;
  },

  deleteResource: async (id: number): Promise<void> => {
    await api.delete(`/resources/${id}`);
  },
};