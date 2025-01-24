import { RequestHandler } from 'express';
import Course from './Course';
import Admin from '../admin/Admin'; // Relación con el admin
import Section from '../section/Section'; // Importar el modelo Section

// Crear un curso
export const createCourse: RequestHandler = async (req, res): Promise<void> => {
  const { title, image, summary, category, about, relatedCareerType, adminId, learningOutcomes, isActive, isInDevelopment } = req.body;

  if (!adminId || typeof adminId !== 'number') {
    res.status(400).json({ error: "El 'adminId' debe ser un número válido" });
    return;
  }

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
      category,
      about,
      relatedCareerType,
      adminId,
      learningOutcomes: learningOutcomes || [],  // Definir valor por defecto
      isActive: isActive !== undefined ? isActive : true,  // Valor por defecto: true
      isInDevelopment: isInDevelopment !== undefined ? isInDevelopment : false,  // Valor por defecto: false
    });

    const courseWithAdmin = await Course.findByPk(course.id, {
      include: { model: Admin, as: 'admin' },
    });

    res.status(201).json(courseWithAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el curso' });
  }
};

// Obtener todos los cursos
export const getCourses: RequestHandler = async (_, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Admin,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    });

    // Añadir el conteo de secciones para cada curso
    const coursesWithSectionCount = await Promise.all(courses.map(async (course) => {
      // Contar las secciones asociadas al curso
      const sectionCount = await Section.count({ where: { courseId: course.getDataValue('id') } });
      return {
        ...course.toJSON(),  // Convertimos el objeto del curso a JSON para agregar propiedades
        sectionCount,         // Añadimos el número de secciones
      };
    }));

    res.status(200).json(coursesWithSectionCount);
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    res.status(500).json({ message: 'Error obteniendo los cursos' });
  }
};

// Obtener un curso por ID
export const getCourseById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "El 'id' debe ser un número válido" });
    return;
  }

  try {
    const course = await Course.findByPk(id, {
      include: {
        model: Admin,
        as: 'admin',
        attributes: ['id', 'name'], // Eliminar 'email' de aquí
      },
    });

    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error al obtener el curso por ID:", error);
    res.status(500).json({ message: 'Error obteniendo el curso' });
  }
};

// Actualizar un curso
export const updateCourse: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "El 'id' debe ser un número válido" });
    return;
  }

  try {
    // Primero verifica si el curso existe
    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    // Si se proporciona adminId, verifica que el admin exista
    if (updateData.adminId) {
      const admin = await Admin.findByPk(updateData.adminId);
      if (!admin) {
        res.status(404).json({ message: 'Administrador no encontrado' });
        return;
      }
    }

    // Actualiza el curso usando el método update
    await Course.update(updateData, {
      where: { id },
      returning: true
    });

    // Obtén el curso actualizado con la información del admin
    const updatedCourse = await Course.findByPk(id, {
      include: [{ 
        model: Admin, 
        as: 'admin',
        attributes: ['id', 'name']
      }]
    });

    if (!updatedCourse) {
      res.status(404).json({ message: 'No se pudo obtener el curso actualizado' });
      return;
    }

    // Obtén el conteo de secciones
    const sectionCount = await Section.count({ 
      where: { courseId: id }
    });

    // Combina el curso actualizado con el conteo de secciones
    const responseData = {
      ...updatedCourse.toJSON(),
      sectionCount
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error actualizando el curso:', error);
    res.status(500).json({ 
      message: 'Error actualizando el curso',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un curso
export const deleteCourse: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "El 'id' debe ser un número válido" });
    return;
  }

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