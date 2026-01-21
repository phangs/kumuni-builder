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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-4 flex justify-center">
          {/* Mobile frame for preview */}
          <div
            className="bg-white border-4 border-gray-800 rounded-[40px] w-[360px] h-[700px] overflow-hidden flex flex-col relative"
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
                {schema ? (
                  <SduiPage
                    schema={{...schema}}
                    currentPageId={currentPage}
                    onAction={handleAction}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading preview...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile home indicator */}
            <div className="bg-gray-800 h-1 w-32 mx-auto rounded-full mb-2"></div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};