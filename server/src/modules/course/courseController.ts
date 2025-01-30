import Course from './Course';
import Admin from '../admin/Admin';
import Section from '../section/Section';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { RequestHandler, Request, Response } from 'express';
import { Model } from 'sequelize';

// Crear un curso (requiere autenticación)
export const createCourse: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
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
        learningOutcomes: learningOutcomes || [],
        isActive: isActive !== undefined ? isActive : true,
        isInDevelopment: isInDevelopment !== undefined ? isInDevelopment : false,
      });

      const courseWithAdmin = await Course.findByPk(course.id, {
        include: { model: Admin, as: 'admin' },
      });

      res.status(201).json(courseWithAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creando el curso' });
    }
  }
];

// Obtener todos los cursos (SIN autenticación)
export const getCourses: RequestHandler[] = [
  async (_, res) => {
    try {
      const courses = await Course.findAll({
        include: {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name'],
        },
      });

      const coursesWithSectionCount = await Promise.all(
        courses.map(async (course) => {
          const sectionCount = await Section.count({ 
            where: { courseId: course.getDataValue('id') } 
          });
          return {
            ...course.toJSON(),
            sectionCount,
          };
        })
      );

      res.status(200).json(coursesWithSectionCount);
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
      res.status(500).json({ message: 'Error obteniendo los cursos' });
    }
  }
];

// Interfaces
interface CourseAttributes {
  id?: number;
  title: string;
  image: string;
  summary: string;
  category: string;
  about: string;
  relatedCareerType: string;
  adminId: number;
  learningOutcomes?: string[];
  isActive?: boolean;
  isInDevelopment?: boolean;
}

interface AdminAttributes {
  id: number;
  name: string;
}

interface SectionAttributes {
  id: number;
  courseId: number;
}

interface CourseInstance extends Model<CourseAttributes>, CourseAttributes {}
interface AdminInstance extends Model<AdminAttributes>, AdminAttributes {}
interface SectionInstance extends Model<SectionAttributes>, SectionAttributes {}

// Obtener un curso por ID (SIN autenticación)
export const getCourseById: RequestHandler[] = [
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ error: "El 'id' debe ser un número válido" });
      return;
    }

    try {
      const course: CourseInstance | null = await Course.findByPk(id, {
        include: {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name'],
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
  }
];

// Actualizar un curso (requiere autenticación)
export const updateCourse: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

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

      if (updateData.adminId) {
        const admin = await Admin.findByPk(updateData.adminId);
        if (!admin) {
          res.status(404).json({ message: 'Administrador no encontrado' });
          return;
        }
      }

      await Course.update(updateData, {
        where: { id },
        returning: true
      });

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

      const sectionCount = await Section.count({ 
        where: { courseId: id }
      });

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
  }
];

// Eliminar un curso (requiere autenticación)
export const deleteCourse: RequestHandler[] = [
  authMiddleware,
  async (req, res): Promise<void> => {
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
  }
];