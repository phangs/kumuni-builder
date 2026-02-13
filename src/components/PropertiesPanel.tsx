import React from 'react';

interface PropertiesPanelProps {
  component: any;
  page: any;
  allPages: any[]; // Added to provide list of all pages for dropdown
  onPageUpdate: (updatedPage: any) => void;
  onComponentUpdate: (updatedComponent: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  component,
  page,
  allPages,
  onPageUpdate,
  onComponentUpdate
}) => {
  // If no component is selected, show page properties
  if (!component) {
    if (!page) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/40">
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Select a component on the canvas or a page from the sidebar to edit its properties.
          </p>
        </div>
      );
    }

    // Page properties editing
    const handlePageChange = (property: string, value: any) => {
      const updatedPage = {
        ...page,
        [property]: value
      };
      onPageUpdate(updatedPage);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
        <div>
          <SectionHeader title="Page Configuration" />
        </div>

        <InputGroup label="Unique ID" description="The identifier used for navigation and deep linking.">
          <input
            type="text"
            value={page.id || ''}
            onChange={(e) => handlePageChange('id', e.target.value)}
            className="styled-input"
            placeholder="e.g. home-page"
          />
        </InputGroup>

        <InputGroup label="Page Title" description="External name displayed in navigation.">
          <input
            type="text"
            value={page.title || ''}
            onChange={(e) => handlePageChange('title', e.target.value)}
            className="styled-input"
            placeholder="e.g. Dashboard"
          />
        </InputGroup>

        <InputGroup label="Order Index">
          <input
            type="number"
            value={page.order || 0}
            onChange={(e) => handlePageChange('order', parseInt(e.target.value))}
            className="styled-input"
          />
        </InputGroup>

        <InputGroup label="Background Color">
          <div className="flex gap-3">
            <input
              type="color"
              value={page.backgroundColor || '#FFFFFF'}
              onChange={(e) => handlePageChange('backgroundColor', e.target.value)}
              className="w-12 h-10 bg-muted/40 border border-border/60 rounded-xl cursor-pointer p-1"
            />
            <input
              type="text"
              value={page.backgroundColor || '#FFFFFF'}
              onChange={(e) => handlePageChange('backgroundColor', e.target.value)}
              className="styled-input flex-1 font-mono uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </InputGroup>
      </div>
    );
  }

  // Component properties editing
  const handleChange = (property: string, value: any) => {
    const updatedComponent = {
      ...component,
      [property]: value
    };
    onComponentUpdate(updatedComponent);
  };

  const handlePropsChange = (property: string, value: any) => {
    const updatedProps = {
      ...(component.props || {}),
      [property]: value
    };
    const updatedComponent = {
      ...component,
      props: updatedProps
    };
    onComponentUpdate(updatedComponent);
  };

  const handleStyleChange = (property: string, value: any) => {
    const updatedProps = {
      ...(component.props || {}),
      style: {
        ...(component.props?.style || {}),
        [property]: value
      }
    };
    const updatedComponent = {
      ...component,
      props: updatedProps
    };
    onComponentUpdate(updatedComponent);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
      <InputGroup label="Component ID" description="Unique within this page.">
        <input
          type="text"
          value={component.id || ''}
          onChange={(e) => handleChange('id', e.target.value)}
          className="styled-input font-mono"
          placeholder="component-id"
        />
      </InputGroup>

      {component.type === 'text' && (
        <InputGroup label="Text Content" description="The actual text to be displayed.">
          <textarea
            value={component.props?.text || ''}
            onChange={(e) => handlePropsChange('text', e.target.value)}
            className="styled-input min-h-[100px]"
            rows={4}
          />
        </InputGroup>
      )}

      {component.type === 'heading' && (
        <InputGroup label="Heading Text" description="Display text for this heading component.">
          <textarea
            value={component.props?.text || ''}
            onChange={(e) => handlePropsChange('text', e.target.value)}
            className="styled-input"
            rows={2}
          />
        </InputGroup>
      )}

      {component.type === 'button' && (
        <>
          <SectionHeader title="Button Properties" />

          <InputGroup label="Button Title" description="The text label shown on the button.">
            <input
              type="text"
              value={component.props?.title || ''}
              onChange={(e) => handlePropsChange('title', e.target.value)}
              className="styled-input"
            />
          </InputGroup>

          <InputGroup label="Visual Style">
            <select
              value={component.props?.variant || 'primary'}
              onChange={(e) => handlePropsChange('variant', e.target.value)}
              className="styled-input appearance-none bg-muted/40"
            >
              <option value="primary">Primary (Filled)</option>
              <option value="secondary">Secondary (Muted)</option>
              <option value="outline">Outline (Ghost)</option>
            </select>
          </InputGroup>

          <SectionHeader title="Interaction Action" />

          <InputGroup label="On Click Action" description="What happens when the user clicks this button?">
            <select
              value={component.action?.type || ''}
              onChange={(e) => {
                const updatedAction = {
                  ...(component.action || {}),
                  type: e.target.value
                };
                handleChange('action', updatedAction);
              }}
              className="styled-input appearance-none bg-muted/40"
            >
              <option value="">No Action</option>
              <option value="@pushPage">Navigate to Page</option>
              <option value="@popPage">Go Back</option>
              <option value="@submitForm">Submit Form</option>
              <option value="@toast">Show Toast</option>
              <option value="@register">Register</option>
            </select>
          </InputGroup>

          {component.action?.type === '@pushPage' && (
            <InputGroup label="Target Page" description="Choose which page to navigate to.">
              <select
                value={component.action?.params?.pageId || ''}
                onChange={(e) => {
                  const updatedAction = {
                    ...(component.action || {}),
                    params: {
                      ...(component.action?.params || {}),
                      pageId: e.target.value
                    }
                  };
                  handleChange('action', updatedAction);
                }}
                className="styled-input appearance-none bg-muted/40"
              >
                <option value="">Select a page...</option>
                {allPages && allPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title || page.id}
                  </option>
                ))}
              </select>
            </InputGroup>
          )}

          {component.action?.type === '@toast' && (
            <InputGroup label="Toast Message" description="The feedback message shown to the user.">
              <input
                type="text"
                value={component.action?.params?.message || ''}
                onChange={(e) => {
                  const updatedAction = {
                    ...(component.action || {}),
                    params: {
                      ...(component.action?.params || {}),
                      message: e.target.value
                    }
                  };
                  handleChange('action', updatedAction);
                }}
                className="styled-input"
                placeholder="e.g. Action successful!"
              />
            </InputGroup>
          )}
        </>
      )}

      {component.type === 'text-input' && (
        <>
          <SectionHeader title="Input Field Properties" />

          <InputGroup label="Field Label">
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="styled-input"
              placeholder="e.g. Full Name"
            />
          </InputGroup>

          <InputGroup label="Placeholder" description="Temporary text shown before the user types.">
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="styled-input"
              placeholder="e.g. Juan Dela Cruz"
            />
          </InputGroup>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Keyboard Type">
              <select
                value={component.props?.keyboardType || 'default'}
                onChange={(e) => handlePropsChange('keyboardType', e.target.value)}
                className="styled-input appearance-none bg-muted/40"
              >
                <option value="default">Default</option>
                <option value="email-address">Email</option>
                <option value="numeric">Numeric</option>
                <option value="phone-pad">Phone</option>
              </select>
            </InputGroup>

            <InputGroup label="Auto Capitalize">
              <select
                value={component.props?.autoCapitalize || 'off'}
                onChange={(e) => handlePropsChange('autoCapitalize', e.target.value)}
                className="styled-input appearance-none bg-muted/40"
              >
                <option value="off">Off</option>
                <option value="none">None</option>
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="characters">Characters</option>
              </select>
            </InputGroup>
          </div>

          <div className="pt-4 mt-4 border-t border-border/40">
            <SectionHeader title="Validation Rules" />

            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40 mb-4 cursor-pointer" onClick={() => handleChange('validation', { ...(component.validation || {}), required: !(component.validation?.required) })}>
              <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${component.validation?.required ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}>
                {component.validation?.required && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm font-medium text-foreground">Mark as Required</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Min Characters">
                <input
                  type="number"
                  value={component.validation?.minLength || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      minLength: e.target.value ? parseInt(e.target.value) : undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2"
                  placeholder="0"
                />
              </InputGroup>

              <InputGroup label="Max Characters">
                <input
                  type="number"
                  value={component.validation?.maxLength || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2"
                  placeholder="255"
                />
              </InputGroup>
            </div>
          </div>
        </>
      )}

      {component.type === 'textarea' && (
        <>
          <SectionHeader title="Text Area Properties" />

          <InputGroup label="Field Label">
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="styled-input"
            />
          </InputGroup>

          <InputGroup label="Placeholder Text">
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="styled-input"
            />
          </InputGroup>

          <InputGroup label="Visual Rows" description="Initial height of the text area.">
            <input
              type="number"
              value={component.props?.rows || 3}
              onChange={(e) => handlePropsChange('rows', parseInt(e.target.value))}
              className="styled-input"
            />
          </InputGroup>

          <div className="pt-4 mt-4 border-t border-border/40">
            <SectionHeader title="Validation Rules" />

            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40 mb-4 cursor-pointer" onClick={() => handleChange('validation', { ...(component.validation || {}), required: !(component.validation?.required) })}>
              <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${component.validation?.required ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}>
                {component.validation?.required && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm font-medium text-foreground">Mark as Required</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Min Characters">
                <input
                  type="number"
                  value={component.validation?.minLength || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      minLength: e.target.value ? parseInt(e.target.value) : undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2"
                />
              </InputGroup>

              <InputGroup label="Max Characters">
                <input
                  type="number"
                  value={component.validation?.maxLength || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2"
                />
              </InputGroup>
            </div>
          </div>
        </>
      )}

      {component.type === 'date-picker' && (
        <>
          <SectionHeader title="Date Picker Properties" />

          <InputGroup label="Field Label">
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="styled-input"
            />
          </InputGroup>

          <InputGroup label="Placeholder Text">
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="styled-input"
            />
          </InputGroup>

          <div className="pt-4 mt-4 border-t border-border/40">
            <SectionHeader title="Date Range Constraints" />

            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40 mb-4 cursor-pointer" onClick={() => handleChange('validation', { ...(component.validation || {}), required: !(component.validation?.required) })}>
              <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${component.validation?.required ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}>
                {component.validation?.required && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm font-medium text-foreground">Mark as Required</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Min Date">
                <input
                  type="date"
                  value={component.validation?.min || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      min: e.target.value || undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2 text-xs"
                />
              </InputGroup>

              <InputGroup label="Max Date">
                <input
                  type="date"
                  value={component.validation?.max || ''}
                  onChange={(e) => {
                    const updatedValidation = {
                      ...(component.validation || {}),
                      max: e.target.value || undefined
                    };
                    handleChange('validation', updatedValidation);
                  }}
                  className="styled-input py-2 text-xs"
                />
              </InputGroup>
            </div>
          </div>
        </>
      )}

      {component.type === 'checkbox' && (
        <>
          <SectionHeader title="Checkbox Properties" />

          <InputGroup label="Field Label">
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="styled-input"
              placeholder="e.g. I agree to the terms"
            />
          </InputGroup>
        </>
      )}

      {component.type === 'image' && (
        <InputGroup label="Image Source (URL)" description="Provide a direct link to the image you want to display.">
          <input
            type="text"
            value={component.props?.source || ''}
            onChange={(e) => handlePropsChange('source', e.target.value)}
            className="styled-input"
            placeholder="https://example.com/image.jpg"
          />
        </InputGroup>
      )}

      {component.type === 'spacer' && (
        <InputGroup label="Vertical Offset" description="Add empty space between components (in pixels).">
          <input
            type="number"
            value={component.props?.size || 16}
            onChange={(e) => handlePropsChange('size', parseInt(e.target.value))}
            className="styled-input"
          />
        </InputGroup>
      )}

      {/* Common style properties */}
      <div className="pt-6 mt-6 border-t border-border/40">
        <SectionHeader title="Visual Styles" />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <InputGroup label="Margin Top">
            <input
              type="number"
              value={component.props?.style?.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value))}
              className="styled-input py-2 text-xs"
              placeholder="0"
            />
          </InputGroup>

          <InputGroup label="Margin Bottom">
            <input
              type="number"
              value={component.props?.style?.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value))}
              className="styled-input py-2 text-xs"
              placeholder="0"
            />
          </InputGroup>

          <InputGroup label="Padding Top">
            <input
              type="number"
              value={component.props?.style?.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', parseInt(e.target.value))}
              className="styled-input py-2 text-xs"
              placeholder="0"
            />
          </InputGroup>

          <InputGroup label="Padding Bottom">
            <input
              type="number"
              value={component.props?.style?.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', parseInt(e.target.value))}
              className="styled-input py-2 text-xs"
              placeholder="0"
            />
          </InputGroup>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-2">
          <InputGroup label="Background Overlay">
            <div className="flex gap-3">
              <input
                type="color"
                value={component.props?.style?.backgroundColor || '#000000'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-10 bg-muted/40 border border-border/60 rounded-xl cursor-pointer p-1"
              />
              <input
                type="text"
                value={component.props?.style?.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="styled-input flex-1 font-mono uppercase"
                placeholder="#HEXCODE"
              />
            </div>
          </InputGroup>

          <InputGroup label="Corner Radius">
            <input
              type="number"
              value={component.props?.style?.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
              className="styled-input"
              placeholder="0"
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 border-b border-border/40 pb-2 mb-4">
    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none">{title}</h3>
  </div>
);

const InputGroup = ({ label, description, children }: { label: string, description?: string, children: any }) => (
  <div className="space-y-1.5 mb-4">
    <label className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">{label}</label>
    {children}
    {description && <p className="text-[10px] text-muted-foreground px-1 opacity-70 leading-tight">{description}</p>}
  </div>
);