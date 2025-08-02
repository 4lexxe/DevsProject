import { Op, Order } from "sequelize";
import Course from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import { IntelligentSearchService } from "./intelligentSearchService";

export interface SearchOptions {
  searchTerm: string;
  categoryId?: number;
  careerTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
  onlyActive?: boolean;
  useIntelligentSearch?: boolean;
}

export interface SearchResult {
  courses: any[];
  totalResults: number;
  searchTerm: string;
  appliedFilters: Partial<SearchOptions>;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemsPerPage: number;
    totalResults: number;
  };
}

export class CourseSearchService {
  
  /**
   * Construye condiciones de búsqueda básica tradicional
   */
  private static buildBasicSearchConditions(searchTerm: string, onlyActive: boolean = true): any {
    return {
      [Op.and]: [
        ...(onlyActive ? [{ isActive: true }] : []),
        {
          [Op.or]: [
            // Búsqueda en campos del curso
            { title: { [Op.iLike]: `%${searchTerm}%` } },
            { summary: { [Op.iLike]: `%${searchTerm}%` } },
            { about: { [Op.iLike]: `%${searchTerm}%` } },
            { learningOutcomes: { [Op.contains]: [searchTerm] } },
            { prerequisites: { [Op.contains]: [searchTerm] } },
            // Búsqueda en CareerType usando subquery
            {
              careerTypeId: {
                [Op.in]: Course.sequelize!.literal(`(
                  SELECT id FROM "CareerTypes" 
                  WHERE "name" ILIKE '%${searchTerm}%' 
                  OR "description" ILIKE '%${searchTerm}%'
                )`)
              }
            },
            // Búsqueda en Categories usando subquery
            {
              id: {
                [Op.in]: Course.sequelize!.literal(`(
                  SELECT "courseId" FROM "CourseCategories" cc
                  JOIN "Categories" c ON cc."categoryId" = c.id
                  WHERE c."name" ILIKE '%${searchTerm}%' 
                  OR c."description" ILIKE '%${searchTerm}%'
                )`)
              }
            }
          ]
        }
      ]
    };
  }

  /**
   * Construye las condiciones de búsqueda
   */
  private static buildSearchConditions(options: SearchOptions) {
    const { searchTerm, careerTypeId, minPrice, maxPrice, onlyActive = true, useIntelligentSearch = false } = options;
    
    let baseConditions: any;

    // Siempre usar búsqueda inteligente para detectar errores tipográficos
    try {
      baseConditions = IntelligentSearchService.buildIntelligentSearchConditions(searchTerm, onlyActive);
    } catch (error) {
      console.warn('Error en búsqueda inteligente, usando búsqueda básica:', error);
      // Fallback a búsqueda básica
      baseConditions = this.buildBasicSearchConditions(searchTerm, onlyActive);
    }

    // Filtros adicionales
    if (careerTypeId) {
      if (!baseConditions[Op.and]) {
        baseConditions = { [Op.and]: [baseConditions] };
      }
      baseConditions[Op.and].push({ careerTypeId });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: any = {};
      if (minPrice !== undefined) priceFilter[Op.gte] = minPrice;
      if (maxPrice !== undefined) priceFilter[Op.lte] = maxPrice;
      
      if (!baseConditions[Op.and]) {
        baseConditions = { [Op.and]: [baseConditions] };
      }
      baseConditions[Op.and].push({ price: priceFilter });
    }

    return baseConditions;
  }

