"use client"

import { useState } from "react"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"

import { Plus } from "lucide-react"
import type { IContent } from "@/course/interfaces/interfaces"
import { useContentContext } from "@/course/context/ContentContext"

import DraggableItem from "@/course/components/Forms/Content/DraggableItem";

interface DraggableContentProps {
    sectionId: string
}

export default function DraggableContentList({ sectionId }: DraggableContentProps) {
    const { state: contentState, addContent, editContent, deleteContent } = useContentContext()

    const [items, setItems] = useState<IContent[]>(
        contentState.contents.filter((content) => content.sectionId === sectionId),
    )

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        setItems(arrayMove(items, oldIndex, newIndex))
    }

    const handleDelete = (id: string) => {
        deleteContent(id); // Eliminar del contexto
        setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Actualizar el estado local
    };

    return (
        <div className=" p-4 ">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-gray-800">Contenidos</h4>
                <button
                    onClick={() => addContent(sectionId)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir contenido
                </button>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Sin contenidos añadidos</p>
            ) : (
                <div className="min-h-2 max-h-64 overflow-y-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <DraggableItem key={item.id} index={index} item={item} onEdit={editContent} onDelete={handleDelete} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

            )}
        </div>
    )
}



