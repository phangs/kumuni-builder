import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SduiPage } from '../SduiRenderer';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('SduiRenderer', () => {
  const mockSchema = {
    pages: [
      {
        id: 'page1',
        title: 'Test Page',
        order: 0,
        components: [
          {
            id: 'text1',
            type: 'text',
            props: {
              text: 'Hello World',
            },
          },
          {
            id: 'button1',
            type: 'button',
            props: {
              title: 'Click Me',
              variant: 'primary',
            },
          },
          {
            id: 'image1',
            type: 'image',
            props: {
              source: 'https://example.com/image.jpg',
            },
          },
        ],
      },
    ],
  };

  it('renders a page with components', () => {
    render(
      <ThemeProvider>
        <SduiPage
          schema={mockSchema}
          currentPageId="page1"
          onAction={jest.fn()}
        />
      </ThemeProvider>
    );

    // Check that the text component is rendered
    expect(screen.getByText('Hello World')).toBeInTheDocument();

    // Check that the button component is rendered
    expect(screen.getByText('Click Me')).toBeInTheDocument();

    // Check that the image component is rendered
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders different button variants', () => {
    const schemaWithVariants = {
      pages: [
        {
          id: 'page1',
          title: 'Test Page',
          order: 0,
          components: [
            {
              id: 'button-primary',
              type: 'button',
              props: {
                title: 'Primary Button',
                variant: 'primary',
              },
            },
            {
              id: 'button-secondary',
              type: 'button',
              props: {
                title: 'Secondary Button',
                variant: 'secondary',
              },
            },
            {
              id: 'button-outline',
              type: 'button',
              props: {
                title: 'Outline Button',
                variant: 'outline',
              },
            },
          ],
        },
      ],
    };

    render(
      <ThemeProvider>
        <SduiPage
          schema={schemaWithVariants}
          currentPageId="page1"
          onAction={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
    expect(screen.getByText('Outline Button')).toBeInTheDocument();
  });

  it('handles missing page gracefully', () => {
    render(
      <ThemeProvider>
        <SduiPage
          schema={mockSchema}
          currentPageId="nonexistent-page"
          onAction={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Page "nonexistent-page" not found in schema')).toBeInTheDocument();
  });

  it('renders heading component', () => {
    const schemaWithHeading = {
      pages: [
        {
          id: 'page1',
          title: 'Test Page',
          order: 0,
          components: [
            {
              id: 'heading1',
              type: 'heading',
              props: {
                text: 'Main Heading',
              },
            },
          ],
        },
      ],
    };

    render(
      <ThemeProvider>
        <SduiPage
          schema={schemaWithHeading}
          currentPageId="page1"
          onAction={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Main Heading')).toBeInTheDocument();
    // Check that it renders as an h2 element
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders text input component', () => {
    const schemaWithTextInput = {
      pages: [
        {
          id: 'page1',
          title: 'Test Page',
          order: 0,
          components: [
            {
              id: 'input1',
              type: 'text-input',
              props: {
                label: 'Name',
                placeholder: 'Enter your name',
              },
            },
          ],
        },
      ],
    };

    render(
      <ThemeProvider>
        <SduiPage
          schema={schemaWithTextInput}
          currentPageId="page1"
          onAction={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });
});