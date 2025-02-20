import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Op, Sequelize } from 'sequelize';
import NodeCache from 'node-cache';
import stringSimilarity from 'string-similarity';
import { naturalizeText } from '../utils/textProcessing';
import Resource, { ResourceType } from '../Resource';
import User from '../../user/User';

// Configuración de caché para resultados de búsqueda
const searchCache = new NodeCache({
  stdTTL: 300, // 5 minutos de tiempo de vida
  checkperiod: 60, // Período de verificación en segundos
  maxKeys: 1000, // Máximo número de claves en caché
});

// Interfaz para campos actualizables del recurso
interface UpdatableResourceFields {
  title?: string;
  description?: string;
  url?: string;
  type?: ResourceType;
  isVisible?: boolean;
  coverImage?: string;
}

// Configuración de similitud
const SIMILARITY_THRESHOLD = 0.3; // Umbral mínimo de similitud
const TITLE_WEIGHT = 0.7; // Peso para similitud en título
const DESCRIPTION_WEIGHT = 0.3; // Peso para similitud en descripción

export class ResourceController {
  // Validaciones para la creación y actualización de recursos
  static resourceValidations = [
    body('title').notEmpty().withMessage('El título es requerido'),
    body('url').isURL().withMessage('La URL debe ser válida'),
    body('type').isIn(Object.values(ResourceType)).withMessage('Tipo de recurso inválido'),
    body('isVisible').optional().isBoolean().withMessage('isVisible debe ser un valor booleano'),
    body('coverImage').optional().isURL().withMessage('La URL de la imagen de portada debe ser válida'),
  ];

  /**
   * Calcula la similitud ponderada entre términos de búsqueda y contenido
   * @param searchTerm Término de búsqueda
   * @param title Título del recurso
   * @param description Descripción del recurso
   * @returns Puntuación de similitud ponderada
   */
  private static calculateSimilarity(
    searchTerm: string,
    title: string,
    description: string | null
  ): number {
    // Procesar y normalizar textos
    const naturalizedSearch = naturalizeText(searchTerm);
    const naturalizedTitle = naturalizeText(title);
    const naturalizedDescription = description ? naturalizeText(description) : '';

    // Calcular similitudes
    const titleSimilarity = stringSimilarity.compareTwoStrings(naturalizedSearch, naturalizedTitle);
    const descriptionSimilarity = description
      ? stringSimilarity.compareTwoStrings(naturalizedSearch, naturalizedDescription)
      : 0;

    // Calcular similitud ponderada
    return (titleSimilarity * TITLE_WEIGHT) + (descriptionSimilarity * DESCRIPTION_WEIGHT);
  }

