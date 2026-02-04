import React, { useState, useEffect } from 'react';
import { SduiPage } from './components/SduiRenderer';
import { useTheme } from './contexts/ThemeContext';
import { useToast } from './contexts/ToastContext';

// Mock schema for preview - in a real implementation, this would come from the builder
const PreviewPage: React.FC = () => {
  const [schema, setSchema] = useState<any>(null);
  const { colorScheme } = useTheme();
  const { toast } = useToast();

  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  useEffect(() => {
    // Get the schema from sessionStorage
    const storedSchema = sessionStorage.getItem('sdui-preview-schema');

    if (storedSchema) {
      try {
        console.log('Retrieved schema from sessionStorage:', storedSchema); // Debug log
        const parsedSchema = JSON.parse(storedSchema);
        console.log('Parsed schema:', parsedSchema); // Debug log

        // Only accept the flattened schema structure (without success/message wrapper)
        if (parsedSchema && typeof parsedSchema === 'object' && 'pages' in parsedSchema) {
          // It's in the flattened format
          console.log('Validated flattened schema format'); // Debug log

          // Check if there's a stored current page ID from the builder
          const storedCurrentPageId = sessionStorage.getItem('sdui-preview-current-page-id');
          let initialPageId;

          if (storedCurrentPageId) {
            // Use the stored current page ID if it exists in the schema
            const pageExists = parsedSchema.pages.some((page: any) => page.id === storedCurrentPageId);
            if (pageExists) {
              initialPageId = storedCurrentPageId;
            } else {
              // Fallback to navigation or first page if stored ID doesn't exist
              initialPageId = parsedSchema.navigation?.initialPageId || parsedSchema.pages?.[0]?.id || 'welcome';
            }
          } else {
            // Use navigation or first page if no stored ID
            initialPageId = parsedSchema.navigation?.initialPageId || parsedSchema.pages?.[0]?.id || 'welcome';
          }

          console.log('Setting initial page ID:', initialPageId); // Debug log

          setSchema(parsedSchema);
          setCurrentPageId(initialPageId);
          // Initialize navigation history with all pages up to the initial page
          // This simulates the user navigating to the current page from the beginning
          const allPages = parsedSchema.pages || [];
          const initialPageIndex = allPages.findIndex((page: any) => page.id === initialPageId);

          if (initialPageIndex > 0) {
            // If the initial page is not the first page, create history from first page to initial page
            const historyUpToInitial = allPages.slice(0, initialPageIndex + 1).map((page: any) => page.id);
            setNavigationHistory(historyUpToInitial);
          } else {
            // If the initial page is the first page, just start with that page
            setNavigationHistory([initialPageId]);
          }
        } else {
          // Invalid format
          console.error('Invalid schema format:', parsedSchema); // Debug log
          throw new Error("Invalid schema format. Please use the flattened schema structure.");
        }
      } catch (e) {
        console.error('Error parsing schema:', e);
        // Show error message to user
        toast.error('Error loading preview: Invalid schema format. Please use the flattened schema structure.');
      }
    } else {
      // If no schema is provided, show an error
      console.log('No schema found in sessionStorage'); // Debug log
      toast.error('No schema provided for preview. Please use the builder to create a design first.');
    }
  }, []);

  const handleAction = (actionId: string, data?: any) => {
    console.log("Action triggered in preview:", actionId, data);

    // Handle navigation actions - these should execute silently without toast
    if (actionId.startsWith('@pushPage:')) {
      const pageId = actionId.split(':')[1];
      if (pageId) {
        // Add the new page to navigation history
        setNavigationHistory(prev => [...prev, pageId]);
        setCurrentPageId(pageId);
      }
    } else if (actionId === '@popPage') {
      // Go back to the previous page in navigation history
      setNavigationHistory(prev => {
        if (prev.length <= 1) {
          // If we're at the first page, stay there
          return prev;
        }
        // Remove the current page and go back to the previous one
        const newHistory = prev.slice(0, -1);
        const previousPageId = newHistory[newHistory.length - 1];
        setCurrentPageId(previousPageId);
        return newHistory;
      });
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

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-screen bg-background relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-6 shadow-lg shadow-primary/20" />
          <p className="text-foreground font-bold tracking-widest uppercase text-[10px]">Synchronizing Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Mobile device frame */}
        <div
          className="bg-[#0f1115] border-[12px] border-[#1a1c21] rounded-[3.5rem] w-[375px] h-[812px] overflow-hidden flex flex-col relative shadow-[0_0_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        >
          {/* Mobile hardware details */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1a1c21] rounded-b-[1.5rem] z-20 flex items-center justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-white/5" />
            <div className="w-12 h-1 rounded-full bg-white/10" />
          </div>

          <div className="absolute top-2 left-10 text-[10px] font-bold text-white/40 z-20">9:41</div>
          <div className="absolute top-2 right-10 flex gap-1 z-20">
            <div className="w-3 h-3 rounded-full border border-white/20" />
            <div className="w-3 h-3 rounded-full border border-white/20" />
          </div>

          {/* Screen content */}
          <div className="flex-1 overflow-auto bg-white relative mt-1 mx-1 rounded-[2.8rem] overflow-hidden">
            <div style={{
              minHeight: '100%',
              backgroundColor: schema?.pages?.find((p: any) => p.id === currentPageId)?.backgroundColor || '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <SduiPage
                schema={{ ...schema }}
                currentPageId={currentPageId}
                onAction={handleAction}
              />
            </div>
          </div>

          {/* Home indicator */}
          <div className="h-6 flex items-center justify-center">
            <div className="w-24 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Back button or controls if needed */}
        <div className="mt-12 flex gap-4">
          <button
            onClick={() => window.close()}
            className="px-8 py-3 bg-card border border-border/60 text-foreground font-bold text-sm rounded-2xl hover:bg-muted transition-all shadow-xl"
          >
            Exit Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;