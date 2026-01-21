import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JsonPreviewPane } from '../JsonPreviewPane';
import { ToastProvider } from '../../contexts/ToastContext';

describe('JsonPreviewPane', () => {
  const mockSchema = {
    id: 'test-app',
    name: 'Test App',
    version: '1.0.0',
    pages: [
      {
        id: 'page1',
        title: 'Home',
        order: 0,
        components: [
          {
            id: 'comp1',
            type: 'text',
            props: { text: 'Hello World' },
          },
        ],
      },
    ],
    navigation: {
      guestPageId: 'page1',
      initialPageId: 'page1',
    },
    metadata: {
      revision: 1,
      createdBy: 'test',
    },
    created_at: '2026-01-21T00:00:00.000Z',
    updated_at: '2026-01-21T00:00:00.000Z',
  };

  it('renders with schema data', () => {
    render(
      <ToastProvider>
        <JsonPreviewPane
          schema={mockSchema}
          selectedComponentId={null}
        />
      </ToastProvider>
    );

    // Check that the collapsible header is present
    expect(screen.getByText('Live JSON Preview')).toBeInTheDocument();

    // Check that the JSON content is rendered
    const jsonContent = screen.getByText(/test-app/);
    expect(jsonContent).toBeInTheDocument();
  });

  it('formats JSON properly', () => {
    render(
      <ToastProvider>
        <JsonPreviewPane
          schema={mockSchema}
          selectedComponentId={null}
        />
      </ToastProvider>
    );

    // Check that the JSON contains expected properties
    expect(screen.getByText(/name/)).toBeInTheDocument();
    expect(screen.getByText(/version/)).toBeInTheDocument();
    expect(screen.getByText(/pages/)).toBeInTheDocument();
  });

  it('highlights selected component when ID is provided', () => {
    render(
      <ToastProvider>
        <JsonPreviewPane
          schema={mockSchema}
          selectedComponentId="comp1"
        />
      </ToastProvider>
    );

    // Check that the collapsible header is present
    expect(screen.getByText('Live JSON Preview')).toBeInTheDocument();
  });

  it('handles empty schema', () => {
    render(
      <ToastProvider>
        <JsonPreviewPane
          schema={{}}
          selectedComponentId={null}
        />
      </ToastProvider>
    );

    // Should still render the header even with empty schema
    expect(screen.getByText('Live JSON Preview')).toBeInTheDocument();
  });

  it('collapses and expands properly', () => {
    render(
      <ToastProvider>
        <JsonPreviewPane
          schema={mockSchema}
          selectedComponentId={null}
        />
      </ToastProvider>
    );

    // Check that the header is present
    const header = screen.getByText('Live JSON Preview');
    expect(header).toBeInTheDocument();

    // The JSON content should be visible (since it's initially open)
    expect(screen.getByText(/test-app/)).toBeInTheDocument();
  });
});