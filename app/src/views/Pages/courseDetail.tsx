import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSectionsByCourse } from '../../services/sectionServices';
import { getContentBySection } from '../../services/contentServices';

interface Section {
  id: string;
  title: string;
  description: string;
}

interface Content {
  id: string;
  type: string;
  contentText?: string;
  contentVideo?: string;
  contentImage?: string;
  contentFile?: string;
  externalLink?: string;
  duration?: number;
  position?: number;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [content, setContent] = useState<{ [key: string]: Content[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Obtener las secciones
        const fetchedSections = await getSectionsByCourse(id!);
        setSections(fetchedSections);

        // Obtener el contenido de cada sección
        const contentPromises = fetchedSections.map((section: Section) =>
          getContentBySection(section.id).then((content) => ({
            sectionId: section.id,
            content,
          }))
        );

        const contentResults = await Promise.all(contentPromises);
        const contentBySection: { [key: string]: Content[] } = {};
        contentResults.forEach(({ sectionId, content }) => {
          contentBySection[sectionId] = content;
        });
        setContent(contentBySection);
      } catch (err) {
        console.error('Error al cargar datos del curso:', err);
        setError('Hubo un error al cargar los datos del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-blue-500">Cargando curso...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Detalles del Curso</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4">Secciones y Contenido</h2>
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="text-xl font-bold">{section.title}</h3>
            <p className="text-gray-700 mb-4">{section.description}</p>
            {content[section.id] ? (
              <ul>
                {content[section.id].map((item) => (
                  <li key={item.id} className="mb-2">
                    <strong>Tipo:</strong> {item.type}
                    {item.contentText && <p>{item.contentText}</p>}
                    {item.contentVideo && (
                      <a href={item.contentVideo} target="_blank" rel="noopener noreferrer">
                        Ver video
                      </a>
                    )}
                    {item.contentImage && (
                      <img src={item.contentImage} alt="Contenido visual" className="my-2 max-w-full" />
                    )}
                    {item.contentFile && (
                      <a href={item.contentFile} target="_blank" rel="noopener noreferrer">
                        Descargar archivo
                      </a>
                    )}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                        Enlace externo
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin contenido disponible.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;