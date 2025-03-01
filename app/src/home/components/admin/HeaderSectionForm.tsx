import React, { useState, useEffect } from 'react';
import { HeaderSection } from '../../services/headerSectionServices';
import { AlertCircle, Image, Type, MessageSquare, Link2, Loader2 } from 'lucide-react';

interface HeaderSectionFormProps {
  initialData: HeaderSection;
  onSubmit: (headerSection: HeaderSection) => void;
  onCancel: () => void;
  isEditing: boolean;
  loading: boolean;
  onChange?: (headerSection: HeaderSection) => void;
}

const HeaderSectionForm: React.FC<HeaderSectionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  loading,
  onChange
}) => {
  const [formData, setFormData] = useState<HeaderSection>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Actualizar el formulario cuando cambian los datos iniciales
  useEffect(() => {
    setFormData(initialData);
    // Resetear los campos tocados cuando cambian los datos iniciales
    setTouchedFields({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Marcar el campo como tocado
    if (!touchedFields[name]) {
      setTouchedFields({
        ...touchedFields,
        [name]: true
      });
    }
    
    // Notificar cambios al componente padre si existe onChange
    if (onChange) {
      onChange(updatedFormData);
    }
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    
    // Marcar el campo como tocado
    setTouchedFields({
      ...touchedFields,
      [name]: true
    });
    
    // Validar el campo cuando pierde el foco
    validateField(name, formData[name as keyof HeaderSection] as string);
  };

  const validateField = (name: string, value: string): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'El título es obligatorio';
          isValid = false;
        } else if (value.length > 50) {
          newErrors.title = 'El título no debe exceder los 50 caracteres';
          isValid = false;
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'image':
        if (!value.trim()) {
          newErrors.image = 'La URL de la imagen es obligatoria';
          isValid = false;
        } else if (!isValidUrl(value)) {
          newErrors.image = 'Ingrese una URL válida';
          isValid = false;
        } else {
          delete newErrors.image;
        }
        break;
        
      case 'slogan':
        if (!value.trim()) {
          newErrors.slogan = 'El slogan es obligatorio';
          isValid = false;
        } else if (value.length > 100) {
          newErrors.slogan = 'El slogan no debe exceder los 100 caracteres';
          isValid = false;
        } else {
          delete newErrors.slogan;
        }
        break;
        
      case 'about':
        if (!value.trim()) {
          newErrors.about = 'La descripción es obligatoria';
          isValid = false;
        } else if (value.length > 200) {
          newErrors.about = 'La descripción no debe exceder los 200 caracteres';
          isValid = false;
        } else {
          delete newErrors.about;
        }
        break;
        
      case 'buttonName':
        if (!value.trim()) {
          newErrors.buttonName = 'El nombre del botón es obligatorio';
          isValid = false;
        } else if (value.length > 20) {
          newErrors.buttonName = 'El nombre del botón no debe exceder los 20 caracteres';
          isValid = false;
        } else {
          delete newErrors.buttonName;
        }
        break;
        
      case 'buttonLink':
        if (!value.trim()) {
          newErrors.buttonLink = 'El enlace del botón es obligatorio';
          isValid = false;
        } else if (!isValidUrl(value)) {
          newErrors.buttonLink = 'Ingrese una URL válida';
          isValid = false;
        } else {
          delete newErrors.buttonLink;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const fields: (keyof HeaderSection)[] = ['title', 'image', 'slogan', 'about', 'buttonName', 'buttonLink'];
    let isValid = true;
    
    // Marcar todos los campos como tocados
    const allTouched = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouchedFields(allTouched);
    
    // Validar cada campo
    fields.forEach(field => {
      const value = formData[field] as string;
      if (!validateField(field, value)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    
    if (errors[fieldName] && touchedFields[fieldName]) {
      return `${baseClasses} border-red-300 bg-red-50 text-red-900 placeholder-red-300`;
    }
    
    return `${baseClasses} border-gray-300 focus:outline-none`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Título */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            <Type className="h-4 w-4 mr-2 text-gray-400" />
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('title')}
            placeholder="Ej: Aprende desarrollo web"
            disabled={loading}
            maxLength={50}
          />
          {touchedFields.title && errors.title && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.title}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            {formData.title.length}/50 caracteres
          </div>
        </div>

        {/* URL de la Imagen */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="image">
            <Image className="h-4 w-4 mr-2 text-gray-400" />
            URL de la Imagen
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('image')}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={loading}
          />
          {touchedFields.image && errors.image && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.image}
            </div>
          )}
        </div>

        {/* Slogan */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="slogan">
            <Type className="h-4 w-4 mr-2 text-gray-400" />
            Slogan
          </label>
          <input
            type="text"
            id="slogan"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('slogan')}
            placeholder="Ej: Domina las tecnologías más demandadas"
            disabled={loading}
            maxLength={100}
          />
          {touchedFields.slogan && errors.slogan && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.slogan}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            {formData.slogan.length}/100 caracteres
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="about">
            <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
            Descripción
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('about')}
            placeholder="Breve descripción que aparecerá en el carrusel"
            rows={3}
            disabled={loading}
            maxLength={200}
          />
          {touchedFields.about && errors.about && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.about}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            {formData.about.length}/200 caracteres
          </div>
        </div>

        {/* Nombre del Botón */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="buttonName">
            <Type className="h-4 w-4 mr-2 text-gray-400" />
            Nombre del Botón
          </label>
          <input
            type="text"
            id="buttonName"
            name="buttonName"
            value={formData.buttonName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('buttonName')}
            placeholder="Ej: Comenzar ahora"
            disabled={loading}
            maxLength={20}
          />
          {touchedFields.buttonName && errors.buttonName && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.buttonName}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            {formData.buttonName.length}/20 caracteres
          </div>
        </div>

        {/* Enlace del Botón */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1" htmlFor="buttonLink">
            <Link2 className="h-4 w-4 mr-2 text-gray-400" />
            Enlace del Botón
          </label>
          <input
            type="text"
            id="buttonLink"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('buttonLink')}
            placeholder="https://ejemplo.com/pagina"
            disabled={loading}
          />
          {touchedFields.buttonLink && errors.buttonLink && (
            <div className="mt-1 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.buttonLink}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : isEditing ? (
            'Actualizar'
          ) : (
            'Crear'
          )}
        </button>
      </div>
    </form>
  );
};

export default HeaderSectionForm; 