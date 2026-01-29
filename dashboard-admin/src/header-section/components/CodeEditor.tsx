import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'plaintext';
  placeholder?: string;
  height?: string;
  label?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = '',
  height = '400px',
  label
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getLanguageLabel = () => {
    switch (language) {
      case 'html': return 'HTML';
      case 'css': return 'CSS';
      case 'javascript': return 'JavaScript';
      case 'typescript': return 'TypeScript';
      default: return 'Texto';
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 m-4 rounded-lg' : ''}`}>
      {/* Header del Editor */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-300">
            {label || getLanguageLabel()}
          </span>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Editor */}
      <div style={{ height: isFullscreen ? 'calc(100vh - 80px)' : height }}>
        <Editor
          height="100%"
          language={language}
          value={value || ''}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Overlay para pantalla completa */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
};

export default CodeEditor;
