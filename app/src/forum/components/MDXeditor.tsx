import React from 'react';
import { InsertCodeBlock, MDXEditor } from '@mdxeditor/editor';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  BoldItalicUnderlineToggles,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  frontmatterPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  CodeToggle,
  BlockTypeSelect,
  ListsToggle,
  toolbarPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  linkDialogPlugin,
  CreateLink

} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {materialLight} from '@uiw/codemirror-theme-material';

interface MDXEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

const MDXEditorComponent: React.FC<MDXEditorProps> = ({
  initialContent = '# Título\n\nComienza a escribir aquí...',
  onChange,
  placeholder,
  className = '',
  readOnly = false,
  minHeight,
  maxHeight,
}) => {
  return (
    <div 
      className={`mdx-editor-wrapper ${className}`}
      style={{
        minHeight,
        maxHeight,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 transparent',
      }}
    >
      <MDXEditor
        markdown={initialContent}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          frontmatterPlugin(),
          imagePlugin(),
          linkPlugin(),
          tablePlugin(),
          linkDialogPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: initialContent }),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'js',
            
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <ListsToggle />
                  <InsertCodeBlock />
                  <CreateLink />

                </DiffSourceToggleWrapper>
              </>
            )
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              html: 'HTML',
              css: 'CSS',
              java: 'Java',
              mysql: 'MySQL',
              php: 'PHP',
              md: 'Markdown',
              py: 'Python',
              json: 'JSON'
            },
            codeMirrorExtensions: [materialLight],
          })
        ]}
        contentEditableClassName={`
          prose
          max-w-full
          mx-auto
          p-4
          text-gray-700
          prose-headings:text-gray-900
          prose-code:before:content-['']
          prose-code:after:content-['']
          prose-blockquote:border-l-4
          prose-blockquote:border-gray-200
          prose-blockquote:bg-gray-50
          ${readOnly ? 'cursor-default pointer-events-none bg-gray-50' : ''}
        `}
      />
    </div>
  );
};

const globalStyles = `
  .mdx-editor-wrapper {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .mdx-editor-wrapper:hover {
    border-color: #9ca3af;
  }

  

  /* Toolbar styles */
  .mdxeditor-toolbar {
    background-color: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    padding: 8px 12px;
    gap: 4px;
    border-radius: 8px 8px 0 0;
  }

  .mdxeditor-toolbar button {
    color: #4b5563;
    padding: 6px 8px;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .mdxeditor-toolbar button:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  .mdxeditor-toolbar button svg {
    width: 18px;
    height: 18px;
  }

  /* Code blocks */
  

  /* Placeholder styling */
  .mdxeditor-placeholder {
    color: #9ca3af;
    font-style: italic;
    padding-left: 4px;
  }

  /* Table styling */
  .mdxeditor table {
    border-collapse: collapse;
    margin: 16px 0;
  }

  .mdxeditor td, .mdxeditor th {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    background-color: white;
  }

  .mdxeditor th {
    background-color: #f9fafb;
    font-weight: 600;
  }

  /* Image styling */
  .mdxeditor img {
    border-radius: 8px;
    border: 1px solid #f3f4f6;
    margin: 16px 0;
  }
    /* Scrollbar personalizada para el editor */
  .mdx-editor-wrapper {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  .mdx-editor-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .mdx-editor-wrapper::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }

  .mdx-editor-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }

  /* Asegurar altura en elementos internos */
  .mdx-editor-wrapper .cm-editor {
    height: 100% !important;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .mdx-editor-wrapper .cm-scroller {
    overflow: auto !important;
    flex: 1;
  }

  /* Ajustar área editable */
  .mdx-editor-wrapper [contenteditable] {
    min-height: calc(100% - 45px) !important; // Restar altura de la toolbar
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

export default MDXEditorComponent;