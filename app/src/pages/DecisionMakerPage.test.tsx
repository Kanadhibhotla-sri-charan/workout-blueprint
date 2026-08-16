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

    await user.selectOptions(screen.getByLabelText(/what do you want to improve/i), 'region:chest');
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

    await user.selectOptions(screen.getByLabelText(/what do you want to improve/i), 'region:chest');
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

    await user.selectOptions(screen.getByLabelText(/what do you want to improve/i), 'region:chest');
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

  // The Phase 4 golden test case (architect approval memo item 5): Upper
  // Pec + Incline Dumbbell Press + "more growth / low redundancy" must
  // demonstrate the complete vertical slice through the actual UI, not
  // just the engine directly — this is the acceptance gate before the
  // taxonomy expands past Upper Pec.
  it('golden test case: Upper Pec + Incline Dumbbell Press + complement goal', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/what do you want to improve/i), 'target:upper-pec');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'complement-current'
    );
    await user.selectOptions(screen.getByLabelText(/current exercise/i), 'incline-dumbbell-press');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // Specific physique target recognition — disambiguated from the
    // select's own "Upper Pec" option text via the result block specifically.
    await screen.findByRole('heading', { name: /stimulus/i });
    const targetName = document.querySelector('.decision-result-block .decision-result-name');
    expect(targetName?.textContent).toBe('Upper Pec');
    // Visual objective (the target's physique_outcome).
    expect(screen.getByText(/upper chest shelf/i)).toBeInTheDocument();
    // Current-exercise context + overlap avoidance + complementary
    // selection: the recommendation must be a genuinely different
    // movement, not the same exercise the user is already doing.
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink).toBeDefined();
    expect(bestFitLink?.textContent).not.toBe('Incline Dumbbell Press');
    // Sets/reps/RIR/frequency/progression all present.
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('RIR')).toBeInTheDocument();
    expect(screen.getByText('Weekly sets')).toBeInTheDocument();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText(/increase the load slightly/i)).toBeInTheDocument();
    // Clear explanation of why this exercise was recommended (not just a
    // bare name — the explanation must reference the current exercise it's
    // reasoning from).
    expect(screen.getByText(/alongside Incline Dumbbell Press/i)).toBeInTheDocument();
  });

  // The revised Phase 4 spec's primary acceptance test (§36): the aesthetic
  // outcome selector — not the direct target dropdown — must resolve
  // "Chest looks flat from the side" all the way through to the same
  // already-validated Upper Pec engine chain (Incline Dumbbell Press ->
  // Cable Fly, full programming). This is the actual required golden slice;
  // the test above exercises the same chain via the direct target picker,
  // which the aesthetic layer sits on top of without disturbing.
  it('golden slice: the aesthetic-outcome entry point ("Chest looks flat from the side") resolves through Upper Pec', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area \(by appearance\)/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'chest-side-projection'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'complement-current'
    );
    await user.selectOptions(screen.getByLabelText(/current exercise/i), 'incline-dumbbell-press');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // The aesthetic-outcome block itself: what the user said they wanted to
    // change, shown ahead of the technical target.
    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const outcomeName = document.querySelector('.decision-result-outcome .decision-result-name');
    expect(outcomeName?.textContent).toBe('Chest looks flat from the side');
    expect(screen.getByText(/lacks depth or projection/i)).toBeInTheDocument();

    // It resolved to the same Upper Pec target the direct-picker golden
    // test validates, not a fabricated or generic chest pick.
    const targetName = document.querySelector('.decision-result-target .decision-result-name');
    expect(targetName?.textContent).toBe('Upper Pec');
    expect(screen.getByText(/upper chest shelf/i)).toBeInTheDocument();

    // Same complement-selection and programming guarantees as the direct
    // golden test.
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink).toBeDefined();
    expect(bestFitLink?.textContent).not.toBe('Incline Dumbbell Press');
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('RIR')).toBeInTheDocument();
    expect(screen.getByText(/alongside Incline Dumbbell Press/i)).toBeInTheDocument();
  });

  it('editing question 1 directly after using the appearance selector clears the stale "what you\'re trying to change" block', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area \(by appearance\)/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'chest-side-projection'
    );
    // Override question 1 directly, away from the aesthetic pick.
    await user.selectOptions(screen.getByLabelText(/what do you want to improve/i), 'region:chest');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByText(/best fit/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /what you're trying to change/i })).not.toBeInTheDocument();
  });
});
