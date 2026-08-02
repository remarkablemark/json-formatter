import type { FormatJsonResult } from './formatJson';
import { getJsonErrorMessage } from './parseJsonError';

/**
 * Parses and re-serializes JSON with no whitespace.
 */
export function minifyJson(input: string): FormatJsonResult {
  try {
    const parsed: unknown = JSON.parse(input);

    return { output: JSON.stringify(parsed) };
  } catch (error) {
    return { error: getJsonErrorMessage(input, error as SyntaxError) };
  }
}
