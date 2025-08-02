import { Star } from "lucide-react";

interface LearningOutcomesProps {
  learningOutcomes: string[];
}

export default function LearningOutcomes({ learningOutcomes }: LearningOutcomesProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
          <Star className="h-5 w-5 inline-block mr-2" />
          Objetivos de Aprendizaje Configurados ({learningOutcomes.length})
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningOutcomes.map((outcome, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <div
                className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "#1d4ed8" }}
              >
                {index + 1}
              </div>
              <span className="font-medium" style={{ color: "#0c154c" }}>
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
