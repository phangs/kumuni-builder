import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropertiesPanel } from '../PropertiesPanel';

describe('PropertiesPanel', () => {
  const mockComponent = {
    id: 'test-component',
    type: 'text',
    props: {
      text: 'Test text',
    },
  };

  const mockPage = {
    id: 'test-page',
    title: 'Test Page',
    order: 0,
    components: [],
  };

  const mockAllPages = [mockPage];

  const mockOnComponentUpdate = jest.fn();
  const mockOnPageUpdate = jest.fn();

  it('renders without crashing', () => {
    render(
      <PropertiesPanel
        component={mockComponent}
        page={mockPage}
        allPages={mockAllPages}
        onComponentUpdate={mockOnComponentUpdate}
        onPageUpdate={mockOnPageUpdate}
      />
    );

    expect(screen.getByText('Component Type')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('displays component ID', () => {
    render(
      <PropertiesPanel
        component={mockComponent}
        page={mockPage}
        allPages={mockAllPages}
        onComponentUpdate={mockOnComponentUpdate}
        onPageUpdate={mockOnPageUpdate}
      />
    );

    const idInput = screen.getByDisplayValue('test-component');
    expect(idInput).toBeInTheDocument();
  });

  it('shows text content field for text component', () => {
    render(
      <PropertiesPanel
        component={mockComponent}
        page={mockPage}
        allPages={mockAllPages}
        onComponentUpdate={mockOnComponentUpdate}
        onPageUpdate={mockOnPageUpdate}
      />
    );

    const textArea = screen.getByDisplayValue('Test text');
    expect(textArea).toBeInTheDocument();
  });

  it('does not show text content field for non-text component', () => {
    const buttonComponent = {
      ...mockComponent,
      type: 'button',
      props: { title: 'Click me' },
    };

    render(
      <PropertiesPanel
        component={buttonComponent}
        page={mockPage}
        allPages={mockAllPages}
        onComponentUpdate={mockOnComponentUpdate}
        onPageUpdate={mockOnPageUpdate}
      />
    );

    const textArea = screen.queryByText('Text Content');
    expect(textArea).not.toBeInTheDocument();
  });
});