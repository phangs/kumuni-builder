import React, { useState, useEffect, useRef } from 'react';
import { CanvasPanel } from './components/CanvasPanel';
import { ComponentsPanel } from './components/ComponentsPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { JsonPreviewPane } from './components/JsonPreviewPane';
import { SettingsPanel } from './components/SettingsPanel';
import { SduiPage } from './components/SduiRenderer';
import { PreviewModal } from './components/PreviewModal';
import { SDUISchema } from './types/sdui';
import { useToast } from './contexts/ToastContext';

function App() {
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [currentPageId, setCurrentPageId] = useState<string>('welcome'); // Will be updated after schema loads
  const [selectedTab, setSelectedTab] = useState<'properties' | 'settings'>('properties');
  const [isImporting, setIsImporting] = useState<boolean>(false); // Flag to track import state
  const prevNavigationRef = useRef<any>(null); // Ref to track previous navigation settings
  const { toast } = useToast();
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [previewSchema, setPreviewSchema] = useState<any>(null);
  const [previewCurrentPageId, setPreviewCurrentPageId] = useState<string>('welcome');
  const [canvasSchema, setCanvasSchema] = useState<SDUISchema>({
    id: "builder-app",
    version: "1.0",
    name: "Builder App",
    description: "SDUI Builder Application",
    slug: "builder-app",
    is_public: false,
    is_published: false,
    published_at: null,
    navigation: {
      guestPageId: "welcome",
      initialPageId: "welcome"
    },
    pages: [
      {
        id: "welcome",
        order: 0,
        title: "Welcome",
        components: []
      }
    ],
    metadata: {
      revision: 1,
      createdBy: "builder"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Update currentPageId when schema changes (but not during import and only if navigation settings changed)
  useEffect(() => {
    if (!isImporting) {
      const currentNav = canvasSchema.navigation;
      const prevNav = prevNavigationRef.current;

      // Only update if navigation settings have actually changed
      if (JSON.stringify(currentNav) !== JSON.stringify(prevNav)) {
        // Update the ref with current navigation
        prevNavigationRef.current = currentNav;

        if (currentNav?.initialPageId) {
          setCurrentPageId(currentNav.initialPageId);
        } else if (canvasSchema.pages?.[0]) {
          setCurrentPageId(canvasSchema.pages[0].id);
        }
      }
    }
  }, [canvasSchema, isImporting]);

  const handleComponentSelect = (component: any) => {
    if (component === null) {
      // If component is null, deselect the current component
      setSelectedComponent(null);
    } else {
      // Otherwise, select the component
      setSelectedComponent(component);
    }
  };

  const handleComponentUpdate = (updatedComponent: any) => {
    // Update the selected component in the schema
    const updatedPages = canvasSchema.pages.map(page => {
      const updateComponents = (components: any[]) => {
        return components.map(comp => {
          if (comp.id === updatedComponent.id) {
            return updatedComponent;
          }
          return comp;
        });
      };

      return {
        ...page,
        components: updateComponents(page.components)
      };
    });

    setCanvasSchema({
      ...canvasSchema,
      pages: updatedPages
    });

    setSelectedComponent(updatedComponent);
  };

  const handlePageUpdate = (updatedPage: any) => {
    // Update the selected page in the schema
    const updatedPages = canvasSchema.pages.map(page => {
      if (page.id === updatedPage.id) {
        return updatedPage;
      }
      return page;
    });

    setCanvasSchema({
      ...canvasSchema,
      pages: updatedPages
    });
  };

  const handleAddComponent = (componentType: string) => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: componentType,
      props: getDefaultProps(componentType),
      gridRow: canvasSchema.pages.find(page => page.id === currentPageId)?.components.length || 0,
      rowSpan: 1
    };

    // Add to the current page
    const updatedPages = canvasSchema.pages.map((page) => {
      if (page.id === currentPageId) {
        return {
          ...page,
          components: [...page.components, newComponent]
        };
      }
      return page;
    });

    setCanvasSchema({
      ...canvasSchema,
      pages: updatedPages
    });
  };

  const handleDeleteComponent = (componentId: string) => {
    // Remove the component from the schema
    const updatedPages = canvasSchema.pages.map(page => {
      return {
        ...page,
        components: page.components.filter(comp => comp.id !== componentId)
      };
    });

    setCanvasSchema({
      ...canvasSchema,
      pages: updatedPages
    });

    // If the deleted component was selected, clear selection
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleReorderComponents = (newOrder: any[]) => {
    // Update the component order in the schema
    const updatedPages = canvasSchema.pages.map((page, pageIndex) => {
      if (pageIndex === 0) { // Working with the first page
        return {
          ...page,
          components: newOrder
        };
      }
      return page;
    });

    setCanvasSchema({
      ...canvasSchema,
      pages: updatedPages
    });
  };

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'text':
        return {
          text: 'Sample Text',
          style: {}
        };
      case 'heading':
        return {
          text: 'Sample Heading',
          style: {}
        };
      case 'button':
        return {
          title: 'Button',
          variant: 'primary'
        };
      case 'text-input':
        return {
          label: 'Input Label',
          placeholder: 'Enter text...',
          keyboardType: 'default',
          autoCapitalize: 'words'
        };
      case 'textarea':
        return {
          label: 'Textarea Label',
          placeholder: 'Enter text...',
          rows: 3,
          autoCapitalize: 'sentences'
        };
      case 'date-picker':
        return {
          label: 'Select Date',
          placeholder: 'Select date'
        };
      case 'image':
        return {
          source: 'https://via.placeholder.com/150',
        };
      case 'spacer':
        return {
          size: 16
        };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top toolbar */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Kumuni Builder - SDUI Designer</h1>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={() => {
              // Create a hidden file input
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.json';
              fileInput.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const importedSchema = JSON.parse(event.target?.result as string);

                      // Check if it's the old schema format (with success/data structure)
                      if (importedSchema.success && importedSchema.data && importedSchema.data.pages) {
                        // It's the old format, convert to flattened format
                        const flattenedSchema = {
                          ...importedSchema.data,
                          id: importedSchema.data.id || importedSchema.data.slug || 'builder-app'
                        };

                        setIsImporting(true);
                        setCanvasSchema(flattenedSchema);
                        // Update current page ID to the first page in the array after import
                        if (flattenedSchema.pages?.[0]) {
                          setCurrentPageId(flattenedSchema.pages[0].id);
                        } else if (flattenedSchema.navigation?.initialPageId) {
                          setCurrentPageId(flattenedSchema.navigation.initialPageId);
                        }
                        // Reset the importing flag after a short delay to allow UI to update
                        setTimeout(() => setIsImporting(false), 0);
                        toast.success('Schema imported successfully!');
                      }
                      // Check if it's the new flattened schema format
                      else if (importedSchema.pages) {
                        // It's the flattened format
                        setIsImporting(true);
                        setCanvasSchema(importedSchema);
                        // Update current page ID to the first page in the array after import
                        if (importedSchema.pages?.[0]) {
                          setCurrentPageId(importedSchema.pages[0].id);
                        } else if (importedSchema.navigation?.initialPageId) {
                          setCurrentPageId(importedSchema.navigation.initialPageId);
                        }
                        // Reset the importing flag after a short delay to allow UI to update
                        setTimeout(() => setIsImporting(false), 0);
                        toast.success('Schema imported successfully!');
                      } else {
                        toast.error('Invalid SDUI schema format. Please use either the old format (with success/data wrapper) or the new flattened format.');
                      }
                    } catch (error) {
                      console.error('Error importing schema:', error);
                      toast.error('Error importing schema: Invalid JSON format');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              fileInput.click();
            }}
          >
            Import JSON
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              // Save schema functionality would go here
              console.log('Saving schema:', canvasSchema);
              toast.success('Schema saved successfully!');
            }}
          >
            Save Schema
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
              // Preview functionality - set the schema and current page ID to state to show modal
              setPreviewSchema(canvasSchema);
              setPreviewCurrentPageId(currentPageId);
              setShowPreviewModal(true);
            }}
          >
            Preview
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => {
              // Export functionality - download the current schema as JSON
              const schemaToExport = {
                ...canvasSchema
              };

              const dataStr = JSON.stringify(schemaToExport, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

              const exportFileDefaultName = `${canvasSchema.name || canvasSchema.id || 'sdui-schema'}-${Date.now()}.json`;

              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
              toast.success('Schema exported successfully!');
            }}
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Main content area with three panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Components Panel - Left */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Pages Panel - Above Components */}
          <div className="border-b border-gray-200">
            <div className="p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Pages</h2>
              <button
                className="text-blue-500 hover:text-blue-700"
                title="Add new page"
                onClick={() => {
                  const newPageId = `page_${Date.now()}`;
                  const newPage = {
                    id: newPageId,
                    order: canvasSchema.pages.length,
                    title: `Page ${canvasSchema.pages.length + 1}`,
                    components: []
                  };

                  setCanvasSchema({
                    ...canvasSchema,
                    pages: [...canvasSchema.pages, newPage]
                  });

                  // Switch to the new page
                  setCurrentPageId(newPageId);
                }}
              >
                +
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto px-2 pb-2">
              {canvasSchema.pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`p-2 mb-1 rounded cursor-pointer flex justify-between items-center ${
                    currentPageId === page.id
                      ? 'bg-blue-100 border border-blue-300'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPageId(page.id)}
                >
                  <span className="text-sm truncate">{page.title || `Page ${index + 1}`}</span>
                  {canvasSchema.pages.length > 1 && (
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        // Remove the page
                        const updatedPages = canvasSchema.pages.filter(p => p.id !== page.id);

                        setCanvasSchema({
                          ...canvasSchema,
                          pages: updatedPages
                        });

                        // If we're deleting the current page, switch to the first page
                        if (currentPageId === page.id && updatedPages.length > 0) {
                          setCurrentPageId(updatedPages[0].id);
                        } else if (updatedPages.length === 0) {
                          // If no pages left, create a default page
                          const defaultPage = {
                            id: 'welcome',
                            order: 0,
                            title: 'Welcome',
                            components: []
                          };

                          setCanvasSchema({
                            ...canvasSchema,
                            pages: [defaultPage]
                          });

                          setCurrentPageId(defaultPage.id);
                        }
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Components Panel - Below Pages with independent scrolling */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="font-semibold text-gray-700">Components</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ComponentsPanel onAddComponent={handleAddComponent} />
            </div>
          </div>
        </div>

        {/* Canvas Panel - Center */}
        <div
          className="flex-1 flex items-start justify-center bg-gray-200 p-4 overflow-auto"
          onClick={(e) => {
            // Only deselect if the click is on the background, not on the mobile frame
            if (e.target === e.currentTarget) {
              handleComponentSelect(null);
            }
          }}
        >
          <div className="mt-4">
            <CanvasPanel
              schema={canvasSchema}
              currentPageId={currentPageId}
              onSelectComponent={handleComponentSelect}
              selectedComponentId={selectedComponent?.id || null}
              onAddComponent={handleAddComponent}
              onRemoveComponent={handleDeleteComponent}
              onReorderComponents={handleReorderComponents}
            />
          </div>
        </div>

        {/* JSON Preview Pane - Before Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <JsonPreviewPane
                schema={canvasSchema}
                selectedComponentId={selectedComponent?.id || null}
              />
            </div>

            {/* Properties/Settings Tabs */}
            <div className="flex flex-col border-t border-gray-200 overflow-hidden flex-1 min-h-[200px] max-h-[50%]">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    selectedTab === 'properties'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('properties')}
                >
                  Properties
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    selectedTab === 'settings'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTab('settings')}
                >
                  Settings
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  {selectedTab === 'properties' ? (
                    <>
                      <h2 className="font-semibold text-gray-700 mb-4">Properties</h2>
                      <PropertiesPanel
                        component={selectedComponent}
                        page={canvasSchema.pages.find(page => page.id === currentPageId)}
                        allPages={canvasSchema.pages}
                        onPageUpdate={handlePageUpdate}
                        onComponentUpdate={handleComponentUpdate}
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-gray-700 mb-4">App Settings</h2>
                      <SettingsPanel
                        schema={canvasSchema}
                        onUpdateSchema={setCanvasSchema}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* Preview Modal Component */}
  <PreviewModal
    isOpen={showPreviewModal}
    onClose={() => setShowPreviewModal(false)}
    schema={previewSchema}
    currentPageId={previewCurrentPageId}
  />
</div>
);
}

export default App;