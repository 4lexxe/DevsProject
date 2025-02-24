import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash2, GripVertical, Plus } from "lucide-react";
import type { IContent } from "@/course/interfaces/Content";
import { useQuizContext } from "@/course/context/QuizFormContext";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { div } from "@tensorflow/tfjs";

export default function DraggableItem({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: IContent;
  index: number;
  onEdit: any;
  onDelete: any;
}) {
  const { quizState, startAddingQuiz, startEditingQuiz } = useQuizContext();
  const { state: sectionState } = useSectionContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ease-in-out"
    >
      {/* Drag Handle */}
      <span
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300 hidden md:block"
      >
        <GripVertical className="w-5 h-5" />
      </span>
 
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

      {/* Actions Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        {/* Quiz Actions */}
        <div className="w-full md:w-auto">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Cuestionario</span>
            {item.quiz && item.quiz.length > 0 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => startEditingQuiz(item.id)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Editar
                </button>
                <button
                  onClick={() => startEditingQuiz(item.id)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Eliminar
                </button>
              </div>
            ) : (
              <button
                onClick={() => startAddingQuiz(item.id)}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Añadir
              </button>
            )}
          </div>
        </div>

        {/* Content Actions */}
        <div className="flex items-center gap-2">
          <button
            data-dndkit-disable-drag
            onClick={() => onEdit(item)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            Editar
          </button>
          <button
            data-dndkit-disable-drag
            onClick={() => onDelete(item.id)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
