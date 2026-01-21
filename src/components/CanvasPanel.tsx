import React, { useState, Fragment } from 'react';
import { ComponentRegistry } from './SduiRenderer';
import { useTheme } from '../contexts/ThemeContext';
import { SDUISchema } from '../types/sdui';

interface CanvasPanelProps {
  schema: SDUISchema;
  currentPageId: string;
  onSelectComponent: (component: any) => void;
  selectedComponentId: string | null;
  onAddComponent: (componentType: string) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (newOrder: any[]) => void;
}

export const CanvasPanel: React.FC<CanvasPanelProps> = ({
  schema,
  currentPageId,
  onSelectComponent,
  selectedComponentId,
  onAddComponent,
  onRemoveComponent,
  onReorderComponents
}) => {
  const { colorScheme } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [draggedItem, setDraggedItem] = useState<{index: number, component: any} | null>(null);

  // Find the current page to render based on the currentPageId
  const currentPage = schema.pages?.find(page => page.id === currentPageId) ||
                     schema.pages?.[0] ||
                     { id: "default", order: 0, title: "Default", components: [] };

  const handleFormDataChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAction = (actionId: string, data?: any) => {
    console.log("Action triggered:", actionId, data);
  };

  // Get theme colors (new schema structure doesn't have theme in the same place)
  const theme = {
    primaryColor: '#030213', // Default primary color
    secondaryColor: '#468B97', // Default secondary color
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      onAddComponent(componentType);
    }

    // Handle reordering if we were dragging within the canvas
    if (draggedItem) {
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragStart = (e: React.DragEvent, index: number, component: any) => {
    e.dataTransfer.setData('componentIndex', index.toString());
    e.dataTransfer.setData('componentId', component.id);
    setDraggedItem({index, component});
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOverItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
  };

  const handleDropOnItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedItem) {
      // Reorder components
      const newComponents = [...currentPage.components];
      const draggedIndex = draggedItem.index;

      // Remove the dragged item
      const [movedItem] = newComponents.splice(draggedIndex, 1);

      // Insert at the new position
      newComponents.splice(targetIndex, 0, movedItem);

      // Update the parent with the new order
      onReorderComponents(newComponents);

      setDraggedItem(null);
    }
  };

  const handleDeleteComponent = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation(); // Prevent selecting the component when clicking delete

    // Call the parent function to handle deletion
    onRemoveComponent(componentId);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Mobile frame */}
      <div
        className="bg-white border-4 border-gray-800 rounded-[40px] w-[360px] h-[700px] overflow-hidden flex flex-col transform scale-90 sm:scale-100"
        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
      >
        {/* Mobile notch */}
        <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-lg"></div>

        {/* Screen content */}
        <div
          className="flex-1 overflow-auto p-4 bg-white"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => onSelectComponent(null)} // Deselect component when clicking on the canvas background
        >
          {currentPage.components.map((component, index) => {
            // Create a unique key for the fragment containing the component and its drop indicator
            const componentKey = component.id || `component-${index}`;

            return (
              <Fragment key={componentKey}>
                {/* Drop indicator above each component */}
                {draggedItem && (
                  <div
                    key={`drop-indicator-${index}`}
                    className={`h-1 w-full my-1 ${
                      draggedItem.index === index ? 'hidden' : 'bg-blue-500'
                    }`}
                    style={{
                      opacity: draggedItem.index === index ? 0 : 0.5,
                      height: '2px',
                    }}
                    onDragOver={(e) => handleDragOverItem(e, index)}
                    onDrop={(e) => handleDropOnItem(e, index)}
                  />
                )}

                <div
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation to prevent deselecting when clicking on a component
                    onSelectComponent(component);
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index, component)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverItem(e, index)}
                  onDrop={(e) => handleDropOnItem(e, index)}
                  className={`relative mb-2 p-2 rounded ${
                    selectedComponentId === component.id
                      ? 'ring-2 ring-blue-500 bg-blue-50 cursor-move'
                      : 'hover:bg-gray-100 cursor-move'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <ComponentRegistry
                        component={component}
                        formData={formData}
                        onFormDataChange={handleFormDataChange}
                        onAction={handleAction}
                        theme={theme}
                      />
                    </div>
                    <button
                      onClick={(e) => handleDeleteComponent(e, component.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Delete component"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Fragment>
            );
          })}

          {/* Drop indicator at the end */}
          {currentPage.components.length > 0 && draggedItem && (
            <div
              key="drop-indicator-end"
              className="h-1 w-full my-1 bg-blue-500"
              style={{
                opacity: 0.5,
                height: '2px',
              }}
              onDragOver={(e) => handleDragOverItem(e, currentPage.components.length)}
              onDrop={(e) => handleDropOnItem(e, currentPage.components.length)}
            />
          )}

          {currentPage.components.length === 0 && (
            <div className="text-center text-gray-500 italic py-8">
              Drag components here to start building
            </div>
          )}
        </div>

        {/* Mobile home indicator */}
        <div className="bg-gray-800 h-1 w-32 mx-auto rounded-full mb-2"></div>
      </div>
    </div>
  );
};