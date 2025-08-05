import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash2, GripVertical } from "lucide-react";
import type { IContent } from "@/course/interfaces/Content";

export default function DraggableItem({
  item,
  index,
  onEdit,
  onDelete,
  isDragging,
}: {
  item: IContent;
  index: number;
  onEdit: any;
  onDelete: any;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.contentId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // Eliminar transición durante el arrastre
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white rounded-xl border ${
        isDragging 
          ? 'shadow-xl border-blue-300 opacity-80'
          : 'shadow-sm border-gray-100 hover:shadow-md'
      } transition-shadow duration-200`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab p-2 text-gray-400 hover:text-gray-600 active:cursor-grabbing transition-colors duration-200 hidden md:flex items-center justify-center"
      >
        <GripVertical className="w-5 h-5" />
      </div>
 
      {/* Content Section */}
      <div className="flex-1 ml-8 space-y-2">
        <h5 className="font-semibold text-gray-800 text-lg">
          {index + 1}. {item.title || "Sin título"}
        </h5>
        <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">
          {item.text || item?.duration}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            WOW
          </span>
        </div>
      </div>

      {/* Actions Section - No modificar eventos durante el arrastre */}
      <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto ${isDragging ? 'pointer-events-none' : ''}`}>

        {/* Content Actions */}
        <div className="flex items-center gap-2">
          <button
            data-dndkit-disable-drag
            onClick={() => onEdit(item)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            Editar
          </button>
          <button
            data-dndkit-disable-drag
            onClick={() => onDelete(item.contentId)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
