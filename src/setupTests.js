import '@testing-library/jest-dom';

// Polyfills and mocks for JSDOM
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    createRadialGradient: () => {
      return {
        addColorStop: () => {},
      };
    },
  };
};

// Mock scrollIntoView since jsdom doesn't support layout
Element.prototype.scrollIntoView = () => {};
