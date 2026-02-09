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

import { Plus } from "lucide-react";
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
  const [pendingUpdates, setPendingUpdates] = useState<{ contentId: string; position: number }[]>([]);
  
  //  Sincronizar `items` cuando cambie la sección
  useEffect(() => {
    if (courseState.section) {
      setItems([...courseState.section.contents].sort((a, b) => a.position - b.position)); //  Siempre ordenado
    }
  }, [courseState.section]);

  //  Ejecutar actualizaciones de posición de forma asíncrona
  useEffect(() => {
    if (pendingUpdates.length > 0) {
      const timer = setTimeout(() => {
        pendingUpdates.forEach((update) => {
          updateContentPosition(update.contentId, update.position);
        });
        setPendingUpdates([]);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [pendingUpdates, updateContentPosition]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = items.findIndex((item) => item.contentId === active.id);
    const newIndex = items.findIndex((item) => item.contentId === over.id);
  
    const updatedItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      position: index + 1, //  Actualiza `position`
    }));
  
    setItems(updatedItems);
    
    //  Programa las actualizaciones para ejecutarse de forma asíncrona
    const updates = updatedItems.map(item => ({ contentId: item.contentId, position: item.position }));
    setPendingUpdates(updates);
  };
  
  const handleDelete = (contentId: string) => {
    // Eliminar el contenido del contexto
    deleteContent(contentId);
    
    // Actualizar el estado local eliminando el item y reestructurando posiciones
    setItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.contentId !== contentId);
      
      // Reestructurar las posiciones de los elementos restantes
      const reorderedItems = filteredItems.map((item, index) => ({
        ...item,
        position: index + 1, // Nueva posición basada en el índice
      }));
      
      //  Programa las actualizaciones para ejecutarse de forma asíncrona
      const updates = reorderedItems.map(item => ({ contentId: item.contentId, position: item.position }));
      setPendingUpdates(updates);
      
      return reorderedItems;
    });
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
              items={items.map(item => item.contentId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {items.map((item, index) => (
                  <DraggableItem
                    key={item.contentId}
                    index={index}
                    item={item}
                    onEdit={() => editContent(item)}
                    onDelete={() => handleDelete(item.contentId)}
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