import { minifyJson } from './minifyJson';

describe('minifyJson', () => {
  it('minifies valid JSON', () => {
    expect(minifyJson('{\n  "a": 1\n}')).toEqual({ output: '{"a":1}' });
  });

  it('returns an error for invalid JSON', () => {
    const result = minifyJson('{invalid}');

    expect('error' in result).toBe(true);
    expect((result as { error: string }).error).toMatch(/^Invalid JSON: /);
  });

  it('returns an error for empty input', () => {
    const result = minifyJson('');

    expect('error' in result).toBe(true);
  });
});
