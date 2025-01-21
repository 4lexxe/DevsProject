import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Quiz from '../components/courses/Quiz';
import { getContentById } from '../../services/contentServices';

interface Content {
  id: number;
  quizTitle?: string;
  quizContent?: string;
  questions?: Array<{
    question: string;
    answers: Array<{
      answer: string;
      isCorrect: boolean;
    }>;
  }>;
}

const QuizPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await getContentById(contentId!);
        if (!data.quizTitle || !data.questions) {
          throw new Error('Invalid quiz content');
        }
        setContent(data);
      } catch (err) {
        setError('Failed to load quiz');
        console.error('Error loading quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [contentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Quiz not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Quiz
        title={content.quizTitle!}
        content={content.quizContent}
        questions={content.questions!}
      />
    </div>
  );
};

export default QuizPage;