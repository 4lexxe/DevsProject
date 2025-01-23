import React, { useEffect, useState } from 'react';
import { getSectionsByCourse } from '../../services/sectionServices';
import SectionModule from './SectionModule';

interface Section {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  lessonsCount: number;
  duration: number;
}

interface SectionListProps {
  courseId: string;
}

const SectionList: React.FC<SectionListProps> = ({ courseId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionCount, setSectionCount] = useState<number>(0);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await getSectionsByCourse(courseId);
        setSections(response.sections);
        setSectionCount(response.sectionCount);
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError('No se pudieron cargar las secciones del curso');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6 bg-white rounded-b-lg border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay secciones disponibles para este curso.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Módulos del Curso
        </h2>
        <span className="text-sm text-gray-500">
          {sectionCount} {sectionCount === 1 ? 'módulo' : 'módulos'} en total
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <SectionModule key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

export default SectionList;
