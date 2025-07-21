import React, { useEffect, useState } from 'react';
import { getContentBySection } from '../../services/contentServices';
import ContentViewer from './ContentViewer';
import { Loader2 } from 'lucide-react';
import type { IContentApi } from '@/course/interfaces/Content';

interface SectionContentProps {
  sectionId: string;
}

const SectionContent: React.FC<SectionContentProps> = ({ sectionId }) => {
  const [contents, setContents] = useState<IContentApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await getContentBySection(sectionId);
        setContents(data);
        setError(null);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No content available for this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contents.map((content) => (
        <ContentViewer key={content.id} content={content} />
      ))}
    </div>
  );
};

export default SectionContent;