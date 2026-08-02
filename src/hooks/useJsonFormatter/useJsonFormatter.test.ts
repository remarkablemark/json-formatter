import { act, renderHook } from '@testing-library/react';

import { useJsonFormatter } from './useJsonFormatter';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

describe('useJsonFormatter', () => {
  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error -- restoring navigator.clipboard for other tests
    delete navigator.clipboard;
  });

  it('has no output or error for empty input', () => {
    const { result } = renderHook(() => useJsonFormatter());

    expect(result.current.output).toBe('');
    expect(result.current.error).toBeUndefined();
  });

  it('formats valid JSON with the default 2-space indent', () => {
    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{"a":1}');
    });

    expect(result.current.output).toBe('{\n  "a": 1\n}');
    expect(result.current.error).toBeUndefined();
  });

  it('reformats when the indent size changes', () => {
    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{"a":1}');
    });
    act(() => {
      result.current.setIndent(4);
    });

    expect(result.current.output).toBe('{\n    "a": 1\n}');
  });

  it('minifies when switching to minify mode', () => {
    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{\n  "a": 1\n}');
    });
    act(() => {
      result.current.setMode('minify');
    });

    expect(result.current.output).toBe('{"a":1}');
  });

  it('surfaces a validation error for invalid JSON', () => {
    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{invalid}');
    });

    expect(result.current.output).toBe('');
    expect(result.current.error).toMatch(/^Invalid JSON: /);
  });

  it('copies the output to the clipboard and resets after a timeout', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{"a":1}');
    });

    await act(async () => {
      result.current.copy();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith('{\n  "a": 1\n}');
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('does not mark as copied and logs the error when the clipboard write fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {
        // suppress expected console output during this test
      });
    const clipboardError = new Error('denied');
    const writeText = vi.fn().mockRejectedValue(clipboardError);
    mockClipboard(writeText);

    const { result } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{"a":1}');
    });

    await act(async () => {
      result.current.copy();
      await Promise.resolve();
    });

    expect(result.current.copied).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to copy to clipboard:',
      clipboardError,
    );

    consoleErrorSpy.mockRestore();
  });

  it('clears the pending timeout on unmount', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { result, unmount } = renderHook(() => useJsonFormatter());

    act(() => {
      result.current.setInput('{"a":1}');
    });

    await act(async () => {
      result.current.copy();
      await Promise.resolve();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });
});
