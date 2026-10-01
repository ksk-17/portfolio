import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

window.matchMedia = window.matchMedia || ((query) => ({
  matches: false, media: query, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
}));

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
globalThis.IntersectionObserver = globalThis.IntersectionObserver || NoopObserver;
globalThis.ResizeObserver = globalThis.ResizeObserver || NoopObserver;

HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
Element.prototype.scrollBy = Element.prototype.scrollBy || vi.fn();
