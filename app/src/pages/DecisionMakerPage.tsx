import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  aestheticOutcomes,
  bodyRegions,
  equipmentOptions,
  exercises,
  functionalGoals,
  getAestheticOutcomeById,
  getAestheticOutcomesByRegion,
  getFunctionalGoalById,
  getFunctionalGoalsByRegion,
  physiqueTargets,
} from '../data';
import { makeRecommendation } from '../engine/decisionEngine';
import { GOAL_LABELS, GOALS, GOALS_REQUIRING_CURRENT_EXERCISE } from '../engine/types';
import type { DecisionInput, DecisionResult, DemandLevel, Goal } from '../engine/types';
import type { AestheticOutcome } from '../types/programming';
import { DEMAND_LEVELS } from '../utils/filters';
import { humanize } from '../utils/format';
import { VideoReference } from '../components/VideoReference';

type DemandChoice = DemandLevel | '';
// Appearance is the primary physique-goal entry point (Phase 4 Corrections
// §2-5): a user should reach a recommendation without knowing a muscle's
// anatomical name, and the first physique-oriented problem presented
// should be an aesthetic one. Direct/advanced target selection is
// preserved for experienced users, reframed as a secondary path rather
// than the default. Function is a separate, clearly-labeled entry point
// (§5's "Appearance and Function remain clearly separated") feeding the
// same downstream engine through its own functionalGoal input (4J) —
// never mixed into the aesthetic outcome selector.
type EntryMode = 'appearance' | 'function' | 'advanced';

function toDemandLevel(value: DemandChoice): DemandLevel | null {
  return value === '' ? null : value;
}

function formatRange([low, high]: [number, number]): string {
  return low === high ? `${low}` : `${low}–${high}`;
}

