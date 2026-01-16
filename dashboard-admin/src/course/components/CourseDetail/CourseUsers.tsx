import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseUsersProps {
  courseId: number;
}

export default function CourseUsers({ courseId }: CourseUsersProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 shadow-lg bg-white">
      <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-gray-50 to-green-50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-green-600" />
            Gestión de Usuarios con Acceso
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/courses/${courseId}/users-access`)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Users className="h-4 w-4" />
              Ver Todos
            </button>
            <button
              onClick={() => navigate(`/courses/${courseId}/grant-access`)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Otorgar Acceso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
