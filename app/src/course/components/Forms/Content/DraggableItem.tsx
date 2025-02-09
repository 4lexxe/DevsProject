import { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash2, GripVertical } from "lucide-react";
import type { IContent } from "@/course/interfaces/interfaces";

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
      className="flex items-center p-2 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab px-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
      >
        <GripVertical className="w-6 h-6" />
      </span>

      <div className="flex-1 px-4 space-y-2">
        <h5 className="font-semibold text-gray-800 text-lg leading-tight">
          {index + 1}.
          {item.contentTextTitle ||
            item.contentImageTitle ||
            item.contentFileTitle ||
            item.contentVideoTitle ||
            item.externalLinkTitle ||
            item.quizTitle}
        </h5>
        <p className="text-sm text-gray-600 line-clamp-2">
            {item.contentText ||
            item?.duration}
            </p>
        <div className="flex items-center space-x-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
            {item.type}
          </span>
          <span className="text-xs text-gray-400">
            {/* You can add additional info here, like date or length */}
            {/* For example: {new Date(item.createdAt).toLocaleDateString()} */}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          data-dndkit-disable-drag
          onClick={() => onEdit(item)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
          aria-label="Edit content"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          data-dndkit-disable-drag
          onClick={() => onDelete(item.sectionId, item.id)}
          className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
          aria-label="Delete content"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
