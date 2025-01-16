import { Request, Response, RequestHandler } from 'express';
import Content from '../models/Content';
import Section from '../models/Section';  // Relación con la sección

// Crear contenido
export const createContent: RequestHandler = async (req, res) => {
  const { type, content, sectionId } = req.body;

  try {
    const section = await Section.findByPk(sectionId);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    const newContent = await Content.create({
      type,
      content,
      sectionId,
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el contenido' });
  }
};

// Obtener el contenido de una sección
export const getContentBySection: RequestHandler = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const content = await Content.findAll({ where: { sectionId } });
    if (!content) {
      res.status(404).json({ message: 'No se encontró contenido' });
      return;
    }

    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el contenido' });
  }
};

// Obtener contenido por ID
export const getContentById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findByPk(id);
    if (!content) {
      res.status(404).json({ message: 'Contenido no encontrado' });
      return;
    }

    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el contenido' });
  }
};

// Actualizar contenido
export const updateContent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { type, content, sectionId } = req.body;

  try {
    const contentItem = await Content.findByPk(id);
    if (!contentItem) {
      res.status(404).json({ message: 'Contenido no encontrado' });
      return;
    }

    contentItem.type = type;
    contentItem.content = content;
    contentItem.sectionId = sectionId;

    await contentItem.save();

    res.status(200).json(contentItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el contenido' });
  }
};

// Eliminar contenido
export const deleteContent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findByPk(id);
    if (!content) {
      res.status(404).json({ message: 'Contenido no encontrado' });
      return;
    }

    await content.destroy();
    res.status(200).json({ message: 'Contenido eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el contenido' });
  }
};