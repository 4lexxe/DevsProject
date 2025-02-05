import React from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useSectionContext } from '@/course/context/SectionContext';
import { IContent } from '../../../interfaces/interfaces'
import { useContentContext } from '@/course/context/ContentContext';
import ContentList from '@/course/components/Forms/Content/ContentList';

export default function SectionList() {
  const { state: sectionState, addSection, editSection, deleteSection } = useSectionContext();
  const { state: contentState, addContent, editContent, deleteContent } = useContentContext();

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
          <button
              onClick={addSection}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </button>
        </div>

        {sectionState.sections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sections added yet.</p>
        ) : (
            <div className="grid gap-6">
              {sectionState.sections.map((section) => {
                const sectionContents: IContent[] = contentState.contents.filter(content => content.sectionId === section.id);

                return (
                    <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                            <p className="text-gray-600 mt-1">{section.description}</p>
                            <p className="text-sm text-gray-500 mt-2">Type: {section.moduleType}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                                onClick={() => editSection(section)}
                                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                                onClick={() => deleteSection(section.id)}
                                className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                        {section.coverImage && (
                            <img
                                src={section.coverImage}
                                alt={section.title}
                                className="mt-4 w-full h-48 object-cover rounded-md"
                            />
                        )}
                      </div>

                      {/* Usando el nuevo componente ContentList */}
                      <ContentList
                          sectionId={section.id}
                          contents={sectionContents}
                          addContent={addContent}
                          editContent={editContent}
                          deleteContent={deleteContent}
                      />
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}