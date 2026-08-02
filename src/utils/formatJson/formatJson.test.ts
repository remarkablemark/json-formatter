import { formatJson } from './formatJson';

describe('formatJson', () => {
  it('formats valid JSON with 2-space indent', () => {
    expect(formatJson('{"a":1}', 2)).toEqual({ output: '{\n  "a": 1\n}' });
  });

  it('formats valid JSON with 4-space indent', () => {
    expect(formatJson('{"a":1}', 4)).toEqual({ output: '{\n    "a": 1\n}' });
  });

  it('formats valid JSON with tab indent', () => {
    expect(formatJson('{"a":1}', 'tab')).toEqual({ output: '{\n\t"a": 1\n}' });
  });

  it('returns an error for invalid JSON', () => {
    const result = formatJson('{invalid}', 2);

    expect('error' in result).toBe(true);
    expect((result as { error: string }).error).toMatch(/^Invalid JSON: /);
  });

  it('returns an error for empty input', () => {
    const result = formatJson('', 2);

    expect('error' in result).toBe(true);
  });
});
