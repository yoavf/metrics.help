import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock posthog-js for tests
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
  },
}));

// Mock PostHogProvider for tests so it simply renders its children
vi.mock('posthog-js/react', () => {
  const React = require('react');
  return {
    PostHogProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});