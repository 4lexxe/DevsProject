import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface LearningOutcomesProps {
  outcomes: string[];
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#1a1f36]">Lo que aprenderás</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-[#1a1f36] text-sm">{outcome}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningOutcomes;