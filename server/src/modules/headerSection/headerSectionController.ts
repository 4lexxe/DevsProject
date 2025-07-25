import { Request, Response, RequestHandler } from 'express';
import HeaderSection from './HeaderSection';
import Admin from '../admin/Admin';  // Relación con el admin que creó la sección
import { authMiddleware } from '../../shared/middleware/authMiddleware';

// Crear una sección de encabezado (requiere autenticación)
export const createHeaderSection: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
    const { image, title, slogan, about, buttonName, buttonLink } = req.body;

    try {
      // Obtener adminId del usuario autenticado
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      // Crear la nueva sección
      const headerSection = await HeaderSection.create({
        image,
        title,
        slogan,
        about,
        buttonName,
        buttonLink,
        adminId,
      });

      res.status(201).json(headerSection);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creando la sección de encabezado' });
    }
  }
];

// Obtener todas las secciones de encabezado (SIN autenticación)
export const getHeaderSections: RequestHandler = async (req, res): Promise<void> => {
  try {
    const headerSections = await HeaderSection.findAll();
    if (!headerSections.length) {
      res.status(404).json({ message: 'No se encontraron secciones de encabezado' });
      return;
    }
    res.status(200).json(headerSections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo las secciones de encabezado' });
  }
};

// Obtener una sección de encabezado por ID (SIN autenticación)
export const getHeaderSectionById: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const headerSection = await HeaderSection.findByPk(id);
    if (!headerSection) {
      res.status(404).json({ message: 'Sección de encabezado no encontrada' });
      return;
    }
    res.status(200).json(headerSection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo la sección de encabezado' });
  }
};

// Actualizar una sección de encabezado (requiere autenticación)
export const updateHeaderSection: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
    const { id } = req.params;
    const { image, title, slogan, about, buttonName, buttonLink } = req.body;

    try {
      const headerSection = await HeaderSection.findByPk(id);
      if (!headerSection) {
        res.status(404).json({ message: 'Sección de encabezado no encontrada' });
        return;
      }

      // Obtener adminId del usuario autenticado
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      // Actualizar la sección de encabezado
      const updatedSection = await headerSection.update({
        image,
        title,
        slogan,
        about,
        buttonName,
        buttonLink,
        adminId
      });

      // Si se actualiza correctamente, devolver la sección actualizada
      res.status(200).json(updatedSection);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error actualizando la sección de encabezado' });
    }
  }
];

// Eliminar una sección de encabezado (requiere autenticación)
export const deleteHeaderSection: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
    const { id } = req.params;

    try {
      const headerSection = await HeaderSection.findByPk(id);
      if (!headerSection) {
        res.status(404).json({ message: 'Sección de encabezado no encontrada' });
        return;
      }

      await headerSection.destroy();
      res.status(200).json({ message: 'Sección de encabezado eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error eliminando la sección de encabezado' });
    }
  }
];