import React, { useState, Fragment, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { ComponentRegistry } from './SduiRenderer';
import { useTheme } from '../contexts/ThemeContext';
import { SDUISchema } from '../types/sdui';
import { calculateCanvasDimensions, getMobileFrameClass } from '../utils/responsiveUtils';
import { useScreenScaling } from '../hooks/useScreenScaling';

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
  const [draggedItem, setDraggedItem] = useState<{ index: number, component: any } | null>(null);
  const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: screenWidth } = useScreenScaling();

  const currentPage = schema.pages?.find(page => page.id === currentPageId) ||
    schema.pages?.[0] ||
    { id: "default", order: 0, title: "Default", components: [] };

  const handleFormDataChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAction = (actionId: string, data?: any) => {
    console.log("Action triggered:", actionId, data);
  };

  const theme = {
    primaryColor: colorScheme.primary,
    secondaryColor: colorScheme.secondary,
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const componentType = e.dataTransfer.getData('componentType');
    const targetIndex = hoveredDropIndex;

    setHoveredDropIndex(null);

    // Case 1: Dragging from sidebar to add a new component
    if (componentType) {
      onAddComponent(componentType);
      // Note: Ideally we would add at targetIndex, but onAddComponent currently only appends.
      // This is still better than it failing.
    }

    // Case 2: Reordering an existing component
    if (draggedItem && targetIndex !== null) {
      const newComponents = [...currentPage.components];
      const draggedIndex = draggedItem.index;

      // Don't do anything if dropped on itself or its current position
      if (draggedIndex !== targetIndex && draggedIndex !== targetIndex - 1) {
        const [movedItem] = newComponents.splice(draggedIndex, 1);
        const adjustedTarget = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
        newComponents.splice(adjustedTarget, 0, movedItem);
        onReorderComponents(newComponents);
      }
    }

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, index: number, component: any) => {
    // Calculate click offset within the element to prevent jumping
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    e.dataTransfer.setData('componentIndex', index.toString());
    e.dataTransfer.setData('componentId', component.id);
    setDraggedItem({ index, component });

    // Create a ghost image for dragging
    const dragGhost = target.cloneNode(true) as HTMLElement;
    dragGhost.style.opacity = '0.5';
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-1000px';
    dragGhost.style.width = `${rect.width}px`; // Ensure width is maintained
    document.body.appendChild(dragGhost);

    // Set the drag image with the calculated offset
    e.dataTransfer.setDragImage(dragGhost, offsetX, offsetY);

    // Clean up
    setTimeout(() => {
      if (document.body.contains(dragGhost)) {
        document.body.removeChild(dragGhost);
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setHoveredDropIndex(null);
  };

  const handleDragOverItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredDropIndex(targetIndex);
  };

  const handleDropOnItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData('componentType');

    if (componentType) {
      onAddComponent(componentType);
    } else if (draggedItem) {
      const newComponents = [...currentPage.components];
      const draggedIndex = draggedItem.index;

      if (draggedIndex !== targetIndex && draggedIndex !== targetIndex - 1) {
        const [movedItem] = newComponents.splice(draggedIndex, 1);
        const adjustedTarget = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
        newComponents.splice(adjustedTarget, 0, movedItem);
        onReorderComponents(newComponents);
      }
    }

    setHoveredDropIndex(null);
    setDraggedItem(null);
  };

  const handleDeleteComponent = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    onRemoveComponent(componentId);
  };

  const mobileFrameClass = getMobileFrameClass(screenWidth);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center py-8 px-4 perspective-1000"
    >
      {/* Mobile device frame */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`bg-[hsl(var(--background))] border-[12px] border-[#1a1a1a] rounded-[3.5rem] overflow-hidden flex flex-col relative shadow-2xl shadow-black/40 ring-1 ring-white/10 ${mobileFrameClass}`}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          aspectRatio: '380 / 780',
        }}
      >
        {/* Device camera/notch hardware area */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-end z-30 pointer-events-none">
          <div className="bg-[#1a1a1a] h-6 w-36 rounded-b-2xl relative">
            <div className="absolute top-1 right-10 w-2 h-2 rounded-full bg-white/5" />
            <div className="absolute top-1 right-4 w-3 h-3 rounded-full bg-blue-500/10 border border-white/5" />
          </div>
        </div>

        {/* Screen Content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative"
          style={{
            backgroundColor: (currentPage as any).backgroundColor || '#FFFFFF'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => onSelectComponent(null)}
        >
          {/* Status bar mock */}
          <div className="h-8 flex justify-between items-center px-8 pt-3 text-[10px] font-bold text-black/40 pointer-events-none">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-black/20 rounded-sm" />
              <div className="w-3 h-3 bg-black/20 rounded-sm" />
            </div>
          </div>

          <div className="p-4 pt-4 min-h-full">
            <AnimatePresence mode="popLayout">
              {currentPage.components.map((component, index) => (
                <Fragment key={component.id}>
                  {/* Enhanced drop zone indicator */}
                  <DropZone
                    isVisible={hoveredDropIndex === index}
                    onDragOver={(e) => handleDragOverItem(e, index)}
                    onDrop={(e) => handleDropOnItem(e, index)}
                  />

                  <motion.div
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.01 }}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, index, component)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const relativeY = e.clientY - rect.top;
                      // If in top half, target before this component, else target after
                      setHoveredDropIndex(relativeY < rect.height / 2 ? index : index + 1);
                    }}
                    onDrop={(e) => {
                      if (hoveredDropIndex !== null) {
                        handleDropOnItem(e, hoveredDropIndex);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComponent(component);
                    }}
                    className={`group relative mb-3 rounded-2xl transition-all duration-200 ${selectedComponentId === component.id
                      ? 'ring-2 ring-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'hover:bg-muted/30 cursor-grab active:cursor-grabbing border border-transparent hover:border-border/60'
                      } ${component.type === 'image' ? '-mx-2' : ''}`}
                  >
                    {/* Interaction controls overlay */}
                    <div className={`absolute -right-3 -top-3 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity ${selectedComponentId === component.id ? 'opacity-100' : ''}`}>
                      <button
                        onClick={(e) => handleDeleteComponent(e, component.id)}
                        className="p-1.5 bg-destructive text-destructive-foreground rounded-lg shadow-md hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="p-1 relative overflow-hidden rounded-xl">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <ComponentRegistry
                        component={component}
                        formData={formData}
                        onFormDataChange={handleFormDataChange}
                        onAction={handleAction}
                        theme={theme}
                      />
                    </div>
                  </motion.div>
                </Fragment>
              ))}
            </AnimatePresence>

            {/* Empty state or end anchor */}
            {currentPage.components.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center border-2 border-dashed border-border/40 rounded-[2rem] bg-muted/5 mt-10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <Plus size={24} />
                </div>
                <h3 className="font-semibold text-foreground/60 mb-1">Canvas is empty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start building your interface by dragging components from the left panel.
                </p>
              </div>
            ) : (
              <DropZone
                isVisible={hoveredDropIndex === currentPage.components.length}
                onDragOver={(e) => handleDragOverItem(e, currentPage.components.length)}
                onDrop={(e) => handleDropOnItem(e, currentPage.components.length)}
                isLast
              />
            )}
          </div>
        </div>

        {/* Home hardware indicator */}
        <div className="bg-[#1a1a1a] h-1.5 w-32 mx-auto rounded-full mb-3 mt-1 shadow-inner opacity-80" />
      </motion.div>
    </div>
  );
};

interface DropZoneProps {
  isVisible: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isLast?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ isVisible, onDragOver, onDrop, isLast }) => (
  <div
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={`w-full transition-all duration-200 relative ${isVisible ? 'h-12' : 'h-6'}`}
  >
    <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-primary/30 rounded-full transition-all ${isVisible ? 'opacity-100 scale-x-100 bg-primary' : 'opacity-0 scale-x-90'}`} />
    {isVisible && (
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-8 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 overflow-hidden shadow-sm">
        <div className="flex gap-1.5 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    )}
  </div>
);