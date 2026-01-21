import React from 'react';

interface ComponentsPanelProps {
  onAddComponent: (componentType: string) => void;
}

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ onAddComponent }) => {
  const components = [
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'heading', label: 'Heading', icon: 'H' },
    { type: 'button', label: 'Button', icon: '_BTN' },
    { type: 'text-input', label: 'Text Input', icon: 'INPUT' },
    { type: 'textarea', label: 'Textarea', icon: 'TEXT' },
    { type: 'date-picker', label: 'Date Picker', icon: 'DATE' },
    { type: 'image', label: 'Image', icon: 'IMG' },
    { type: 'spacer', label: 'Spacer', icon: '|||' },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Basic Components</h3>
        <div className="space-y-1">
          {components.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.type)}
              className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-move transition-colors"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-gray-300 mr-3 text-xs font-bold">
                {comp.icon}
              </div>
              <span className="text-sm">{comp.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">Layout</h3>
        <div className="space-y-1">
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'spacer')}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-xs text-center cursor-move"
          >
            Spacer
          </div>
        </div>
      </div>
    </div>
  );
};