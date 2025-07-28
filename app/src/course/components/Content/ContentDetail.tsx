import React from "react";
import { IContentApi } from "@/course/interfaces/Content";
import { Clock, ArrowLeft, BookOpen } from "lucide-react";
import MarkdownPreview from "../SectionForm/MarkdownPreview";
import { Link } from "react-router-dom";

function ContentDetail({ content, courseId }: { content: IContentApi, courseId: string }) {
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

        {content.link && (
          <div className="mb-8 bg-gradient-to-r from-cyan-50 to-slate-100 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-600 to-blue-900 bg-clip-text text-transparent">
              Recurso principal
            </h3>
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-cyan-600 to-blue-900 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-950 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Ver {content.linkType === "video" ? "video" : "recurso"}
            </a>
          </div>
        )}

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
