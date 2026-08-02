import { getJsonErrorMessage } from './parseJsonError';

export type FormatJsonResult = { error: string } | { output: string };

/**
 * Parses and re-serializes JSON with the given indentation.
 */
export function formatJson(
  input: string,
  indent: 2 | 4 | 'tab',
): FormatJsonResult {
  try {
    const parsed: unknown = JSON.parse(input);

    return {
      output: JSON.stringify(parsed, null, indent === 'tab' ? '\t' : indent),
    };
  } catch (error) {
    return { error: getJsonErrorMessage(input, error as SyntaxError) };
  }
}
