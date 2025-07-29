import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { Plus, Edit, Trash2 } from "lucide-react";
import type { IContent } from "@/course/interfaces/Content";

import DraggableItem from "@/course/components/SectionForm/DraggableItem";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { useState, useEffect } from "react";

export default function DraggableContentList() {
  const {
    state: courseState,
    addContent,
    editContent,
    deleteContent,
    updateContentPosition,
  } = useSectionContext();
  
  const [items, setItems] = useState<IContent[]>([]);
  
  // 🔹 Sincronizar `items` cuando cambie la sección
  useEffect(() => {
    if (courseState.section) {
      setItems([...courseState.section.contents].sort((a, b) => a.position - b.position)); // 🔥 Siempre ordenado
    }
  }, [courseState.section]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
  
    const updatedItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      position: index + 1, // 🔥 Actualiza `position`
    }));
  
    setItems(updatedItems);
    
    updatedItems.forEach((item) => {
      updateContentPosition(item.id, item.position);
    });
  };
  
  const handleDelete = (id: string) => {
    deleteContent(id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-800">Contenidos</h4>
        <button
          onClick={addContent}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir contenido
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Sin contenidos añadidos
        </p>
      ) : (
        <div className="">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {items.map((item, index) => (
                  <DraggableItem
                    key={item.id}
                    index={index}
                    item={item}
                    onEdit={() => editContent(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}