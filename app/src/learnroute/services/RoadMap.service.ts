import { Node, Edge } from '@xyflow/react';
import api from '../../shared/api/axios';
import { AxiosResponse } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

export interface Roadmap {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  structure: {
    nodes: Node[];
    edges: Edge[];
  };
  userId: number;
  User?: User;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRoadmapDTO {
  title: string;
  description?: string;
  isPublic: boolean;
  structure: {
    nodes: Node[];
    edges: Edge[];
  };
}

const defaultStructure = {
  nodes: [],
  edges: []
};

export const RoadmapService = {
  async getAll(): Promise<Roadmap[]> {
    const response: AxiosResponse<Roadmap[]> = await api.get('/roadmaps');
    return response.data.map(roadmap => ({
      ...roadmap,
      structure: roadmap.structure || defaultStructure
    }));
  },
  
  async getById(id: number): Promise<Roadmap> {
    const response: AxiosResponse<Roadmap> = await api.get(`/roadmaps/${id}`);
    return response.data;
  },

  async create(roadmap: CreateRoadmapDTO): Promise<Roadmap> {
    const response: AxiosResponse<Roadmap> = await api.post('/roadmaps', roadmap);
    return response.data;
  },

  async update(id: number, roadmap: Partial<CreateRoadmapDTO>): Promise<Roadmap> {
    const response: AxiosResponse<Roadmap> = await api.put(`/roadmaps/${id}`, roadmap);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/roadmaps/${id}`);
  }
};