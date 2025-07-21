import { useState, useEffect } from "react";
import { getQuizById } from "@/course/services";
import { useParams } from "react-router-dom";

import { PaginationQuiz as QuizComponent } from "@/course/components";

function QuizPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const [quiz, setQuiz] = useState<any | null | undefined>(); // Usa un tipo adecuado en lugar de 'any'

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return; // Evita hacer la petición si no hay un ID válido
      try {
        const data = await getQuizById(contentId);
        setQuiz(data.quiz)
      } catch (err) {
        console.error("Error al obtener el contenido:", err);
      }
    };

    fetchContent();
  }, [contentId]); // Se ejecuta cuando `contentId` cambia

  if(quiz === null){
    return(
      <div className="min-h-screen flex items-center justify-center  from-blue-50 via-white to-purple-50">
          <div className=" text-xl text-gray-600">No hay quiz disponible para este contenido</div>
      </div>
    )
  }

  if (quiz === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <QuizComponent quizzes={quiz} />
    </div>
  );
}

export default QuizPage;