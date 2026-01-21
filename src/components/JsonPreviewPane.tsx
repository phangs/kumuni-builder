import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface JsonPreviewPaneProps {
  schema: any; // The flattened schema
  selectedComponentId: string | null;
}

export const JsonPreviewPane: React.FC<JsonPreviewPaneProps> = ({ schema, selectedComponentId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formattedJson, setFormattedJson] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Format the JSON whenever the schema changes
  useEffect(() => {
    try {
      setFormattedJson(JSON.stringify(schema, null, 2));
    } catch (error) {
      console.error('Error formatting JSON:', error);
      setFormattedJson('Error formatting JSON');
    }
  }, [schema]);

  // Scroll to the selected component in the JSON
  useEffect(() => {
    if (!selectedComponentId || !containerRef.current) return;

    // Use a slight delay to ensure DOM is updated
    const timer = setTimeout(() => {
      // Find the component in the JSON string and scroll to it
      const jsonString = formattedJson;
      const componentIndex = jsonString.indexOf(`"id": "${selectedComponentId}"`);

      if (componentIndex !== -1) {
        // Calculate approximate position to scroll to
        const lines = jsonString.substring(0, componentIndex).split('\n');
        const lineNumber = lines.length;

        // Scroll to approximately that line
        const lineHeight = 20; // Approximate line height in pixels
        const scrollTop = Math.max(0, (lineNumber - 5) * lineHeight); // Scroll to 5 lines before the component

        if (containerRef.current) {
          containerRef.current.scrollTop = scrollTop;
        }
      }
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [selectedComponentId, formattedJson]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-md transition-colors">
          <span>Live JSON Preview</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(formattedJson)
                  .then(() => {
                    toast.success('JSON copied to clipboard!');
                  })
                  .catch(err => {
                    console.error('Failed to copy JSON: ', err);
                    toast.error('Failed to copy JSON to clipboard');
                  });
              }}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Copy JSON to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <CollapsibleTrigger asChild>
              <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div
          ref={containerRef}
          className="h-96 overflow-auto border border-gray-200 rounded-b-md bg-gray-50"
        >
          <SyntaxHighlighter
            language="json"
            style={vs}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              maxHeight: '100%',
              overflow: 'visible', // Allow scrolling within the container
              backgroundColor: '#f8f9fa', // Consistent light gray background
            }}
            wrapLines={true}
            lineProps={(lineNumber: number) => {
              const lineContent = formattedJson.split('\n')[lineNumber - 1] || '';
              if (selectedComponentId && lineContent.includes(`"id": "${selectedComponentId}"`)) {
                return { style: { backgroundColor: '#ffeb3b40', display: 'block' } }; // Highlight selected component
              }
              return { style: { display: 'block' } };
            }}
          >
            {formattedJson}
          </SyntaxHighlighter>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};