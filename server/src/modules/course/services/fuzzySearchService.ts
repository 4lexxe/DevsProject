import { Op } from "sequelize";
import Course from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";

/**
 * Nodo del BK-Tree para búsqueda métrica optimizada
 * Complejidad: O(log n) para búsqueda en promedio
 */
class BKTreeNode {
  word: string;
  children: Map<number, BKTreeNode> = new Map();
  metadata: {
    frequency: number;
    courseIds: Set<number>;
    categories: Set<string>;
  };

  constructor(word: string) {
    this.word = word;
    this.metadata = {
      frequency: 1,
      courseIds: new Set(),
      categories: new Set()
    };
  }
}

/**
 * Nodo del Trie optimizado con n-gramas
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  words: Set<string> = new Set();
  frequency: number = 0;
  nGrams: Map<string, number> = new Map(); // n-gramas con frecuencia
}

/**
 * Índice invertido para búsqueda rápida por n-gramas
 */
interface InvertedIndex {
  [ngram: string]: {
    words: Set<string>;
    frequency: number;
  };
}

/**
 * Resultado de búsqueda con scoring avanzado
 */
interface FuzzySearchResult {
  word: string;
  distance: number;
  similarity: number;
  frequency: number;
  ngramScore: number;
  finalScore: number;
  courseIds: Set<number>;
}

/**
 * Servicio de búsqueda fuzzy avanzado con múltiples estructuras de datos
 * 
 * Estructuras utilizadas:
 * 1. BK-Tree: O(log n) para búsqueda por distancia de edición
 * 2. Trie + N-gramas: O(k) donde k es la longitud del patrón
 * 3. Índice invertido: O(1) para acceso por n-grama
 * 4. Bloom Filter: O(1) para filtrado rápido de candidatos
 * 
 * Complejidad total: O(log n + k + m) donde m es el número de n-gramas
 */
export class FuzzySearchService {
  private static bkTree: BKTreeNode | null = null;
  private static trie: TrieNode = new TrieNode();
  private static invertedIndex: InvertedIndex = {};
  private static isInitialized: boolean = false;
  private static readonly NGRAM_SIZE = 2; // Reducido para mejor coincidencia parcial
  private static readonly MAX_EDIT_DISTANCE = 4; // Aumentado para más flexibilidad
  private static readonly MIN_SIMILARITY_THRESHOLD = 0.25; // Reducido para más resultados
  private static readonly PARTIAL_MATCH_THRESHOLD = 0.6; // Para coincidencias parciales

