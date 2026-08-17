// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
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

// Appearance is the default entry mode (Phase 4 Corrections §2-5: it's the
// primary physique-goal entry point, not an optional add-on). Tests that
// specifically exercise the direct/advanced target picker switch into that
// mode explicitly first.
async function useAdvancedMode(user: UserEvent) {
  await user.click(screen.getByRole('radio', { name: /direct \/ advanced/i }));
}

describe('DecisionMakerPage', () => {
  it('produces a Best Fit recommendation for a goal-only submission', async () => {
    const user = userEvent.setup();
    renderPage();

    await useAdvancedMode(user);
    await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'region:chest');
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

    await useAdvancedMode(user);
    await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'region:chest');
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

    await useAdvancedMode(user);
    await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'region:chest');
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
  // taxonomy expands past Upper Pec. Exercised here via the direct/
  // advanced picker specifically, to confirm that path still works
  // unchanged (Phase 4 Corrections §5's "direct target path still works").
  it('golden test case (direct/advanced path): Upper Pec + Incline Dumbbell Press + complement goal', async () => {
    const user = userEvent.setup();
    renderPage();

    await useAdvancedMode(user);
    await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'target:upper-pec');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'complement-current'
    );
    await user.selectOptions(screen.getByLabelText(/current exercise/i), 'incline-dumbbell-press');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // Specific physique target recognition — disambiguated from the
    // select's own "Upper Pec" option text via the result block specifically.
    await screen.findByRole('heading', { name: /stimulus/i });
    const targetName = document.querySelector('.decision-result-target .decision-result-name');
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
  // Cable Fly, full programming). Appearance is the default entry mode
  // (Phase 4 Corrections §2), so no mode switch is needed here.
  it('golden slice: the aesthetic-outcome entry point ("Chest looks flat from the side") resolves through Upper Pec', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'chest');
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

    // It resolved to the same Upper Pec primary target the direct-picker
    // golden test validates, not a fabricated or generic chest pick.
    const targetName = document.querySelector('.decision-result-target .decision-result-name');
    expect(targetName?.textContent).toBe('Upper Pec');
    expect(screen.getByText(/upper chest shelf/i)).toBeInTheDocument();

    // Supporting target (lower-pec) is surfaced, not silently discarded
    // (Phase 4 Corrections §7-8).
    const supportingBlock = document.querySelector('.decision-result-supporting');
    expect(supportingBlock?.textContent).toMatch(/lower pec/i);

    // Same complement-selection and programming guarantees as before.
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink).toBeDefined();
    expect(bestFitLink?.textContent).not.toBe('Incline Dumbbell Press');
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('RIR')).toBeInTheDocument();
    expect(screen.getByText(/alongside Incline Dumbbell Press/i)).toBeInTheDocument();
  });

  // Second required golden slice (spec §37): proves the aesthetic-outcome
  // architecture isn't accidentally chest-only, by resolving a completely
  // different region/target (arms/triceps) through the same UI path.
  it('golden slice: the aesthetic-outcome entry point ("Triceps have no depth from behind") resolves through Triceps', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'arms');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'triceps-back-depth'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'complement-current'
    );
    await user.selectOptions(screen.getByLabelText(/current exercise/i), 'cable-pushdown');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const outcomeName = document.querySelector('.decision-result-outcome .decision-result-name');
    expect(outcomeName?.textContent).toBe('Triceps have no depth from behind');
    expect(screen.getByText(/looks flat or thin when viewed from behind/i)).toBeInTheDocument();

    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Triceps');
    // The visual-objective text ("...outsized effect on overall arm
    // thickness...") is distinct enough from the outcome's own
    // technical_explanation not to collide with it.
    expect(screen.getByText(/outsized effect on overall arm thickness/i)).toBeInTheDocument();

    // Supporting target (triceps-long-head) surfaced, not discarded.
    const supportingBlock = document.querySelector('.decision-result-supporting');
    expect(supportingBlock?.textContent).toMatch(/triceps — long-head emphasis/i);

    // A genuinely different movement from the current exercise, not the
    // same one restated.
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink).toBeDefined();
    expect(bestFitLink?.textContent).not.toBe('Cable Pushdown');
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('RIR')).toBeInTheDocument();
    // "alongside Cable Pushdown" also appears in the alternative's own
    // explanation, so scope this check to the Best Fit block specifically.
    expect(document.querySelector('.decision-result-best')?.textContent).toMatch(/alongside Cable Pushdown/i);
  });

  // Multi-target golden slice, corrected per Phase 4B §3-4/§25 Test A:
  // "My arms look thin from the side" involves both a primary target
  // (brachialis-arm-thickness) and a supporting one (triceps). The
  // primary-target exercise must win the top recommendation regardless of
  // how favorable a supporting-target exercise's generic stimulus tag is
  // — a triceps-only top pick fails this test, per the spec's own
  // "arms look thin from the side" worked example. The supporting target
  // must still be surfaced, not discarded, just because it didn't win.
  it('multi-target golden slice: "Arms look thin from the side" recommends a direct primary-target exercise and still surfaces the supporting target', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'arms');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'arm-side-thickness'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const outcomeName = document.querySelector('.decision-result-outcome .decision-result-name');
    expect(outcomeName?.textContent).toBe('Arms look thin from the side');

    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Brachialis / Arm Thickness');

    // Supporting target (triceps) is surfaced even though it doesn't win.
    const supportingBlock = document.querySelector('.decision-result-supporting');
    expect(supportingBlock?.textContent).toMatch(/triceps/i);

    // Test A (Phase 4B §25): top recommendation must be a direct
    // primary-target (brachialis) exercise. A triceps-only result fails —
    // Close-Grip Bench Press (triceps, heavy-compound) is reachable and
    // would win on generic stimulus tags alone, but must not.
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink?.textContent).toBe('Cable Hammer Curl (Rope)');
  });

  it('editing the direct/advanced picker after using the appearance selector clears the stale "what you\'re trying to change" block and its supporting targets', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'chest-side-projection'
    );
    // Switch to the direct/advanced path and override away from the
    // aesthetic pick.
    await useAdvancedMode(user);
    await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'region:chest');
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    expect(await screen.findByText(/best fit/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /what you're trying to change/i })).not.toBeInTheDocument();
    expect(document.querySelector('.decision-result-supporting')).not.toBeInTheDocument();
  });

  // Phase 4 Corrections §5/§19: Function must be a clearly separated entry
  // point, distinct from both Appearance and the direct/advanced path,
  // even though it has no working data model yet (that's 4J).
  // 4J: Function is a real, working entry point — separate from Appearance,
  // feeding the same engine through its own functionalGoal input. Core
  // Anti-Extension has exactly one tagged exercise (Plank), so build-base
  // resolving to it end to end is a clean, deterministic proof the branch
  // actually works, not just that it's visually present.
  it('Function resolves a real recommendation through its own functional-goal picker, kept separate from the aesthetic result blocks', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('radio', { name: /^function$/i }));
    await user.selectOptions(screen.getByLabelText(/body area/i), 'core');
    await user.selectOptions(
      screen.getByLabelText(/what do you want to improve functionally/i),
      'core-anti-extension'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    const functionalBlock = document.querySelector('.decision-result-functional');
    expect(functionalBlock?.querySelector('.decision-result-name')?.textContent).toBe('Core Anti-Extension');
    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink?.textContent).toBe('Plank');

    // Never mixed into the aesthetic outcome selector or result blocks
    // (revised spec §12).
    expect(document.querySelector('.decision-result-outcome')).not.toBeInTheDocument();
    expect(document.querySelector('.decision-result-target')).not.toBeInTheDocument();
  });

  it('switching from Function to Appearance clears the stale functional-goal state, and vice versa', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('radio', { name: /^function$/i }));
    await user.selectOptions(screen.getByLabelText(/body area/i), 'core');
    await user.selectOptions(
      screen.getByLabelText(/what do you want to improve functionally/i),
      'core-anti-extension'
    );

    await user.click(screen.getByRole('radio', { name: /^appearance$/i }));
    await user.selectOptions(screen.getByLabelText(/body area/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'chest-side-projection'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // Resolved the aesthetic pick, not a leftover functional one.
    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Upper Pec');
    expect(document.querySelector('.decision-result-functional')).not.toBeInTheDocument();
  });

  // Found during the 4K mobile pass: switching entry modes cleared
  // bodyRegion/physiqueTarget/functionalGoal but not currentExerciseId, so
  // an exercise picked under the old region could silently resubmit even
  // though the dropdown visibly showed "— none —" after the switch —
  // "complement-current" for a Function-mode pick would then reason from a
  // stale, unrelated chest exercise instead of returning the engine's own
  // missing-current-exercise message.
  it('switching entry modes clears a previously-picked current exercise, not just the region/target', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'chest');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'chest-side-projection'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'complement-current'
    );
    await user.selectOptions(screen.getByLabelText(/current exercise/i), 'incline-dumbbell-press');

    await user.click(screen.getByRole('radio', { name: /^function$/i }));
    expect(screen.getByLabelText(/current exercise/i)).toHaveValue('');

    await user.selectOptions(screen.getByLabelText(/body area/i), 'core');
    await user.selectOptions(
      screen.getByLabelText(/what do you want to improve functionally/i),
      'core-anti-extension'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // The engine's own "needs you to specify the exercise" message, not a
    // recommendation reasoned from the stale Incline Dumbbell Press pick.
    expect(await screen.findByText(/needs you to specify the exercise/i)).toBeInTheDocument();
  });

  // 4I: full-body taxonomy expansion. "Glutes" is a genuinely new region
  // label in the Appearance selector (the underlying exercise data calls
  // it "hips" — this proves the outcome's target.parent_region correctly
  // drives the engine's bodyRegion, independent of the outcome's own
  // presentation-label region).
  it('a newly expanded region (Glutes) resolves through the Appearance UI to the real underlying hips body region', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'glutes');
    await user.selectOptions(
      screen.getByLabelText(/how do you want it to look/i),
      'glute-roundness'
    );
    await user.selectOptions(
      screen.getByLabelText(/what are you trying to accomplish/i),
      'build-base'
    );
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Gluteus Maximus');
    // The current-exercise dropdown, and the recommendation itself, must
    // be drawn from the real "hips" region the target resolves to, not a
    // nonexistent "glutes" body region.
    expect(screen.getByRole('option', { name: 'Hip Thrust' })).toBeInTheDocument();
  });

  it('Appearance is selected by default — the first physique-oriented entry is aesthetic, not anatomical', async () => {
    renderPage();

    expect(screen.getByRole('radio', { name: /^appearance$/i })).toBeChecked();
    expect(screen.getByLabelText(/body area/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/region or physique target/i)).not.toBeInTheDocument();
  });

  // 4B-10 (Phase 4B §23): "Why this exercise?" makes primary/supporting
  // target provenance auditable in the UI, not just available on the
  // engine result object.
  describe('4B-10: reasoning and programming-profile visibility', () => {
    it('shows a direct-match checkmark against the primary target when bestFit is a primary-target pick', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.selectOptions(screen.getByLabelText(/body area/i), 'arms');
      await user.selectOptions(screen.getByLabelText(/how do you want it to look/i), 'arm-side-thickness');
      await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
      await user.click(screen.getByRole('button', { name: /get recommendation/i }));

      await screen.findByRole('heading', { name: /why this exercise/i });
      const whyBlock = document.querySelector('.decision-result-why');
      expect(whyBlock?.textContent).toMatch(/Primary target:\s*Brachialis \/ Arm Thickness/);
      expect(whyBlock?.textContent).toMatch(/✓ Direct match/);
      // Cable Hammer Curl (Rope) is the primary-target winner (Phase 4B
      // §3-4 regression) — no supporting-target line should be shown when
      // bestFitTargetMatch is 'primary', since Triceps didn't win this pick.
      expect(whyBlock?.textContent).not.toMatch(/Supporting target/);
    });

    it('shows a supporting-target secondary-contribution line when bestFit is a supporting-target pick', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.selectOptions(screen.getByLabelText(/body area/i), 'arms');
      await user.selectOptions(screen.getByLabelText(/how do you want it to look/i), 'arm-side-thickness');
      await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
      // Restrict equipment to only what Dip (Triceps-Biased) needs, so
      // every brachialis (primary-target) exercise is filtered out and the
      // supporting-target triceps exercise must win instead (mirrors the
      // engine-level regression test in decisionEngine.test.ts).
      await user.click(screen.getByLabelText(/limit by equipment/i));
      await user.selectOptions(screen.getByLabelText(/equipment available/i), ['dip bars', 'bodyweight']);
      await user.click(screen.getByRole('button', { name: /get recommendation/i }));

      await screen.findByRole('heading', { name: /why this exercise/i });
      const whyBlock = document.querySelector('.decision-result-why');
      expect(whyBlock?.textContent).toMatch(/Primary target:\s*Brachialis \/ Arm Thickness/);
      expect(whyBlock?.textContent).toMatch(/not directly tagged to this pick yet/);
      expect(whyBlock?.textContent).toMatch(/Supporting target:\s*Triceps/);
      expect(whyBlock?.textContent).toMatch(/✓ Secondary contribution/);
    });

    it('the Programming block surfaces the resolved Programming Profile name and a target-aware "for this target" note', async () => {
      const user = userEvent.setup();
      renderPage();

      await user.selectOptions(screen.getByLabelText(/body area/i), 'arms');
      await user.selectOptions(screen.getByLabelText(/how do you want it to look/i), 'arm-side-thickness');
      await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
      await user.click(screen.getByRole('button', { name: /get recommendation/i }));

      await screen.findByRole('heading', { name: /programming/i });
      const programmingBlocks = Array.from(document.querySelectorAll('.decision-result-block'));
      const programmingBlock = programmingBlocks.find((block) =>
        block.querySelector('h2')?.textContent?.match(/programming/i)
      );
      expect(programmingBlock?.textContent).toMatch(/Baseline/);
      // Cable Hammer Curl (Rope) classifies as moderate-hypertrophy-isolation.
      expect(programmingBlock?.textContent).toMatch(/Moderate hypertrophy isolation/);
      expect(programmingBlock?.textContent).toMatch(/For this target/);
      expect(programmingBlock?.textContent).toMatch(/primary target driving this recommendation/i);
    });

    it('the Intensity technique block always renders, explaining a real pick or explaining why none applies', async () => {
      const user = userEvent.setup();
      renderPage();

      await useAdvancedMode(user);
      await user.selectOptions(screen.getByLabelText(/region or physique target/i), 'region:back');
      await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
      await user.click(screen.getByRole('button', { name: /get recommendation/i }));

      await screen.findByRole('heading', { name: /intensity technique/i });
      const intensityBlock = Array.from(document.querySelectorAll('.decision-result-block')).find((block) =>
        block.querySelector('h2')?.textContent?.match(/intensity technique/i)
      );
      // Either a real technique name plus a non-generic contextual
      // explanation, or an explicit "no technique" explanation — never a
      // silently absent block (Phase 4B §20).
      expect(intensityBlock?.textContent?.length).toBeGreaterThan('Intensity technique'.length);
    });
  });

  // Phase 4C §6 permanent negative test, run through the real UI. Before
  // Phase 4C, "Lower calf near the ankle looks thin" recommended Leg-Press
  // Calf Raise (self-described in its own summary as being "for
  // accumulating extra volume rather than being a primary growth driver")
  // over Seated Calf Raise (self-described as "a soleus-specific
  // stimulus") on pure alphabetical accident.
  it('Phase 4C golden slice: "Lower calf near the ankle looks thin" recommends the soleus-specific Seated Calf Raise, not the generic Leg-Press Calf Raise', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'calves');
    await user.selectOptions(screen.getByLabelText(/how do you want it to look/i), 'calf-lower-fullness');
    await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Soleus');

    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink?.textContent).toBe('Seated Calf Raise');

    const whyBlock = document.querySelector('.decision-result-why');
    expect(whyBlock?.textContent).toMatch(/✓ Direct match/);
  });

  // Phase 4C Final Correction §12 permanent negative test, run through the
  // real UI. Before this correction, "Calves look thin / no shape"
  // recommended Leg Press Calf Raise (a stable-compound coverage tag) over
  // Standing Calf Raise, even though the outcome's own knowledge base
  // already establishes Standing Calf Raise as the primary width/shape
  // tool — an explicit Aesthetic Exercise Role the generic stimulus
  // ranking couldn't see.
  it('Phase 4C Final Correction golden slice: "Calves look thin / no shape" recommends Standing Calf Raise, not the generic Leg Press Calf Raise', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText(/body area/i), 'calves');
    await user.selectOptions(screen.getByLabelText(/how do you want it to look/i), 'calf-width-shape');
    await user.selectOptions(screen.getByLabelText(/what are you trying to accomplish/i), 'build-base');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    await screen.findByRole('heading', { name: /what you're trying to change/i });
    const targetBlock = document.querySelector('.decision-result-target');
    expect(targetBlock?.querySelector('.decision-result-name')?.textContent).toBe('Gastrocnemius');

    const bestFitLink = screen.getAllByRole('link').find((link) => link.className.includes('decision-result-name'));
    expect(bestFitLink?.textContent).toBe('Standing Calf Raise');
  });
});
