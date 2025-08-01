import { Op } from "sequelize";
import Course from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";

/**
 * Nodo del Trie para indexación rápida de palabras
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  words: string[] = []; // Palabras completas que terminan en este nodo
  frequency: number = 0;
}

/**
 * Servicio de búsqueda inteligente con Trie + Levenshtein
 * - Indexación rápida con Trie
 * - Corrección de errores tipográficos con Levenshtein
 * - Búsqueda por similitud con PostgreSQL pg_trgm
 */
export class IntelligentSearchService {
  private static trie: TrieNode = new TrieNode();
  private static isInitialized: boolean = false;

  /**
   * Normaliza el texto de búsqueda
   */
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s]/g, ' ') // Remover caracteres especiales
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  /**
   * Calcula la distancia de Levenshtein entre dos strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Inicializar matriz
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    // Llenar matriz
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitución
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j] + 1      // eliminación
          );
        }
      }
    }

    return matrix[len2][len1];
  }

  /**
   * Inserta una palabra en el Trie
   */
  private static insertIntoTrie(word: string, originalText: string): void {
    const normalizedWord = this.normalizeText(word);
    let current = this.trie;

    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    if (!current.words.includes(originalText)) {
      current.words.push(originalText);
    }
    current.frequency++;
  }

  /**
   * Busca palabras similares en el Trie usando Levenshtein
   */
  private static searchSimilarInTrie(word: string, maxDistance: number = 2): string[] {
    const normalizedWord = this.normalizeText(word);
    const results: { word: string; distance: number; frequency: number }[] = [];

    const dfs = (node: TrieNode, currentWord: string, distance: number) => {
      // Si la distancia ya es mayor al máximo, no continuar
      if (distance > maxDistance) return;

      // Si es final de palabra, calcular distancia exacta
      if (node.isEndOfWord) {
        const exactDistance = this.levenshteinDistance(normalizedWord, currentWord);
        if (exactDistance <= maxDistance) {
          for (const originalWord of node.words) {
            results.push({
              word: originalWord,
              distance: exactDistance,
              frequency: node.frequency
            });
          }
        }
      }

      // Continuar explorando hijos
      for (const [char, childNode] of node.children) {
        dfs(childNode, currentWord + char, distance);
      }
    };

    dfs(this.trie, '', 0);

    // Ordenar por distancia y frecuencia
    return results
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return b.frequency - a.frequency;
      })
      .map(r => r.word)
      .slice(0, 10); // Limitar resultados
  }

  /**
   * Inicializa el Trie con datos de la base de datos
   */
  static async initializeTrie(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Cargar títulos de cursos
      const courses = await Course.findAll({
        where: { isActive: true },
        attributes: ['title', 'summary']
      });

      for (const course of courses) {
        // Indexar título completo
        this.insertIntoTrie(course.title, course.title);
        
        // Indexar palabras individuales del título
        const titleWords = course.title.split(' ').filter(word => word.length > 2);
        for (const word of titleWords) {
          this.insertIntoTrie(word, course.title);
        }

        // Indexar palabras del resumen si existe
        if (course.summary) {
          const summaryWords = course.summary.split(' ').filter(word => word.length > 3);
          for (const word of summaryWords) {
            this.insertIntoTrie(word, course.title);
          }
        }
      }

      // Cargar categorías
      const categories = await Category.findAll({
        attributes: ['name', 'description']
      });

      for (const category of categories) {
        this.insertIntoTrie(category.name, category.name);
        if (category.description) {
          const descWords = category.description.split(' ').filter(word => word.length > 3);
          for (const word of descWords) {
            this.insertIntoTrie(word, category.name);
          }
        }
      }

      // Cargar tipos de carrera
      const careerTypes = await CareerType.findAll({
        attributes: ['name', 'description']
      });

      for (const careerType of careerTypes) {
        this.insertIntoTrie(careerType.name, careerType.name);
        if (careerType.description) {
          const descWords = careerType.description.split(' ').filter(word => word.length > 3);
          for (const word of descWords) {
            this.insertIntoTrie(word, careerType.name);
          }
        }
      }

      this.isInitialized = true;
      console.log('Trie inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Trie:', error);
    }
  }

  /**
   * Detecta qué quiso escribir el usuario usando Trie + Levenshtein
   */
  static async detectIntention(searchTerm: string): Promise<string[]> {
    await this.initializeTrie();
    
    const normalizedTerm = this.normalizeText(searchTerm);
    const words = normalizedTerm.split(' ').filter(word => word.length > 1);
    const suggestions: string[] = [];

    // Buscar cada palabra con corrección de errores
    for (const word of words) {
      const maxDistance = Math.max(1, Math.floor(word.length * 0.3)); // 30% de la longitud
      const similarWords = this.searchSimilarInTrie(word, maxDistance);
      suggestions.push(...similarWords);
    }

    // Buscar el término completo
    const maxDistanceComplete = Math.max(2, Math.floor(normalizedTerm.length * 0.2));
    const completeSuggestions = this.searchSimilarInTrie(normalizedTerm, maxDistanceComplete);
    suggestions.push(...completeSuggestions);

    // Remover duplicados y retornar
    return [...new Set(suggestions)].slice(0, 10);
  }

  /**
   * Construye condiciones de búsqueda usando PostgreSQL similarity (pg_trgm)
   */
  static buildSimilaritySearchConditions(searchTerm: string, onlyActive: boolean = true): any {
    const normalizedTerm = this.normalizeText(searchTerm);
    
    const baseConditions: any = {
      [Op.and]: [
        ...(onlyActive ? [{ isActive: true }] : []),
        {
          [Op.or]: [
            // Búsqueda exacta tradicional
            { title: { [Op.iLike]: `%${normalizedTerm}%` } },
            { summary: { [Op.iLike]: `%${normalizedTerm}%` } },
            { about: { [Op.iLike]: `%${normalizedTerm}%` } },
            
            // Búsqueda por similitud usando pg_trgm (si está disponible)
            Course.sequelize!.literal(`similarity("title", '${normalizedTerm}') > 0.3`),
            Course.sequelize!.literal(`similarity("summary", '${normalizedTerm}') > 0.2`),
            
            // Búsqueda en CareerType con similitud
            {
              careerTypeId: {
                [Op.in]: Course.sequelize!.literal(`(
                  SELECT id FROM "CareerTypes" 
                  WHERE "name" ILIKE '%${normalizedTerm}%' 
                  OR "description" ILIKE '%${normalizedTerm}%'
                  OR similarity("name", '${normalizedTerm}') > 0.3
                )`)
              }
            },
            
            // Búsqueda en Categories con similitud
            {
              id: {
                [Op.in]: Course.sequelize!.literal(`(
                  SELECT "courseId" FROM "CourseCategories" cc
                  JOIN "Categories" c ON cc."categoryId" = c.id
                  WHERE c."name" ILIKE '%${normalizedTerm}%' 
                  OR c."description" ILIKE '%${normalizedTerm}%'
                  OR similarity(c."name", '${normalizedTerm}') > 0.3
                )`)
              }
            }
          ]
        }
      ]
    };

    return baseConditions;
  }

  /**
   * Construye condiciones de búsqueda inteligente usando pg_trgm para similitud
   */
  static buildIntelligentSearchConditions(searchTerm: string, onlyActive: boolean = true): any {
    const searchConditions: any[] = [];
    const words = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    // Búsqueda por similitud usando pg_trgm con umbral más bajo para errores tipográficos
    searchConditions.push(
      Course.sequelize!.literal(`similarity(title, '${searchTerm}') > 0.2`),
      Course.sequelize!.literal(`similarity(summary, '${searchTerm}') > 0.2`),
      Course.sequelize!.literal(`similarity(about, '${searchTerm}') > 0.2`)
    );
    
    // Búsqueda por palabras individuales con similitud
    for (const word of words) {
      searchConditions.push(
        Course.sequelize!.literal(`similarity(title, '${word}') > 0.2`),
        Course.sequelize!.literal(`similarity(summary, '${word}') > 0.2`),
        Course.sequelize!.literal(`similarity(about, '${word}') > 0.2`)
      );
    }
    
    // Búsqueda tradicional como fallback
    searchConditions.push(
      { title: { [Op.iLike]: `%${searchTerm}%` } },
      { summary: { [Op.iLike]: `%${searchTerm}%` } },
      { about: { [Op.iLike]: `%${searchTerm}%` } }
    );
    
    // Búsqueda en CareerType con similitud mejorada
    searchConditions.push({
      careerTypeId: {
        [Op.in]: Course.sequelize!.literal(`(
          SELECT id FROM "CareerTypes" 
          WHERE similarity("name", '${searchTerm}') > 0.2
          OR similarity("description", '${searchTerm}') > 0.2
          OR "name" ILIKE '%${searchTerm}%' 
          OR "description" ILIKE '%${searchTerm}%'
        )`)
      }
    });
    
    // Búsqueda por palabras individuales en CareerType
    for (const word of words) {
      searchConditions.push({
        careerTypeId: {
          [Op.in]: Course.sequelize!.literal(`(
            SELECT id FROM "CareerTypes" 
            WHERE similarity("name", '${word}') > 0.2
            OR similarity("description", '${word}') > 0.2
          )`)
        }
      });
    }

    // Búsqueda en Categories con similitud mejorada
    searchConditions.push({
      id: {
        [Op.in]: Course.sequelize!.literal(`(
          SELECT "courseId" FROM "CourseCategories" cc
          JOIN "Categories" c ON cc."categoryId" = c.id
          WHERE similarity(c."name", '${searchTerm}') > 0.2
          OR similarity(c."description", '${searchTerm}') > 0.2
          OR c."name" ILIKE '%${searchTerm}%' 
          OR c."description" ILIKE '%${searchTerm}%'
        )`)
      }
    });
    
    // Búsqueda por palabras individuales en Categories
    for (const word of words) {
      searchConditions.push({
        id: {
          [Op.in]: Course.sequelize!.literal(`(
            SELECT "courseId" FROM "CourseCategories" cc
            JOIN "Categories" c ON cc."categoryId" = c.id
            WHERE similarity(c."name", '${word}') > 0.2
            OR similarity(c."description", '${word}') > 0.2
          )`)
        }
      });
    }

    const baseConditions: any = {
      [Op.and]: [
        ...(onlyActive ? [{ isActive: true }] : []),
        {
          [Op.or]: searchConditions
        }
      ]
    };

    return baseConditions;
  }

  /**
   * Calcula un score de relevancia mejorado
   */
  static calculateRelevanceScore(course: any, originalSearchTerm: string): number {
    const normalizedSearch = this.normalizeText(originalSearchTerm);
    const normalizedTitle = this.normalizeText(course.title || '');
    const normalizedSummary = this.normalizeText(course.summary || '');
    
    let score = 0;

    // Coincidencia exacta en título (máxima puntuación)
    if (normalizedTitle.includes(normalizedSearch)) {
      score += 100;
    }

    // Coincidencia al inicio del título
    if (normalizedTitle.startsWith(normalizedSearch)) {
      score += 50;
    }

    // Coincidencia en resumen
    if (normalizedSummary.includes(normalizedSearch)) {
      score += 25;
    }

    // Puntuación por similitud usando Levenshtein
    const titleDistance = this.levenshteinDistance(normalizedSearch, normalizedTitle);
    const maxLength = Math.max(normalizedSearch.length, normalizedTitle.length);
    const similarity = 1 - (titleDistance / maxLength);
    score += similarity * 30;

    // Puntuación por palabras individuales
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 2);
    for (const word of searchWords) {
      if (normalizedTitle.includes(word)) score += 10;
      if (normalizedSummary.includes(word)) score += 5;
    }

    return Math.max(0, score);
  }

  /**
   * Ordena los resultados por relevancia
   */
  static sortByRelevance(courses: any[], originalSearchTerm: string): any[] {
    return courses
      .map(course => ({
        ...course,
        relevanceScore: this.calculateRelevanceScore(course, originalSearchTerm)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Obtiene sugerencias inteligentes usando Trie + detección de intención
   */
  static async getIntelligentSuggestions(partialTerm: string, limit: number = 10): Promise<string[]> {
    try {
      // Inicializar Trie si no está inicializado
      await this.initializeTrie();
      
      // Detectar intenciones
      const intentions = await this.detectIntention(partialTerm);
      
      if (intentions.length > 0) {
        return intentions.slice(0, limit);
      }

      // Fallback a búsqueda tradicional
      const normalizedTerm = this.normalizeText(partialTerm);
      const suggestions: string[] = [];

      // Sugerencias de títulos de cursos
      const courses = await Course.findAll({
        where: {
          isActive: true,
          title: { [Op.iLike]: `%${normalizedTerm}%` }
        },
        attributes: ['title'],
        limit: Math.floor(limit * 0.4),
        order: [['title', 'ASC']]
      });

      suggestions.push(...courses.map(course => course.title));

      // Sugerencias de categorías
      const categories = await Category.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${normalizedTerm}%` } },
            { description: { [Op.iLike]: `%${normalizedTerm}%` } }
          ]
        },
        attributes: ['name'],
        limit: Math.floor(limit * 0.3),
        order: [['name', 'ASC']]
      });

      suggestions.push(...categories.map(category => category.name));

      // Sugerencias de tipos de carrera
      const careerTypes = await CareerType.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${normalizedTerm}%` } },
            { description: { [Op.iLike]: `%${normalizedTerm}%` } }
          ]
        },
        attributes: ['name'],
        limit: Math.floor(limit * 0.3),
        order: [['name', 'ASC']]
      });

      suggestions.push(...careerTypes.map(careerType => careerType.name));

      return [...new Set(suggestions)].slice(0, limit);

    } catch (error) {
      console.error('Error al obtener sugerencias inteligentes:', error);
      return [];
    }
  }

  /**
   * Reinicia el Trie (útil para actualizaciones)
   */
  static resetTrie(): void {
    this.trie = new TrieNode();
    this.isInitialized = false;
  }
}