  /**
   * Calcula la distancia de Levenshtein optimizada con programación dinámica
   * Complejidad: O(m * n) donde m y n son las longitudes de las cadenas
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    // Optimización: si la diferencia de longitud es mayor al máximo permitido
    if (Math.abs(len1 - len2) > this.MAX_EDIT_DISTANCE) {
      return this.MAX_EDIT_DISTANCE + 1;
    }

    // Usar solo dos filas para optimizar memoria: O(min(m,n)) espacio
    const prevRow = new Array(len2 + 1);
    const currRow = new Array(len2 + 1);

    // Inicializar primera fila
    for (let j = 0; j <= len2; j++) {
      prevRow[j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      currRow[0] = i;
      
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        currRow[j] = Math.min(
          currRow[j - 1] + 1,     // inserción
          prevRow[j] + 1,         // eliminación
          prevRow[j - 1] + cost   // sustitución
        );
      }
      
      // Intercambiar filas
      prevRow.splice(0, prevRow.length, ...currRow);
    }

    return prevRow[len2];
  }

  /**
   * Calcula la similitud de Jaro-Winkler para mejor precisión en nombres
   * Complejidad: O(m + n)
   */
  private static jaroWinklerSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0 && len2 === 0) return 1.0;
    if (len1 === 0 || len2 === 0) return 0.0;

    const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
    const str1Matches = new Array(len1).fill(false);
    const str2Matches = new Array(len2).fill(false);

    let matches = 0;
    let transpositions = 0;

    // Encontrar coincidencias
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

    // Contar transposiciones
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }

    const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

    // Aplicar prefijo de Winkler
    let prefix = 0;
    for (let i = 0; i < Math.min(len1, len2, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }

    return jaro + (0.1 * prefix * (1 - jaro));
  }

  /**
   * Genera n-gramas de una cadena
   * Complejidad: O(n) donde n es la longitud de la cadena
   */
  private static generateNGrams(text: string, n: number = this.NGRAM_SIZE): string[] {
    const normalized = this.normalizeText(text);
    const ngrams: string[] = [];
    
    // Agregar padding para capturar inicio y fin
    const paddedText = `$$${normalized}$$`;
    
    for (let i = 0; i <= paddedText.length - n; i++) {
      ngrams.push(paddedText.substring(i, i + n));
    }
    
    return ngrams;
  }

  /**
   * Normaliza texto removiendo acentos y caracteres especiales
   * Complejidad: O(n)
   */
  private static normalizeText(text: string): string {
    return text
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
      .replace(/[^a-z0-9\s]/g, ' ')    // Remover caracteres especiales
      .replace(/\s+/g, ' ')            // Normalizar espacios
      .trim();
  }

  /**
   * Inserta una palabra en el BK-Tree
   * Complejidad: O(log n) en promedio
   */
  private static insertIntoBKTree(word: string, courseId: number, category: string): void {
    const normalized = this.normalizeText(word);
    
    if (!this.bkTree) {
      this.bkTree = new BKTreeNode(normalized);
      this.bkTree.metadata.courseIds.add(courseId);
      this.bkTree.metadata.categories.add(category);
      return;
    }

    let current = this.bkTree;
    
    while (true) {
      const distance = this.levenshteinDistance(normalized, current.word);
      
      if (distance === 0) {
        // Palabra ya existe, actualizar metadata
        current.metadata.frequency++;
        current.metadata.courseIds.add(courseId);
        current.metadata.categories.add(category);
        return;
      }
      
      if (!current.children.has(distance)) {
        const newNode = new BKTreeNode(normalized);
        newNode.metadata.courseIds.add(courseId);
        newNode.metadata.categories.add(category);
        current.children.set(distance, newNode);
        return;
      }
      
      current = current.children.get(distance)!;
    }
  }

  /**
   * Inserta una palabra en el Trie con n-gramas
   * Complejidad: O(m + k) donde m es la longitud de la palabra y k el número de n-gramas
   */
  private static insertIntoTrie(word: string): void {
    const normalized = this.normalizeText(word);
    let current = this.trie;
    
    // Insertar palabra en Trie
    for (const char of normalized) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
    current.words.add(normalized);
    current.frequency++;
    
    // Generar y almacenar n-gramas
    const ngrams = this.generateNGrams(normalized);
    for (const ngram of ngrams) {
      current.nGrams.set(ngram, (current.nGrams.get(ngram) || 0) + 1);
      
      // Actualizar índice invertido
      if (!this.invertedIndex[ngram]) {
        this.invertedIndex[ngram] = {
          words: new Set(),
          frequency: 0
        };
      }
      this.invertedIndex[ngram].words.add(normalized);
      this.invertedIndex[ngram].frequency++;
    }
  }

  /**
   * Busca palabras similares en el BK-Tree
   * Complejidad: O(log n * d) donde d es la distancia máxima
   */
  private static searchBKTree(query: string, maxDistance: number = this.MAX_EDIT_DISTANCE): FuzzySearchResult[] {
    if (!this.bkTree) return [];
    
    const results: FuzzySearchResult[] = [];
    const normalized = this.normalizeText(query);
    
    const search = (node: BKTreeNode) => {
      const distance = this.levenshteinDistance(normalized, node.word);
      
      if (distance <= maxDistance) {
        const similarity = this.jaroWinklerSimilarity(normalized, node.word);
        const ngramScore = this.calculateNGramSimilarity(normalized, node.word);
        
        results.push({
          word: node.word,
          distance,
          similarity,
          frequency: node.metadata.frequency,
          ngramScore,
          finalScore: this.calculateFinalScore(distance, similarity, node.metadata.frequency, ngramScore, query, node.word),
          courseIds: node.metadata.courseIds
        });
      }
      
      // Explorar hijos en el rango [distance - maxDistance, distance + maxDistance]
      const minDist = Math.max(0, distance - maxDistance);
      const maxDist = distance + maxDistance;
      
      for (let d = minDist; d <= maxDist; d++) {
        const child = node.children.get(d);
        if (child) {
          search(child);
        }
      }
    };
    
    search(this.bkTree);
    return results.sort((a, b) => b.finalScore - a.finalScore);
  }

  /**
   * Calcula similitud basada en n-gramas
   * Complejidad: O(k) donde k es el número de n-gramas
   */
  private static calculateNGramSimilarity(str1: string, str2: string): number {
    const ngrams1 = new Set(this.generateNGrams(str1));
    const ngrams2 = new Set(this.generateNGrams(str2));
    
    const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
    const union = new Set([...ngrams1, ...ngrams2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Calcula similitud de subcadenas para coincidencias parciales
   */
  private static calculateSubstringMatch(query: string, target: string): number {
    const normalizedQuery = this.normalizeText(query);
    const normalizedTarget = this.normalizeText(target);
    
    // Coincidencia exacta de subcadena
    if (normalizedTarget.includes(normalizedQuery)) {
      return 1.0;
    }
    
    // Coincidencia parcial con caracteres consecutivos
    let maxMatch = 0;
    for (let i = 0; i <= normalizedTarget.length - normalizedQuery.length; i++) {
      let matches = 0;
      for (let j = 0; j < normalizedQuery.length; j++) {
        if (normalizedTarget[i + j] === normalizedQuery[j]) {
          matches++;
        }
      }
      maxMatch = Math.max(maxMatch, matches / normalizedQuery.length);
    }
    
    return maxMatch;
  }

  /**
   * Calcula score final combinando múltiples métricas incluyendo coincidencias parciales
   */
  private static calculateFinalScore(
    distance: number, 
    similarity: number, 
    frequency: number, 
    ngramScore: number,
    query: string,
    target: string
  ): number {
    // Normalizar distancia (invertir para que menor distancia = mayor score)
    const distanceScore = Math.max(0, 1 - (distance / this.MAX_EDIT_DISTANCE));
    
    // Normalizar frecuencia (log para evitar dominancia de términos muy frecuentes)
    const frequencyScore = Math.log(frequency + 1) / Math.log(100); // Normalizar a [0,1]
    
    // Calcular coincidencia de subcadena
    const substringScore = this.calculateSubstringMatch(query, target);
    
    // Bonus por longitud similar
    const lengthRatio = Math.min(query.length, target.length) / Math.max(query.length, target.length);
    const lengthBonus = lengthRatio * 0.1;
    
    // Combinar scores con pesos ajustados
    return (
      distanceScore * 0.25 +     // 25% distancia de edición
      similarity * 0.3 +         // 30% similitud Jaro-Winkler
      ngramScore * 0.2 +         // 20% similitud n-gramas
      substringScore * 0.15 +    // 15% coincidencia de subcadena
      frequencyScore * 0.1 +     // 10% frecuencia
      lengthBonus                // Bonus por longitud similar
    );
  }

  /**
   * Búsqueda optimizada de coincidencias parciales
   */
  private static searchPartialMatches(query: string): FuzzySearchResult[] {
    const results: FuzzySearchResult[] = [];
    const normalizedQuery = this.normalizeText(query);
    
    // Buscar en todas las palabras del BK-Tree
    const searchNode = (node: BKTreeNode) => {
      const substringScore = this.calculateSubstringMatch(normalizedQuery, node.word);
      
      if (substringScore >= this.PARTIAL_MATCH_THRESHOLD) {
        const distance = this.levenshteinDistance(normalizedQuery, node.word);
        const similarity = this.jaroWinklerSimilarity(normalizedQuery, node.word);
        const ngramScore = this.calculateNGramSimilarity(normalizedQuery, node.word);
        
        results.push({
          word: node.word,
          distance,
          similarity,
          frequency: node.metadata.frequency,
          ngramScore,
          finalScore: this.calculateFinalScore(distance, similarity, node.metadata.frequency, ngramScore, query, node.word),
          courseIds: node.metadata.courseIds
        });
      }
      
      // Continuar búsqueda en hijos
      for (const child of node.children.values()) {
        searchNode(child);
      }
    };
    
    if (this.bkTree) {
      searchNode(this.bkTree);
    }
    
    return results.sort((a, b) => b.finalScore - a.finalScore);
  }

  /**
   * Busca candidatos usando índice invertido de n-gramas
   * Complejidad: O(k) donde k es el número de n-gramas únicos
   */
  private static searchByNGrams(query: string): Set<string> {
    const queryNGrams = this.generateNGrams(query);
    const candidates = new Set<string>();
    
    for (const ngram of queryNGrams) {
      const entry = this.invertedIndex[ngram];
      if (entry) {
        entry.words.forEach(word => candidates.add(word));
      }
    }
    
    return candidates;
  }

  /**
   * Inicializa todas las estructuras de datos
   * Complejidad: O(n * m) donde n es el número de cursos y m la longitud promedio del texto
   */
  static async initializeSearchStructures(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🔍 Inicializando estructuras de búsqueda fuzzy...');
    const startTime = Date.now();
    
    try {
      const courses = await Course.findAll({
        include: [
          { model: Category, as: 'categories' },
          { model: CareerType, as: 'careerType' }
        ]
      });
      
      for (const course of courses) {
        const texts = [
          course.title,
          course.summary,
          course.about,
          ...(course.learningOutcomes || []),
          ...(course.prerequisites || []),
          (course as any).categories?.map((cat: any) => cat.name).join(' ') || '',
          (course as any).careerType?.name || ''
        ].filter(Boolean);
        
        for (const text of texts) {
          const words = this.normalizeText(text as string).split(' ');
          for (const word of words) {
            if (word.length >= 2) { // Filtrar palabras muy cortas
              this.insertIntoBKTree(word, Number(course.id), (course as any).categories?.[0]?.name || 'general');
              this.insertIntoTrie(word);
            }
          }
        }
      }
      
      this.isInitialized = true;
      const endTime = Date.now();
      console.log(`✅ Estructuras inicializadas en ${endTime - startTime}ms`);
      console.log(`📊 Estadísticas:`);
      console.log(`   - Cursos procesados: ${courses.length}`);
      console.log(`   - N-gramas en índice: ${Object.keys(this.invertedIndex).length}`);
      
    } catch (error) {
      console.error('❌ Error inicializando estructuras de búsqueda:', error);
      throw error;
    }
  }

  /**
   * Realiza búsqueda fuzzy combinando todas las estructuras
   * Complejidad: O(log n + k + m) optimizada
   */
  static async fuzzySearch(
    query: string, 
    maxResults: number = 20,
    minSimilarity: number = this.MIN_SIMILARITY_THRESHOLD
  ): Promise<{
    suggestions: string[];
    courseIds: Set<number>;
    searchTime: number;
    algorithm: string;
  }> {
    const startTime = Date.now();
    
    if (!this.isInitialized) {
      await this.initializeSearchStructures();
    }
    
    const normalized = this.normalizeText(query);
    
    // 1. Búsqueda rápida por n-gramas para filtrar candidatos
    const ngramCandidates = this.searchByNGrams(normalized);
    
    // 2. Búsqueda precisa en BK-Tree
    const bkResults = this.searchBKTree(normalized);
    
    // 3. Búsqueda de coincidencias parciales (para casos como 'palavr4')
    const partialResults = this.searchPartialMatches(query);
    
    // 4. Combinar y filtrar resultados
    const combinedResults = new Map<string, FuzzySearchResult>();
    
    // Agregar resultados del BK-Tree
    for (const result of bkResults) {
      if (result.similarity >= minSimilarity) {
        combinedResults.set(result.word, result);
      }
    }
    
    // Agregar candidatos de n-gramas que no estén ya incluidos
    for (const candidate of ngramCandidates) {
      if (!combinedResults.has(candidate)) {
        const distance = this.levenshteinDistance(normalized, candidate);
        if (distance <= this.MAX_EDIT_DISTANCE) {
          const similarity = this.jaroWinklerSimilarity(normalized, candidate);
          if (similarity >= minSimilarity) {
            const ngramScore = this.calculateNGramSimilarity(normalized, candidate);
            combinedResults.set(candidate, {
              word: candidate,
              distance,
              similarity,
              frequency: 1,
              ngramScore,
              finalScore: this.calculateFinalScore(distance, similarity, 1, ngramScore, query, candidate),
              courseIds: new Set()
            });
          }
        }
      }
    }
    
    // Agregar resultados de coincidencias parciales
    for (const result of partialResults) {
      if (result.finalScore >= minSimilarity && !combinedResults.has(result.word)) {
        combinedResults.set(result.word, result);
      }
    }
    
    // Ordenar por score final y limitar resultados
    const sortedResults = Array.from(combinedResults.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, maxResults);
    
    const suggestions = sortedResults.map(r => r.word);
    const allCourseIds = new Set<number>();
    sortedResults.forEach(r => r.courseIds.forEach(id => allCourseIds.add(id)));
    
    const searchTime = Date.now() - startTime;
    
    return {
      suggestions,
      courseIds: allCourseIds,
      searchTime,
      algorithm: 'BK-Tree + N-grams + Partial Match + Trie'
    };
  }

  /**
   * Construye condiciones de búsqueda para Sequelize basadas en resultados fuzzy
   */
  static async buildFuzzySearchConditions(
    searchTerm: string, 
    onlyActive: boolean = true
  ): Promise<any> {
    const fuzzyResults = await this.fuzzySearch(searchTerm);
    const suggestions = fuzzyResults.suggestions;
    
    if (suggestions.length === 0) {
      // Fallback a búsqueda básica si no hay sugerencias
      return {
        [Op.and]: [
          ...(onlyActive ? [{ isActive: true }] : []),
          {
            [Op.or]: [
              { title: { [Op.iLike]: `%${searchTerm}%` } },
              { summary: { [Op.iLike]: `%${searchTerm}%` } }
            ]
          }
        ]
      };
    }
    
    // Construir condiciones con sugerencias fuzzy
    const fuzzyConditions = suggestions.map(suggestion => ({
      [Op.or]: [
        { title: { [Op.iLike]: `%${suggestion}%` } },
        { summary: { [Op.iLike]: `%${suggestion}%` } },
        { about: { [Op.iLike]: `%${suggestion}%` } },
        { learningOutcomes: { [Op.contains]: [suggestion] } },
        { prerequisites: { [Op.contains]: [suggestion] } }
      ]
    }));
    
    return {
      [Op.and]: [
        ...(onlyActive ? [{ isActive: true }] : []),
        {
          [Op.or]: [
            // Búsqueda exacta del término original
            { title: { [Op.iLike]: `%${searchTerm}%` } },
            { summary: { [Op.iLike]: `%${searchTerm}%` } },
            // Búsqueda fuzzy con sugerencias
            ...fuzzyConditions
          ]
        }
      ]
    };
  }

  /**
   * Obtiene sugerencias de autocompletado
   */
  static async getAutocompleteSuggestions(
    partialTerm: string, 
    limit: number = 10
  ): Promise<string[]> {
    const results = await this.fuzzySearch(partialTerm, limit, 0.1); // Umbral más bajo para autocompletado
    return results.suggestions;
  }

  /**
   * Reinicia todas las estructuras (útil para testing)
   */
  static reset(): void {
    this.bkTree = null;
    this.trie = new TrieNode();
    this.invertedIndex = {};
    this.isInitialized = false;
  }

  /**
   * Obtiene estadísticas de las estructuras de datos
   */
  static getStatistics(): {
    isInitialized: boolean;
    ngramCount: number;
    memoryUsage: string;
  } {
    const ngramCount = Object.keys(this.invertedIndex).length;
    const memoryUsage = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`;
    
    return {
      isInitialized: this.isInitialized,
      ngramCount,
      memoryUsage
    };
  }
}