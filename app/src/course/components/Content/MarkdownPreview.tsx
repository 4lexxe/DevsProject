import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Personalizar estilos de componentes
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-gray-800 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-800" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-800" {...props} />,
          li: ({node, ...props}) => <li className="ml-4" {...props} />,
          code: ({node, inline, ...props}: any) => 
            inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400" {...props} />
            ) : (
              <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
            ),
          pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />,
          a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          img: ({node, ...props}) => <img className="rounded-lg my-4 max-w-full h-auto" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} /></div>,
          th: ({node, ...props}) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props} />,
          td: ({node, ...props}) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}