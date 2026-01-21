# Kumuni Builder - SDUI Framework

The Kumuni Builder is a Server Driven UI (SDUI) framework designed to work seamlessly with the Kumuni Expo super app. It allows for dynamic UI rendering from JSON definitions, enabling rapid UI updates without app store releases.

## Architecture Overview

The Kumuni Builder follows the same technology stack as the Kumuni Expo app to minimize drift between the SDUI definitions and the final rendered components:

- **React 19.1.0** - UI library
- **TypeScript ~5.9.2** - Type safety
- **Tailwind CSS** - Styling system with the same theme as kumuni-expo
- **Radix UI Primitives** - Accessible component primitives
- **Lucide React** - Icon library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching and caching
- **React Native Web** - For cross-platform compatibility

## Key Components

### SDUI Renderer
The core of the system is the `SduiRenderer` component which takes a JSON definition and renders the corresponding UI elements.

### Component Mapping
The system maps JSON component definitions to actual React components using a registry pattern:

```json
{
  "type": "button",
  "props": {
    "variant": "primary",
    "children": "Click Me"
  }
}
```

The system supports both custom components (like cards, buttons) and standard HTML elements (div, section, p, h1, etc.).

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to http://localhost:5173

## SDUI Schema

The SDUI system supports the following component types:
- `container` - Layout containers
- `text` - Text elements with variants (h1, h2, p, etc.) - Note: text content should be passed as children rather than a text property
- `button` - Interactive buttons
- `image` - Image components
- `card` - Card components with header/content/footer
- Standard HTML elements (div, section, header, footer, nav, aside, main, article, ul, ol, li, p, span, h1-h6, a, img, form, input, textarea, select, button, label)
- And many more based on Radix UI primitives

Each component can have:
- `type` - The component type
- `props` - Properties to pass to the component
- `children` - Nested child components
- `id` - Unique identifier
- `className` - Tailwind CSS classes
- `style` - Inline styles

## Alignment with Kumuni Expo

To ensure minimal drift between SDUI designs and the final app:
- Same component library (Radix UI)
- Identical styling system (Tailwind CSS with same theme)
- Shared utility functions
- Consistent color palette and typography
- Same icon set (Lucide React)
- Similar form handling and state management patterns

## Development Guidelines

When creating new SDUI-compatible components:
1. Follow the same patterns as existing components
2. Use the same styling system (Tailwind CSS)
3. Maintain the same prop interfaces where possible
4. Ensure accessibility compliance
5. Test components in both SDUI and direct usage contexts