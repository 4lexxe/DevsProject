import React, { useState, useEffect } from 'react';
import { type HeaderSection } from '../services/headerSectionServices';
import { AlertCircle, Image, Type, MessageSquare, Link2, Loader2, Code, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import InputFile from './InputFile';
import CodeEditor from './CodeEditor';

interface HeaderSectionFormProps {
  initialData: HeaderSection;
  onSubmit: (headerSection: HeaderSection) => void;
  onCancel: () => void;
  isEditing: boolean;
  loading: boolean;
}

const HeaderSectionForm: React.FC<HeaderSectionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  loading,
}) => {
  const [formData, setFormData] = useState<HeaderSection>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Actualizar el formulario cuando cambian los datos iniciales (por ejemplo, al editar otra sección)
  useEffect(() => {
    setFormData(initialData);
    setTouchedFields({});
    setErrors({});
  }, [initialData.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const baseClasses = "w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500";
    
    if (errors[fieldName] && touchedFields[fieldName]) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    
    return `${baseClasses} focus:outline-none`;
  };

  // Manejar cambio de imagen
  const handleImageChange = (fileUrl: string | null) => {
    const updatedFormData = {
      ...formData,
      image: fileUrl || ''
    };
    
    setFormData(updatedFormData);
    
    // Marcar el campo como tocado
    if (!touchedFields.image) {
      setTouchedFields({
        ...touchedFields,
        image: true
      });
    }
    
    // Limpiar error cuando el usuario cambia la imagen
    if (errors.image) {
      setErrors({
        ...errors,
        image: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Título */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="title">
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
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.title}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            {formData.title.length}/50 caracteres
          </div>
        </div>

        {/* Badge Text */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="badgeText">
            <Type className="h-4 w-4 mr-2 text-gray-400" />
            Texto del Badge
          </label>
          <input
            type="text"
            id="badgeText"
            name="badgeText"
            value={formData.badgeText || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldClassName('badgeText')}
            placeholder="Ej: Developer Path"
            disabled={loading}
            maxLength={30}
          />
          {touchedFields.badgeText && errors.badgeText && (
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.badgeText}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            {(formData.badgeText || '').length}/30 caracteres
          </div>
        </div>

        {/* URL de la Imagen */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="image">
            <Image className="h-4 w-4 mr-2 text-gray-400" />
            Imagen de Fondo
          </label>
          <div className="mt-1">
            <InputFile
              value={formData.image}
              onChange={handleImageChange}
              error={touchedFields.image ? errors.image : undefined}
              disabled={loading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Tamaño recomendado: 1920x1080 píxeles
          </p>
        </div>

        {/* Slogan */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="slogan">
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
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.slogan}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            {formData.slogan.length}/100 caracteres
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="about">
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
            rows={4}
            disabled={loading}
            maxLength={200}
          />
          {touchedFields.about && errors.about && (
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.about}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            {formData.about.length}/200 caracteres
          </div>
        </div>

        {/* Nombre del Botón */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="buttonName">
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
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.buttonName}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex justify-end">
            {formData.buttonName.length}/20 caracteres
          </div>
        </div>

        {/* Enlace del Botón */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-300 mb-2" htmlFor="buttonLink">
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
            <div className="mt-2 flex items-center text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.buttonLink}
            </div>
          )}
        </div>

        {/* Sección de Personalización Avanzada */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <div className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personalización Avanzada</h3>
            </div>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-6 pt-4">
              {/* Tipo de Contenido */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contentType">
                  <Code className="h-4 w-4 mr-2 text-gray-400" />
                  Tipo de Contenido
                </label>
                <select
                  id="contentType"
                  name="contentType"
                  value={formData.contentType || 'default'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                >
                  <option value="default">Por Defecto</option>
                  <option value="code">Editor de Código</option>
                  <option value="iframe">Iframe</option>
                  <option value="custom">HTML/CSS/JS Personalizado</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Selecciona cómo se mostrará el contenido en el hero
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Code className="h-4 w-4 mr-2 text-gray-400" />
                  Tech Stack (separado por comas)
                </label>
                <input
                  type="text"
                  value={formData.techStack?.join(', ') || ''}
                  onChange={(e) => {
                    const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                    setFormData(prev => ({
                      ...prev,
                      techStack: techs,
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="React, Node, TypeScript, Next.js"
                  disabled={loading}
                />
              </div>

              {/* Código Personalizado (para editor) */}
              {formData.contentType === 'code' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Code className="h-4 w-4 mr-2 text-gray-400" />
                    Código Personalizado
                  </label>
                  <CodeEditor
                    value={formData.customCode || ''}
                    onChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        customCode: value || '',
                      }));
                    }}
                    language="typescript"
                    height="400px"
                    label="Código del Editor"
                  />
                </div>
              )}

              {/* URL de Iframe */}
              {formData.contentType === 'iframe' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="iframeUrl">
                    <Link2 className="h-4 w-4 mr-2 text-gray-400" />
                    URL del Iframe
                  </label>
                  <input
                    type="text"
                    id="iframeUrl"
                    name="iframeUrl"
                    value={formData.iframeUrl || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="https://ejemplo.com/demo"
                    disabled={loading}
                  />
                </div>
              )}

              {/* HTML/CSS/JS Personalizado */}
              {formData.contentType === 'custom' && (
                <>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Code className="h-4 w-4 mr-2 text-gray-400" />
                      HTML Personalizado
                    </label>
                    <CodeEditor
                      value={formData.customHtml || ''}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          customHtml: value || '',
                        }));
                      }}
                      language="html"
                      height="300px"
                      label="HTML"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Code className="h-4 w-4 mr-2 text-gray-400" />
                      CSS Personalizado
                    </label>
                    <CodeEditor
                      value={formData.customCss || ''}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          customCss: value || '',
                        }));
                      }}
                      language="css"
                      height="300px"
                      label="CSS"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Code className="h-4 w-4 mr-2 text-gray-400" />
                      JavaScript Personalizado
                    </label>
                    <CodeEditor
                      value={formData.customJs || ''}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          customJs: value || '',
                        }));
                      }}
                      language="javascript"
                      height="300px"
                      label="JavaScript"
                    />
                  </div>
                </>
              )}

              {/* Colores */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="backgroundColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color de Fondo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      name="backgroundColor"
                      value={formData.backgroundColor || '#ffffff'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor || ''}
                      onChange={handleChange}
                      name="backgroundColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#ffffff o rgb(255,255,255)"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="titleColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color del Título
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="titleColor"
                      name="titleColor"
                      value={formData.titleColor || '#000000'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.titleColor || ''}
                      onChange={handleChange}
                      name="titleColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#000000"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="sloganColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color del Slogan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="sloganColor"
                      name="sloganColor"
                      value={formData.sloganColor || '#666666'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.sloganColor || ''}
                      onChange={handleChange}
                      name="sloganColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#666666"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="textColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color del Texto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="textColor"
                      name="textColor"
                      value={formData.textColor || '#333333'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.textColor || ''}
                      onChange={handleChange}
                      name="textColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#333333"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="buttonColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color del Botón
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="buttonColor"
                      name="buttonColor"
                      value={formData.buttonColor || '#3b82f6'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.buttonColor || ''}
                      onChange={handleChange}
                      name="buttonColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#3b82f6"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="buttonTextColor">
                    <Palette className="h-4 w-4 mr-2 text-gray-400" />
                    Color del Texto del Botón
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="buttonTextColor"
                      name="buttonTextColor"
                      value={formData.buttonTextColor || '#ffffff'}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.buttonTextColor || ''}
                      onChange={handleChange}
                      name="buttonTextColor"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="#ffffff"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-8 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-base font-medium"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center justify-center px-8 py-4 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {isEditing ? 'Guardando...' : 'Creando...'}
            </>
          ) : isEditing ? (
            'Guardar Cambios'
          ) : (
            'Crear Sección'
          )}
        </button>
      </div>
    </form>
  );
};

export default HeaderSectionForm; 