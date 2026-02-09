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

  // Función helper para verificar permisos de propietario o moderador
  private static canModifyResource(user: User, resource: any): { canModify: boolean; reason?: string } {
    try {
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const isOwner = resource.userId === user.id;
      const canModerateAll = userPermissions.includes('moderate:all_resources') || user.Role?.name === 'superadmin';
      const canManageOwn = userPermissions.includes('manage:own_resources');

      console.log(' Verificando permisos para resource:', {
        resourceId: resource.id,
        resourceUserId: resource.userId,
        currentUserId: user.id,
        isOwner,
        canModerateAll,
        canManageOwn,
        userPermissions
      });

      if (canModerateAll) {
        return { canModify: true };
      }

      if (isOwner && canManageOwn) {
        return { canModify: true };
      }

      if (!isOwner) {
        return { canModify: false, reason: 'Solo el propietario del recurso puede modificarlo' };
      }

      return { canModify: false, reason: 'No tienes permisos para gestionar recursos' };
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return { canModify: false, reason: 'Error verificando permisos' };
    }
  }

  // Crear un nuevo recurso (requiere autenticación)
  static async createResource(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Verificar permisos básicos para subir recursos
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('upload:resources') && user.Role?.name !== 'superadmin') {
        res.status(403).json({
          error: 'No tienes permisos para subir recursos'
        });
        return;
      }

      const { title, description, url, type, isVisible, coverImage } = req.body;
      const userId = user.id;

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
            as: 'User',
            attributes: ['id', 'name', 'username', 'displayName', 'avatar'],
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
            as: 'User',
            attributes: ['id', 'name', 'username', 'displayName', 'avatar'],
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

  // Actualizar un recurso (requiere ser propietario o tener permisos de moderador)
  static async updateResource(req: Request, res: Response): Promise<void> {
    try {
      console.log(' Iniciando actualización de recurso');
      
      const user = req.user as User;
      if (!user) {
        console.log(' Usuario no autenticado');
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      console.log(' Usuario autenticado:', {
        id: user.id,
        roleId: user.roleId,
        roleName: user.Role?.name
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(' Errores de validación:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { title, description, url, type, isVisible, coverImage } = req.body;

      console.log(' Datos de actualización:', {
        resourceId: id,
        title,
        description: description?.substring(0, 50) + '...',
        url,
        type,
        isVisible,
        coverImage: coverImage?.substring(0, 50) + '...'
      });

      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
        return;
      }

      // Buscar el recurso con información completa del usuario
      const resource = await Resource.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User',
            include: [
              {
                association: 'Role',
                include: ['Permissions']
              }
            ]
          }
        ]
      });

      if (!resource) {
        console.log(' Recurso no encontrado:', id);
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      console.log(' Recurso encontrado:', {
        id: resource.id,
        userId: resource.userId,
        title: resource.title
      });

      // Asegurar que el usuario tenga información completa del rol
      const userWithRole = await User.findByPk(user.id, {
        include: [
          {
            association: 'Role',
            include: ['Permissions']
          }
        ]
      });

      if (!userWithRole) {
        console.log(' Error cargando información del usuario');
        res.status(401).json({ error: 'Error de autenticación' });
        return;
      }

      // Verificar permisos usando la función helper
      const { canModify, reason } = ResourceController.canModifyResource(userWithRole, resource);
      if (!canModify) {
        console.log(' Sin permisos:', reason);
        res.status(403).json({ error: reason });
        return;
      }

      console.log(' Permisos verificados correctamente');

      // Preparar campos para actualizar (solo los que no son undefined)
      const updatedFields: UpdatableResourceFields = {};
      
      if (title !== undefined) updatedFields.title = title;
      if (description !== undefined) updatedFields.description = description;
      if (url !== undefined) updatedFields.url = url;
      if (type !== undefined) updatedFields.type = type;
      if (isVisible !== undefined) updatedFields.isVisible = isVisible;
      if (coverImage !== undefined) updatedFields.coverImage = coverImage;

      console.log(' Campos a actualizar:', updatedFields);

      // Actualizar el recurso
      await resource.update(updatedFields);

      console.log(' Recurso actualizado correctamente');

      // Obtener el recurso actualizado con información del usuario
      const updatedResource = await Resource.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'username', 'displayName', 'avatar'],
          },
        ],
      });

      res.json(updatedResource);
      
    } catch (error) {
      console.error(' Error updating resource:', error);
      
      // Log detallado del error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      res.status(500).json({ 
        error: 'Error al actualizar el recurso',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      });
    }
  }

  // Eliminar un recurso (requiere ser propietario o tener permisos de moderador)
  static async deleteResource(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      if (!user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;

      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
        return;
      }

      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      // Asegurar que el usuario tenga información completa del rol
      const userWithRole = await User.findByPk(user.id, {
        include: [
          {
            association: 'Role',
            include: ['Permissions']
          }
        ]
      });

      if (!userWithRole) {
        res.status(401).json({ error: 'Error de autenticación' });
        return;
      }

      // Verificar permisos usando la función helper
      const { canModify, reason } = ResourceController.canModifyResource(userWithRole, resource);
      if (!canModify) {
        res.status(403).json({ error: reason });
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