import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { JsonFormatter } from '.';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

function typeInInput(value: string) {
  fireEvent.change(screen.getByLabelText(/input/i), { target: { value } });
}

describe('JsonFormatter component', () => {
  afterEach(() => {
    // @ts-expect-error -- restoring navigator.clipboard for other tests
    delete navigator.clipboard;
  });

  it('renders without crashing', () => {
    render(<JsonFormatter />);

    expect(
      screen.getByRole('heading', { name: /json formatter/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/input/i)).toBeInTheDocument();
    expect(screen.getByTestId('json-output')).toBeEmptyDOMElement();
  });

  it('formats valid JSON as it is typed, defaulting to 2-space indent', () => {
    render(<JsonFormatter />);

    typeInInput('{"a":1}');

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n  "a": 1\n}',
    );
  });

  it('shows a validation error for invalid JSON', () => {
    render(<JsonFormatter />);

    typeInInput('{invalid}');

    expect(screen.getByRole('alert')).toHaveTextContent(/^Invalid JSON: /);
    expect(screen.getByTestId('json-output')).toBeEmptyDOMElement();
  });

  it('minifies the output when the minify mode is selected', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeInInput('{"a":1}');
    await user.click(screen.getByRole('button', { name: 'Minify' }));

    expect(screen.getByTestId('json-output').textContent).toBe('{"a":1}');
    expect(screen.getByRole('combobox', { name: /indent/i })).toBeDisabled();
  });

  it('switches back to format mode', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeInInput('{"a":1}');
    await user.click(screen.getByRole('button', { name: 'Minify' }));
    await user.click(screen.getByRole('button', { name: 'Format' }));

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n  "a": 1\n}',
    );
    expect(
      screen.getByRole('combobox', { name: /indent/i }),
    ).not.toBeDisabled();
  });

  it('reformats when the indent size changes', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeInInput('{"a":1}');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /indent/i }),
      'Tab',
    );

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n\t"a": 1\n}',
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: /indent/i }),
      '4 spaces',
    );

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n    "a": 1\n}',
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: /indent/i }),
      '2 spaces',
    );

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n  "a": 1\n}',
    );
  });

  it('disables the copy button when there is no valid output', () => {
    render(<JsonFormatter />);

    expect(screen.getByRole('button', { name: /copy/i })).toBeDisabled();
  });

  it('uses the dark syntax theme when the OS prefers dark mode', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      }),
    );

    render(<JsonFormatter />);
    typeInInput('{"a":1}');

    expect(screen.getByTestId('json-output').textContent).toBe(
      '{\n  "a": 1\n}',
    );

    vi.unstubAllGlobals();
  });

  it('copies the formatted output to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    mockClipboard(writeText);
    render(<JsonFormatter />);

    typeInInput('{"a":1}');
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('{\n  "a": 1\n}');
    expect(
      await screen.findByRole('button', { name: 'Copied!' }),
    ).toBeInTheDocument();
  });
});
