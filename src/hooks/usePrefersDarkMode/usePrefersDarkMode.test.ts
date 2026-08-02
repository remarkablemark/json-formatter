import { act, renderHook } from '@testing-library/react';

import { usePrefersDarkMode } from './usePrefersDarkMode';

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQueryList = {
    matches,
    addEventListener: (
      _type: 'change',
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      listeners.add(listener);
    },
    removeEventListener: (
      _type: 'change',
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      listeners.delete(listener);
    },
  } as MediaQueryList;

  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryList));

  return {
    emitChange: (nextMatches: boolean) => {
      for (const listener of listeners) {
        listener({ matches: nextMatches } as MediaQueryListEvent);
      }
    },
  };
}

describe('usePrefersDarkMode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the initial matchMedia value', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => usePrefersDarkMode());

    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    const { emitChange } = mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersDarkMode());
    expect(result.current).toBe(false);

    act(() => {
      emitChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes the listener on unmount', () => {
    const { emitChange } = mockMatchMedia(false);

    const { result, unmount } = renderHook(() => usePrefersDarkMode());
    unmount();

    act(() => {
      emitChange(true);
    });

    expect(result.current).toBe(false);
  });
});
