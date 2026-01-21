// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock ResizeObserver if it doesn't exist (needed for some UI libraries)
global.ResizeObserver = require('resize-observer-polyfill');

// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => `Mocked Syntax Highlighter: ${children}`,
}));

jest.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  vs: {},
}));