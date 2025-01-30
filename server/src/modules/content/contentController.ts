import Content from './Content';
import Section from '../section/Section';
import { authMiddleware } from '../../shared/middleware/authMiddleware'; // Middleware de autenticación

interface CreateContentRequest {
  type: string;
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
  questions?: string[];
  duration?: number;
  position?: number;
  sectionId: number;
}
import { RequestHandler, Request, Response } from 'express';

// Crear contenido (requiere autenticación)
export const createContent: RequestHandler[] = [
  authMiddleware, // Añadir middleware de autenticación
  async (req: Request<{}, {}, CreateContentRequest>, res: Response): Promise<void> => {
    const {
      type,
      contentText,
      contentTextTitle,
      contentVideo,
      contentVideoTitle,
      contentImage,
      contentImageTitle,
      contentFile,
      contentFileTitle,
      externalLink,
      externalLinkTitle,
      quizTitle,
      quizContent,
      questions,
      duration,
      position,
      sectionId,
    } = req.body;

    try {
      // Verificar si la sección existe
      const section = await Section.findByPk(sectionId);
      if (!section) {
        res.status(404).json({ message: 'Sección no encontrada' });
        return;
      }

      // Crear el nuevo contenido
      const newContent = await Content.create({
        type,
        contentText,
        contentTextTitle,
        contentVideo,
        contentVideoTitle,
        contentImage,
        contentImageTitle,
        contentFile,
        contentFileTitle,
        externalLink,
        externalLinkTitle,
        quizTitle,
        quizContent,
        questions,
        duration,
        position,
        sectionId,
      });

      res.status(201).json(newContent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creando el contenido', error });
    }
  }
];

// Obtener el contenido de una sección (sin autenticación)
export const getContentBySection: RequestHandler = async (req, res): Promise<void> => {
  const { sectionId } = req.params;

  try {
    // Obtener contenido relacionado con la sección ordenado por posición
    const content = await Content.findAll({ where: { sectionId }, order: [['position', 'ASC']] });
    if (content.length === 0) {
      res.status(404).json({ message: 'No se encontró contenido en la sección' });
      return;
    }

    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el contenido' });
  }
};

// Obtener contenido por ID (sin autenticación)
export const getContentById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

// Actualizar contenido (requiere autenticación)
export const updateContent: RequestHandler[] = [
  authMiddleware, // Añadir middleware de autenticación
  async (req, res): Promise<void> => {
    const { id } = req.params;
    const {
      type,
      contentText,
      contentTextTitle,
      contentVideo,
      contentVideoTitle,
      contentImage,
      contentImageTitle,
      contentFile,
      contentFileTitle,
      externalLink,
      externalLinkTitle,
      quizTitle,
      quizContent,
      questions,
      duration,
      position,
      sectionId,
    } = req.body;

    try {
      // Buscar contenido por ID
      const contentItem = await Content.findByPk(id);
      if (!contentItem) {
        res.status(404).json({ message: 'Contenido no encontrado' });
        return;
      }

      // Validar si la nueva sección existe, en caso de que se quiera cambiar
      if (sectionId) {
        const section = await Section.findByPk(sectionId);
        if (!section) {
          res.status(404).json({ message: 'Sección no encontrada' });
          return;
        }
      }

      // Actualizar valores del contenido
      contentItem.type = type || contentItem.type;
      contentItem.contentText = contentText || contentItem.contentText;
      contentItem.contentTextTitle = contentTextTitle || contentItem.contentTextTitle;
      contentItem.contentVideo = contentVideo || contentItem.contentVideo;
      contentItem.contentVideoTitle = contentVideoTitle || contentItem.contentVideoTitle;
      contentItem.contentImage = contentImage || contentItem.contentImage;
      contentItem.contentImageTitle = contentImageTitle || contentItem.contentImageTitle;
      contentItem.contentFile = contentFile || contentItem.contentFile;
      contentItem.contentFileTitle = contentFileTitle || contentItem.contentFileTitle;
      contentItem.externalLink = externalLink || contentItem.externalLink;
      contentItem.externalLinkTitle = externalLinkTitle || contentItem.externalLinkTitle;
      contentItem.quizTitle = quizTitle || contentItem.quizTitle;
      contentItem.quizContent = quizContent || contentItem.quizContent;
      contentItem.questions = questions || contentItem.questions;
      contentItem.duration = duration || contentItem.duration;
      contentItem.position = position || contentItem.position;
      contentItem.sectionId = sectionId || contentItem.sectionId;

      await contentItem.save();

      res.status(200).json(contentItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error actualizando el contenido' });
    }
  }
];

// Eliminar contenido (requiere autenticación)
export const deleteContent: RequestHandler[] = [
  authMiddleware, // Añadir middleware de autenticación
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      // Buscar contenido por ID
      const content = await Content.findByPk(id);
      if (!content) {
        res.status(404).json({ message: 'Contenido no encontrado' });
        return;
      }

      // Eliminar el contenido
      await content.destroy();
      res.status(200).json({ message: 'Contenido eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error eliminando el contenido' });
    }
  }
];