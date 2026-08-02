import { render, screen } from '@testing-library/react';

import { App } from '.';

describe('App component', () => {
  it('renders the JSON formatter', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /json formatter/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/input/i)).toBeInTheDocument();
  });
});
