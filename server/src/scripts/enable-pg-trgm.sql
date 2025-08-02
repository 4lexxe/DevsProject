-- Script para habilitar la extensión pg_trgm en PostgreSQL
-- Esta extensión permite búsquedas por similitud y corrección de errores tipográficos

-- Verificar si la extensión ya está instalada
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- Crear la extensión si no existe
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verificar que la extensión se instaló correctamente
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- Crear índices GIN para mejorar el rendimiento de las búsquedas por similitud
-- Estos índices aceleran las consultas que usan similarity()

-- Índice para títulos de cursos
CREATE INDEX IF NOT EXISTS idx_courses_title_gin 
ON "Courses" USING gin (title gin_trgm_ops);

-- Índice para resúmenes de cursos
CREATE INDEX IF NOT EXISTS idx_courses_summary_gin 
ON "Courses" USING gin (summary gin_trgm_ops);

-- Índice para descripciones de cursos
CREATE INDEX IF NOT EXISTS idx_courses_about_gin 
ON "Courses" USING gin (about gin_trgm_ops);

-- Índice para nombres de categorías
CREATE INDEX IF NOT EXISTS idx_categories_name_gin 
ON "Categories" USING gin (name gin_trgm_ops);

-- Índice para descripciones de categorías
CREATE INDEX IF NOT EXISTS idx_categories_description_gin 
ON "Categories" USING gin (description gin_trgm_ops);

-- Índice para nombres de tipos de carrera
CREATE INDEX IF NOT EXISTS idx_career_types_name_gin 
ON "CareerTypes" USING gin (name gin_trgm_ops);

-- Índice para descripciones de tipos de carrera
CREATE INDEX IF NOT EXISTS idx_career_types_description_gin 
ON "CareerTypes" USING gin (description gin_trgm_ops);

-- Configurar el umbral de similitud (opcional)
-- Valores más bajos = más permisivo con errores tipográficos
-- Valores más altos = más estricto
SET pg_trgm.similarity_threshold = 0.3;

-- Ejemplos de uso de la función similarity:
-- SELECT title, similarity(title, 'cirso de nodejs') as sim 
-- FROM "Courses" 
-- WHERE similarity(title, 'cirso de nodejs') > 0.3 
-- ORDER BY sim DESC;

-- SELECT title, similarity(title, 'inteligencia artifcial') as sim 
-- FROM "Courses" 
-- WHERE similarity(title, 'inteligencia artifcial') > 0.3 
-- ORDER BY sim DESC;

SELECT 'pg_trgm extension and indexes created successfully!' as status;