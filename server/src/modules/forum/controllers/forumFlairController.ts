import { Request, Response } from 'express';
import ForumFlair, { FlairType } from '../models/ForumFlair';
import User from '../../user/User';
import sequelize from '../../../infrastructure/database/db';
import ForumPost from '../models/ForumPost';
import PostFlair from '../models/PostFlair';
import UserFlair from '../models/UserFlair';

export class ForumFlairController {
/**
 * @function getAllFlairs
 * @description Obtiene todos los distintivos disponibles
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async getAllFlairs (req: Request, res: Response): Promise<void> {
  try {
    const flairs = await ForumFlair.findAll({
      where: { isActive: true }
    });
    
    res.status(200).json({ success: true, data: flairs });
  } catch (error) {
    console.error('Error al obtener todos los flairs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getFlairById
 * @description Obtiene un distintivo por su ID
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async getFlairById (req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    res.status(200).json({ success: true, data: flair });
  } catch (error) {
    console.error('Error al obtener el flair por ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function createFlair
 * @description Crea un nuevo distintivo
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async createFlair (req: Request, res: Response): Promise<void> {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      name, 
      description, 
      icon, 
      color, 
      type, 
      isActive = true,
      createdBy 
    } = req.body;
    
    // Validaciones básicas
    if (!name || !description) {
      res.status(400).json({ 
        success: false, 
        message: 'El nombre y la descripción son obligatorios' 
      });
      return;
    }

    if (type && !Object.values(FlairType).includes(type)) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de distintivo no válido' 
      });
      return;
    }
    
    // Crear el distintivo
    const flair = await ForumFlair.create({
      name,
      description,
      icon,
      color,
      type,
      isActive,
      createdBy
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Distintivo creado exitosamente', 
      data: flair 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function updateFlair
 * @description Actualiza un distintivo existente
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async updateFlair (req: Request, res: Response): Promise<void> {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      icon, 
      color, 
      type, 
      isActive
    } = req.body;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Actualizar el distintivo
    await flair.update({
      name: name || flair.name,
      description: description || flair.description,
      icon: icon || flair.icon,
      color: color || flair.color,
      type: type || flair.type,
      isActive: typeof isActive === 'boolean' ? isActive : flair.isActive
    }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo actualizado exitosamente', 
      data: flair 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function deleteFlair
 * @description Elimina un distintivo (desactivándolo)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async deleteFlair (req: Request, res: Response): Promise<void> {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(id);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // En lugar de eliminar, desactivamos el distintivo
    await flair.update({ isActive: false }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo desactivado exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el distintivo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function assignFlairToUser
 * @description Asigna un distintivo a un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async assignFlairToUser (req: Request, res: Response): Promise<void> {
  try {
    const { flairId, userId } = req.params;
    const { expiresAt } = req.body; // Campo opcional para fecha de expiración
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }

    // Validar el tipo de flair (opcional, según tu lógica de negocio)
    if (flair.type !== FlairType.ROLE_BASED && flair.type !== FlairType.ACHIEVEMENT) {
      res.status(400).json({ 
        success: false, 
        message: `No se puede asignar flair (${flair.name}) a usuarios debido a su tipo` 
      });
      return;
    }
    
    // Buscar el usuario
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Usar el método estático de UserFlair en lugar del método de la asociación
    await UserFlair.assignFlair(parseInt(userId), parseInt(flairId), expiresAt ? new Date(expiresAt) : undefined);
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo asignado exitosamente al usuario' 
    });
  } catch (error) {
    console.error('Error al asignar el flair al usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al asignar el distintivo al usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function removeFlairFromUser
 * @description Elimina un distintivo de un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async removeFlairFromUser (req: Request, res: Response): Promise<void> {
  try {
    const { flairId, userId } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Buscar el usuario
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    
    // Usar el método estático de UserFlair para eliminar la asignación
    const removed = await UserFlair.removeFlair(parseInt(userId), parseInt(flairId));
    
    if (!removed) {
      res.status(404).json({ 
        success: false, 
        message: 'El usuario no tiene asignado este distintivo' 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Distintivo eliminado exitosamente del usuario' 
    });
  } catch (error) {
    console.error('Error al eliminar el flair del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el distintivo del usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getFlairsByType
 * @description Obtiene todos los distintivos por tipo
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async getFlairsByType (req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.params;
    
    // Validar que el tipo sea válido
    if (!Object.values(FlairType).includes(type as FlairType)) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de flair no válido' 
      });
      return;
    }

    const flairs = await ForumFlair.findAll({
      where: { 
        type: type,  // Usar el tipo específico del parámetro
        isActive: true 
      }
    });
    
    res.status(200).json({ success: true, data: flairs });
  } catch (error) {
    console.error('Error al obtener flairs por tipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos por tipo',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function getUserFlairs
 * @description Obtiene todos los distintivos de un usuario
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
static async getUserFlairs (req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const onlyActive = req.query.onlyActive === 'true' || req.query.onlyActive === undefined;
    
    // Usar el nuevo método para obtener los flairs del usuario
    const userFlairs = await UserFlair.getUserFlairs(parseInt(userId), { onlyActive });
    
    if (!userFlairs || userFlairs.length === 0) {
      res.status(200).json({ success: true, data: [] });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: userFlairs.map(uf => ({
        id: uf.id,
        flairId: uf.flairId,
        userId: uf.userId,
        isActive: uf.isActive,
        expiresAt: uf.expiresAt,
        createdAt: uf.createdAt,
        updatedAt: uf.updatedAt,
        flair: uf.get('flair')
      }))
    });
  } catch (error) {
    console.error('Error al obtener los flairs del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los distintivos del usuario',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * @function assignFlairToPost
 * @description Asigna un distintivo a un post (actúa como etiqueta)
 */
static async assignFlairToPost(req: Request, res: Response): Promise<void> {
  try {
    const { flairId, postId } = req.params;
    const { assignedBy } = req.body; // ID del usuario que asigna el flair (opcional)
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }

    // Validar el tipo de flair (opcional, según tu lógica de negocio)
    if (flair.type !== FlairType.POST) {
      res.status(400).json({ 
        success: false, 
        message: `No se puede asignar flair (${flair.name}) a posts debido a su tipo` 
      });
      return;
    }
    
    // Buscar el post
    const post = await ForumPost.findByPk(postId);
    
    if (!post) {
      res.status(404).json({ success: false, message: 'Post no encontrado' });
      return;
    }
    
    // Verificar que el usuario tenga permisos (autor del post o moderador)
    //Añadir despues**
    
    // Usar el método estático de PostFlair para asignar el flair
    await PostFlair.assignFlair(parseInt(postId), parseInt(flairId), assignedBy ? parseInt(assignedBy) : undefined);
    
    res.status(200).json({ 
      success: true, 
      message: 'Etiqueta asignada exitosamente al post' 
    });
  } catch (error) {
    console.error('Error al asignar la etiqueta al post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al asignar la etiqueta al post',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * @function removeFlairFromPost
 * @description Elimina un distintivo de un post
 */
static async removeFlairFromPost(req: Request, res: Response): Promise<void> {
  try {
    const { flairId, postId } = req.params;
    
    // Buscar el distintivo
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Buscar el post
    const post = await ForumPost.findByPk(postId);
    
    if (!post) {
      res.status(404).json({ success: false, message: 'Post no encontrado' });
      return;
    }
    
    // Verificar que el usuario tenga permisos (autor del post o moderador)
    //Añadir despues**
    
    // Usar el método estático de PostFlair para remover el flair
    const removed = await PostFlair.removeFlair(parseInt(postId), parseInt(flairId));
    
    if (!removed) {
      res.status(404).json({ 
        success: false, 
        message: 'El post no tiene asignada esta etiqueta' 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Etiqueta eliminada exitosamente del post' 
    });
  } catch (error) {
    console.error('Error al eliminar la etiqueta del post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la etiqueta del post',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * @function getPostFlairs
 * @description Obtiene todos los distintivos de un post
 */
static async getPostFlairs(req: Request, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const onlyActive = req.query.onlyActive === 'true' || req.query.onlyActive === undefined;
    
    // Usar el nuevo método para obtener los flairs del post
    const postFlairs = await PostFlair.getPostFlairs(parseInt(postId), { onlyActive });
    
    if (!postFlairs || postFlairs.length === 0) {
      res.status(200).json({ success: true, data: [] });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      data: postFlairs.map(pf => ({
        id: pf.id,
        flairId: pf.flairId,
        postId: pf.postId,
        isActive: pf.isActive,
        assignedAt: pf.assignedAt,
        assignedBy: pf.assignedBy,
        createdAt: pf.createdAt,
        updatedAt: pf.updatedAt,
        flair: pf.get('flair')
      }))
    });
  } catch (error) {
    console.error('Error al obtener las etiquetas del post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las etiquetas del post',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * @function getPostsByFlair
 * @description Obtiene todos los posts con un determinado flair
 */
static async getPostsByFlair(req: Request, res: Response): Promise<void> {
  try {
    const { flairId } = req.params;
    const onlyActive = req.query.onlyActive === 'true' || req.query.onlyActive === undefined;
    
    // Verificar que el flair existe
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Obtener posts con este flair
    const posts = await PostFlair.getPostsWithFlair(parseInt(flairId), onlyActive);
    
    res.status(200).json({ 
      success: true, 
      data: posts
    });
  } catch (error) {
    console.error('Error al obtener posts por flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los posts por flair',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * @function getUsersByFlair
 * @description Obtiene todos los usuarios con un determinado flair
 */
static async getUsersByFlair(req: Request, res: Response): Promise<void> {
  try {
    const { flairId } = req.params;
    const onlyActive = req.query.onlyActive === 'true' || req.query.onlyActive === undefined;
    
    // Verificar que el flair existe
    const flair = await ForumFlair.findByPk(flairId);
    
    if (!flair) {
      res.status(404).json({ success: false, message: 'Distintivo no encontrado' });
      return;
    }
    
    // Obtener usuarios con este flair
    const users = await UserFlair.getUsersWithFlair(parseInt(flairId), onlyActive);
    
    res.status(200).json({ 
      success: true, 
      data: users
    });
  } catch (error) {
    console.error('Error al obtener usuarios por flair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los usuarios por flair',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

}