import { Request, Response, RequestHandler } from 'express';
import Section from '../models/Section';
import Course from '../models/Course';  // Relación con el curso

// Crear una sección
export const createSection: RequestHandler = async (req, res) => {
  const { title, description, courseId } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    const section = await Section.create({
      title,
      description,
      courseId,
    });

    res.status(201).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando la sección' });
  }
};

// Obtener todas las secciones de un curso
export const getSectionsByCourse: RequestHandler = async (req, res) => {
  const { courseId } = req.params;

  try {
    const sections = await Section.findAll({ where: { courseId } });
    if (!sections) {
      res.status(404).json({ message: 'No se encontraron secciones' });
      return;
    }

    res.status(200).json(sections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo las secciones' });
  }
};

// Obtener una sección por ID
export const getSectionById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const section = await Section.findByPk(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    res.status(200).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo la sección' });
  }
};

// Actualizar una sección
export const updateSection: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, courseId } = req.body;

  try {
    const section = await Section.findByPk(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    section.title = title;
    section.description = description;
    section.courseId = courseId;

    await section.save();
    
    res.status(200).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando la sección' });
  }
};

// Eliminar una sección
export const deleteSection: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const section = await Section.findByPk(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    await section.destroy();
    res.status(200).json({ message: 'Sección eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando la sección' });
  }
};