  /**
   * Construye las condiciones de inclusión para las relaciones
   */
  private static buildIncludeConditions() {
    return [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
        required: false
      },
      {
        model: CareerType,
        as: "careerType",
        required: false
      }
    ];
  }

  /**
   * Construye las condiciones de ordenamiento
   */
  private static buildOrderConditions(searchTerm: string): Order {
    return [
      // Priorizar coincidencias exactas en el título
      Course.sequelize!.literal(`CASE WHEN LOWER("Course"."title") = LOWER('${searchTerm}') THEN 1 ELSE 2 END`),
      // Luego coincidencias que empiecen con el término
      Course.sequelize!.literal(`CASE WHEN LOWER("Course"."title") LIKE LOWER('${searchTerm}%') THEN 1 ELSE 2 END`),
      // Finalmente por fecha de creación
      ['createdAt', 'DESC']
    ] as Order;
  }

  /**
   * Valida los parámetros de búsqueda
   */
  static validateSearchParams(searchTerm: string): { isValid: boolean; error?: string } {
    if (!searchTerm || typeof searchTerm !== 'string') {
      return { isValid: false, error: 'El término de búsqueda es requerido' };
    }

    if (searchTerm.trim().length < 2) {
      return { isValid: false, error: 'El término de búsqueda debe tener al menos 2 caracteres' };
    }

    if (searchTerm.length > 100) {
      return { isValid: false, error: 'El término de búsqueda no puede exceder 100 caracteres' };
    }

    return { isValid: true };
  }

  /**
   * Búsqueda básica de cursos
   */
  static async basicSearch(searchTerm: string, page: number = 1, limit: number = 30): Promise<SearchResult> {
    const offset = (page - 1) * limit;
    
    const searchConditions = this.buildSearchConditions({ searchTerm, onlyActive: true });
    const includeConditions = this.buildIncludeConditions();
    const orderConditions = this.buildOrderConditions(searchTerm);

    // Obtener el total de resultados usando findAndCountAll
    const { count: totalCount, rows: courses } = await Course.findAndCountAll({
      where: searchConditions,
      include: includeConditions,
      order: orderConditions,
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalResults: totalCount,
      searchTerm,
      appliedFilters: { searchTerm },
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        itemsPerPage: limit,
        totalResults: totalCount
      }
    };
  }

  /**
   * Búsqueda avanzada de cursos
   */
  static async advancedSearch(options: SearchOptions): Promise<SearchResult> {
    const { page = 1, limit = 30 } = options;
    const offset = (page - 1) * limit;
    
    const searchConditions = this.buildSearchConditions(options);
    const includeConditions = this.buildIncludeConditions();
    const orderConditions = this.buildOrderConditions(options.searchTerm);

    // Obtener el total de resultados usando findAndCountAll
    const { count: totalCount, rows: courses } = await Course.findAndCountAll({
      where: searchConditions,
      include: includeConditions,
      order: orderConditions,
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalResults: totalCount,
      searchTerm: options.searchTerm,
      appliedFilters: options,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        itemsPerPage: limit,
        totalResults: totalCount
      }
    };
  }

  /**
   * Búsqueda por categoría
   */
  static async searchByCategory(categoryId: number, page: number = 1, limit: number = 30): Promise<SearchResult> {
    const offset = (page - 1) * limit;
    
    const searchConditions = {
      isActive: true,
      id: {
        [Op.in]: Course.sequelize!.literal(`(
          SELECT "courseId" FROM "CourseCategories" 
          WHERE "categoryId" = ${categoryId}
        )`)
      }
    };

    const includeConditions = this.buildIncludeConditions();

    // Obtener el total de resultados usando findAndCountAll
    const { count: totalCount, rows: courses } = await Course.findAndCountAll({
      where: searchConditions,
      include: includeConditions,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalResults: totalCount,
      searchTerm: `Categoría ID: ${categoryId}`,
      appliedFilters: { categoryId },
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        itemsPerPage: limit,
        totalResults: totalCount
      }
    };
  }

  /**
   * Búsqueda por tipo de carrera
   */
  static async searchByCareerType(careerTypeId: number, page: number = 1, limit: number = 30): Promise<SearchResult> {
    const offset = (page - 1) * limit;
    
    const searchConditions = {
      isActive: true,
      careerTypeId
    };

    const includeConditions = this.buildIncludeConditions();

    // Obtener el total de resultados usando findAndCountAll
    const { count: totalCount, rows: courses } = await Course.findAndCountAll({
      where: searchConditions,
      include: includeConditions,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalResults: totalCount,
      searchTerm: `Tipo de carrera ID: ${careerTypeId}`,
      appliedFilters: { careerTypeId },
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        itemsPerPage: limit,
        totalResults: totalCount
      }
    };
  }

  /**
   * Búsqueda por rango de precios
   */
  static async searchByPriceRange(minPrice: number, maxPrice: number, page: number = 1, limit: number = 30): Promise<SearchResult> {
    const offset = (page - 1) * limit;
    
    const priceFilter: any = {};
    if (minPrice !== undefined) priceFilter[Op.gte] = minPrice;
    if (maxPrice !== undefined) priceFilter[Op.lte] = maxPrice;

    const searchConditions = {
      isActive: true,
      price: priceFilter
    };

    const includeConditions = this.buildIncludeConditions();

    // Obtener el total de resultados usando findAndCountAll
    const { count: totalCount, rows: courses } = await Course.findAndCountAll({
      where: searchConditions,
      include: includeConditions,
      order: [['price', 'ASC']],
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalResults: totalCount,
      searchTerm: `Precio: $${minPrice} - $${maxPrice}`,
      appliedFilters: { minPrice, maxPrice },
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        itemsPerPage: limit,
        totalResults: totalCount
      }
    };
  }

  /**
   * Obtiene sugerencias de búsqueda mejoradas
   */
  static async getSearchSuggestions(partialTerm: string, limit: number = 10): Promise<string[]> {
    try {
      // Usar las sugerencias inteligentes que incluyen categorías y tipos de carrera
      return await IntelligentSearchService.getIntelligentSuggestions(partialTerm, limit);
    } catch (error) {
      // Fallback a sugerencias básicas si hay error
      const courses = await Course.findAll({
        where: {
          isActive: true,
          title: {
            [Op.iLike]: `%${partialTerm}%`
          }
        },
        attributes: ['title'],
        limit,
        order: [['title', 'ASC']]
      });

      return courses.map(course => course.title);
    }
  }
}