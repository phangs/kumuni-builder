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
        fontSize: 15, // Aligned with sfProRegular15
        fontWeight: '400',
        color: '#1D1D1F', // Standard dark color from kumuni-expo
        textAlign: 'left',
        lineHeight: 1.5,
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
        fontSize: 22, // Aligned with sfProSemibold22
        fontWeight: '600',
        color: '#030213', // Brand primary color
        textAlign: 'left',
        lineHeight: 1.2,
        margin: '0 0 4px 0',
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
  // Ensure we use hardcoded brand colors as default to match mobile even in dark mode builder
  const primaryColor = theme?.primaryColor || '#030213';
  const secondaryColor = theme?.secondaryColor || '#468B97';

  // Determine button styles based on variant
  let buttonStyle: React.CSSProperties = {
    borderRadius: 12, // More modern look matching newest UI
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: '12px 16px',
    minWidth: 44,
    minHeight: 48, // Standard mobile button height
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
    display: 'flex',
    transition: 'all 0.2s ease',
    userSelect: 'none',
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
    borderColor: '#E5E7EB', // Lighter border matching kumuni-expo
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 15,
    backgroundColor: '#F9FAFB', // Slight off-white background
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
  };

  return (
    <div key={component.id} style={{ marginBottom: 18, width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: '600',
          color: '#374151'
        }}>
          {label}
        </label>
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
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 15,
    backgroundColor: '#F9FAFB',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    display: 'block',
  };

  return (
    <div key={component.id} style={{ marginBottom: 18, width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: '600',
          color: '#374151'
        }}>
          {label}
        </label>
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
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 15,
    backgroundColor: '#F9FAFB',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
  };

  return (
    <div key={component.id} style={{ marginBottom: 18, width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: '600',
          color: '#374151'
        }}>
          {label}
        </label>
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
        borderRadius: 12, // More modern radius matching brand spec
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
 * Render Checkbox component - matches kumuni-expo styling
 */
const renderCheckbox = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void,
  theme?: { primaryColor?: string }
) => {
  const { label, ...otherProps } = component.props || {};
  const checked = formData[component.id] || false;
  const primaryColor = theme?.primaryColor || '#000000';

  return (
    <div
      key={component.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 14px',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        border: '1px solid #E5E7EB',
        marginBottom: 12,
        cursor: 'pointer',
        userSelect: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
      onClick={() => {
        if (onFormDataChange) {
          onFormDataChange(component.id, !checked);
        }
      }}
      {...otherProps}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `2px solid ${checked ? primaryColor : '#D1D5DB'}`,
          backgroundColor: checked ? primaryColor : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 15, fontWeight: '500', color: '#374151', flex: 1 }}>
        {label || 'Checkbox Label'}
      </span>
    </div>
  );
};

/**
 * Render Select (Dropdown) component
 */
