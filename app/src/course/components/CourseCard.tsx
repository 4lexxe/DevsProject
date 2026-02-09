import { User } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    coverImage?: string;
    creator?: {
      id: number;
      name: string;
      username?: string;
      displayName?: string;
      avatar?: string;
    };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const getCreatorDisplayName = () => {
    if (!course.creator) return 'Instructor desconocido';
    return course.creator.displayName || course.creator.name || course.creator.username || 'Instructor';
  };

  const getCreatorUsername = () => {
    return course.creator?.username ? `@${course.creator.username}` : '';
  };

  const getCreatorAvatar = () => {
    if (course.creator?.avatar) return course.creator.avatar;
    const name = getCreatorDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {course.coverImage && (
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Información del creador */}
        {course.creator && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={getCreatorAvatar()}
                alt={getCreatorDisplayName()}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getCreatorDisplayName()}
                </p>
                {getCreatorUsername() && (
                  <p className="text-xs text-gray-500 truncate">
                    {getCreatorUsername()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
