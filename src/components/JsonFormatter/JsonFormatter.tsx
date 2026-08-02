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

const COPY_BUTTON_CLASS_NAME =
  'flex h-9 cursor-pointer items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 text-center text-sm font-medium text-white shadow-xs transition-all hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300 dark:focus:bg-slate-300 dark:active:bg-slate-300';

const SEGMENT_BUTTON_CLASS_NAME =
  'flex cursor-pointer items-center justify-center px-4 text-center text-sm font-medium transition-colors';

function segmentButtonClassName(active: boolean): string {
  return [
    SEGMENT_BUTTON_CLASS_NAME,
    active
      ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
  ].join(' ');
}

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
        <div className="flex h-9 divide-x divide-slate-300 overflow-hidden rounded-md border border-slate-300 dark:divide-slate-700 dark:border-slate-700">
          <button
            aria-pressed={mode === 'format'}
            className={segmentButtonClassName(mode === 'format')}
            onClick={() => {
              setMode('format');
            }}
            type="button"
          >
            Format
          </button>
          <button
            aria-pressed={mode === 'minify'}
            className={segmentButtonClassName(mode === 'minify')}
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
            className="h-9 rounded-md border border-slate-300 bg-slate-50 px-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
          className={COPY_BUTTON_CLASS_NAME}
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
            className="flex min-h-64 flex-1 flex-col overflow-auto rounded-md border border-slate-300 text-left dark:border-slate-700"
            data-testid="json-output"
          >
            {output && (
              <SyntaxHighlighter
                customStyle={{ flex: 1, margin: 0 }}
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
