import { FieldErrors } from "react-hook-form";

interface FormState {
  quiz: Array<{
    id: string;
    question: string;
    description: string;
    markdown?: string;
    order: number;
    points: number;
    explanation?: string;
    image?: string;
    type: "MultipleChoice" | "TrueOrFalse" | "ShortAnswer" | "Single";
    answers: Array<{
      id?: string;
      text: string;
      isCorrect: boolean;
      explanation?: string;
    }>;
    metadata?: {
      difficulty?: "easy" | "medium" | "hard";
      tags?: string;
    };
  }>;
}

interface QuizErrorsProps {
  submitError: string | null;
  serverErrors: Array<{ path: string; message: string }>;
  formErrors: FieldErrors<FormState>;
}

export default function QuizErrors({
  submitError,
  serverErrors,
  formErrors,
}: QuizErrorsProps) {
  // Función para extraer errores de validación del formulario (refine)
  const getFormValidationErrors = () => {
    const errors: Array<{ path: string; message: string }> = [];
    
    if (formErrors.quiz && Array.isArray(formErrors.quiz)) {
      formErrors.quiz.forEach((questionError, questionIndex) => {
        
        
        if (questionError) {
          // Errores de campos básicos
          const basicFields = [
            "question",
            "description", 
            "order",
            "points",
            "type",
            "markdown",
            "explanation",
            "image"
          ];
          
          basicFields.forEach((field) => {
            const fieldError = (questionError as any)[field];
            if (fieldError && fieldError.message) {
              console.log(`Found basic field error - ${field}:`, fieldError.message);
              errors.push({
                path: `Pregunta ${questionIndex + 1} - ${getFieldName(field)}`,
                message: fieldError.message,
              });
            }
          });

          // Errores de validaciones específicas de refine
          const validationFields = [
            "validation_truefalse_count",
            "validation_truefalse_correct",
            "validation_single_correct", 
            "validation_multiple_correct",
            "validation_short_answer"
          ];
          
          validationFields.forEach((field) => {
            const fieldError = (questionError as any)[field];
            if (fieldError && fieldError.message) {
              console.log(`Found validation error - ${field}:`, fieldError.message);
              errors.push({
                path: `Pregunta ${questionIndex + 1} - ${getValidationName(field)}`,
                message: fieldError.message,
              });
            }
          });

          // Errores de respuestas individuales
          if (questionError.answers && Array.isArray(questionError.answers)) {
            console.log(`Checking answers array for question ${questionIndex + 1}:`, questionError.answers);
            questionError.answers.forEach((answerError: any, answerIndex: number) => {
              if (answerError?.text?.message) {
                console.log(`Found answer text error - Q${questionIndex + 1}A${answerIndex + 1}:`, answerError.text.message);
                errors.push({
                  path: `Pregunta ${questionIndex + 1} - Respuesta ${answerIndex + 1}`,
                  message: answerError.text.message,
                });
              }
            });
          }
          
          // Error general de answers (array validation)
          if (questionError.answers && typeof questionError.answers === 'object' && 'message' in questionError.answers) {
            console.log(`Found answers general error for Q${questionIndex + 1}:`, (questionError.answers as any).message);
            errors.push({
              path: `Pregunta ${questionIndex + 1} - Respuestas`,
              message: (questionError.answers as any).message,
            });
          }
        }
      });
    }

    // Error general del quiz
    if (formErrors.quiz && typeof formErrors.quiz === 'object' && 'message' in formErrors.quiz) {
      console.log("Found quiz general error:", (formErrors.quiz as any).message);
      errors.push({
        path: 'Quiz General',
        message: (formErrors.quiz as any).message,
      });
    }

    return errors;
  };

  // Función auxiliar para nombres de campos
  const getFieldName = (field: string): string => {
    const fieldNames: { [key: string]: string } = {
      question: "Título",
      description: "Descripción",
      order: "Orden", 
      points: "Puntos",
      type: "Tipo",
      markdown: "Contenido Markdown",
      explanation: "Explicación",
      image: "Imagen"
    };
    return fieldNames[field] || field;
  };

  // Función auxiliar para nombres de validaciones
  const getValidationName = (field: string): string => {
    const validationNames: { [key: string]: string } = {
      validation_truefalse_count: "Validación Verdadero/Falso (Cantidad)",
      validation_truefalse_correct: "Validación Verdadero/Falso (Correctas)",
      validation_single_correct: "Validación Selección Única",
      validation_multiple_correct: "Validación Opción Múltiple", 
      validation_short_answer: "Validación Respuesta Corta"
    };
    return validationNames[field] || field;
  };

  const formValidationErrors = getFormValidationErrors();

  return (
    <div className="space-y-4">
      {/* Errores de Validación del Formulario (Refine) */}
      {formValidationErrors.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-orange-800 text-sm font-semibold mb-2">
                Errores de validación del formulario ({formValidationErrors.length}):
              </h4>
              <ul className="space-y-1">
                {formValidationErrors.map((error, index) => (
                  <li key={index} className="text-orange-700 text-sm flex items-start">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>
                      <strong className="font-medium">{error.path}:</strong>{" "}
                      {error.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error de Envío */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al guardar</h3>
              <p className="text-red-700 text-sm font-medium mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Errores de Validación del Servidor */}
      {serverErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-red-800 text-sm font-semibold mb-2">
                Errores de validación del servidor ({serverErrors.length}):
              </h4>
              <ul className="space-y-1">
                {serverErrors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>
                      <strong className="font-medium">{error.path}:</strong>{" "}
                      {error.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