const renderSelect = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void
) => {
  const { label, placeholder, options = [], ...otherProps } = component.props || {};
  const value = formData[component.id] || '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 15,
    backgroundColor: '#F9FAFB',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
  };

  return (
    <div key={component.id} style={{ marginBottom: 18, width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: '600',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      <select
        style={inputStyle}
        value={value}
        onChange={(e) => {
          if (onFormDataChange) {
            onFormDataChange(component.id, e.target.value);
          }
        }}
        {...otherProps}
      >
        <option value="" disabled>{placeholder || 'Select an option'}</option>
        {options.map((opt: any, idx: number) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Render Switch (Toggle) component
 */
const renderSwitch = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void,
  theme?: { primaryColor?: string }
) => {
  const { label, ...otherProps } = component.props || {};
  const checked = formData[component.id] || false;
  const primaryColor = theme?.primaryColor || '#030213';

  return (
    <div
      key={component.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        width: '100%',
      }}
      {...otherProps}
    >
      <span style={{ fontSize: 15, fontWeight: '500', color: '#1D1D1F' }}>
        {label}
      </span>
      <div
        style={{
          width: 50,
          height: 30,
          backgroundColor: checked ? primaryColor : '#E5E7EB',
          borderRadius: 15,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onClick={() => {
          if (onFormDataChange) {
            onFormDataChange(component.id, !checked);
          }
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            backgroundColor: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  );
};

/**
 * Render Badge component
 */
const renderBadge = (
  component: SDUIComponent,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { text, variant = 'default', ...otherProps } = component.props || {};
  const primaryColor = theme?.primaryColor || '#030213';
  const secondaryColor = theme?.secondaryColor || '#468B97';

  let backgroundColor = primaryColor;
  let color = 'white';
  let border = 'none';

  switch (variant) {
    case 'secondary':
      backgroundColor = secondaryColor;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      color = primaryColor;
      border = `1px solid ${primaryColor}`;
      break;
    case 'destructive':
      backgroundColor = '#EF4444';
      break;
  }

  return (
    <span
      key={component.id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '500',
        backgroundColor,
        color,
        border,
        width: 'fit-content',
        ...otherProps
      }}
    >
      {text}
    </span>
  );
};

/**
 * Render Avatar component
 */
const renderAvatar = (
  component: SDUIComponent
) => {
  const { src, fallbackText, size = 40, ...otherProps } = component.props || {};

  return (
    <div
      key={component.id}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...otherProps
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: size * 0.4, fontWeight: '600', color: '#6B7280' }}>
          {fallbackText || '?'}
        </span>
      )}
    </div>
  );
};

/**
 * Render Alert component
 */
const renderAlert = (
  component: SDUIComponent
) => {
  const { title, description, variant = 'default', ...otherProps } = component.props || {};

  const styles: React.CSSProperties = {
    padding: 16,
    borderRadius: 8,
    border: '1px solid',
    marginBottom: 16,
    backgroundColor: variant === 'destructive' ? '#FEF2F2' : '#F9FAFB',
    borderColor: variant === 'destructive' ? '#FCA5A5' : '#E5E7EB',
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: '600',
    marginBottom: 4,
    color: variant === 'destructive' ? '#991B1B' : '#1F2937',
  };

  const descStyle: React.CSSProperties = {
    fontSize: 14,
    color: variant === 'destructive' ? '#B91C1C' : '#6B7280',
  };

  return (
    <div key={component.id} style={styles} {...otherProps}>
      {title && <div style={titleStyle}>{title}</div>}
      {description && <div style={descStyle}>{description}</div>}
    </div>
  );
};

/**
 * Render Card component (Container)
 */
const renderCard = (
  component: SDUIComponent,
  formData: Record<string, any>,
  onFormDataChange?: (name: string, value: any) => void,
  onAction?: (actionId: string, data?: any) => void,
  theme?: { primaryColor?: string; secondaryColor?: string }
) => {
  const { title, description, footer, components = [], style, ...otherProps } = component.props || {};
  const computedStyle = convertStyle(style, theme);

  return (
    <div
      key={component.id}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 16,
        marginBottom: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        ...computedStyle
      }}
      {...otherProps}
    >
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={{ fontSize: 18, fontWeight: '600', marginBottom: 4, marginTop: 0 }}>{title}</h3>}
          {description && <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{description}</p>}
        </div>
      )}

      {components && components.length > 0 && (
        <div style={{ marginBottom: footer ? 16 : 0 }}>
          {components.map((child: SDUIComponent, idx: number) => (
            <ComponentRegistry
              key={child.id || idx}
              component={child}
              formData={formData}
              onFormDataChange={onFormDataChange}
              onAction={onAction}
              theme={theme}
            />
          ))}
        </div>
      )}

      {footer && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          {footer}
        </div>
      )}
    </div>
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
    case 'checkbox':
      return renderCheckbox(
        component,
        formData,
        onFormDataChange,
        theme
      );
    case 'image':
      return renderImage(component, theme);
    case 'spacer':
      return renderSpacer(component);
    case 'select':
      return renderSelect(
        component,
        formData,
        onFormDataChange
      );
    case 'switch':
      return renderSwitch(
        component,
        formData,
        onFormDataChange,
        theme
      );
    case 'badge':
      return renderBadge(component, theme);
    case 'avatar':
      return renderAvatar(component);
    case 'alert':
      return renderAlert(component);
    case 'card':
      return renderCard(
        component,
        formData,
        onFormDataChange,
        onAction,
        theme
      );
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

  // Get theme colors (fallback to brand colors)
  const theme = {
    primaryColor: colorScheme.primary,
    secondaryColor: colorScheme.secondary,
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
        minHeight: '100%',
        padding: 20, // Standard mobile padding
        backgroundColor: (currentPage as any).backgroundColor || '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {currentPage.components.map((component, index) => {
        // Special handling for image components to allow full width without side padding
        const isImage = component.type === 'image';
        const marginBottom = index < currentPage.components.length - 1 ? 8 : 0;

        // For images, we want them to span full width, so we'll handle them differently
        if (isImage) {
          // For images, we need to span full width and touch the edges
          return (
            <div
              key={component.id}
              style={{
                marginLeft: '-20px',  // Compensate for parent padding to touch left edge
                marginRight: '-20px', // Compensate for parent padding to touch right edge
                paddingLeft: '20px',   // Restore inner padding
                paddingRight: '20px',  // Restore inner padding
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