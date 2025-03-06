import React from 'react';

interface ShortAnswerProps {
  value: string;
  onChange: (value: string) => void;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
      />
    </div>
  );
};

export default ShortAnswer;