  /**
   * Crea un nuevo recurso
   * Requiere autenticación
   */
  static async createResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated?.()) {
        res.status(401).json({ error: 'Se requiere autenticación' });
        return;
      }

      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { title, description, url, type, isVisible, coverImage } = req.body;
      const userId = (req.user as User)?.id;

      if (!userId) {
        res.status(401).json({ error: 'Usuario no identificado' });
        return;
      }

      // Crear recurso
      const resource = await Resource.create({
        title: naturalizeText(title), // Procesar título
        description: description ? naturalizeText(description) : undefined, // Procesar descripción
        url,
        type,
        userId,
        isVisible: isVisible ?? true,
        coverImage,
      });

      // Limpiar caché
      searchCache.flushAll();
      
      res.status(201).json(resource.toJSON());
    } catch (error) {
      console.error('Error en creación de recurso:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }

  /**
   * Obtiene recursos con búsqueda optimizada
   * Acceso público
   */
  static async getResources(req: Request, res: Response): Promise<void> {
    try {
      const { q = '', limit = '30', lastCreatedAt, type } = req.query;
      const parsedLimit = parseInt(limit as string, 10);

      // Validar límite
      if (isNaN(parsedLimit)) {
        res.status(400).json({ error: 'Parámetro de límite inválido' });
        return;
      }

      // Verificar caché
      const cacheKey = `resources:${q}:${limit}:${lastCreatedAt}:${type}`;
      const cachedResult = searchCache.get(cacheKey);
      if (cachedResult) {
        res.json(cachedResult);
        return;
      }

      // Construir consulta
      const whereClause: any = { isVisible: true };
      const order: any[] = [['createdAt', 'DESC']];

      if (type) {
        whereClause.type = type;
      }

      if (lastCreatedAt) {
        whereClause.createdAt = { [Op.lt]: new Date(lastCreatedAt as string) };
      }

      // Búsqueda con similitud
      if (q && typeof q === 'string' && q.trim()) {
        const searchTerm = naturalizeText(q.trim());
        
        // Obtener todos los recursos para procesamiento de similitud
        const allResources = await Resource.findAll({
          where: whereClause,
          include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
        });

        // Calcular similitudes y filtrar
        const scoredResources = allResources
          .map(resource => ({
            resource,
            similarity: ResourceController.calculateSimilarity(
              searchTerm,
              resource.title,
              resource.description
            )
          }))
          .filter(({ similarity }) => similarity >= SIMILARITY_THRESHOLD)
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, parsedLimit);

        const result = {
          total: scoredResources.length,
          results: scoredResources.map(({ resource }) => resource.toJSON())
        };

        // Guardar en caché si hay resultados
        if (result.results.length > 0) {
          searchCache.set(cacheKey, result);
        }

        res.json(result);
        return;
      }

      // Consulta sin término de búsqueda
      const resources = await Resource.findAndCountAll({
        where: whereClause,
        include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
        limit: parsedLimit,
        order,
        distinct: true,
      });

      const result = {
        total: resources.count,
        results: resources.rows.map(resource => resource.toJSON()),
      };

      // Guardar en caché si hay resultados
      if (result.results.length > 0) {
        searchCache.set(cacheKey, result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en obtención de recursos:', error);
      res.status(500).json({
        error: 'Error al procesar la solicitud',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Obtiene un recurso por ID
   * Acceso público
   */
  static async getResourceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar ID
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'Identificador inválido' });
        return;
      }

      // Verificar caché
      const cacheKey = `resource:${id}`;
      const cachedResource = searchCache.get(cacheKey);
      if (cachedResource) {
        res.json(cachedResource);
        return;
      }

      // Obtener recurso
      const resource = await Resource.findByPk(id, {
        include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
      });

      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      const resourceJSON = resource.toJSON();
      
      // Guardar en caché
      searchCache.set(cacheKey, resourceJSON);

      res.json(resourceJSON);
    } catch (error) {
      console.error('Error en obtención de recurso:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }

  /**
   * Actualiza un recurso
   * Requiere autenticación y permisos
   */
  static async updateResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated?.()) {
        res.status(401).json({ error: 'Se requiere autenticación' });
        return;
      }

      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { title, description, url, type, isVisible, coverImage } = req.body;

      // Validar ID
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'Identificador inválido' });
        return;
      }

      // Obtener recurso
      const resource = await Resource.findByPk(id);

      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      // Verificar permisos
      const user = req.user as User;
      const userId = user.id;

      if (resource.userId !== userId && user.Role?.name !== 'superAdmin') {
        res.status(403).json({ error: 'Permisos insuficientes' });
        return;
      }

      // Actualizar campos
      const updatedFields: UpdatableResourceFields = {
        title: title ? naturalizeText(title) : undefined,
        description: description ? naturalizeText(description) : undefined,
        url,
        type,
        isVisible,
        coverImage,
      };

      await resource.update(updatedFields);

      // Limpiar caché
      searchCache.del(`resource:${id}`);
      searchCache.flushAll();

      // Obtener recurso actualizado
      const updatedResource = await Resource.findByPk(id, {
        include: [{ model: User, as: 'User', attributes: ['id', 'name'] }],
      });

      res.json(updatedResource?.toJSON());
    } catch (error) {
      console.error('Error en actualización de recurso:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }

  /**
   * Elimina un recurso
   * Requiere autenticación y permisos
   */
  static async deleteResource(req: Request, res: Response): Promise<void> {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated?.()) {
        res.status(401).json({ error: 'Se requiere autenticación' });
        return;
      }

      const { id } = req.params;

      // Validar ID
      if (!/^\d+$/.test(id)) {
        res.status(400).json({ error: 'Identificador inválido' });
        return;
      }

      // Obtener recurso
      const resource = await Resource.findByPk(id);

      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado' });
        return;
      }

      // Verificar permisos
      const user = req.user as User;
      const userId = user.id;

      if (resource.userId !== userId && user.Role?.name !== 'superAdmin') {
        res.status(403).json({ error: 'Permisos insuficientes' });
        return;
      }

      // Eliminar recurso
      await resource.destroy();

      // Limpiar caché
      searchCache.del(`resource:${id}`);
      searchCache.flushAll();

      res.json({ message: 'Recurso eliminado correctamente' });
    } catch (error) {
      console.error('Error en eliminación de recurso:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }
}