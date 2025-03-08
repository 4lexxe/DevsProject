// src/services/forumThreadService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para un hilo del foro
export interface ForumThread {
  id: number;
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  // Puedes agregar más campos según sea necesario
}

// Servicio para manejar las operaciones relacionadas con los hilos del foro
const ForumThreadService = {
  // Obtener todos los hilos
  async getAllThreads(): Promise<ForumThread[]> {
    try {
      const response = await api.get('/forum/threads');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los hilos:', error);
      throw new Error('Error al obtener los hilos.');
    }
  },

  // Obtener un hilo por ID
  async getThreadById(id: number): Promise<ForumThread> {
    try {
      const response = await api.get(`/forum/threads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el hilo con id ${id}:`, error);
      throw new Error('Error al obtener el hilo.');
    }
  },

  // Crear un nuevo hilo
  async createThread(threadData: Omit<ForumThread, 'id'>): Promise<ForumThread> {
    try {
      const response = await api.post('/forum/threads', threadData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el hilo:', error);
      throw new Error('Error al crear el hilo.');
    }
  },

  // Actualizar un hilo existente
  async updateThread(id: number, threadData: Partial<ForumThread>): Promise<ForumThread> {
    try {
      const response = await api.put(`/forum/threads/${id}`, threadData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el hilo con id ${id}:`, error);
      throw new Error('Error al actualizar el hilo.');
    }
  },

  // Eliminar un hilo
  async deleteThread(id: number): Promise<void> {
    try {
      await api.delete(`/forum/threads/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el hilo con id ${id}:`, error);
      throw new Error('Error al eliminar el hilo.');
    }
  },
};

export default ForumThreadService;