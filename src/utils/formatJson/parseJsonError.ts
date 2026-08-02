/**
 * Computes a 1-based line and column for the given character position within
 * `input`, so that error messages are consistent across JS engines (some
 * engines already embed a line/column in the native error message, others
 * don't).
 */
function getLineAndColumn(
  input: string,
  position: number,
): { column: number; line: number } {
  let line = 1;
  let column = 1;

  for (let index = 0; index < position && index < input.length; index++) {
    if (input[index] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  return { column, line };
}

/**
 * Builds a friendly error message for a `JSON.parse` `SyntaxError`, appending
 * a `(line X, column Y)` suffix computed from the error's character position
 * when one can be found, so the message is consistent regardless of which JS
 * engine threw the error.
 */
export function getJsonErrorMessage(input: string, error: SyntaxError): string {
  const message = `Invalid JSON: ${error.message}`;
  const match = /position (\d+)/.exec(error.message);

  if (!match) {
    return message;
  }

  const position = Number(match[1]);
  const { column, line } = getLineAndColumn(input, position);

  return `${message} (line ${String(line)}, column ${String(column)})`;
}
