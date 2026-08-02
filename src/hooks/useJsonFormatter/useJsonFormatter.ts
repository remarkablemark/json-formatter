import { useEffect, useRef, useState } from 'react';
import {
  formatJson,
  type JsonFormatterIndent,
  minifyJson,
} from 'src/utils/formatJson';

export type JsonFormatterMode = 'format' | 'minify';

const COPIED_TIMEOUT_MS = 2_000;

export interface UseJsonFormatterResult {
  copied: boolean;
  copy: () => void;
  error: string | undefined;
  indent: JsonFormatterIndent;
  input: string;
  mode: JsonFormatterMode;
  output: string;
  setIndent: (indent: JsonFormatterIndent) => void;
  setInput: (input: string) => void;
  setMode: (mode: JsonFormatterMode) => void;
}

/**
 * Manages the state and derived output for the JSON formatter: the raw
 * input, the chosen indent size and format/minify mode, the resulting
 * formatted output (or validation error), and copy-to-clipboard feedback.
 */
export function useJsonFormatter(): UseJsonFormatterResult {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<JsonFormatterIndent>(2);
  const [mode, setMode] = useState<JsonFormatterMode>('format');
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const result = input.trim()
    ? mode === 'format'
      ? formatJson(input, indent)
      : minifyJson(input)
    : { output: '' };

  const output = 'output' in result ? result.output : '';
  const error = 'error' in result ? result.error : undefined;

  function copy() {
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, COPIED_TIMEOUT_MS);
      })
      .catch(() => {
        // Silently ignore clipboard failures (e.g. permission denied).
      });
  }

  return {
    copied,
    copy,
    error,
    indent,
    input,
    mode,
    output,
    setIndent,
    setInput,
    setMode,
  };
}