export function DecisionMakerPage() {
  const [bodyRegion, setBodyRegion] = useState('');
  const [physiqueTarget, setPhysiqueTarget] = useState('');
  const [goal, setGoal] = useState<Goal | ''>('');
  const [restrictEquipment, setRestrictEquipment] = useState(false);
  const [equipmentAvailable, setEquipmentAvailable] = useState<string[]>([]);
  const [maxSetupTime, setMaxSetupTime] = useState<DemandChoice>('');
  const [maxFatigueCost, setMaxFatigueCost] = useState<DemandChoice>('');
  const [maxStabilityDemand, setMaxStabilityDemand] = useState<DemandChoice>('');
  const [maxSkillDemand, setMaxSkillDemand] = useState<DemandChoice>('');
  const [currentExerciseId, setCurrentExerciseId] = useState('');
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [entryMode, setEntryMode] = useState<EntryMode>('appearance');
  // "region -> aesthetic outcome" resolves into the same bodyRegion/
  // physiqueTarget state the direct/advanced picker also writes into, plus
  // supportingPhysiqueTargets for the outcome's supporting targets (Phase 4
  // Corrections §7-8) — contributing targets that broaden the candidate
  // pool rather than being silently discarded, without driving the main
  // recommendation the way the primary target does.
  const [appearanceRegion, setAppearanceRegion] = useState('');
  const [aestheticOutcomeId, setAestheticOutcomeId] = useState('');
  const [supportingPhysiqueTargets, setSupportingPhysiqueTargets] = useState<string[]>([]);
  const [resultAestheticOutcome, setResultAestheticOutcome] = useState<AestheticOutcome | null>(null);
  // Function branch (4J): "region -> functional goal" mirrors the
  // Appearance selector's structure, but resolves into its own
  // functionalGoal state rather than physiqueTarget — kept fully separate
  // so a functional recommendation is never displayed as an aesthetic one.
  const [functionalRegion, setFunctionalRegion] = useState('');
  const [functionalGoalId, setFunctionalGoalId] = useState('');

  const goalNeedsCurrentExercise = goal !== '' && GOALS_REQUIRING_CURRENT_EXERCISE.includes(goal);
  const currentExerciseOptions = bodyRegion
    ? exercises.filter((exercise) => exercise.body_regions.includes(bodyRegion))
    : exercises;

  const aestheticRegions = [...new Set(aestheticOutcomes.map((o) => o.region))].sort();
  const outcomesInAppearanceRegion = appearanceRegion ? getAestheticOutcomesByRegion(appearanceRegion) : [];

  const functionalRegions = [...new Set(functionalGoals.map((g) => g.parent_region))].sort();
  const goalsInFunctionalRegion = functionalRegion ? getFunctionalGoalsByRegion(functionalRegion) : [];

  // "region:<name>" for a broad body-region pick, "target:<id>" for a
  // specific physique target — combined into one select, grouped by
  // region, per PHASE-4 §6's "browse a region, then optionally drill into
  // a specific target" flow. Generalizes automatically as more targets
  // are added to the taxonomy without needing UI rework.
  const targetSelectValue = physiqueTarget ? `target:${physiqueTarget}` : bodyRegion ? `region:${bodyRegion}` : '';

  // Switching the top-level entry mode resets every mode's resolved state,
  // not just the one being left — piecemeal clearing inside each select's
  // own handler only fires once a new value is picked there, which left a
  // gap: switching modes and changing the *other* mode's region select
  // without yet picking a new outcome/goal could otherwise submit a stale
  // bodyRegion/physiqueTarget/functionalGoal combination left over from
  // before the switch.
  function handleEntryModeChange(mode: EntryMode) {
    setEntryMode(mode);
    setBodyRegion('');
    setPhysiqueTarget('');
    setSupportingPhysiqueTargets([]);
    setAestheticOutcomeId('');
    setFunctionalGoalId('');
    // currentExerciseId's valid options are filtered by bodyRegion (see
    // currentExerciseOptions below); leaving a previously-picked exercise
    // in place after a mode switch clears bodyRegion would silently
    // resubmit an exercise from the *old* region once a new one resolves,
    // even though the dropdown visibly shows "— none —" in between.
    setCurrentExerciseId('');
  }

  function handleTargetSelectChange(value: string) {
    // A direct edit to the advanced picker overrides whatever the
    // appearance or function selector had resolved, so the result view
    // doesn't keep showing a stale block, and a hand-picked target
    // doesn't inherit another outcome's supporting targets.
    setAestheticOutcomeId('');
    setSupportingPhysiqueTargets([]);
    setFunctionalGoalId('');
    if (value.startsWith('target:')) {
      const id = value.slice('target:'.length);
      const target = physiqueTargets.find((t) => t.id === id);
      setPhysiqueTarget(id);
      if (target) setBodyRegion(target.parent_region);
    } else if (value.startsWith('region:')) {
      setPhysiqueTarget('');
      setBodyRegion(value.slice('region:'.length));
    }
  }

  function handleAppearanceRegionChange(region: string) {
    setAppearanceRegion(region);
    setAestheticOutcomeId('');
    setSupportingPhysiqueTargets([]);
  }

  function handleAestheticOutcomeChange(outcomeId: string) {
    setAestheticOutcomeId(outcomeId);
    setFunctionalGoalId('');
    const outcome = getAestheticOutcomeById(outcomeId);
    if (!outcome) return;
    // Primary/supporting split (Phase 4 Corrections §7-8): the primary
    // target drives exercise selection and the Target/Visual-objective
    // display; supporting targets broaden the candidate pool and are
    // surfaced separately, never silently dropped.
    const primaryTargetId = outcome.primary_targets[0];
    const target = physiqueTargets.find((t) => t.id === primaryTargetId);
    setPhysiqueTarget(primaryTargetId);
    setSupportingPhysiqueTargets(outcome.supporting_targets ?? []);
    if (target) setBodyRegion(target.parent_region);
  }

  function handleFunctionalRegionChange(region: string) {
    setFunctionalRegion(region);
    setFunctionalGoalId('');
  }

  function handleFunctionalGoalChange(goalId: string) {
    setFunctionalGoalId(goalId);
    // A functional pick overrides whatever the aesthetic path had
    // resolved, and vice versa (handleAestheticOutcomeChange/
    // handleTargetSelectChange clear this state) — the two never combine.
    setPhysiqueTarget('');
    setSupportingPhysiqueTargets([]);
    setAestheticOutcomeId('');
    const goalRecord = getFunctionalGoalById(goalId);
    if (!goalRecord) return;
    setBodyRegion(goalRecord.parent_region);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!bodyRegion || !goal) return;

    const input: DecisionInput = {
      bodyRegion,
      physiqueTarget: physiqueTarget || null,
      supportingPhysiqueTargets: supportingPhysiqueTargets.length > 0 ? supportingPhysiqueTargets : null,
      aestheticOutcome: aestheticOutcomeId || null,
      functionalGoal: functionalGoalId || null,
      goal,
      equipmentAvailable: restrictEquipment ? equipmentAvailable : null,
      maxSetupTime: toDemandLevel(maxSetupTime),
      maxFatigueCost: toDemandLevel(maxFatigueCost),
      maxStabilityDemand: toDemandLevel(maxStabilityDemand),
      maxSkillDemand: toDemandLevel(maxSkillDemand),
      currentExerciseId: currentExerciseId || null,
    };
    setResult(makeRecommendation(input, exercises));
    setResultAestheticOutcome(getAestheticOutcomeById(aestheticOutcomeId) ?? null);
  }

  // Purely presentational — drives the progress indicator only, never a
  // gate on which fields are rendered. Every field the test suite queries
  // via getByLabelText stays mounted regardless of step completion.
  const step1Done = Boolean(bodyRegion);
  const step2Done = Boolean(goal);
  const step3Done = step2Done;

  return (
    <div className="decision-maker-page">
      <div className="decision-maker-hero">
        <p className="eyebrow">Decide</p>
        <h1>Turn a visual problem into a training decision.</h1>
        <p className="home-tagline">
          Tell Blueprint what you see. It will explain what may be limiting it and what to focus on.
        </p>
      </div>

      <div className="decision-progress" aria-hidden="true">
        <span className="decision-progress-step">
          <span className={step1Done ? 'decision-progress-dot decision-progress-dot-done' : 'decision-progress-dot'} />
          01
        </span>
        <span className="decision-progress-line" />
        <span className="decision-progress-step">
          <span className={step2Done ? 'decision-progress-dot decision-progress-dot-done' : 'decision-progress-dot'} />
          02
        </span>
        <span className="decision-progress-line" />
        <span className="decision-progress-step">
          <span className={step3Done ? 'decision-progress-dot decision-progress-dot-done' : 'decision-progress-dot'} />
          03
        </span>
        <span className="decision-progress-line" />
        <span className="decision-progress-step">
          <span className={result ? 'decision-progress-dot decision-progress-dot-done' : 'decision-progress-dot'} />
          RESULT
        </span>
      </div>

      <form onSubmit={handleSubmit} className="decision-form">
        <fieldset className="filter-field entry-mode-field decision-step">
          <legend>1. What do you want to improve?</legend>
          <p className="decision-step-label">
            <span className="decision-step-number">STEP 01</span>
            What are you trying to improve?
          </p>
          <div className="entry-mode-choices">
            <label className="radio-field">
              <input
                type="radio"
                name="entry-mode"
                value="appearance"
                checked={entryMode === 'appearance'}
                onChange={() => handleEntryModeChange('appearance')}
              />
              Appearance
            </label>
            <label className="radio-field">
              <input
                type="radio"
                name="entry-mode"
                value="function"
                checked={entryMode === 'function'}
                onChange={() => handleEntryModeChange('function')}
              />
              Function
            </label>
            <label className="radio-field">
              <input
                type="radio"
                name="entry-mode"
                value="advanced"
                checked={entryMode === 'advanced'}
                onChange={() => handleEntryModeChange('advanced')}
              />
              Direct / Advanced
            </label>
          </div>

          {entryMode === 'appearance' && (
            <div className="entry-mode-panel">
              <label htmlFor="dm-appearance-region">Body area</label>
              <select
                id="dm-appearance-region"
                value={appearanceRegion}
                onChange={(event) => handleAppearanceRegionChange(event.target.value)}
              >
                <option value="">— none —</option>
                {aestheticRegions.map((region) => (
                  <option key={region} value={region}>
                    {humanize(region)}
                  </option>
                ))}
              </select>
              {appearanceRegion && (
                <>
                  <label htmlFor="dm-appearance-outcome">How do you want it to look?</label>
                  <select
                    id="dm-appearance-outcome"
                    value={aestheticOutcomeId}
                    onChange={(event) => handleAestheticOutcomeChange(event.target.value)}
                  >
                    <option value="" disabled>
                      Select what you're trying to change…
                    </option>
                    {outcomesInAppearanceRegion.map((outcome) => (
                      <option key={outcome.id} value={outcome.id}>
                        {outcome.display_name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}

          {entryMode === 'function' && (
            <div className="entry-mode-panel">
              <p className="field-hint">
                Functional goals — joint durability, movement quality, and stability — feed the
                same engine as Appearance, kept separate since they're not about how something
                looks.
              </p>
              <label htmlFor="dm-functional-region">Body area</label>
              <select
                id="dm-functional-region"
                value={functionalRegion}
                onChange={(event) => handleFunctionalRegionChange(event.target.value)}
              >
                <option value="">— none —</option>
                {functionalRegions.map((region) => (
                  <option key={region} value={region}>
                    {humanize(region)}
                  </option>
                ))}
              </select>
              {functionalRegion && (
                <>
                  <label htmlFor="dm-functional-goal">What do you want to improve functionally?</label>
                  <select
                    id="dm-functional-goal"
                    value={functionalGoalId}
                    onChange={(event) => handleFunctionalGoalChange(event.target.value)}
                  >
                    <option value="" disabled>
                      Select a functional goal…
                    </option>
                    {goalsInFunctionalRegion.map((goalOption) => (
                      <option key={goalOption.id} value={goalOption.id}>
                        {goalOption.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}

          {entryMode === 'advanced' && (
            <div className="entry-mode-panel">
              <label htmlFor="dm-target">Region or physique target</label>
              <select
                id="dm-target"
                value={targetSelectValue}
                onChange={(event) => handleTargetSelectChange(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select a region or a specific target…
                </option>
                {bodyRegions.map((region) => {
                  const targetsInRegion = physiqueTargets.filter((t) => t.parent_region === region);
                  return (
                    <optgroup key={region} label={humanize(region)}>
                      <option value={`region:${region}`}>All {humanize(region)}</option>
                      {targetsInRegion.map((target) => (
                        <option key={target.id} value={`target:${target.id}`}>
                          {target.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>
          )}
        </fieldset>

        <div className="filter-field decision-step">
          <label htmlFor="dm-goal">2. What are you trying to accomplish?</label>
          <select
            id="dm-goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value as Goal)}
            required
          >
            <option value="" disabled>
              Select a goal…
            </option>
            {GOALS.map((goalOption) => (
              <option key={goalOption} value={goalOption}>
                {GOAL_LABELS[goalOption]}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="decision-constraints decision-step">
          <legend>3. What constraints matter?</legend>
          <p className="decision-step-label">
            <span className="decision-step-number">STEP 03</span>
            What constraints matter?
          </p>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={restrictEquipment}
              onChange={(event) => setRestrictEquipment(event.target.checked)}
            />
            Limit by equipment I have available
          </label>
          {restrictEquipment && (
            <div className="filter-field">
              <label htmlFor="dm-equipment">Equipment available</label>
              <select
                id="dm-equipment"
                multiple
                size={6}
                value={equipmentAvailable}
                onChange={(event) =>
                  setEquipmentAvailable(
                    Array.from(event.target.selectedOptions, (option) => option.value)
                  )
                }
              >
                {equipmentOptions.map((item) => (
                  <option key={item} value={item}>
                    {humanize(item)}
                  </option>
                ))}
              </select>
              <p className="field-hint">
                Select everything you have access to. Selecting nothing means bodyweight-only.
              </p>
            </div>
          )}

          <div className="filter-field">
            <label htmlFor="dm-setup">Time / setup tolerance</label>
            <select
              id="dm-setup"
              value={maxSetupTime}
              onChange={(event) => setMaxSetupTime(event.target.value as DemandChoice)}
            >
              <option value="">No preference</option>
              {DEMAND_LEVELS.map((level) => (
                <option key={level} value={level}>
                  Up to {humanize(level)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="dm-fatigue">Fatigue tolerance</label>
            <select
              id="dm-fatigue"
              value={maxFatigueCost}
              onChange={(event) => setMaxFatigueCost(event.target.value as DemandChoice)}
            >
              <option value="">No preference</option>
              {DEMAND_LEVELS.map((level) => (
                <option key={level} value={level}>
                  Up to {humanize(level)}
                </option>
              ))}
            </select>
            <p className="field-hint">
              Capping fatigue tolerance at low also trims volume/frequency guidance toward its
              lower end and turns off optional intensity-technique suggestions.
            </p>
          </div>

          <div className="filter-field">
            <label htmlFor="dm-stability">Stability preference</label>
            <select
              id="dm-stability"
              value={maxStabilityDemand}
              onChange={(event) => setMaxStabilityDemand(event.target.value as DemandChoice)}
            >
              <option value="">No preference</option>
              {DEMAND_LEVELS.map((level) => (
                <option key={level} value={level}>
                  Up to {humanize(level)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="dm-skill">Skill preference</label>
            <select
              id="dm-skill"
              value={maxSkillDemand}
              onChange={(event) => setMaxSkillDemand(event.target.value as DemandChoice)}
            >
              <option value="">No preference</option>
              {DEMAND_LEVELS.map((level) => (
                <option key={level} value={level}>
                  Up to {humanize(level)}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="filter-field decision-step">
          <label htmlFor="dm-current">
            4. Current exercise {goalNeedsCurrentExercise ? '(required for this goal)' : '(optional)'}
          </label>
          <select
            id="dm-current"
            value={currentExerciseId}
            onChange={(event) => setCurrentExerciseId(event.target.value)}
          >
            <option value="">— none —</option>
            {currentExerciseOptions.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="button button-primary decision-submit">
          Get Recommendation
        </button>
      </form>

      {result && <DecisionResultView result={result} aestheticOutcome={resultAestheticOutcome} />}
    </div>
  );
}

function DecisionResultView({
  result,
  aestheticOutcome,
}: {
  result: DecisionResult;
  aestheticOutcome: AestheticOutcome | null;
}) {
  if (result.status === 'missing-current-exercise' || result.status === 'no-candidates') {
    return (
      <div className="decision-result decision-result-empty">
        <p>{result.reason}</p>
      </div>
    );
  }

  const { programming } = result;

  return (
    <div className="decision-result">
      {aestheticOutcome && (
        <div className="decision-result-block decision-result-outcome">
          <h2>
            What you&apos;re trying to change
          </h2>
          <p className="decision-result-name">{aestheticOutcome.display_name}</p>
          <p>{aestheticOutcome.visual_description}</p>
          {aestheticOutcome.technical_explanation && (
            <details>
              <summary>Technical explanation</summary>
              <p>{aestheticOutcome.technical_explanation}</p>
            </details>
          )}
        </div>
      )}

      {result.functionalGoal && (
        <div className="decision-result-block decision-result-functional">
          <h2>
            Functional goal
          </h2>
          <p className="decision-result-name">{result.functionalGoal.name}</p>
          <p>{result.functionalGoal.definition}</p>
          <p className="field-hint">{result.functionalGoal.why_it_matters}</p>
        </div>
      )}

      {result.target && (
        <div className="decision-result-block decision-result-target">
          <h2>
            Target
          </h2>
          <p className="decision-result-name">{result.target.name}</p>
          <p>{result.target.definition}</p>
        </div>
      )}

      {result.supportingTargets.length > 0 && (
        <div className="decision-result-block decision-result-supporting">
          <h2>
            Also contributes
          </h2>
          <ul>
            {result.supportingTargets.map((supportingTarget) => (
              <li key={supportingTarget.id}>
                <strong>{supportingTarget.name}</strong> — {supportingTarget.physique_outcome}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.visualObjective && (
        <div className="decision-result-block">
          <h2>
            Visual objective
          </h2>
          <p>{result.visualObjective}</p>
        </div>
      )}

      <div className="decision-result-block decision-result-best">
        <h2>
          Best fit
        </h2>
        <Link to={`/exercises/${result.bestFit.id}`} className="decision-result-name">
          {result.bestFit.name}
        </Link>
        <p>{result.why}</p>
        {(result.bestFit.video_status === 'verified' ||
          result.bestFit.video_status === 'needs-review' ||
          result.bestFit.video_status === 'broken') && (
          <div className="decision-result-video">
            <VideoReference videoLink={result.bestFit.video_link} videoStatus={result.bestFit.video_status} />
          </div>
        )}
      </div>

      {result.target && (
        <div className="decision-result-block decision-result-why">
          <h2>
            Why this exercise?
          </h2>
          <p>
            <strong>Primary target:</strong> {result.target.name} —{' '}
            {result.bestFitTargetMatch === 'primary'
              ? '✓ Direct match'
              : 'not directly tagged to this pick yet'}
          </p>
          {result.bestFitTargetMatch === 'supporting' &&
            (() => {
              const matchedSupportingTarget = result.supportingTargets.find((supportingTarget) =>
                result.bestFit.physique_targets?.includes(supportingTarget.id)
              );
              return matchedSupportingTarget ? (
                <p>
                  <strong>Supporting target:</strong> {matchedSupportingTarget.name} — ✓ Secondary contribution
                </p>
              ) : null;
            })()}
        </div>
      )}

      <div className="decision-result-block">
        <h2>
          Stimulus
        </h2>
        <p>{result.stimulus}</p>
      </div>

      <div className="decision-result-block">
        <h2>
          Programming
        </h2>
        <p className="field-hint">
          <strong>Baseline</strong> — {programming.profile.name}
        </p>
        <dl className="demand-grid">
          <div>
            <dt>Reps</dt>
            <dd>{formatRange(programming.repRange.primaryRange)}</dd>
          </div>
          <div>
            <dt>RIR</dt>
            <dd>{formatRange(programming.rirTypicalRange)}</dd>
          </div>
          <div>
            <dt>Weekly sets</dt>
            <dd>{formatRange(programming.weeklyVolumeSets)}</dd>
          </div>
          <div>
            <dt>Frequency</dt>
            <dd>{formatRange(programming.frequencyPerWeek)}/week</dd>
          </div>
        </dl>
        <p className="field-hint">{programming.repRange.reason}</p>
        <p className="field-hint">{programming.rirGuidance}</p>
        <p className="field-hint">{programming.progressionExplanation}</p>
        <p>{programming.profile.guidance_note}</p>
        {result.targetProgrammingContext && (
          <p className="field-hint">
            <strong>For this target</strong> — {result.targetProgrammingContext}
          </p>
        )}
      </div>

      <div className="decision-result-block">
        <h2>
          Intensity technique
        </h2>
        {programming.intensityTechnique ? (
          <>
            <p className="decision-result-name">{programming.intensityTechnique.name}</p>
            <p>{programming.intensityTechniqueContext}</p>
            <p className="field-hint">{programming.intensityTechnique.when_not_to_use}</p>
          </>
        ) : (
          <p className="field-hint">{programming.intensityTechniqueContext}</p>
        )}
      </div>

      {result.alternative && (
        <div className="decision-result-block">
          <h2>
            Alternative
          </h2>
          <Link to={`/exercises/${result.alternative.id}`} className="decision-result-name">
            {result.alternative.name}
          </Link>
          <p>{result.alternativeWhy}</p>
        </div>
      )}

      {result.watchOut.length > 0 && (
        <div className="decision-result-block">
          <h2>
            Watch out
          </h2>
          <ul>
            {result.watchOut.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {result.complements.length > 0 && (
        <div className="decision-result-block">
          <h2>
            Complements
          </h2>
          <ul className="relationship-list">
            {result.complements.map((exercise) => (
              <li key={exercise.id}>
                <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phase 4C §18: a development/debug ranking trace, collapsed by
          default — not the primary user-facing explanation, but available
          for adversarial testing of ranking behavior without re-deriving
          it by hand. */}
      <details className="decision-result-trace">
        <summary>Debug: ranking trace</summary>
        <dl className="demand-grid">
          <div>
            <dt>Target match</dt>
            <dd>{result.bestFitTrace.targetMatch}</dd>
          </div>
          <div>
            <dt>Aesthetic role</dt>
            <dd>{result.bestFitTrace.aestheticRole}</dd>
          </div>
          <div>
            <dt>Aesthetic suitability</dt>
            <dd>{result.bestFitTrace.aestheticSuitability}</dd>
          </div>
          <div>
            <dt>Programming profile</dt>
            <dd>{result.bestFitTrace.programmingProfile}</dd>
          </div>
          <div>
            <dt>Fatigue cost</dt>
            <dd>{result.bestFitTrace.fatigueCost}</dd>
          </div>
        </dl>
        <p className="field-hint">Final reason: {result.bestFitTrace.finalReason}</p>
      </details>
    </div>
  );
}
