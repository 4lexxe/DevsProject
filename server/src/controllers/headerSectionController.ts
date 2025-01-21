import { Request, Response, RequestHandler } from 'express';
import HeaderSection from '../models/HeaderSection';
import Admin from '../models/Admin';  // Relación con el admin que creó la sección

// Crear una sección de encabezado
export const createHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  const { image, title, slogan, about, buttonName, buttonLink, adminId } = req.body;

  try {
    // Verificar que el admin existe
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Admin no encontrado' });
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
};

// Obtener todas las secciones de encabezado
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

// Obtener una sección de encabezado por ID
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

// Actualizar una sección de encabezado
export const updateHeaderSection: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const { image, title, slogan, about, buttonName, buttonLink, adminId } = req.body;

  try {
    const headerSection = await HeaderSection.findByPk(id);
    if (!headerSection) {
      res.status(404).json({ message: 'Sección de encabezado no encontrada' });
      return;
    }

    // Verificar que el admin existe
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Admin no encontrado' });
      return;
    }

    // Actualizar la sección de encabezado solo si hay cambios
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
};

// Eliminar una sección de encabezado
export const deleteHeaderSection: RequestHandler = async (req, res): Promise<void> => {
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
};