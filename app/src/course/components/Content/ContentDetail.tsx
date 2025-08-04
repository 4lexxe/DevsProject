import React from "react";
import { IContentApi, IContentFile } from "@/course/interfaces/Content";
import { Clock, ArrowLeft, BookOpen, FileText, Video, Image, Download } from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";
import SecureVideoPlayer from "./SecureVideoPlayer";
import { Link } from "react-router-dom";

function ContentDetail({ content, courseId }: { content: IContentApi, courseId: string }) {
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
    // Generar URL de preview público
    const getPublicPreviewUrl = (fileId: string, fileType: string) => {
      if (file.drivePreviewLink) {
        return file.drivePreviewLink;
      }
      
      // Extraer ID del archivo de diferentes tipos de URLs
      let driveId = fileId;
      if (file.driveWebViewLink) {
        const match = file.driveWebViewLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) driveId = match[1];
      }
      
      // Generar URL público de preview según el tipo
      switch (fileType) {
        case 'pdf':
          return `https://drive.google.com/file/d/${driveId}/preview`;
        case 'presentation':
          return `https://docs.google.com/presentation/d/${driveId}/embed?start=false&loop=false&delayms=3000&usp=sharing`;
        default:
          return `https://drive.google.com/file/d/${driveId}/preview?usp=sharing`;
      }
    };

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
              src={getPublicPreviewUrl(file.driveFileId, file.fileType)}
              className="w-full h-full border-0"
              title={file.originalName}
            />
          </div>
        );
      
      case 'presentation':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={getPublicPreviewUrl(file.driveFileId, file.fileType)}
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
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>{content.duration} minutos</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-slate-700 mb-6 text-lg leading-relaxed">
          {content.text}
        </p>

        {content.resources && content.resources.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent">
              Recursos adicionales
            </h3>
            <div className="grid gap-4">
              {content.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 hover:from-cyan-50 hover:to-slate-100 transition-all duration-300 flex items-center group"
                >
                  <span className="text-slate-800 group-hover:text-cyan-900 transition-colors">
                    {resource.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Archivos del contenido */}
        {content.files && content.files.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent">
              Archivos del contenido
            </h3>
            <div className="grid gap-6">
              {content.files.map((file) => (
                <div key={file.id} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6">
                  {/* Header del archivo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.fileType)}
                      <div>
                        <h4 className="font-semibold text-slate-800">{file.originalName}</h4>
                        <p className="text-sm text-slate-600">
                          {formatFileSize(file.fileSize)} • {file.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    {file.allowDownload && file.driveWebContentLink && (
                      <a
                        href={file.driveWebContentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                      </a>
                    )}
                  </div>

                  {/* Vista previa del archivo */}
                  {['video', 'pdf', 'presentation', 'image'].includes(file.fileType) && (
                    <div className="mt-4">
                      {renderFilePreview(file)}
                    </div>
                  )}

                  {/* Descripción si existe */}
                  {file.description && (
                    <p className="mt-4 text-slate-700 text-sm">{file.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.markdown && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent">
                Contenido Detallado
              </h2>
              <MarkdownPreview markdown={content.markdown} />
            </div>
          </div>
        )}

        {content.quiz && content.quiz.length > 0 && (
          <div className="mt-8">
            <Link
              to={`/course/section/content/${content.id}/quiz`}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-lg font-semibold">Comenzar Quiz</span>
            </Link>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex justify-between items-center">
        <p className="text-sm text-slate-600">
          Última actualización:{" "}
          {new Date(content.updatedAt).toLocaleDateString()}
        </p>
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
}

export default ContentDetail;
