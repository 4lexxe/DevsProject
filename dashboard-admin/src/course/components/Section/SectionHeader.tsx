import { ArrowLeft } from "lucide-react";

interface SectionHeaderProps {
  section: {
    id: number;
    title: string;
    description: string;
    coverImage?: string;
    moduleType: string;
    colorGradient: [string, string];
    courseId: string;
    lessonsCount: number;
    duration: number;
  };
  onBack: () => void;
}

export default function SectionHeader({ section, onBack }: SectionHeaderProps) {
  const getModuleTypeBg = (type: string) => {
    switch (type.toLowerCase()) {
      case "introductorio":
        return "#1d4ed8"
      case "principiante":
        return "#42d7c7"
      case "intermedio":
        return "#0c154c"
      case "avanzado":
        return "#02ffff"
      default:
        return "#1d4ed8"
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver al Dashboard
      </button>

      {/* Header de la sección */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div
          className="flex flex-col space-y-1.5 p-6 text-white"
          style={{
            background: `linear-gradient(to right, ${section.colorGradient[0]}, ${section.colorGradient[1]})`,
          }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative w-24 h-24 bg-white rounded-lg p-2 flex-shrink-0 mx-auto md:mx-0">
              <img
                src={section.coverImage || "/placeholder.svg"}
                alt={section.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold leading-none tracking-tight">
                  {section.title} (ID: {section.id})
                </h3>
                <div
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white"
                  style={{ backgroundColor: getModuleTypeBg(section.moduleType) }}
                >
                  {section.moduleType}
                </div>
              </div>
              <p className="text-blue-100 text-lg mb-3">{section.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-blue-50 text-sm">
                <span>Curso ID: {section.courseId}</span>
                <span>Lecciones: {section.lessonsCount}</span>
                <span>Duración: {section.duration} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
