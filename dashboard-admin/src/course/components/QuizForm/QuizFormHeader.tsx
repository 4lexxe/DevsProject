interface QuizFormHeaderProps {
  isEditMode: boolean;
}

export default function QuizFormHeader({ 
    isEditMode
}: QuizFormHeaderProps) {

  return (
    <div className="w-full mb-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Editar Quiz' : 'Configurar Quiz'}
        </h1>
        <p className="text-gray-600 mt-1">
          Configura las preguntas y respuestas para el contenido
        </p>
      </div>
    </div>
  );
}
