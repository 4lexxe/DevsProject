import { Request, Response, RequestHandler } from 'express';
import Content from '../models/Content';
import Section from '../models/Section'; // Relación con la sección

interface CreateContentRequest {
  type: string;
  contentText?: string;
  contentVideo?: string;
  contentImage?: string;
  contentFile?: string;
  externalLink?: string;
  duration?: number;
  position?: number;
  sectionId: number;
  return: any;
}

// Crear contenido
export const createContent: RequestHandler = async (req: Request<{}, {}, CreateContentRequest>, res): Promise<void> => {
  const {
    type,
    contentText,
    contentVideo,
    contentImage,
    contentFile,
    externalLink,
    duration,
    position,
    sectionId,
  } = req.body;

  try {
    const section = await Section.findByPk(sectionId);
    if (!section) {
      res.status(404).json({ message: 'Sección no encontrada' });
      return;
    }

    const newContent = await Content.create({
      type,
      contentText,
      contentVideo,
      contentImage,
      contentFile,
      externalLink,
      duration,
      position,
      sectionId,
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el contenido', error });
  }
};

// Obtener el contenido de una sección
export const getContentBySection: RequestHandler = async (req, res): Promise<void> => {
  const { sectionId } = req.params;

  try {
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

// Obtener contenido por ID
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

// Actualizar contenido
export const updateContent: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const {
    type,
    contentText,
    contentVideo,
    contentImage,
    contentFile,
    externalLink,
    duration,
    position,
    sectionId,
  } = req.body;

  try {
    const contentItem = await Content.findByPk(id);
    if (!contentItem) {
      res.status(404).json({ message: 'Contenido no encontrado' });
    }

    if (sectionId) {
      const section = await Section.findByPk(sectionId);
      if (!section) {
        res.status(404).json({ message: 'Sección no encontrada' });
        return;
      }
    }

    if (contentItem) {
      // Actualizar valores
      contentItem.type = type || contentItem.type;
      contentItem.contentText = contentText || contentItem.contentText;
      contentItem.contentVideo = contentVideo || contentItem.contentVideo;
      contentItem.contentImage = contentImage || contentItem.contentImage;
      contentItem.contentFile = contentFile || contentItem.contentFile;
      contentItem.externalLink = externalLink || contentItem.externalLink;
      contentItem.duration = duration || contentItem.duration;
      contentItem.position = position || contentItem.position;
      contentItem.sectionId = sectionId || contentItem.sectionId;

      await contentItem.save();
    }

    res.status(200).json(contentItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el contenido' });
  }
};

// Eliminar contenido
export const deleteContent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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