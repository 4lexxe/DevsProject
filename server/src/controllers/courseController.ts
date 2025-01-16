import { Request, Response, RequestHandler } from 'express';
import Course from '../models/Course';
import Admin from '../models/Admin';  // Relación con el admin

// Crear un curso
export const createCourse: RequestHandler = async (req, res) => {
  const { title, image, summary, adminId } = req.body;

  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Administrador no encontrado' });
      return;
    }

    const course = await Course.create({
      title,
      image,
      summary,
      adminId,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el curso' });
  }
};

// Obtener todos los cursos
export const getCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo los cursos' });
  }
};

// Obtener un curso por ID
export const getCourseById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el curso' });
  }
};

// Actualizar un curso
export const updateCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, image, summary, adminId } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    course.title = title;
    course.image = image;
    course.summary = summary;
    course.adminId = adminId;

    await course.save();
    
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el curso' });
  }
};

// Eliminar un curso
export const deleteCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    await course.destroy();
    res.status(200).json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el curso' });
  }
};