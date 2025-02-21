import React from "react";
import { IContentApi } from "@/course/interfaces/Content";
import { Clock, ArrowLeft, BookOpen } from "lucide-react";
import MarkdownPreview from "../forms/previews/MarkdownPreview";
import { Link } from "react-router-dom";

function ContentDetail({ content }: { content: IContentApi }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>{content.duration} minutos</span>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {content.text}
            </p>

            {content.link && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recurso principal
                </h3>
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Ver {content.linkType === "video" ? "video" : "recurso"}
                </a>
              </div>
            )}

            {content.resources && content.resources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recursos adicionales
                </h3>
                <div className="grid gap-4">
                  {content.resources.map((resource: any, index: any) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 flex items-center group"
                    >
                      <span className="text-gray-800 group-hover:text-blue-600 transition-colors">
                        {resource.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {content.markdown && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Contenido Detallado
                  </h2>
                  <MarkdownPreview markdown={content.markdown} />
                </div>
              </div>
            )}

            {content.quiz && (
              <div className="mt-8">
                <Link
                  to={`/course/section/content/${content.id}/quiz`}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-lg font-semibold">Comenzar Quiz</span>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Última actualización:{" "}
              {new Date(content.updatedAt).toLocaleDateString()}
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDetail;
