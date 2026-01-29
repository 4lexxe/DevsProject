import React from 'react';
import { Tag, Code, Play } from 'lucide-react';
import { Category } from '@/course/interfaces/ViewnerCourse';

interface HeroCourseProps {
  title: string;
  description: string;
  image: string;
  categories: Category[];
  courseId?: string;
  // Campos del header dinámico
  headerType?: 'default' | 'programming' | 'hacking' | 'custom' | 'iframe';
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerButtonText?: string;
  headerButtonLink?: string;
  techStack?: string[];
  customHeaderContent?: string;
}

export default function HeroCourse({
  title,
  description,
  image,
  categories,
  courseId,
  headerType = 'default',
  headerTitle,
  headerSubtitle,
  headerDescription,
  headerButtonText,
  headerButtonLink,
  techStack = [],
  customHeaderContent,
}: HeroCourseProps) {
  // Determinar qué título usar
  const displayTitle = headerTitle || title;
  const displayDescription = headerDescription || description;

  // Renderizar contenido personalizado o iframe
  if (headerType === 'iframe' && customHeaderContent) {
    return (
      <div className="relative w-full" style={{ minHeight: '400px' }}>
        <iframe
          src={customHeaderContent}
          className="w-full h-full border-0"
          style={{ minHeight: '400px' }}
          title="Course Header"
        />
      </div>
    );
  }

  if (headerType === 'custom' && customHeaderContent) {
    return (
      <div 
        className="relative w-full"
        dangerouslySetInnerHTML={{ __html: customHeaderContent }}
      />
    );
  }
  // Renderizar header de programación con consola
  if (headerType === 'programming') {
    return (
      <div className="relative min-h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative min-h-[500px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Contenido izquierdo */}
            <div className="text-white">
              {/* Categorías */}
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5" />
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100/20 text-white"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Subtítulo */}
              {headerSubtitle && (
                <p className="text-lg text-blue-400 font-semibold mb-2">
                  {headerSubtitle}
                </p>
              )}

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {displayTitle}
              </h1>

              {/* Descripción */}
              <p className="text-base sm:text-lg text-gray-300 mb-6">
                {displayDescription}
              </p>

              {/* Tech Stack */}
              {techStack && techStack.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-gray-400">Tech Stack:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm font-mono text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón */}
              {headerButtonText && headerButtonLink && (
                <a
                  href={headerButtonLink}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  {headerButtonText}
                </a>
              )}
            </div>

            {/* Consola derecha */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-xs">Terminal</span>
              </div>
              <div className="text-green-400">
                <div className="mb-2">
                  <span className="text-blue-400">$</span> npm install
                </div>
                <div className="mb-2 text-gray-500">
                  Installing packages...
                </div>
                <div className="mb-2">
                  <span className="text-blue-400">$</span> npm start
                </div>
                <div className="text-gray-500">
                  Server running on http://localhost:3000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar header de hacking
  if (headerType === 'hacking') {
    return (
      <div className="relative min-h-[500px] bg-gradient-to-br from-green-900 via-black to-green-900">
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative min-h-[500px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-white max-w-3xl">
            {/* Categorías */}
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-5 h-5" />
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Subtítulo */}
            {headerSubtitle && (
              <p className="text-lg text-green-400 font-mono mb-2">
                {headerSubtitle}
              </p>
            )}

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono text-green-400">
              {displayTitle}
            </h1>

            {/* Descripción */}
            <p className="text-base sm:text-lg text-gray-300 mb-6">
              {displayDescription}
            </p>

            {/* Botón */}
            {headerButtonText && headerButtonLink && (
              <a
                href={headerButtonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors font-mono"
              >
                {headerButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Header por defecto
  return (
    <div className="relative min-h-[400px]">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        {/* Capa oscura sobre la imagen */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative min-h-[400px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        {/* Contenedor limitado para el contenido */}
        <div className="text-white max-w-2xl">
          {/* Categorías */}
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5" />
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100/70 text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Subtítulo */}
          {headerSubtitle && (
            <p className="text-lg text-blue-300 font-semibold mb-2">
              {headerSubtitle}
            </p>
          )}

          {/* Título responsive */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 overflow-hidden whitespace-normal break-words max-w-full">
            {displayTitle}
          </h1>

          {/* Descripción responsive */}
          <p className="text-base sm:text-lg text-gray-200 overflow-hidden whitespace-normal break-words max-w-full mb-6">
            {displayDescription}
          </p>

          {/* Tech Stack */}
          {techStack && techStack.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5" />
                <span className="text-sm font-semibold">Tech Stack:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botón */}
          {headerButtonText && headerButtonLink && (
            <a
              href={headerButtonLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              {headerButtonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}