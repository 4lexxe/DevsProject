import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import MarkdownPreview from "../SectionForm/MarkdownPreview";

interface Quiz {
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
}

interface QuizDisplayProps {
  quiz: Quiz;
  quizIndex: number;
  contentId: string;
  onEditQuiz: (contentId: string) => void;
  onDeleteQuiz: (contentId: string, quizId: string) => void;
}

export default function QuizDisplay({ 
  quiz, 
  quizIndex, 
  contentId, 
  onEditQuiz, 
  onDeleteQuiz 
}: QuizDisplayProps) {
  return (
    <div className="border rounded-lg p-4" style={{ borderColor: "#02ffff" }}>
      {/* Header del quiz con información básica */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-lg" style={{ color: "#0c154c" }}>
            {quizIndex + 1}. {quiz.question}
          </p>
          <div className="flex items-center gap-2">
            <span 
              className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: "#1d4ed8" }}
            >
              {quiz.type}
            </span>
            <span 
              className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: "#42d7c7" }}
            >
              {quiz.points} pts
            </span>
            {/* Quiz Action Buttons */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEditQuiz(contentId)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200"
                title="Editar quiz"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => onDeleteQuiz(contentId, quiz.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors duration-200"
                title="Eliminar quiz"
              >
                <Trash2 className="w-3 h-3" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
        
        {quiz.description && (
          <p className="text-gray-600 text-sm mb-2">{quiz.description}</p>
        )}

        {/* Contenido markdown del quiz si existe */}
        {quiz.markdown && (
          <div className="mb-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-amber-800 text-sm">Información adicional</span>
            </div>
            <div className="text-sm">
              <MarkdownPreview markdown={quiz.markdown} />
            </div>
          </div>
        )}

        {/* Imagen del quiz si existe */}
        {quiz.image && (
          <div className="mb-3">
            <img 
              src={quiz.image} 
              alt={`Imagen para ${quiz.question}`}
              className="max-w-sm h-auto rounded-lg border"
            />
          </div>
        )}

        {/* Información técnica del quiz */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded">
          <div>
            <span className="font-medium">ID:</span> {quiz.id}
          </div>
          <div>
            <span className="font-medium">Orden:</span> {quiz.order}
          </div>
          <div>
            <span className="font-medium">Tipo:</span> {quiz.type}
          </div>
          <div>
            <span className="font-medium">Puntos:</span> {quiz.points}
          </div>
        </div>
      </div>

      {/* Respuestas */}
      <div className="mb-3">
        <h6 className="font-medium text-sm mb-2" style={{ color: "#0c154c" }}>
          Respuestas ({quiz.answers.length}):
        </h6>
        <div className="space-y-2">
          {quiz.answers.map((answer, answerIndex) => (
            <div 
              key={answer.id || `${quiz.id}-answer-${answerIndex}`} 
              className={`flex items-start gap-3 p-2 rounded ${answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                {answer.isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs font-mono text-gray-500">
                  {answer.id || `ans-${answerIndex}`}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${answer.isCorrect ? 'text-green-800' : 'text-gray-700'}`}>
                  {answer.text}
                </span>
                {answer.explanation && (
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Explicación:</span> {answer.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explicación general del quiz */}
      {quiz.explanation && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm">
            <span className="font-medium" style={{ color: "#0c154c" }}>Explicación general:</span>
            <span className="text-gray-700 ml-2">{quiz.explanation}</span>
          </p>
        </div>
      )}

      {/* Metadata */}
      {quiz.metadata && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <h6 className="font-medium text-sm mb-2" style={{ color: "#0c154c" }}>
            Metadatos:
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {quiz.metadata.difficulty && (
              <div>
                <span className="font-medium">Dificultad:</span>
                <span 
                  className={`ml-2 px-2 py-1 rounded text-xs text-white ${
                    quiz.metadata.difficulty === 'easy' ? 'bg-green-500' :
                    quiz.metadata.difficulty === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                >
                  {quiz.metadata.difficulty}
                </span>
              </div>
            )}
            {quiz.metadata.tags && quiz.metadata.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {quiz.metadata.tags.map((tag, tagIndex) => (
                    <span 
                      key={`${quiz.id}-tag-${tagIndex}`}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
