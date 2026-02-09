import React from "react";
import { IContentApi, IContentFile } from "@/course/interfaces/Content";
import { Clock, ArrowLeft, BookOpen, FileText, Video, Image, Download } from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";
import SecureVideoPlayer from "./SecureVideoPlayer";
import { Link } from "react-router-dom";

function ContentDetail({ content, courseId, courseSlug }: { content: IContentApi, courseId: string, courseSlug?: string }) {
  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'presentation':
        return <FileText className="w-5 h-5 text-orange-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Función para renderizar la vista previa según el tipo
  const renderFilePreview = (file: IContentFile) => {

    switch (file.fileType) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <SecureVideoPlayer
              contentFileId={file.id}
              title={file.originalName}
              className="w-full h-full"
              onError={(error) => {
                console.error('Error en reproductor de video:', error);
              }}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={file.drivePreviewLink}
              className="w-full h-full border-0"
              title={file.originalName}
            />
          </div>
        );
      
      case 'presentation':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={file.drivePreviewLink}
              className="w-full h-full border-0"
              title={file.originalName}
              allowFullScreen
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {file.thumbnailLink ? (
              <img
                src={file.thumbnailLink}
                alt={file.originalName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header mejorado con mejor diseño */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-700 to-blue-900 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{content.title}</h1>
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              <span>{content.duration} minutos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con mejor espaciado */}
      <div className="p-6 md:p-8 lg:p-10">
        {content.text && (
          <div className="mb-8">
            <p className="text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-line">
              {content.text}
            </p>
          </div>
        )}

        {content.resources && content.resources.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-600" />
              Recursos adicionales
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {content.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-cyan-50 hover:to-blue-50 border border-slate-200 hover:border-cyan-300 transition-all duration-300 flex items-center group shadow-sm hover:shadow-md"
                >
                  <div className="flex-1">
                    <span className="text-slate-800 group-hover:text-cyan-900 font-medium transition-colors block">
                      {resource.title}
                    </span>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 rotate-[-135deg] transition-all" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Archivos del contenido */}
        {content.files && content.files.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Archivos del contenido
            </h3>
            <div className="grid gap-6">
              {content.files.map((file) => (
                <div key={file.id} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header del archivo */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-lg">{file.originalName}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {file.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    {file.allowDownload && file.driveWebContentLink && (
                      <a
                        href={file.driveWebContentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-5 py-2.5 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-md hover:shadow-lg self-start sm:self-auto"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                      </a>
                    )}
                  </div>

                  {/* Vista previa del archivo */}
                  {['video', 'pdf', 'presentation', 'image'].includes(file.fileType) && (
                    <div className="mt-5 rounded-lg overflow-hidden shadow-md">
                      {renderFilePreview(file)}
                    </div>
                  )}

                  {/* Descripción si existe */}
                  {file.description && (
                    <p className="mt-5 text-slate-700 text-base leading-relaxed p-4 bg-white rounded-lg border border-slate-200">
                      {file.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.markdown && (
          <div className="mt-10">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 md:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent flex items-center gap-2">
                <FileText className="w-7 h-7 text-cyan-600" />
                Contenido Detallado
              </h2>
              <div className="prose prose-slate max-w-none">
                <MarkdownPreview markdown={content.markdown} />
              </div>
            </div>
          </div>
        )}

        {content.quiz && content.quiz.length > 0 && (
          <div className="mt-10">
            <Link
              to={`/course/section/content/${content.id}/quiz`}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-lg font-semibold">Comenzar Quiz</span>
            </Link>
          </div>
        )}


      </div>

      {/* Footer mejorado */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 md:px-8 py-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-600">
          Última actualización:{" "}
          <span className="font-medium">{new Date(content.updatedAt).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </p>
        <Link
          to={courseSlug ? `/course/${courseSlug}` : `/course/${courseId}`}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2.5 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Curso</span>
        </Link>
      </div>
    </div>
  );
}

export default ContentDetail;
