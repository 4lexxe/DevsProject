import Course from "./Course";
import User from "../user/User";

export const getAllCourses = async () => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'username', 'displayName', 'avatar']
        }
      ]
    });
    return courses;
  } catch (error) {
    throw new Error(`Error al obtener los cursos: ${error}`);
  }
};

export const getCourseById = async (id: number) => {
  try {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'username', 'displayName', 'avatar']
        }
      ]
    });
    return course;
  } catch (error) {
    throw new Error(`Error al obtener el curso: ${error}`);
  }
};

export const getCoursesByCategory = async (categoryId: number) => {
  try {
    const courses = await Course.findAll({
      where: { categoryId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'username', 'displayName', 'avatar']
        }
      ]
    });
    return courses;
  } catch (error) {
    throw new Error(`Error al obtener los cursos por categoría: ${error}`);
  }
};