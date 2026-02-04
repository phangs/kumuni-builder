import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { ChevronDown, Copy, Check, Code } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface JsonPreviewPaneProps {
  schema: any; // The flattened schema
  selectedComponentId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JsonPreviewPane: React.FC<JsonPreviewPaneProps> = ({
  schema,
  selectedComponentId,
  isOpen,
  onOpenChange
}) => {
  const [formattedJson, setFormattedJson] = useState('');
  const [copied, setCopied] = useState(false);
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
    if (!selectedComponentId || !containerRef.current || !isOpen) return;

    const timer = setTimeout(() => {
      const jsonString = formattedJson;
      const componentIndex = jsonString.indexOf(`"id": "${selectedComponentId}"`);

      if (componentIndex !== -1) {
        const lines = jsonString.substring(0, componentIndex).split('\n');
        const lineNumber = lines.length;
        const lineHeight = 20;
        const scrollTop = Math.max(0, (lineNumber - 5) * lineHeight);

        if (containerRef.current) {
          containerRef.current.scrollTop = scrollTop;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedComponentId, formattedJson, isOpen]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedJson)
      .then(() => {
        setCopied(true);
        toast.success('JSON copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy JSON: ', err);
        toast.error('Failed to copy JSON to clipboard');
      });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full h-full flex flex-col bg-card">
      <div className="flex-none border-b border-border bg-muted/20">
        <div className="flex items-center justify-between w-full p-3 pl-4 h-12">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-primary" />
            <span className="text-[11px] font-bold text-foreground uppercase tracking-widest">Live Schema JSON</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg transition-all ${copied ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
              title="Copy JSON to clipboard"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <CollapsibleTrigger asChild>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>

      <CollapsibleContent className="flex-1 overflow-hidden data-[state=closed]:hidden">
        <div
          ref={containerRef}
          className="h-full overflow-auto custom-scrollbar bg-[#1e1e1e]"
        >
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              backgroundColor: 'transparent',
              lineHeight: '1.6',
            }}
            wrapLines={true}
            lineProps={(lineNumber: number) => {
              const lineContent = formattedJson.split('\n')[lineNumber - 1] || '';
              if (selectedComponentId && lineContent.includes(`"id": "${selectedComponentId}"`)) {
                return { style: { backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'block', borderLeft: '2px solid #0EA5E9' } };
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