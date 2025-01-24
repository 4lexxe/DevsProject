import { Request, Response, RequestHandler } from 'express';
import Section from '../section/Section';  // Modelo de sección
import Course from '../course/Course';  // Relación con el curso

// Crear una sección
export const createSection: RequestHandler = async (req, res) => {
  const { title, description, courseId, moduleType, coverImage } = req.body;

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
      moduleType,  // Nuevo atributo: tipo de módulo
      coverImage,  // Nuevo atributo: portada de la sección
    });

    res.status(201).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando la sección' });
  }
};

// Obtener todas las secciones de un curso, junto con el número de módulos
export const getSectionsByCourse: RequestHandler = async (req, res) => {
  const { courseId } = req.params;

  try { 
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    // Contamos las secciones (módulos) para el curso
    const sectionCount = await Section.count({ where: { courseId } });

    // Obtenemos las secciones del curso
    const sections = await Section.findAll({ where: { courseId } });

    if (sections.length === 0) {
      res.status(404).json({ message: 'No se encontraron secciones' });
      return;
    }

    // Respondemos con las secciones y el número total de secciones
    res.status(200).json({ sectionCount, sections });
  } catch (error) {
    console.error("Error al obtener las secciones:", error);
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
  const { title, description, courseId, moduleType, coverImage } = req.body;

  try {
    const section = await Section.findByPk(id);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    section.title = title;
    section.description = description;
    section.courseId = courseId;
    section.moduleType = moduleType;  // Nuevo atributo: tipo de módulo
    section.coverImage = coverImage;  // Nuevo atributo: portada de la sección

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