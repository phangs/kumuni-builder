import React, { useState } from 'react';
import { SduiPage } from './SduiRenderer';
import { useToast } from '../contexts/ToastContext';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: any;
  currentPageId: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  schema,
  currentPageId: initialPageId
}) => {
  const { toast } = useToast();
  // Initialize with the initialPageId, or fallback to the first page in schema if initialPageId is empty
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (initialPageId) {
      return initialPageId;
    } else if (schema && schema.pages && schema.pages.length > 0) {
      return schema.pages[0].id;
    }
    return '';
  });

  if (!isOpen) {
    return null;
  }

  const handleAction = (actionId: string, data?: any) => {
    console.log("Action triggered in preview:", actionId, data);

    // Handle navigation actions - these should execute silently without toast
    if (actionId.startsWith('@pushPage:')) {
      const pageId = actionId.split(':')[1];
      if (pageId) {
        setCurrentPage(pageId);
      }
    } else if (actionId === '@popPage') {
      // Go back to the previous page in navigation history
      // For simplicity, we'll just go back to the initial page
      setCurrentPage(initialPageId);
    } else if (actionId === '@submitForm') {
      // Handle form submission
      toast.success('Form submitted successfully!');
    } else if (actionId.startsWith('{"type":"@toast"')) {
      // Handle toast action from JSON string
      try {
        const actionObj = JSON.parse(actionId);
        if (actionObj.params?.message) {
          toast.info(actionObj.params.message);
        } else {
          toast.info('Toast message displayed!');
        }
      } catch (e) {
        console.error('Error parsing toast action:', e);
        toast.info('Action executed!');
      }
    } else if (actionId === '@toast') {
      // Handle simple toast action
      toast.info('Toast message displayed!');
    } else if (actionId === '@register') {
      // Handle registration action
      toast.info('Registration initiated!');
    } else {
      // For other actions, just execute without feedback or minimal feedback
      console.log(`Action "${actionId}" executed!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm shadow-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-card border border-border/60 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-border/40 flex justify-between items-center bg-muted/20">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Live Simulator</p>
            <h2 className="text-xl font-bold text-foreground tracking-tight">App Preview</h2>
          </div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground transition-colors group"
            onClick={onClose}
            aria-label="Close preview"
          >
            <div className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</div>
          </button>
        </div>

        <div className="p-10 flex-1 overflow-auto flex justify-center bg-muted/10 dot-pattern">
          {/* Mobile frame for preview */}
          <div
            className="bg-[#0f1115] border-[8px] border-[#1a1c21] rounded-[3.5rem] w-[340px] h-[680px] overflow-hidden flex flex-col relative shadow-2xl ring-1 ring-white/10"
          >
            {/* Mobile sensor housing / notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1c21] rounded-b-[1.5rem] z-20 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/5" />
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>

            {/* Screen content */}
            <div className="flex-1 overflow-auto bg-white relative mt-1 mx-1 rounded-[2.8rem] overflow-hidden">
              <div style={{
                minHeight: '100%',
                backgroundColor: schema?.pages?.find((p: any) => p.id === currentPage)?.backgroundColor || '#FFFFFF',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {schema ? (
                  <SduiPage
                    schema={{ ...schema }}
                    currentPageId={currentPage}
                    onAction={handleAction}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
                      <p className="text-sm font-medium text-muted-foreground">Initializing Preview...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile home indicator */}
            <div className="h-6 flex items-center justify-center">
              <div className="w-24 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-t border-border/40 flex justify-end bg-muted/20">
          <button
            className="px-6 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-all border border-border"
            onClick={onClose}
          >
            Exit Preview
          </button>
        </div>
      </div>
    </div>
  );
};