import { Request, Response } from 'express';
import Resource from '../Resource';
import User from '../../user/User';
import { body, validationResult } from 'express-validator';

// Interface para los campos actualizables
import { ResourceType } from '../Resource';

interface UpdatableResourceFields {
  title?: string;
  description?: string;
  url?: string;
  type?: ResourceType;
  isVisible?: boolean;
  coverImage?: string;
}

export class ResourceController {
  // Validaciones para los datos de entrada
  static resourceValidations = [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('url').isURL().withMessage('La URL debe ser válida'),
    body('type').isIn(['video', 'document', 'image', 'link']).withMessage('Tipo de recurso inválido'),
    body('isVisible').optional().isBoolean().withMessage('isVisible debe ser un valor booleano'),
    body('coverImage').optional().isURL().withMessage('La URL de la imagen de portada debe ser válida'),
  ];

  // Crear un nuevo recurso (requiere autenticación)
  static async createResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { title, description, url, type, isVisible, coverImage } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const resource = await Resource.create({
        title,
        description,
        url,
        type,
        userId,
        isVisible: isVisible ?? true,
        coverImage,
      });

      res.status(201).json(resource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Error al crear el recurso' });
    }
  }

  // Obtener todos los recursos visibles (público)
  static async getResources(_req: Request, res: Response): Promise<void> {
    try {
      const resources = await Resource.findAll({
        where: { isVisible: true },
        include: [
          {
            model: User,
            as: 'User', // Usa el alias definido en la relación
            attributes: ['id', 'name'], // Incluye solo los campos necesarios del usuario
          },
        ],
      });

      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Error al obtener los recursos' });
    }
  }

  // Obtener un recurso por ID (público)
  static async getResourceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar que el ID sea un número
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
        return;
      }

      const resource = await Resource.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User', // Usa el alias definido en la relación
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource by ID:', error);
      res.status(500).json({ error: 'Error al obtener el recurso' });
    }
  }

  // Actualizar un recurso (requiere autenticación y permisos)
  static async updateResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { title, description, url, type, isVisible, coverImage } = req.body;

      // Validar que el ID sea un número
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
        return;
      }

      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      const user = req.user as User;
      const userId = user.id;

      // Verificar si el usuario es el creador del recurso o es superAdmin
      if (resource.userId !== userId && user.Role?.name !== 'superAdmin') {
        res.status(403).json({ error: 'No tienes permiso para actualizar este recurso' });
        return;
      }

      const updatedFields: UpdatableResourceFields = {
        title,
        description,
        url,
        type,
        isVisible,
        coverImage,
      };

      await resource.update(updatedFields);

      res.json(await Resource.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'name'],
          },
        ],
      }));
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Error al actualizar el recurso' });
    }
  }

  // Eliminar un recurso (requiere autenticación y permisos)
  static async deleteResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;

      // Validar que el ID sea un número
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
        return;
      }

      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      const user = req.user as User;
      const userId = user.id;

      // Verificar si el usuario es el creador del recurso o es superAdmin
      if (resource.userId !== userId && user.Role?.name !== 'superAdmin') {
        res.status(403).json({ error: 'No tienes permiso para eliminar este recurso' });
        return;
      }

      await resource.destroy();
      res.json({ message: 'Recurso eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Error al eliminar el recurso' });
    }
  }
}