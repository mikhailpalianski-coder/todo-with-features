import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Type definitions for global in test environment
declare global {
  // eslint-disable-next-line no-var
  var fetch: ReturnType<typeof vi.fn>;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.fetch globally
globalThis.fetch = vi.fn() as never;

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

