// ColorSelector.tsx
import { Pencil } from "lucide-react";

interface ColorSelectorProps {
  onColorSelect: (color: string) => void;
  selectedColor: string;
  onCustomColorRequest?: () => void;
}

export function ColorSelector({
  onColorSelect,
  selectedColor,
  onCustomColorRequest,
}: ColorSelectorProps) {
  const colors = [
    { name: "Red", value: "#FF0000" },
    { name: "Light Red", value: "#FFB3B3" },
    { name: "Orange", value: "#FFA500" },
    { name: "Light Orange", value: "#FFD6A5" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Light Yellow", value: "#FFFFA3" },
    { name: "Green", value: "#008000" },
    { name: "Light Green", value: "#90EE90" },
    { name: "Blue", value: "#0000FF" },
    { name: "Light Blue", value: "#ADD8E6" },
    { name: "Indigo", value: "#4B0082" },
    { name: "Light Indigo", value: "#9B7CB9" },
    { name: "Violet", value: "#8A2BE2" },
    { name: "Light Violet", value: "#DDB3FF" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#808080" },
    { name: "Light Gray", value: "#D3D3D3" },
    { name: "White", value: "#FFFFFF" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-3">Colores para la cabecera de la sección</h2>
      <div className="grid grid-cols-6 gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`w-12 h-12 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              selectedColor === color.value ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
            style={{
              backgroundColor: color.value,
              border: color.value === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
            }}
            title={color.name}
          />
        ))}
        <button
          onClick={onCustomColorRequest}
          className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          title="Color personalizado"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}