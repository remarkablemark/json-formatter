import { getJsonErrorMessage } from './parseJsonError';

export type FormatJsonResult = { error: string } | { output: string };
export type JsonFormatterIndent = 2 | 4 | 'tab';

/**
 * Parses and re-serializes JSON with the given indentation.
 */
export function formatJson(
  input: string,
  indent: JsonFormatterIndent,
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
