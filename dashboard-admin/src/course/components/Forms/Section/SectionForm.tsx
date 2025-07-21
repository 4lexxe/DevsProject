import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { getSectionById } from "@/course/services/sectionServices";
import { useSectionContext } from "@/course/context/SectionFormContext";
import type { ISectionInput } from "@/course/interfaces/CourseForm";
import { sectionSchema, moduleTypes } from "@/course/validations/sectionSchema";
import {
  BookOpen,
  Image as ImageIcon,
  Type,
  FileText,
  Loader2,
  X as CloseIcon,
  Save as SaveIcon,
  Palette,
} from "lucide-react";
import { ColorSelector } from "../../colors/ColorSelector";
import { ColorPicker } from "../../colors/ColorPicker";

export default function SectionForm() {
  const navigate = useNavigate();
  const {
    state: sectionState,
    cancelEdit,
    setSection,
    editSection,
    startEditingSection,
  } = useSectionContext();
  const { sectionId } = useParams<{ sectionId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<"color1" | "color2" | null>(null);
  const [pickerType, setPickerType] = useState<"default" | "custom">("default");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISectionInput>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: sectionState.section?.title || "",
      description: sectionState.section?.description || "",
      moduleType: sectionState.section?.moduleType || "",
      coverImage: sectionState.section?.coverImage || "",
      colorGradient: sectionState.section?.colorGradient || ["#FFFFFF", "#000000"],
    },
  });

  const colorGradient = watch("colorGradient");

  const handleCancel = () => {
    if (sectionId) {
      reset({
        title: sectionState.section?.title || "",
        description: sectionState.section?.description || "",
        moduleType: sectionState.section?.moduleType || "",
        coverImage: sectionState.section?.coverImage || "",
        colorGradient: sectionState.section?.colorGradient || ["#FFFFFF", "#000000"],
      });
      cancelEdit();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (sectionId && !sectionState.section) {
      const fetchSection = async () => {
        setIsLoading(true);
        try {
          const sectionData = await getSectionById(sectionId);
          setSection(sectionData);
          startEditingSection();
          reset({
            ...sectionData,
            colorGradient: sectionData.colorGradient || ["#FFFFFF", "#000000"],
          });
        } catch (error) {
          console.error("Error al cargar la sección:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSection();
    }
  }, [sectionId, sectionState.section, setSection, startEditingSection, reset]);

  useEffect(() => {
    if (sectionState.section) {
      reset({
        title: sectionState.section.title,
        description: sectionState.section.description,
        moduleType: sectionState.section.moduleType,
        coverImage: sectionState.section.coverImage,
        colorGradient: sectionState.section.colorGradient,
      });
    }
  }, [sectionState.section, reset]);

  const handleColorChange = (color: string, index: number) => {
    const newColors = [...colorGradient] as [string, string];
    newColors[index] = color;
    setValue("colorGradient", newColors);
    setShowColorPicker(null);
    setPickerType("default");
  };

  const onSubmit = (data: ISectionInput) => {
    if (!sectionState.isEditingSection) {
      setSection({ ...data, contents: [] });
    } else {
      editSection(data);
    }
    /* handleCancel(); */
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sectionId && !sectionState.section && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No se encontró la sección.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          {sectionState.isEditingSection ? "Editar Sección" : "Añadir Nueva Sección"}
        </h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4" /> Título
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Ingrese el título"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" /> Tipo de Módulo
              </label>
              <select
                {...register("moduleType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione un tipo</option>
                {moduleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.moduleType && (
                <p className="mt-1 text-sm text-red-600">{errors.moduleType.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="h-4 w-4" /> Imagen de Portada
            </label>
            <input
              type="url"
              {...register("coverImage")}
              placeholder="URL de la imagen"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.coverImage && (
              <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" /> Descripción
            </label>
            <textarea
              {...register("description")}
              placeholder="Describa la sección"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-4 w-4" /> Color Primario
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("colorGradient.0")}
                  placeholder="#FFFFFF"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowColorPicker("color1")}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  style={{ backgroundColor: colorGradient?.[0] }}
                >
                  <Palette className="h-4 w-4" />
                </button>
              </div>
              {errors.colorGradient?.[0] && (
                <p className="mt-1 text-sm text-red-600">{errors.colorGradient[0].message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-4 w-4" /> Color Secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("colorGradient.1")}
                  placeholder="#000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowColorPicker("color2")}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  style={{ backgroundColor: colorGradient?.[1] }}
                >
                  <Palette className="h-4 w-4" />
                </button>
              </div>
              {errors.colorGradient?.[1] && (
                <p className="mt-1 text-sm text-red-600">{errors.colorGradient[1].message}</p>
              )}
            </div>
          </div>

          {showColorPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Seleccionar {showColorPicker === "color1" ? "Color Primario" : "Color Secundario"}
                </h3>
                
                {pickerType === 'default' ? (
                  <ColorSelector
                    selectedColor={colorGradient?.[showColorPicker === "color1" ? 0 : 1]}
                    onColorSelect={(color) => handleColorChange(color, showColorPicker === "color1" ? 0 : 1)}
                    onCustomColorRequest={() => setPickerType('custom')}
                  />
                ) : (
                  <ColorPicker
                    onChange={(color) => handleColorChange(color, showColorPicker === "color1" ? 0 : 1)}
                  />
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    setShowColorPicker(null);
                    setPickerType('default');
                  }}
                  className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CloseIcon className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}