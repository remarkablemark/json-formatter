import { createRoot } from 'react-dom/client';

const mockRender = vi.fn();

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender,
  })),
}));

// Avoid transforming/instrumenting the real App (and its dependencies, e.g.
// react-syntax-highlighter) here, since this test only exercises the
// createRoot/render wiring; App itself is covered by App.test.tsx.
vi.mock('./components/App', () => ({
  App: () => null,
}));

const mockCreateRoot = vi.mocked(createRoot);

beforeAll(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

afterAll(() => {
  document.body.innerHTML = '';
});

describe('main entry point', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates root and renders App', () => {
    return import('./main').then(() => {
      expect(mockCreateRoot).toHaveBeenCalledWith(
        document.getElementById('root'),
      );

      expect(mockRender).toHaveBeenCalled();
    });
  });
});
