import { Star } from "lucide-react";

interface LearningOutcomesProps {
  learningOutcomes: string[];
}

export default function LearningOutcomes({ learningOutcomes }: LearningOutcomesProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Objetivos de Aprendizaje ({learningOutcomes.length})
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningOutcomes.map((outcome, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white"
            >
              <div className="w-6 h-6 text-white rounded flex items-center justify-center text-xs font-semibold bg-gray-700 flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span className="font-medium text-gray-900 text-sm leading-relaxed pt-0.5">
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
