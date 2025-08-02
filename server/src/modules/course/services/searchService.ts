import { Op, Order } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Course from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import { IntelligentSearchService } from "./intelligentSearchService";
import { FuzzySearchService } from "./fuzzySearchService";

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
  useFuzzySearch?: boolean;
  fuzzyThreshold?: number;
}

export interface SearchResult {
  courses: any[];
  totalResults: number;
  searchTerm: string;
  appliedFilters: Partial<SearchOptions>;
  searchMetadata?: {
    algorithm: string;
    searchTime: number;
    suggestions?: string[];
    fuzzyMatches?: boolean;
  };
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
   * Realiza búsqueda unificada que combina todas las técnicas de forma transparente
   */
  static async advancedSearch(options: SearchOptions): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      return await this.unifiedSearch(options, startTime);
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
      throw new Error('Error interno del servidor durante la búsqueda');
    }
  }

  /**
   * Búsqueda unificada que aplica normalización, tokenización y corrección automática
   */
  private static async unifiedSearch(options: SearchOptions, startTime: number): Promise<SearchResult> {
    const { searchTerm, page = 1, limit = 10 } = options;
    
    if (!searchTerm?.trim()) {
      return this.getAllCourses(options);
    }

    // 1. Normalizar el texto del usuario
    const normalizedTerm = this.normalizeSearchTerm(searchTerm);
    
    // 2. Tokenizar por palabras
    const tokens = this.tokenizeSearchTerm(normalizedTerm);
    
    // 3. Aplicar corrección fuzzy silenciosa a cada token
    const correctedTokens = await this.applySilentFuzzyCorrection(tokens);
    
    // 4. Construir condiciones de búsqueda unificada
    const searchConditions = this.buildUnifiedSearchConditions(tokens, correctedTokens, options);
    
    // 5. Ejecutar búsqueda con puntuación
    const result = await this.executeUnifiedSearch(searchConditions, options);
    
    return {
      ...result,
      searchMetadata: {
        algorithm: 'Unified Search (Traditional + Intelligent + Fuzzy)',
        searchTime: Date.now() - startTime,
        suggestions: [], // No mostramos sugerencias al usuario
        fuzzyMatches: correctedTokens.some(token => token.wasCorrected)
      }
    };
  }

  /**
   * Normaliza el término de búsqueda eliminando acentos, caracteres especiales y aplicando reemplazos comunes
   */
  private static normalizeSearchTerm(term: string): string {
    const commonReplacements: { [key: string]: string } = {
      'c++': 'cplus',
      'c#': 'csharp',
      'node.js': 'nodejs',
      'node js': 'nodejs',
      'react.js': 'reactjs',
      'vue.js': 'vuejs',
      'angular.js': 'angularjs',
      '.net': 'dotnet',
      'machine learning': 'machinelearning',
      'data science': 'datascience',
      'web development': 'webdevelopment',
      'full stack': 'fullstack'
    };

    let normalized = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/g, (match) => {
        const accents: {[key: string]: string} = {
          'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae',
          'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i',
          'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o',
          'õ': 'o', 'ö': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
          'ý': 'y', 'þ': 'th', 'ÿ': 'y'
        };
        return accents[match] || match;
      })
      .replace(/[^a-z0-9\s]/g, ' ') // Remover caracteres especiales
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();

    // Aplicar reemplazos comunes
    for (const [original, replacement] of Object.entries(commonReplacements)) {
      // Escapar caracteres especiales de regex
      const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      normalized = normalized.replace(new RegExp(escapedOriginal, 'gi'), replacement);
    }

    return normalized;
  }

  /**
   * Tokeniza el término de búsqueda en palabras individuales
   */
  private static tokenizeSearchTerm(term: string): string[] {
    return term
      .split(' ')
      .filter(token => token.length >= 2) // Filtrar tokens muy cortos
      .slice(0, 10); // Limitar número de tokens para rendimiento
  }

  /**
   * Aplica corrección fuzzy silenciosa a cada token
   */
  private static async applySilentFuzzyCorrection(tokens: string[]): Promise<Array<{original: string, corrected: string, wasCorrected: boolean}>> {
    const correctedTokens = [];
    
    for (const token of tokens) {
      try {
        // Intentar corrección fuzzy
        const fuzzyResult = await FuzzySearchService.fuzzySearch(token, 5, 0.7);
        
        if (fuzzyResult.suggestions.length > 0) {
          const bestSuggestion = fuzzyResult.suggestions[0];
          // Solo aplicar corrección si la similitud es alta
          if (this.calculateSimilarity(token, bestSuggestion) >= 0.8) {
            correctedTokens.push({
              original: token,
              corrected: bestSuggestion,
              wasCorrected: true
            });
            continue;
          }
        }
      } catch (error) {
        console.warn(`Error en corrección fuzzy para token '${token}':`, error);
      }
      
      // Si no hay corrección, usar el token original
      correctedTokens.push({
        original: token,
        corrected: token,
        wasCorrected: false
      });
    }
    
    return correctedTokens;
  }

  /**
   * Calcula similitud entre dos strings usando Jaro-Winkler
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0 || len2 === 0) return 0.0;
    
    const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
    if (matchWindow < 0) return 0.0;
    
    const str1Matches = new Array(len1).fill(false);
    const str2Matches = new Array(len2).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // Identificar coincidencias
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchWindow);
      const end = Math.min(i + matchWindow + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (str2Matches[j] || str1[i] !== str2[j]) continue;
        str1Matches[i] = true;
        str2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0.0;
    
    // Calcular transposiciones
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    
    const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
    
    // Aplicar prefijo Winkler
    let prefix = 0;
    for (let i = 0; i < Math.min(len1, len2, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }
    
    return jaro + (0.1 * prefix * (1 - jaro));
  }

  /**
    * Construye condiciones de búsqueda unificada combinando tokens originales y corregidos
    */
   private static buildUnifiedSearchConditions(
     originalTokens: string[], 
     correctedTokens: Array<{original: string, corrected: string, wasCorrected: boolean}>,
     options: SearchOptions
   ): any {
     const { onlyActive = true } = options;
     
     // Combinar todos los tokens (originales y corregidos) para búsqueda amplia
     const allTokens = new Set<string>();
     
     originalTokens.forEach(token => allTokens.add(token));
     correctedTokens.forEach(({corrected}) => allTokens.add(corrected));
     
     const tokenArray = Array.from(allTokens);
     
     // Construir condiciones OR para cada token en múltiples campos
     const tokenConditions = tokenArray.map(token => ({
       [Op.or]: [
         // Búsqueda en título (prioridad alta)
         { title: { [Op.iLike]: `%${token}%` } },
         // Búsqueda en resumen (prioridad media)
         { summary: { [Op.iLike]: `%${token}%` } },
         // Búsqueda en descripción (prioridad media)
         { about: { [Op.iLike]: `%${token}%` } },
         // Búsqueda en outcomes de aprendizaje
         { learningOutcomes: { [Op.contains]: [token] } },
         // Búsqueda en prerrequisitos
         { prerequisites: { [Op.contains]: [token] } },
         // Búsqueda en categorías usando subquery
           {
             id: {
               [Op.in]: sequelize.literal(`(
                 SELECT DISTINCT cc."courseId" 
                 FROM "CourseCategories" cc 
                 INNER JOIN "Categories" cat ON cc."categoryId" = cat.id 
                 WHERE cat.name ILIKE '%${token}%' OR cat.description ILIKE '%${token}%'
               )`)
             }
           },
           // Búsqueda en tipos de carrera usando subquery
           {
             id: {
               [Op.in]: sequelize.literal(`(
                 SELECT DISTINCT c.id 
                 FROM "Courses" c 
                 INNER JOIN "CareerTypes" ct ON c."careerTypeId" = ct.id 
                 WHERE ct.name ILIKE '%${token}%' OR ct.description ILIKE '%${token}%'
               )`)
             }
           }
       ]
     }));
     
     const baseConditions: any = {
       [Op.and]: [
         // Al menos uno de los tokens debe coincidir
         { [Op.or]: tokenConditions }
       ]
     };
     
     // Agregar filtro de cursos activos si se especifica
     if (onlyActive) {
       baseConditions[Op.and].push({ isActive: true });
     }
     
     // Agregar filtros adicionales específicos
      if (options.categoryId) {
        baseConditions[Op.and].push({ 
          id: {
            [Op.in]: sequelize.literal(`(
              SELECT "courseId" FROM "CourseCategories" 
              WHERE "categoryId" = ${options.categoryId}
            )`)
          }
        });
      }
     
     if (options.careerTypeId) {
       baseConditions[Op.and].push({ careerTypeId: options.careerTypeId });
     }
     
     if (options.minPrice !== undefined || options.maxPrice !== undefined) {
       const priceFilter: any = {};
       if (options.minPrice !== undefined) priceFilter[Op.gte] = options.minPrice;
       if (options.maxPrice !== undefined) priceFilter[Op.lte] = options.maxPrice;
       baseConditions[Op.and].push({ price: priceFilter });
     }
     
     return baseConditions;
   }
   
   /**
    * Ejecuta la búsqueda unificada con puntuación y ordenamiento
    */
   private static async executeUnifiedSearch(
     searchConditions: any, 
     options: SearchOptions
   ): Promise<Omit<SearchResult, 'searchMetadata'>> {
     const { page = 1, limit = 10, searchTerm } = options;
     const offset = (page - 1) * limit;
     
     try {
       const { count: totalCount, rows: courses } = await Course.findAndCountAll({
         where: searchConditions,
         include: this.buildIncludeConditions(),
         order: this.buildOrderConditions(searchTerm),
         limit,
         offset,
         distinct: true
       });
       
       // Calcular puntuación de relevancia para cada curso
       const scoredCourses = this.calculateRelevanceScores(courses, searchTerm || '');
       
       const totalPages = Math.ceil(totalCount / limit);
       
       return {
         courses: scoredCourses,
         totalResults: totalCount,
         searchTerm: searchTerm || '',
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
     } catch (error) {
       console.error('Error ejecutando búsqueda unificada:', error);
       throw error;
     }
   }
   
   /**
    * Calcula puntuación de relevancia para ordenar resultados
    */
   private static calculateRelevanceScores(courses: any[], searchTerm: string): any[] {
     if (!searchTerm.trim()) return courses;
     
     const normalizedSearchTerm = this.normalizeSearchTerm(searchTerm);
     const searchTokens = this.tokenizeSearchTerm(normalizedSearchTerm);
     
     return courses.map(course => {
       let score = 0;
       
       // Construir texto completo del curso incluyendo relaciones
       const categoryNames = (course.categories || []).map((cat: any) => cat.name || '').join(' ');
       const categoryDescriptions = (course.categories || []).map((cat: any) => cat.description || '').join(' ');
       const careerTypeName = course.careerType?.name || '';
       const careerTypeDescription = course.careerType?.description || '';
       
       const courseText = [
         course.title || '',
         course.summary || '',
         course.about || '',
         ...(course.learningOutcomes || []),
         ...(course.prerequisites || []),
         categoryNames,
         categoryDescriptions,
         careerTypeName,
         careerTypeDescription
       ].join(' ').toLowerCase();
       
       // Puntuación por coincidencias en título (peso alto)
       const titleMatches = searchTokens.filter(token => 
         (course.title || '').toLowerCase().includes(token)
       ).length;
       score += titleMatches * 10;
       
       // Puntuación por coincidencias en resumen (peso medio-alto)
       const summaryMatches = searchTokens.filter(token => 
         (course.summary || '').toLowerCase().includes(token)
       ).length;
       score += summaryMatches * 7;
       
       // Puntuación por coincidencias en categorías (peso medio)
       const categoryMatches = searchTokens.filter(token => 
         categoryNames.toLowerCase().includes(token) || categoryDescriptions.toLowerCase().includes(token)
       ).length;
       score += categoryMatches * 6;
       
       // Puntuación por coincidencias en tipo de carrera (peso medio)
       const careerTypeMatches = searchTokens.filter(token => 
         careerTypeName.toLowerCase().includes(token) || careerTypeDescription.toLowerCase().includes(token)
       ).length;
       score += careerTypeMatches * 5;
       
       // Puntuación por coincidencias en descripción (peso bajo)
       const aboutMatches = searchTokens.filter(token => 
         (course.about || '').toLowerCase().includes(token)
       ).length;
       score += aboutMatches * 3;
       
       // Puntuación por coincidencias en outcomes y prerrequisitos (peso bajo)
       const learningMatches = searchTokens.filter(token => 
         (course.learningOutcomes || []).join(' ').toLowerCase().includes(token) ||
         (course.prerequisites || []).join(' ').toLowerCase().includes(token)
       ).length;
       score += learningMatches * 2;
       
       // Bonus por coincidencia exacta de la frase completa
       if (courseText.includes(normalizedSearchTerm)) {
         score += 20;
       }
       
       return { ...course.toJSON(), relevanceScore: score };
     }).sort((a, b) => b.relevanceScore - a.relevanceScore);
   }
   
   /**
    * Obtiene todos los cursos cuando no hay término de búsqueda
    */
   private static async getAllCourses(options: SearchOptions): Promise<SearchResult> {
     const { page = 1, limit = 10, onlyActive = true } = options;
     const offset = (page - 1) * limit;
     
     const whereConditions: any = {};
     if (onlyActive) {
       whereConditions.isActive = true;
     }
     
     // Agregar otros filtros
     const additionalFilters = this.buildSearchConditions(options);
     Object.assign(whereConditions, additionalFilters);
     
     const { count: totalCount, rows: courses } = await Course.findAndCountAll({
       where: whereConditions,
       include: this.buildIncludeConditions(),
       order: [['createdAt', 'DESC']],
       limit,
       offset,
       distinct: true
     });
     
     const totalPages = Math.ceil(totalCount / limit);
     
     return {
       courses,
       totalResults: totalCount,
       searchTerm: '',
       appliedFilters: options,
       searchMetadata: {
         algorithm: 'All Courses',
         searchTime: 0,
         suggestions: [],
         fuzzyMatches: false
       },
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
   * Búsqueda fuzzy avanzada con corrección de errores tipográficos
   */
  static async fuzzySearch(options: SearchOptions): Promise<SearchResult> {
    const { searchTerm, page = 1, limit = 30, onlyActive = true, fuzzyThreshold = 0.3 } = options;
    const offset = (page - 1) * limit;
    const startTime = Date.now();

    try {
      // Inicializar estructuras de búsqueda fuzzy si es necesario
      await FuzzySearchService.initializeSearchStructures();

      // Obtener condiciones de búsqueda fuzzy
      const searchConditions = await FuzzySearchService.buildFuzzySearchConditions(searchTerm, onlyActive);
      
      // Agregar filtros adicionales
      const additionalConditions = this.buildSearchConditions(options);
      const finalConditions = {
        [Op.and]: [
          searchConditions,
          ...Object.keys(additionalConditions).map(key => ({ [key]: additionalConditions[key] }))
        ]
      };

      // Realizar búsqueda con paginación
      const { count: totalCount, rows: courses } = await Course.findAndCountAll({
        where: finalConditions,
        include: this.buildIncludeConditions(),
        order: this.buildOrderConditions(searchTerm),
        limit,
        offset,
        distinct: true
      });

      // Obtener sugerencias fuzzy para metadata
      const fuzzyResults = await FuzzySearchService.fuzzySearch(searchTerm, 10, fuzzyThreshold);
      const searchTime = Date.now() - startTime;

      return {
        courses,
        totalResults: totalCount,
        searchTerm,
        appliedFilters: options,
        searchMetadata: {
          algorithm: fuzzyResults.algorithm,
          searchTime: searchTime,
          suggestions: fuzzyResults.suggestions,
          fuzzyMatches: fuzzyResults.suggestions.length > 0
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1,
          itemsPerPage: limit,
          totalResults: totalCount
        }
      };
    } catch (error) {
      console.error('Error en búsqueda fuzzy:', error);
      // Fallback a búsqueda básica
      return await this.basicSearch(searchTerm, page, limit);
    }
  }

  /**
   * Obtiene sugerencias de búsqueda mejoradas con fuzzy search
   */
  static async getSearchSuggestions(partialTerm: string, limit: number = 10): Promise<string[]> {
    try {
      // Intentar primero con fuzzy search
      const fuzzyResults = await FuzzySearchService.getAutocompleteSuggestions(partialTerm, limit);
      if (fuzzyResults.length > 0) {
        return fuzzyResults;
      }
      
      // Fallback a sugerencias inteligentes
      return await IntelligentSearchService.getIntelligentSuggestions(partialTerm, limit);
    } catch (error) {
      // Fallback final a sugerencias básicas
      const courses = await Course.findAll({
        where: {
          isActive: true,
          title: {
            [Op.iLike]: `%${partialTerm}%`
          }
        },
        limit,
        attributes: ['title']
      });
      
      return courses.map(course => course.title);
    }
  }

  /**
   * Obtiene estadísticas de rendimiento de búsqueda
   */
  static getSearchStatistics(): any {
    return FuzzySearchService.getStatistics();
  }
}