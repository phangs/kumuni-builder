import React from 'react';
import {
  Type,
  Heading1,
  Square,
  MousePointerClick,
  Calendar,
  Image as ImageIcon,
  GripHorizontal,
  Layout,
  CheckSquare
} from 'lucide-react';

interface ComponentsPanelProps {
  onAddComponent: (componentType: string) => void;
}

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ onAddComponent }) => {
  const components = [
    { type: 'text', label: 'Text', icon: <Type size={16} /> },
    { type: 'heading', label: 'Heading', icon: <Heading1 size={16} /> },
    { type: 'button', label: 'Button', icon: <MousePointerClick size={16} /> },
    { type: 'text-input', label: 'Text Input', icon: <Square size={16} /> },
    { type: 'textarea', label: 'Textarea', icon: <GripHorizontal size={16} /> },
    { type: 'date-picker', label: 'Date Picker', icon: <Calendar size={16} /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
    { type: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
    { type: 'spacer', label: 'Spacer', icon: <Layout size={16} /> },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
    // Optional: add a custom drag image or effect
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] uppercase font-bold text-foreground/50 tracking-widest mb-4 ml-1">Elements</h3>
        <div className="grid grid-cols-1 gap-2">
          {components.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.type)}
              onClick={() => onAddComponent(comp.type)}
              className="group flex items-center p-3 bg-muted/20 hover:bg-primary/10 border border-border/40 hover:border-primary/30 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border/40 group-hover:border-primary/20 group-hover:text-primary mr-3 transition-colors shadow-sm">
                {comp.icon}
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{comp.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
        <p className="text-[11px] text-primary/70 leading-relaxed font-medium">
          <span className="font-bold">Pro Tip:</span> Drag components onto the mobile canvas or click them to add at the bottom.
        </p>
      </div>
    </div>
  );
};