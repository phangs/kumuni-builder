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
import { useScreenScaling } from './hooks/useScreenScaling';
import { useAuth } from './contexts/AuthContext';
import { UserProfileMenu } from './components/UserProfileMenu';
import { MainLayout } from './components/MainLayout';
import { useParams } from 'react-router-dom';

function App() {
  // Main application code for authenticated users
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [currentPageId, setCurrentPageId] = useState<string>('welcome'); // Will be updated after schema loads
  const [selectedTab, setSelectedTab] = useState<'properties' | 'settings'>('properties');
  const [isImporting, setIsImporting] = useState<boolean>(false); // Flag to track import state
  const prevNavigationRef = useRef<any>(null); // Ref to track previous navigation settings
  const { toast } = useToast();
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isJsonOpen, setIsJsonOpen] = useState<boolean>(false);
  const [previewSchema, setPreviewSchema] = useState<any>(null);
  const [previewCurrentPageId, setPreviewCurrentPageId] = useState<string>('welcome');
  const [canvasSchema, setCanvasSchema] = useState<SDUISchema>({
    id: "builder-app",
    version: "1.0",
    name: "Builder App",
    description: "SDUI Builder Application",
    slug: "builder-app",
    icon: "",
    is_public: false,
    is_published: false,
    published_at: null,
    navigation: {
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

  // Fetch app schema if an ID is provided
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchApp = async () => {
      if (!id) return;

      const token = localStorage.getItem('kumuni-token');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          signal
        });

        if (response.ok) {
          const responseData = await response.json();
          // Handle both wrapped { success: true, data: { ... } } and unwrapped { ... } response formats
          const appData = responseData.data || responseData;

          if (!signal.aborted && appData.sduiSchema) {
            setIsImporting(true);
            setCanvasSchema(appData.sduiSchema);
            setTimeout(() => setIsImporting(false), 100);
            toast.success(`Loaded app: ${appData.name}`);
          }
        } else {
          if (!signal.aborted) {
            toast.error('Failed to load the application.');
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching app:', error);
          toast.error('An error occurred while loading the application.');
        }
      }
    };

    fetchApp();

    return () => {
      controller.abort();
    };
  }, [id, toast]);
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
      case 'checkbox':
        return {
          label: 'Checkbox Label',
          style: {}
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

  const { isLargeScreen, isMediumScreen, isSmallScreen, scale } = useScreenScaling();

  // Calculate responsive panel widths based on screen size
  const getLeftPanelWidth = () => {
    if (isLargeScreen) return 'w-64'; // 256px for large screens
    if (isMediumScreen) return 'w-56'; // 224px for medium screens
    return 'w-48'; // 192px for small screens
  };

  const getRightPanelWidth = () => {
    if (isLargeScreen) return 'w-80'; // 320px for large screens
    if (isMediumScreen) return 'w-72'; // 288px for medium screens
    return 'w-64'; // 256px for small screens
  };

  return (
    <div className="dark h-screen w-full bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <MainLayout
        showBuilderButtons={true}
        onImportClick={() => {
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
        onSaveClick={async () => {
          const token = localStorage.getItem('kumuni-token');
          if (!token) {
            toast.error('You must be logged in to save.');
            return;
          }

          const method = id ? 'PATCH' : 'POST';
          const url = id
            ? `${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps/${id}`
            : `${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps`;

          try {
            const response = await fetch(url, {
              method: method,
              headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: canvasSchema.name || 'Untitled App',
                description: canvasSchema.description || '',
                iconUrl: canvasSchema.icon || '',
                category: 'default',
                provider: 'system',
                status: 'draft',
                sduiSchema: canvasSchema
              }),
            });

            if (response.ok) {
              toast.success(`Mini-app ${id ? 'updated' : 'saved'} successfully!`);
            } else {
              const errorData = await response.json().catch(() => ({}));
              toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Save error:', error);
            toast.error('An error occurred while saving.');
          }
        }}
        onPreviewClick={() => {
          // Preview functionality - set the schema and current page ID to state to show modal
          setPreviewSchema(canvasSchema);
          setPreviewCurrentPageId(currentPageId);
          setShowPreviewModal(true);

          // Also set in sessionStorage for standalone PreviewPage if needed
          sessionStorage.setItem('sdui-preview-schema', JSON.stringify(canvasSchema));
          sessionStorage.setItem('sdui-preview-current-page-id', currentPageId);
        }}
        onExportClick={() => {
          // Export functionality - download the current schema as JSON
          const schemaToExport = {
            ...canvasSchema
          };

          const dataStr = JSON.stringify(schemaToExport, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

          const exportFileDefaultName = `${canvasSchema.name || canvasSchema.id || 'sdui-schema'}-${Date.now()}.json`;

          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
          toast.success('Schema exported successfully!');
        }}
      >
        {/* Main content area with three panels */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {/* Components Panel - Left */}
          <div className={`${getLeftPanelWidth()} bg-card border-r border-border flex flex-col min-w-[180px] max-w-[20%] transition-width duration-300`}>
            {/* Pages Panel - Above Components */}
            <div className="border-b border-border">
              <div className="p-4 flex justify-between items-center">
                <h2 className="font-semibold text-foreground">Pages</h2>
                <button
                  className="text-primary hover:text-primary/80"
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
                    className={`p-2 mb-1 rounded cursor-pointer flex justify-between items-center transition-colors ${currentPageId === page.id
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    onClick={() => setCurrentPageId(page.id)}
                  >
                    <span className="text-sm truncate">{page.title || `Page ${index + 1}`}</span>
                    {canvasSchema.pages.length > 1 && (
                      <button
                        className="text-destructive/70 hover:text-destructive ml-2"
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
            <div className="flex-1 flex flex-col overflow-hidden bg-card/50">
              <div className="p-4 border-b border-border flex-shrink-0">
                <h2 className="font-semibold text-foreground">Components</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <ComponentsPanel onAddComponent={handleAddComponent} />
              </div>
            </div>
          </div>

          {/* Canvas Panel - Center */}
          <div
            className="flex-1 flex items-start justify-center bg-background/95 dot-pattern relative p-8 overflow-auto animate-in fade-in duration-500"
            onClick={(e) => {
              // Only deselect if the click is on the background, not on the mobile frame
              if (e.target === e.currentTarget) {
                handleComponentSelect(null);
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="mt-4 relative z-0">
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

          {/* Right Panel: JSON + Properties */}
          <div className={`${getRightPanelWidth()} bg-card border-l border-border flex flex-col overflow-hidden min-w-[220px] max-w-[25%] transition-width duration-300`}>
            <div className="flex flex-col flex-1 overflow-hidden h-full">
              {/* JSON Pane: Now with dynamic height */}
              <div className={`overflow-hidden flex flex-col transition-all duration-300 ${isJsonOpen ? 'flex-1 min-h-[40%]' : 'h-12 flex-none'}`}>
                <JsonPreviewPane
                  schema={canvasSchema}
                  selectedComponentId={selectedComponent?.id || null}
                  isOpen={isJsonOpen}
                  onOpenChange={setIsJsonOpen}
                />
              </div>

              {/* Properties/Settings Area: Always fills remaining space */}
              <div className="flex flex-col border-t border-border overflow-hidden flex-1 bg-card">
                <div className="flex border-b border-border bg-muted/20">
                  <button
                    className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${selectedTab === 'properties'
                      ? 'text-primary border-b-2 border-primary bg-card'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    onClick={() => setSelectedTab('properties')}
                  >
                    Properties
                  </button>
                  <button
                    className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${selectedTab === 'settings'
                      ? 'text-primary border-b-2 border-primary bg-card'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    onClick={() => setSelectedTab('settings')}
                  >
                    Settings
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-card">
                  <div className="p-5">
                    {selectedTab === 'properties' ? (
                      <>
                        {selectedComponent ? (
                          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                            <div>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Component</p>
                              <h2 className="text-lg font-bold text-foreground capitalize tracking-tight">
                                {selectedComponent.type.replace('-', ' ')}
                              </h2>
                            </div>
                            <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-mono font-bold border border-primary/20">
                              ID: {selectedComponent.id.slice(-6)}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-6">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Context</p>
                            <h2 className="text-lg font-bold text-foreground capitalize tracking-tight">
                              Page Properties
                            </h2>
                          </div>
                        )}
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
                        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-tight">App Configuration</h2>
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
      </MainLayout>
    </div>
  );
}

export default App;