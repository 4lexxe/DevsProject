import React from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { IContent } from "@/course/interfaces/interfaces";

interface ContentListProps {
    sectionId: string;
    contents: Array<IContent>;
    addContent: (sectionId: string) => void;
    editContent: (content: any) => void;
    deleteContent: (contentId: string) => void;
}

const ContentList: React.FC<ContentListProps> = ({ sectionId, contents, addContent, editContent, deleteContent }) => {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-700">Contents</h4>
                <button
                    onClick={() => addContent(sectionId)}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Content
                </button>
            </div>

            {contents.length === 0 ? (
                <p className="text-gray-500 text-sm">No contents added yet.</p>
            ) : (
                <div className="space-y-3">
                    {contents.map((content) => (
                        <div
                            key={content.id}
                            className="bg-gray-50 p-3 rounded-md border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className="font-medium text-gray-800">{content.contentTextTitle}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{content.contentText}</p>
                                    <p className="text-xs text-gray-500 mt-1">Type: {content.type}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => editContent(content)}
                                        className="flex items-center px-2 py-1 text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteContent(content.id)}
                                        className="flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentList;