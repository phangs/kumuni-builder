import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  SDUIComponent, 
  FormData
} from '@/types/sdui';

interface ComponentRegistryProps {
  component: SDUIComponent;
  formData?: Record<string, any>;
  onFormDataChange?: (name: string, value: any) => void;
  onAction?: (actionId: string, data?: any) => void;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

/**
 * Convert SDUI style to React style
 */
const convertStyle = (
  style?: any,
  theme?: { primaryColor?: string; secondaryColor?: string }
): React.CSSProperties => {
  if (!style) return {};

  const converted: React.CSSProperties = {};

  // Handle margin
  if (typeof style.margin === 'number') {
    converted.margin = style.margin;
  } else if (style.margin) {
    converted.marginTop = style.margin.top;
    converted.marginBottom = style.margin.bottom;
    converted.marginLeft = style.margin.left;
    converted.marginRight = style.margin.right;
  }

  // Handle padding
  if (typeof style.padding === 'number') {
    converted.padding = style.padding;
  } else if (style.padding) {
    converted.paddingTop = style.padding.top;
    converted.paddingBottom = style.padding.bottom;
    converted.paddingLeft = style.padding.left;
    converted.paddingRight = style.padding.right;
  }

  // Handle other style properties
  if (style.backgroundColor) {
    converted.backgroundColor = style.backgroundColor;
  }
  if (style.borderRadius) {
    converted.borderRadius = style.borderRadius;
  }
  if (style.width) {
    converted.width = style.width;
  }
  if (style.height) {
    converted.height = style.height;
  }
  if (style.flex) {
    converted.flex = style.flex;
  }
  if (style.alignItems) {
    converted.alignItems = style.alignItems;
  }
  if (style.justifyContent) {
    converted.justifyContent = style.justifyContent;
  }

  return converted;
};

/**
 * Render Text component - matches kumuni-expo styling
 */
const renderText = (
  component: SDUIComponent,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { text, style, ...otherProps } = component.props || {};
  const computedStyle = convertStyle(style, theme);
  
  return (
    <div
      key={component.id}
      style={{
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        lineHeight: 1.4,
        ...computedStyle
      }}
      {...otherProps}
    >
      {text}
    </div>
  );
};

/**
 * Render Heading component - matches kumuni-expo styling
 */
const renderHeading = (
  component: SDUIComponent,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { text, style, ...otherProps } = component.props || {};
  const computedStyle = convertStyle(style, theme);
  
  return (
    <h2
      key={component.id}
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left',
        lineHeight: 1.2,
        margin: 0,
        ...computedStyle
      }}
      {...otherProps}
    >
      {text}
    </h2>
  );
};

/**
 * Render Button component - matches kumuni-expo styling
 */
const renderButton = (
  component: SDUIComponent,
  onAction?: (actionId: string, data?: any) => void,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { title, variant = 'primary', ...otherProps } = component.props || {};
  const { colorScheme } = useTheme();
  const primaryColor = theme?.primaryColor || colorScheme?.primary || '#030213';
  const secondaryColor = theme?.secondaryColor || colorScheme?.secondary || '#468B97';
  
  // Determine button styles based on variant
  let buttonStyle: React.CSSProperties = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: '12px 16px',
    minWidth: 44,
    minHeight: 44,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
    display: 'flex',
  };

  switch (variant) {
    case 'primary':
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      };
      break;
    case 'secondary':
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: secondaryColor,
        borderColor: secondaryColor,
      };
      break;
    case 'outline':
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        borderColor: primaryColor,
      };
      break;
    default:
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      };
  }

  let textStyle: React.CSSProperties = {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  };

  // Apply text color based on variant
  switch (variant) {
    case 'primary':
      textStyle = { ...textStyle, color: '#FFFFFF' };
      break;
    case 'secondary':
      textStyle = { ...textStyle, color: '#FFFFFF' };
      break;
    case 'outline':
      textStyle = { ...textStyle, color: primaryColor };
      break;
    default:
      textStyle = { ...textStyle, color: '#FFFFFF' };
      break;
  }

  // Handle action
  const handleButtonClick = () => {
    if (component.action && onAction) {
      let actionId: string;

      if (typeof component.action === 'object' && component.action !== null) {
        const actionObj = component.action;

        if (actionObj.type === '@pushPage') {
          const pageId = actionObj.params?.pageId || actionObj.params?.page_id || actionObj.pageId;
          actionId = pageId ? `@pushPage:${pageId}` : '@pushPage';
        } else if (actionObj.type === '@popPage') {
          actionId = '@popPage';
        } else if (actionObj.type === '@submitForm' || actionObj.type === '@biometricAuth' || actionObj.type === '@toast') {
          actionId = JSON.stringify(actionObj);
        } else {
          actionId = actionObj.type;
        }
      } else {
        actionId = component.action as string;
      }

      onAction(actionId);
    }
  };

  return (
    <div
      key={component.id}
      style={buttonStyle}
      onClick={handleButtonClick}
      {...otherProps}
    >
      <span style={textStyle}>{title}</span>
    </div>
  );
};

/**
 * Render Text Input component - matches kumuni-expo styling
 */
const renderTextInput = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void
) => {
  const { label, placeholder, keyboardType, autoCapitalize, ...otherProps } = component.props || {};
  const value = formData[component.id] || '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    outline: 'none',
  };

  return (
    <div key={component.id} style={{ marginBottom: 16, width: '100%' }}>
      {label && (
        <div style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontSize: 14, 
          fontWeight: '600',
          color: '#000000'
        }}>
          {label}
        </div>
      )}
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onFormDataChange) {
            onFormDataChange(component.id, e.target.value);
          }
        }}
        autoCapitalize={autoCapitalize || 'off'}
        type="text"
        {...otherProps}
      />
    </div>
  );
};

