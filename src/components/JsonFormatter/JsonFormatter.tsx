import { useId } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useJsonFormatter } from 'src/hooks/useJsonFormatter';
import { usePrefersDarkMode } from 'src/hooks/usePrefersDarkMode';
import type { JsonFormatterIndent } from 'src/utils/formatJson';

SyntaxHighlighter.registerLanguage('json', json);

const BUTTON_CLASS_NAME =
  'cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-center text-sm font-medium text-slate-800 shadow-xs transition-all hover:border-slate-800 focus:border-slate-800 focus:bg-slate-50 active:border-slate-800 active:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-800 dark:active:border-slate-500 dark:active:bg-slate-800';

const INDENT_OPTIONS: { label: string; value: JsonFormatterIndent }[] = [
  { label: '2 spaces', value: 2 },
  { label: '4 spaces', value: 4 },
  { label: 'Tab', value: 'tab' },
];

function parseIndent(value: string): JsonFormatterIndent {
  if (value === 'tab') {
    return 'tab';
  }

  return value === '4' ? 4 : 2;
}

export function JsonFormatter() {
  const prefersDark = usePrefersDarkMode();
  const {
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
  } = useJsonFormatter();
  const inputId = useId();

  return (
    <div>
      <h1 className="my-6 text-4xl font-bold">JSON Formatter</h1>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
        <div className="flex gap-2">
          <button
            aria-pressed={mode === 'format'}
            className={BUTTON_CLASS_NAME}
            onClick={() => {
              setMode('format');
            }}
            type="button"
          >
            Format
          </button>
          <button
            aria-pressed={mode === 'minify'}
            className={BUTTON_CLASS_NAME}
            onClick={() => {
              setMode('minify');
            }}
            type="button"
          >
            Minify
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
          Indent
          <select
            className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-sm text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            disabled={mode === 'minify'}
            onChange={(event) => {
              setIndent(parseIndent(event.target.value));
            }}
            value={String(indent)}
          >
            {INDENT_OPTIONS.map(({ label, value }) => (
              <option key={label} value={String(value)}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          className={BUTTON_CLASS_NAME}
          disabled={!output}
          onClick={copy}
          type="button"
        >
          <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 text-left md:flex-row">
        <div className="flex min-h-64 flex-1 flex-col">
          <label
            className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
            htmlFor={inputId}
          >
            Input
          </label>
          <textarea
            className="min-h-64 w-full resize-y rounded-md border border-slate-300 bg-slate-50 p-3 font-[monospace] text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            id={inputId}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder="Paste JSON here"
            value={input}
          />
        </div>

        <div className="flex min-h-64 flex-1 flex-col">
          <span className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Output
          </span>
          <div
            className="min-h-64 flex-1 overflow-auto rounded-md border border-slate-300 text-left dark:border-slate-700"
            data-testid="json-output"
          >
            {output && (
              <SyntaxHighlighter
                customStyle={{ margin: 0, minHeight: '100%' }}
                language="json"
                style={prefersDark ? oneDark : oneLight}
              >
                {output}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
