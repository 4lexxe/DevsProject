import { Plus, HelpCircle } from "lucide-react";
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
      difficulty?: 'easy' | 'medium' | 'hard';
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
  onDeleteQuiz: (contentId: string, quizId: string) => void;
}

export default function ContentItemDisplay({ 
  content, 
  onAddQuiz, 
  onEditQuiz, 
  onDeleteQuiz 
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
          {content.quiz && content.quiz.length > 0 ? (
            <>
              <button
                onClick={() => onAddQuiz(content.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir Quiz
              </button>
              <span className="text-xs text-gray-500">
                {content.quiz.length} quiz{content.quiz.length !== 1 ? 'zes' : ''} configurado{content.quiz.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <button
              onClick={() => onAddQuiz(content.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir primer Quiz
            </button>
          )}
        </div>
      </div>

      {/* Mostrar Quizzes si existen */}
      {content.quiz && content.quiz.length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1d4ed8" }}>
          <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "#0c154c" }}>
            <HelpCircle className="h-5 w-5" />
            Quizzes ({content.quiz.length})
          </h5>
          <div className="space-y-3">
            {content.quiz.map((quizItem, quizIndex) => (
              <QuizDisplay
                key={quizItem.id}
                quiz={quizItem}
                quizIndex={quizIndex}
                contentId={content.id}
                onEditQuiz={onEditQuiz}
                onDeleteQuiz={onDeleteQuiz}
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

      <div className="text-xs text-gray-500 mt-3 pt-2 border-t" style={{ borderColor: "#1d4ed8" }}>
        <span>Duración: {content.duration} minutos</span> | <span>Content ID: {content.id}</span> |{" "}
        <span>Sección ID: {content.sectionId}</span>
      </div>
    </div>
  );
}
