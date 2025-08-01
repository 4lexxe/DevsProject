-- Script para habilitar la extensión pg_trgm en PostgreSQL
-- Esta extensión permite búsquedas por similitud para corrección ortográfica

-- 1. Habilitar la extensión pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Verificar que la extensión esté instalada
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- 3. Crear índices GIN para mejorar el rendimiento de las búsquedas por similitud
-- Índices en la tabla Courses
CREATE INDEX IF NOT EXISTS idx_courses_title_gin ON "Courses" USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_courses_summary_gin ON "Courses" USING gin (summary gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_courses_about_gin ON "Courses" USING gin (about gin_trgm_ops);

-- Índices en la tabla Categories
CREATE INDEX IF NOT EXISTS idx_categories_name_gin ON "Categories" USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_categories_description_gin ON "Categories" USING gin (description gin_trgm_ops);

-- Índices en la tabla CareerTypes
CREATE INDEX IF NOT EXISTS idx_careertypes_name_gin ON "CareerTypes" USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_careertypes_description_gin ON "CareerTypes" USING gin (description gin_trgm_ops);

-- 4. Configurar el umbral de similitud (opcional)
-- Un valor de 0.2 significa que las palabras deben tener al menos 20% de similitud
-- Esto permite detectar mejor errores tipográficos como 'hinteligencia' -> 'inteligencia'
SET pg_trgm.similarity_threshold = 0.2;

-- 5. Verificar que los índices se crearon correctamente
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexname LIKE '%_gin' 
AND (tablename = 'Courses' OR tablename = 'Categories' OR tablename = 'CareerTypes');

-- 6. Ejemplo de uso de la función similarity()
-- Buscar cursos con errores tipográficos:
-- SELECT title, similarity(title, 'hinteligencia arti') as sim 
-- FROM "Courses" 
-- WHERE similarity(title, 'hinteligencia arti') > 0.2 
-- ORDER BY sim DESC;
--
-- También funciona con palabras individuales:
-- SELECT title, similarity(title, 'inteligencxia') as sim1, similarity(title, 'artifical') as sim2
-- FROM "Courses" 
-- WHERE similarity(title, 'inteligencxia') > 0.2 OR similarity(title, 'artifical') > 0.2
-- ORDER BY GREATEST(sim1, sim2) DESC;

-- Nota: Este script debe ejecutarse con permisos de superusuario en PostgreSQL