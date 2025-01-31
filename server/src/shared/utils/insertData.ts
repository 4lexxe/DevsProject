import { Transaction } from "sequelize";
import Course from "../../modules/course/Course";
import Section from "../../modules/section/Section";
import Content from "../../modules/content/Content";
import HeaderSection from "../../modules/headerSection/HeaderSection";
import { CreationAttributes } from "sequelize";

interface CourseData extends CreationAttributes<Course> {
  title: string;
  image: string;
  summary: string;
  category: string;
  about: string;
  relatedCareerType: string;
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number;
}

interface SectionData {
  title: string;
  description: string;
  courseId?: number;
  moduleType: string;
  coverImage: string;
  contents?: ContentData[];
}

interface ContentData {
  type: string;
  sectionId?: number;
  contentText?: string;
  contentTextTitle?: string;
  contentVideo?: string;
  contentVideoTitle?: string;
  contentImage?: string;
  contentImageTitle?: string;
  contentFile?: string;
  contentFileTitle?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  quizTitle?: string;
  quizContent?: string;
  questions?: Array<{ question: string; answers: Array<{ answer: string; isCorrect: boolean }> }>;
  duration?: number;
  position?: number;
}

interface HeaderSectionData {
  title: string;
  description: string;
  courseId?: number;
  moduleType: string;
  coverImage: string;
  contents?: ContentData[];
}

export async function insertCourseWithSections(
  courseData: CourseData,
  sectionsData: SectionData[],
  headerSectionsData: HeaderSectionData[],
  transaction?: Transaction
): Promise<Course> {
  const t = transaction || (await Course.sequelize!.transaction());

  try {
    // Crear el curso
    const course = await Course.create(courseData, { transaction: t });

    // Crear las secciones asociadas al curso
    for (const section of sectionsData) {
      const createdSection = await Section.create(
        { ...section, courseId: course.id },
        { transaction: t }
      );

      // Insertar los contenidos de la sección
      if (section.contents && section.contents.length > 0) {
        const contentsWithSectionId = section.contents.map((content) => ({
          ...content,
          sectionId: createdSection.id,
        }));
        await Content.bulkCreate(contentsWithSectionId, { transaction: t });
      }
    }

    // Crear las secciones de encabezado asociadas al curso
    for (const headerSection of headerSectionsData) {
      const createdHeaderSection = await HeaderSection.create(
        { ...headerSection, courseId: course.id },
        { transaction: t }
      );

      // Insertar los contenidos de la sección de encabezado
      if (headerSection.contents && headerSection.contents.length > 0) {
        const contentsWithHeaderSectionId = headerSection.contents.map((content) => ({
          ...content,
          sectionId: createdHeaderSection.id,
        }));
        await Content.bulkCreate(contentsWithHeaderSectionId, { transaction: t });
      }
    }

    if (!transaction) {
      await t.commit();
    }

    return course;
  } catch (error) {
    if (!transaction) {
      await t.rollback();
    }
    throw error;
  }
}