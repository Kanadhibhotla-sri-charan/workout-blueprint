// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DecisionMakerPage } from './DecisionMakerPage';

// @testing-library/react's automatic afterEach cleanup only registers
// itself against a global `afterEach` (test.globals: true in the vitest
// config); this project imports test functions explicitly instead, so
// cleanup is wired by hand here to keep each test's render isolated.
afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter>
      <DecisionMakerPage />
    </MemoryRouter>
  );
}

describe('DecisionMakerPage', () => {
  it('produces a Best Fit recommendation for a goal-only submission', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/what are you training/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByText(/best fit/i)).toBeInTheDocument();
  });

  it('shows the engine\'s own missing-current-exercise message rather than guessing', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/what are you training/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'replace-exercise'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByText(/needs you to specify the exercise/i)).toBeInTheDocument();
  });

  it('reveals the equipment multi-select only once the constraint checkbox is checked', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.queryByLabelText(/equipment available/i)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText(/limit by equipment/i));
    expect(screen.getByLabelText(/equipment available/i)).toBeInTheDocument();
  });

  it('resolves a replace-exercise recommendation end to end with a current exercise set', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/what are you training/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'replace-exercise'
    );
    await user.selectOptions(
      screen.getByLabelText(/current exercise/i),
      'incline-dumbbell-press'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByRole('link', { name: 'Incline Barbell Press' })).toBeInTheDocument();
  });
});
