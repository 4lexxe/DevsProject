import { Plus, HelpCircle, Trash2, Edit, FolderOpen, Upload } from "lucide-react";
import QuizDisplay from "./QuizDisplay";

interface Content {
  id: string;
  position: number;
  title: string;
  text: string;
  duration: number;
  sectionId: string;
  quiz?: Array<{
    id: string;
    question: string;
    type: string;
    points: number;
    description?: string;
    markdown?: string;
    image?: string;
    order: number;
    explanation?: string;
    answers: Array<{
      id?: string;
      text: string;
      isCorrect: boolean;
      explanation?: string;
    }>;
    metadata?: {
      difficulty?: "easy" | "medium" | "hard";
      tags?: string[];
    };
  }>;
  resources?: Array<{
    title: string;
    url: string;
  }>;
}

interface ContentItemDisplayProps {
  content: Content;
  onAddQuiz: (contentId: string) => void;
  onEditQuiz: (contentId: string) => void;
  onDeleteQuiz: (contentId: string) => void;
  onManageFiles?: (contentId: string) => void;
  onUploadFiles?: (contentId: string) => void;
}

export default function ContentItemDisplay({
  content,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onManageFiles,
  onUploadFiles,
}: ContentItemDisplayProps) {
  return (
    <div
      className="border rounded-lg p-4"
      style={{ backgroundColor: "#eff6ff", borderColor: "#42d7c7" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <h4 className="font-semibold text-lg" style={{ color: "#0c154c" }}>
          {content.position}. {content.title}
        </h4>
      </div>
      <p className="text-gray-600 mb-3">{content.text}</p>

      {/* Quiz Management Buttons */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <>
            <button
              onClick={() => onAddQuiz(content.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir Quiz
            </button>
          </>
        </div>
      </div>

      {/* File Management Buttons */}
      {(onManageFiles || onUploadFiles) && (
        <div className="mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            {onUploadFiles && (
              <button
                onClick={() => onUploadFiles(content.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir Archivos
              </button>
            )}
            {onManageFiles && (
              <button
                onClick={() => onManageFiles(content.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Gestionar Archivos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mostrar Quizzes si existen */}
      {content.quiz && content.quiz.length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1d4ed8" }}>
          <div className="flex items-center justify-between">
            <h5
              className="font-semibold mb-0 flex items-center gap-2"
              style={{ color: "#0c154c" }}
            >
              <HelpCircle className="h-5 w-5" />
              Quizzes ({content.quiz.length})
            </h5>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditQuiz(content.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                title="Editar quiz"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar
              </button>
              <button
                onClick={() => onDeleteQuiz(content.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                title="Eliminar quiz"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {content.quiz.map((quizItem, quizIndex) => (
              <QuizDisplay
                key={quizItem.id}
                quiz={quizItem}
                quizIndex={quizIndex}
                contentId={content.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mostrar Resources si existen */}
      {content.resources && content.resources.length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1d4ed8" }}>
          <h5 className="font-semibold mb-3" style={{ color: "#0c154c" }}>
            Recursos ({content.resources.length})
          </h5>
          <div className="space-y-2">
            {content.resources.map((resource, resourceIndex) => (
              <a
                key={`${content.id}-resource-${resourceIndex}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {resource.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <div
        className="text-xs text-gray-500 mt-3 pt-2 border-t"
        style={{ borderColor: "#1d4ed8" }}
      >
        <span>Duración: {content.duration} minutos</span> |{" "}
        <span>Content ID: {content.id}</span> |{" "}
        <span>Sección ID: {content.sectionId}</span>
      </div>
    </div>
  );
}
