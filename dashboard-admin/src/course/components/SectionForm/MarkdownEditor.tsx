import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  error?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe tu contenido en Markdown aquí...',
  height = '600px',
  label = 'Editor de Markdown',
  error
}) => {
  // Detectar tema del sistema o del HTML
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <div 
        className={`border rounded-lg overflow-hidden ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
        data-color-mode={theme}
      >
        <MDEditor
          value={value || ''}
          onChange={(val) => handleChange(val || '')}
          preview="edit"
          hideToolbar={false}
          height={parseInt(height.replace('px', '') || '600') || 600}
          data-color-mode={theme}
          textareaProps={{
            placeholder: placeholder,
          }}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default MarkdownEditor;
