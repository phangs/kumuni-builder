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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Mobile frame */}
      <div
        className="bg-white border-4 border-gray-800 rounded-[40px] w-[360px] h-[700px] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
      >
        {/* Mobile notch */}
        <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-lg"></div>

        {/* Screen content - this is where the actual SDUI content renders */}
        <div className="flex-1 overflow-auto bg-white">
          {/* Ensure white background unless specifically set in the page, and override SduiPage's background */}
          <div style={{
            minHeight: '100%',
            padding: 16,
            backgroundColor: schema?.pages?.[0]?.backgroundColor || '#FFFFFF',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <SduiPage
              schema={{...schema}}
              currentPageId={currentPageId}
              onAction={handleAction}
            />
          </div>
        </div>

        {/* Mobile home indicator */}
        <div className="bg-gray-800 h-1 w-32 mx-auto rounded-full mb-2"></div>
      </div>
    </div>
  );
};

export default PreviewPage;