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
        <div className="text-center text-gray-500 py-8">
          Select a page or component to edit its properties
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
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Page Properties</h3>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Page ID</h3>
          <input
            type="text"
            value={page.id || ''}
            onChange={(e) => handlePageChange('id', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Page ID"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Page Title</h3>
          <input
            type="text"
            value={page.title || ''}
            onChange={(e) => handlePageChange('title', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Page Title"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Page Order</h3>
          <input
            type="number"
            value={page.order || 0}
            onChange={(e) => handlePageChange('order', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Component Type</h3>
        <div className="text-sm bg-gray-100 px-3 py-2 rounded">
          {component.type}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">ID</h3>
        <input
          type="text"
          value={component.id || ''}
          onChange={(e) => handleChange('id', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Component ID"
        />
      </div>

      {component.type === 'text' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Text Content</h3>
            <textarea
              value={component.props?.text || ''}
              onChange={(e) => handlePropsChange('text', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              rows={3}
            />
          </div>
        </>
      )}

      {component.type === 'heading' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Heading Text</h3>
            <textarea
              value={component.props?.text || ''}
              onChange={(e) => handlePropsChange('text', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              rows={2}
            />
          </div>
        </>
      )}

      {component.type === 'button' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Button Title</h3>
            <input
              type="text"
              value={component.props?.title || ''}
              onChange={(e) => handlePropsChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Variant</h3>
            <select
              value={component.props?.variant || 'primary'}
              onChange={(e) => handlePropsChange('variant', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Action Type</h3>
            <select
              value={component.action?.type || ''}
              onChange={(e) => {
                const updatedAction = {
                  ...(component.action || {}),
                  type: e.target.value
                };
                handleChange('action', updatedAction);
              }}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">No Action</option>
              <option value="@pushPage">Navigate to Page</option>
              <option value="@popPage">Go Back</option>
              <option value="@submitForm">Submit Form</option>
              <option value="@toast">Show Toast</option>
              <option value="@register">Register</option>
            </select>
          </div>

          {component.action?.type === '@pushPage' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Target Page ID</h3>
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
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Select a page</option>
                {allPages && allPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title || page.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {component.action?.type === '@toast' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Toast Message</h3>
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
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Message to display"
              />
            </div>
          )}
        </>
      )}

      {component.type === 'text-input' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Label</h3>
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Placeholder</h3>
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Keyboard Type</h3>
            <select
              value={component.props?.keyboardType || 'default'}
              onChange={(e) => handlePropsChange('keyboardType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="email-address">Email</option>
              <option value="numeric">Numeric</option>
              <option value="phone-pad">Phone</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Auto Capitalize</h3>
            <select
              value={component.props?.autoCapitalize || 'off'}
              onChange={(e) => handlePropsChange('autoCapitalize', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="off">Off</option>
              <option value="none">None</option>
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="characters">Characters</option>
            </select>
          </div>

          {/* Validation Properties */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Validation</h3>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="textInputRequired"
                checked={component.validation?.required || false}
                onChange={(e) => {
                  const updatedValidation = {
                    ...(component.validation || {}),
                    required: e.target.checked
                  };
                  handleChange('validation', updatedValidation);
                }}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="textInputRequired" className="ml-2 block text-sm text-gray-700">
                Required
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Min Length</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="Min length"
                />
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Max Length</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="Max length"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {component.type === 'textarea' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Label</h3>
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Placeholder</h3>
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rows</h3>
            <input
              type="number"
              value={component.props?.rows || 3}
              onChange={(e) => handlePropsChange('rows', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Auto Capitalize</h3>
            <select
              value={component.props?.autoCapitalize || 'sentences'}
              onChange={(e) => handlePropsChange('autoCapitalize', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="off">Off</option>
              <option value="none">None</option>
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="characters">Characters</option>
            </select>
          </div>

          {/* Validation Properties */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Validation</h3>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="textareaRequired"
                checked={component.validation?.required || false}
                onChange={(e) => {
                  const updatedValidation = {
                    ...(component.validation || {}),
                    required: e.target.checked
                  };
                  handleChange('validation', updatedValidation);
                }}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="textareaRequired" className="ml-2 block text-sm text-gray-700">
                Required
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Min Length</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="Min length"
                />
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Max Length</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="Max length"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {component.type === 'date-picker' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Label</h3>
            <input
              type="text"
              value={component.props?.label || ''}
              onChange={(e) => handlePropsChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Placeholder</h3>
            <input
              type="text"
              value={component.props?.placeholder || ''}
              onChange={(e) => handlePropsChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="Select date"
            />
          </div>

          {/* Validation Properties */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Validation</h3>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="datePickerRequired"
                checked={component.validation?.required || false}
                onChange={(e) => {
                  const updatedValidation = {
                    ...(component.validation || {}),
                    required: e.target.checked
                  };
                  handleChange('validation', updatedValidation);
                }}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="datePickerRequired" className="ml-2 block text-sm text-gray-700">
                Required
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Min Date</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">Max Date</h4>
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
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {component.type === 'image' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Image Source</h3>
            <input
              type="text"
              value={component.props?.source || ''}
              onChange={(e) => handlePropsChange('source', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="Image URL"
            />
          </div>
        </>
      )}

      {component.type === 'spacer' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
            <input
              type="number"
              value={component.props?.size || 16}
              onChange={(e) => handlePropsChange('size', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </>
      )}

      {/* Common style properties */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Styling</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Margin Top</h4>
            <input
              type="number"
              value={component.props?.style?.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Margin Bottom</h4>
            <input
              type="number"
              value={component.props?.style?.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Padding Top</h4>
            <input
              type="number"
              value={component.props?.style?.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', parseInt(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Padding Bottom</h4>
            <input
              type="number"
              value={component.props?.style?.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', parseInt(e.target.value))}
              className="w-full p-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Background Color</h4>
          <input
            type="color"
            value={component.props?.style?.backgroundColor || ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-8 border border-gray-300 rounded"
          />
        </div>
        
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Border Radius</h4>
          <input
            type="number"
            value={component.props?.style?.borderRadius || ''}
            onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
            className="w-full p-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>
    </div>
  );
};