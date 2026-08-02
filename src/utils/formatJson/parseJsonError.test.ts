import { getJsonErrorMessage } from './parseJsonError';

function parseAndCatch(input: string): SyntaxError {
  try {
    JSON.parse(input);
  } catch (error) {
    return error as SyntaxError;
  }

  throw new Error('expected JSON.parse to throw');
}

describe('getJsonErrorMessage', () => {
  it('includes the line and column for an error on the first line', () => {
    const error = parseAndCatch('{invalid}');

    expect(getJsonErrorMessage('{invalid}', error)).toMatch(
      /^Invalid JSON: .+ \(line 1, column \d+\)$/,
    );
  });

  it('includes the line and column for an error on a later line', () => {
    const input = '{\n  "a": 1,\n  invalid\n}';
    const error = parseAndCatch(input);

    expect(getJsonErrorMessage(input, error)).toMatch(
      /^Invalid JSON: .+ \(line 3, column \d+\)$/,
    );
  });

  it('falls back to the plain message when no position is present', () => {
    const error = new SyntaxError('Something went wrong');

    expect(getJsonErrorMessage('irrelevant', error)).toBe(
      'Invalid JSON: Something went wrong',
    );
  });
});
