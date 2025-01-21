import { Request, Response, RequestHandler } from 'express';
import Content from '../models/Content';
import Section from '../models/Section'; // Relación con la tabla "Sections"

// Interfaz para la creación de contenido
interface CreateContentRequest {
  type: string; // Tipo de contenido (texto, video, imagen, archivo, enlace externo)
  contentText?: string; // Contenido de texto
  contentVideo?: string; // URL del video
  contentVideoTitle?: string; // Título del video
  contentImage?: string; // URL de la imagen
  contentImageTitle?: string; // Título de la imagen
  contentFile?: string; // URL del archivo
  contentFileTitle?: string; // Título del archivo
  externalLink?: string; // URL de un enlace externo
  externalLinkTitle?: string; // Título del enlace externo
  duration?: number; // Duración en segundos (para videos o audios)
  position?: number; // Posición del contenido dentro de su sección
  sectionId: number; // ID de la sección a la que pertenece el contenido
}

// Crear contenido
export const createContent: RequestHandler = async (req: Request<{}, {}, CreateContentRequest>, res): Promise<void> => {
  const {
    type,
    contentText,
    contentVideo,
    contentVideoTitle,
    contentImage,
    contentImageTitle,
    contentFile,
    contentFileTitle,
    externalLink,
    externalLinkTitle,
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
      contentVideo,
      contentVideoTitle,
      contentImage,
      contentImageTitle,
      contentFile,
      contentFileTitle,
      externalLink,
      externalLinkTitle,
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
    contentVideoTitle,
    contentImage,
    contentImageTitle,
    contentFile,
    contentFileTitle,
    externalLink,
    externalLinkTitle,
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
    contentItem.contentVideo = contentVideo || contentItem.contentVideo;
    contentItem.contentVideoTitle = contentVideoTitle || contentItem.contentVideoTitle;
    contentItem.contentImage = contentImage || contentItem.contentImage;
    contentItem.contentImageTitle = contentImageTitle || contentItem.contentImageTitle;
    contentItem.contentFile = contentFile || contentItem.contentFile;
    contentItem.contentFileTitle = contentFileTitle || contentItem.contentFileTitle;
    contentItem.externalLink = externalLink || contentItem.externalLink;
    contentItem.externalLinkTitle = externalLinkTitle || contentItem.externalLinkTitle;
    contentItem.duration = duration || contentItem.duration;
    contentItem.position = position || contentItem.position;
    contentItem.sectionId = sectionId || contentItem.sectionId;

    await contentItem.save();

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
};