/**
 * Render Textarea component - matches kumuni-expo styling
 */
const renderTextarea = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void
) => {
  const { label, placeholder, rows = 3, autoCapitalize, ...otherProps } = component.props || {};
  const value = formData[component.id] || '';

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    outline: 'none',
    resize: 'vertical',
  };

  return (
    <div key={component.id} style={{ marginBottom: 16, width: '100%' }}>
      {label && (
        <div style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontSize: 14, 
          fontWeight: '600',
          color: '#000000'
        }}>
          {label}
        </div>
      )}
      <textarea
        style={textareaStyle}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => {
          if (onFormDataChange) {
            onFormDataChange(component.id, e.target.value);
          }
        }}
        autoCapitalize={autoCapitalize || 'sentences'}
        {...otherProps}
      />
    </div>
  );
};

/**
 * Render Date Picker component - matches kumuni-expo styling
 */
const renderDatePicker = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void
) => {
  const { label, placeholder, ...otherProps } = component.props || {};
  const value = formData[component.id] || '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    outline: 'none',
  };

  return (
    <div key={component.id} style={{ marginBottom: 16, width: '100%' }}>
      {label && (
        <div style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontSize: 14, 
          fontWeight: '600',
          color: '#000000'
        }}>
          {label}
        </div>
      )}
      <input
        style={inputStyle}
        type="date"
        value={value}
        onChange={(e) => {
          if (onFormDataChange) {
            onFormDataChange(component.id, e.target.value);
          }
        }}
        placeholder={placeholder}
        {...otherProps}
      />
    </div>
  );
};

/**
 * Render Image component - matches kumuni-expo styling
 */
const renderImage = (
  component: SDUIComponent,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { source, style, ...otherProps } = component.props || {};
  const computedStyle = convertStyle(style, theme);

  return (
    <img
      key={component.id}
      src={source}
      alt=""
      style={{
        width: '100%',
        height: 200,
        objectFit: 'cover',
        borderRadius: 8,
        margin: 0,
        padding: 0,
        ...computedStyle
      }}
      {...otherProps}
    />
  );
};

/**
 * Render Spacer component - matches kumuni-expo styling
 */
const renderSpacer = (
  component: SDUIComponent
) => {
  const { size = 16, ...otherProps } = component.props || {};
  
  return (
    <div
      key={component.id}
      style={{
        width: '100%',
        height: size,
      }}
      {...otherProps}
    />
  );
};

/**
 * ComponentRegistry - Main component renderer
 * Routes SDUI components to their respective renderers
 */
export const ComponentRegistry: React.FC<ComponentRegistryProps> = ({
  component,
  formData = {},
  onFormDataChange,
  onAction,
  theme,
}) => {
  switch (component.type) {
    case 'text':
      return renderText(component, theme);
    case 'heading':
      return renderHeading(component, theme);
    case 'button':
      return renderButton(component, onAction, theme);
    case 'text-input':
      return renderTextInput(
        component,
        formData,
        onFormDataChange
      );
    case 'textarea':
      return renderTextarea(
        component,
        formData,
        onFormDataChange
      );
    case 'date-picker':
      return renderDatePicker(
        component,
        formData,
        onFormDataChange
      );
    case 'image':
      return renderImage(component, theme);
    case 'spacer':
      return renderSpacer(component);
    default:
      console.warn(`Unknown component type: ${component.type}`);
      return <div key={component.id}>Unsupported component: {component.type}</div>;
  }
};

// Export the main SduiPage component
interface SduiPageProps {
  schema: {
    pages: {
      id: string;
      title: string;
      components: SDUIComponent[];
    }[];
  };
  currentPageId: string;
  onAction: (actionId: string, data?: any) => void;
}

export const SduiPage: React.FC<SduiPageProps> = ({ schema, currentPageId, onAction }) => {
  const { colorScheme } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Find current page
  const currentPage = schema.pages.find((page) => page.id === currentPageId);

  if (!currentPage) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Page "{currentPageId}" not found in schema</h2>
      </div>
    );
  }

  // Get theme colors (fallback to app theme)
  const theme = {
    primaryColor: '#030213',
    secondaryColor: '#468B97',
  };

  const handleFormDataChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 16,
        backgroundColor: '#FFFFFF',
      }}
    >
      {currentPage.components.map((component, index) => {
        // Special handling for image components to allow full width without side padding
        const isImage = component.type === 'image';
        const marginBottom = index < currentPage.components.length - 1 ? 8 : 0;

        // For images, we want them to span full width, so we'll handle them differently
        if (isImage) {
          // For images, we need to span full width, so we'll remove horizontal padding effects
          return (
            <div
              key={component.id}
              style={{
                marginLeft: '-16px',  // Compensate for parent padding
                marginRight: '-16px', // Compensate for parent padding
                paddingLeft: '16px',   // Add padding inside
                paddingRight: '16px',  // Add padding inside
                marginBottom: marginBottom
              }}
            >
              <ComponentRegistry
                component={component}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onAction={onAction}
                theme={theme}
              />
            </div>
          );
        } else {
          // For non-image components, use normal spacing
          return (
            <div
              key={component.id}
              style={{
                marginBottom: marginBottom
              }}
            >
              <ComponentRegistry
                component={component}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onAction={onAction}
                theme={theme}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default SduiPage;