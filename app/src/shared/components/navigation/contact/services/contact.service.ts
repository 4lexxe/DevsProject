// src/api/services/ContactMessageService.ts
import api from '@/api/axios'; // Asegúrate de tener configurada la instancia de axios

// Interfaces para definir los tipos de datos de un mensaje de contacto
export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateContactMessageDTO {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  
  export interface UpdateContactMessageDTO {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }
  
  export const ContactMessageService = {
    // Crear un nuevo mensaje de contacto
    async create(contactData: CreateContactMessageDTO): Promise<ContactMessage> {
      try {
        const response = await api.post<ContactMessage>('/contactMessages', contactData);
        return response.data;
      } catch (error) {
        console.error('Error al crear el mensaje de contacto:', error);
        throw error;
      }
    },
  
    // Obtener todos los mensajes de contacto
    async getAll(): Promise<ContactMessage[]> {
      try {
        const response = await api.get<ContactMessage[]>('/contactMessages');
        return response.data;
      } catch (error) {
        console.error('Error al obtener los mensajes de contacto:', error);
        throw error;
      }
    },
  
    // Obtener un mensaje de contacto por ID
    async getById(id: number): Promise<ContactMessage> {
      try {
        const response = await api.get<ContactMessage>(`/contactMessages/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener el mensaje de contacto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Actualizar un mensaje de contacto
    async update(id: number, data: UpdateContactMessageDTO): Promise<ContactMessage> {
      try {
        const response = await api.put<ContactMessage>(`/contactMessages/${id}`, data);
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar el mensaje de contacto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un mensaje de contacto
    async delete(id: number): Promise<void> {
      try {
        await api.delete(`/contactMessages/${id}`);
      } catch (error) {
        console.error(`Error al eliminar el mensaje de contacto con ID ${id}:`, error);
        throw error;
      }
    },
  };