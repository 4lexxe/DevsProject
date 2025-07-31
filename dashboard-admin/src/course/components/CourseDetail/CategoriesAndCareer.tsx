import { Tag, GraduationCap } from "lucide-react";
import { CourseData } from "../../interfaces/CourseDetail";

interface CategoriesAndCareerProps {
  courseData: CourseData;
  formatDate: (dateString: string) => string;
}

export default function CategoriesAndCareer({ courseData, formatDate }: CategoriesAndCareerProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Categorías */}
      <div className="rounded-lg border shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
            <Tag className="h-5 w-5 inline-block mr-2" />
            Categorías Asignadas ({courseData.categories.length})
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {courseData.categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4"
                style={{ backgroundColor: "#eff6ff", borderColor: "#1d4ed8" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img
                      src={category.icon || "/placeholder.svg"}
                      alt={category.name}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg" style={{ color: "#0c154c" }}>
                        {category.name}
                      </h4>
                      <div
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white"
                        style={{ backgroundColor: category.isActive ? "#42d7c7" : "#6b7280" }}
                      >
                        {category.isActive ? "Activa" : "Inactiva"}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{category.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Categoría ID:</span> {category.id}
                      </div>
                      <div>
                        <span className="font-medium">Relación:</span> {category.CourseCategory.courseId}-
                        {category.CourseCategory.categoryId}
                      </div>
                      <div>
                        <span className="font-medium">Creada:</span> {formatDate(category.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Actualizada:</span> {formatDate(category.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tipo de carrera */}
      <div className="rounded-lg border shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
            <GraduationCap className="h-5 w-5 inline-block mr-2" />
            Carrera Asociada (ID: {courseData.careerTypeId})
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
            <div className="relative w-16 h-16">
              <img
                src={courseData.careerType.icon || "/placeholder.svg"}
                alt={courseData.careerType.name}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold" style={{ color: "#0c154c" }}>
                {courseData.careerType.name}
              </h3>
              <p style={{ color: "#1d4ed8" }}>{courseData.careerType.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
