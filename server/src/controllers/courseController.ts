import { Request, Response, RequestHandler } from 'express';
import Course from '../models/Course';
import Admin from '../models/Admin';  // Relación con el admin

// Crear un curso
export const createCourse: RequestHandler = async (req, res): Promise<void> => {
  const { title, image, summary, category, about, relatedCareerType, adminId } = req.body;

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
export const getCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Admin,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error al obtener los cursos:", error); // Log detallado
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
        attributes: ['id', 'name', 'email'], // Selecciona sólo campos necesarios
      },
    });

    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error al obtener el curso por ID:", error); // Log detallado
    res.status(500).json({ message: 'Error obteniendo el curso' });
  }
};

// Actualizar un curso
export const updateCourse: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const { title, image, summary, category, about, relatedCareerType, adminId } = req.body;

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

    course.title = title || course.title;
    course.image = image || course.image;
    course.summary = summary || course.summary;
    course.category = category || course.category;
    course.about = about || course.about;
    course.relatedCareerType = relatedCareerType || course.relatedCareerType;
    course.adminId = adminId || course.adminId;

    await course.save();

    const updatedCourse = await Course.findByPk(course.id, {
      include: { model: Admin, as: 'admin' },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el curso' });
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