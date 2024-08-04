import { Globals } from '@react-spring/web';

beforeAll(() => {
    // Turn off animated transitions for testing
    Globals.assign({
        skipAnimation: true,
    });
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

afterEach(() => {
    // Restore all fake clocks if used
    jest.useRealTimers();
});
