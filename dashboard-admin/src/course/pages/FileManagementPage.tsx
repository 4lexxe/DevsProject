import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Trash2, Upload, Globe, Lock, FileText, GripVertical } from 'lucide-react';
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { 
  getContentFiles, 
  deleteFile, 
  reorderFiles,
  ContentFile,
  formatFileSize,
  getFileTypeInfo
} from '../services/contentFileService';

// Componente sortable para cada archivo
function SortableFileItem({ file, onDelete }: {
  file: ContentFile;
  onDelete: (fileId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getFileIcon = (fileType: ContentFile['fileType']) => {
    const typeInfo = getFileTypeInfo(fileType);
    return <FileText className={`h-5 w-5 ${typeInfo.color}`} />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {getFileIcon(file.fileType)}
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{file.originalName}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{formatFileSize(file.fileSize)}</span>
              <span className="capitalize">{file.fileType.replace('_', ' ')}</span>
              <span>{new Date(file.createdAt).toLocaleDateString()}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Pos: {file.position}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {/* View File */}
          {file.driveWebViewLink && (
            <a
              href={file.driveWebViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              title="Ver archivo"
            >
              <Eye className="h-4 w-4" />
            </a>
          )}

          {/* Download File */}
          <a
            href={file.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
            title="Descargar archivo"
          >
            <Download className="h-4 w-4" />
          </a>

          {/* Delete File */}
          <button
            onClick={() => onDelete(file.id.toString())}
            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar archivo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FileManagementPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Sensors para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchFiles();
  }, [contentId]);

  const fetchFiles = async () => {
    if (!contentId) return;
    
    try {
      setLoading(true);
      const filesData = await getContentFiles(contentId, {
        orderBy: 'position',
        order: 'ASC'
      });
      // Asegurar que los archivos están ordenados por position
      const sortedFiles = filesData.sort((a, b) => a.position - b.position);
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar el drag & drop
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = files.findIndex((file) => file.id.toString() === active.id);
    const newIndex = files.findIndex((file) => file.id.toString() === over.id);

    // Reordenar archivos y actualizar posiciones
    const updatedFiles = arrayMove(files, oldIndex, newIndex).map((file, index) => ({
      ...file,
      position: index + 1,
    }));

    setFiles(updatedFiles);

    // Actualizar posiciones en el servidor usando batch operation
    try {
      const fileOrders = updatedFiles.map((file) => ({
        fileId: file.id.toString(),
        position: file.position
      }));
      
      await reorderFiles(contentId!, fileOrders);
      console.log('Posiciones actualizadas correctamente');
    } catch (error) {
      console.error('Error al actualizar posiciones:', error);
      // Revertir cambios en caso de error
      fetchFiles();
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;
    
    try {
      await deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id.toString() !== fileId));
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando archivos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Archivos
            </h1>
          </div>
          
          <button
            onClick={() => navigate(`/contents/${contentId}/files/upload`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Subir Archivos
          </button>
        </div>

        {/* Files Grid */}
        <div className="bg-white rounded-lg shadow-sm">
          {files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay archivos
              </h3>
              <p className="text-gray-500 mb-4">
                Aún no se han subido archivos para este contenido.
              </p>
              <button
                onClick={() => navigate(`/contents/${contentId}/files/upload`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Subir primer archivo
              </button>
            </div>
          ) : (
            <div className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map(f => f.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {files.map((file) => (
                      <SortableFileItem
                        key={file.id.toString()}
                        file={file}
                        onDelete={handleDeleteFile}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {files.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                <div className="text-sm text-gray-500">Total archivos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(files.reduce((sum, file) => sum + file.fileSize, 0))}
                </div>
                <div className="text-sm text-gray-500">Tamaño total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {files.filter(f => f.isPublic).length}
                </div>
                <div className="text-sm text-gray-500">Públicos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {files.filter(f => !f.isPublic).length}
                </div>
                <div className="text-sm text-gray-500">Privados</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
