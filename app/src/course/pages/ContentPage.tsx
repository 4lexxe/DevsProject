import type React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import MarkdownPreview from "../components/forms/previews/MarkdownPreview";
import { getContentById } from "../services/contentServices";
import { useEffect, useState } from "react";

const LessonPage: React.FC = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const [content, setContent] = useState<any>(null); // Usa un tipo adecuado en lugar de 'any'
  
    useEffect(() => {
      const fetchContent = async () => {
        if (!contentId) return; // Evita hacer la petición si no hay un ID válido
        try {
          const data = await getContentById(contentId);
          const data2 = {...data, resources: JSON.parse(data.resources)}
          setContent(data2);
        } catch (err) {
          console.error("Error al obtener el contenido:", err);
        }
      };
  
      fetchContent();
    }, [contentId]); // Se ejecuta cuando `contentId` cambia

    useEffect(() => {
        console.log(content)
    }, [content])

  if (!content) {
    return <div>Contenido no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 mt-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{content.duration} minutos</span>
          </div>
          <p className="text-gray-700 mb-6">{content.text}</p>

          {content.link && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recurso principal:</h3>
              <a
                href={content.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ver {content.linkType === "video" ? "video" : "recurso"}
              </a>
            </div>
          )}

          {content.resources && content.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Recursos adicionales:
              </h3>
              <ul className="list-disc pl-5">
                {content.resources.map((resource: any, index: any) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.markdown && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Contenido Detallado</h2>
              <MarkdownPreview markdown={content.markdown} />
            </div>
          )}
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Última actualización:{" "}
            {new Date(content.updatedAt).toLocaleDateString()}
          </p>
          <Link
            to="/cursos"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
