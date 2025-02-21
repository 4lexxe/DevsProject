import type React from "react";
import { useParams } from "react-router-dom";
import { getContentById } from "../services/contentServices";
import { useEffect, useState } from "react";
import ContentDetail from "../components/contentViewner/ContentDetail";


const ContentPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<any>(null); // Usa un tipo adecuado en lugar de 'any'

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return; // Evita hacer la petición si no hay un ID válido
      try {
        const data = await getContentById(contentId);
        const data2 = { ...data, resources: JSON.parse(data.resources) };
        setContent(data2);
      } catch (err) {
        console.error("Error al obtener el contenido:", err);
      }
    };

    fetchContent();
  }, [contentId]); // Se ejecuta cuando `contentId` cambia

  /* useEffect(() => {
        console.log(content)
    }, [content]) */

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return <ContentDetail content={content} />;
};

export default ContentPage;
