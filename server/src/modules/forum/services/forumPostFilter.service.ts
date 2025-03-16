// server/src/modules/forum/services/forumPostFilter.service.ts

import { Op, WhereOptions, Order, Includeable } from 'sequelize';
import ForumPost from '../models/ForumPost';
import User from '../../user/User';
import ForumCategory from '../models/ForumCategory';
import ForumFlair from '../models/ForumFlair';

interface FilterOptions {
  // Filtros básicos
  search?: string;
  categoryId?: number | number[];
  authorId?: number | number[];
  status?: string;
  
  // Filtros de estado
  isPinned?: boolean;
  isLocked?: boolean;
  isAnnouncement?: boolean;
  isNSFW?: boolean;
  isSpoiler?: boolean;
  
  // Filtros de actividad
  minViewCount?: number;
  maxViewCount?: number;
  minReplyCount?: number;
  maxReplyCount?: number;
  minVoteScore?: number;
  maxVoteScore?: number;
  
  // Filtros temporales
  createdBefore?: Date | string;
  createdAfter?: Date | string;
  updatedBefore?: Date | string;
  updatedAfter?: Date | string;
  activeAfter?: Date | string;
  activeBefore?: Date | string;
  
  // Filtros de relaciones
  flairIds?: number[];
  
  // Ordenamiento
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  
  // Paginación
  page?: number;
  limit?: number;
}

class ForumPostFilterService {
  /**
   * Aplica filtros avanzados a las consultas de ForumPost
   */
  public async getFilteredPosts(options: FilterOptions) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'lastActivityAt',
      sortOrder = 'DESC',
      ...filters
    } = options;
    
    const offset = (page - 1) * limit;
    
    // Construir cláusula WHERE
    const where = this.buildWhereClause(filters);
    
    // Construir cláusula ORDER
    const order = this.buildOrderClause(sortBy, sortOrder);
    
    // Construir INCLUDES (relaciones)
    const include = this.buildIncludeClause(filters);
    
    // Realizar la consulta
    const { count, rows } = await ForumPost.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      distinct: true // Importante para contar correctamente cuando hay includes
    });
    
    return {
      posts: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit
      }
    };
  }
  
  /**
   * Construye la cláusula WHERE para los filtros
   */
  private buildWhereClause(filters: FilterOptions): WhereOptions {
    const where: any = {};
    
    // Filtros básicos
    if (filters.categoryId) {
      where.categoryId = Array.isArray(filters.categoryId) 
        ? { [Op.in]: filters.categoryId } 
        : filters.categoryId;
    }
    
    if (filters.authorId) {
      where.authorId = Array.isArray(filters.authorId) 
        ? { [Op.in]: filters.authorId } 
        : filters.authorId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    // Filtros de búsqueda de texto
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { content: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }
    
    // Filtros de estado
    if (typeof filters.isPinned === 'boolean') where.isPinned = filters.isPinned;
    if (typeof filters.isLocked === 'boolean') where.isLocked = filters.isLocked;
    if (typeof filters.isAnnouncement === 'boolean') where.isAnnouncement = filters.isAnnouncement;
    if (typeof filters.isNSFW === 'boolean') where.isNSFW = filters.isNSFW;
    if (typeof filters.isSpoiler === 'boolean') where.isSpoiler = filters.isSpoiler;
    
    // Filtros de conteo
    if (filters.minViewCount !== undefined) where.viewCount = { ...where.viewCount, [Op.gte]: filters.minViewCount };
    if (filters.maxViewCount !== undefined) where.viewCount = { ...where.viewCount, [Op.lte]: filters.maxViewCount };
    
    if (filters.minReplyCount !== undefined) where.replyCount = { ...where.replyCount, [Op.gte]: filters.minReplyCount };
    if (filters.maxReplyCount !== undefined) where.replyCount = { ...where.replyCount, [Op.lte]: filters.maxReplyCount };
    
    if (filters.minVoteScore !== undefined) where.voteScore = { ...where.voteScore, [Op.gte]: filters.minVoteScore };
    if (filters.maxVoteScore !== undefined) where.voteScore = { ...where.voteScore, [Op.lte]: filters.maxVoteScore };
    
    // Filtros temporales
    if (filters.createdAfter) where.createdAt = { ...where.createdAt, [Op.gte]: new Date(filters.createdAfter) };
    if (filters.createdBefore) where.createdAt = { ...where.createdAt, [Op.lte]: new Date(filters.createdBefore) };
    
    if (filters.updatedAfter) where.updatedAt = { ...where.updatedAt, [Op.gte]: new Date(filters.updatedAfter) };
    if (filters.updatedBefore) where.updatedAt = { ...where.updatedAt, [Op.lte]: new Date(filters.updatedBefore) };
    
    if (filters.activeAfter) where.lastActivityAt = { ...where.lastActivityAt, [Op.gte]: new Date(filters.activeAfter) };
    if (filters.activeBefore) where.lastActivityAt = { ...where.lastActivityAt, [Op.lte]: new Date(filters.activeBefore) };
    
    return where;
  }
  
  /**
   * Construye la cláusula ORDER para ordenamiento
   */
  private buildOrderClause(sortBy: string, sortOrder: 'ASC' | 'DESC'): Order {
    // Lista de campos permitidos para ordenar
    const allowedSortFields = [
      'title', 'createdAt', 'updatedAt', 'lastActivityAt', 
      'viewCount', 'replyCount', 'voteScore', 'upvoteCount', 'downvoteCount'
    ];
    
    // Si el campo no está permitido, utilizar lastActivityAt por defecto
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'lastActivityAt';
    
    // El orden ASC solo tiene sentido para título, para el resto usar DESC por defecto
    const order = field === 'title' && sortOrder !== 'DESC' ? 'ASC' : sortOrder;
    
    return [[field, order]];
  }
  
  /**
   * Construye la cláusula INCLUDE para relaciones
   */
  private buildIncludeClause(filters: FilterOptions): Includeable[] {
    const include: Includeable[] = [
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      { model: ForumCategory, as: 'category' }
    ];
    
    // Si se filtran por flairs, incluir la relación
    if (filters.flairIds && filters.flairIds.length > 0) {
      include.push({
        model: ForumFlair,
        as: 'flairs',
        attributes: ['id', 'name', 'icon', 'color'],
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
        where: { id: { [Op.in]: filters.flairIds } }
      });
    }
    
    return include;
  }
}

export default new ForumPostFilterService();