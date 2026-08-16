import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { bodyRegions, equipmentOptions, exercises, physiqueTargets } from '../data';
import { makeRecommendation } from '../engine/decisionEngine';
import { GOAL_LABELS, GOALS, GOALS_REQUIRING_CURRENT_EXERCISE } from '../engine/types';
import type { DecisionInput, DecisionResult, DemandLevel, Goal } from '../engine/types';
import { DEMAND_LEVELS } from '../utils/filters';
import { humanize } from '../utils/format';

type DemandChoice = DemandLevel | '';

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

  const goalNeedsCurrentExercise = goal !== '' && GOALS_REQUIRING_CURRENT_EXERCISE.includes(goal);
  const currentExerciseOptions = bodyRegion
    ? exercises.filter((exercise) => exercise.body_regions.includes(bodyRegion))
    : exercises;

  // "region:<name>" for a broad body-region pick, "target:<id>" for a
  // specific physique target — combined into one select, grouped by
  // region, per PHASE-4 §6's "browse a region, then optionally drill into
  // a specific target" flow. Generalizes automatically as more targets
  // are added to the taxonomy without needing UI rework.
  const targetSelectValue = physiqueTarget ? `target:${physiqueTarget}` : bodyRegion ? `region:${bodyRegion}` : '';

  function handleTargetSelectChange(value: string) {
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!bodyRegion || !goal) return;

    const input: DecisionInput = {
      bodyRegion,
      physiqueTarget: physiqueTarget || null,
      goal,
      equipmentAvailable: restrictEquipment ? equipmentAvailable : null,
      maxSetupTime: toDemandLevel(maxSetupTime),
      maxFatigueCost: toDemandLevel(maxFatigueCost),
      maxStabilityDemand: toDemandLevel(maxStabilityDemand),
      maxSkillDemand: toDemandLevel(maxSkillDemand),
      currentExerciseId: currentExerciseId || null,
    };
    setResult(makeRecommendation(input, exercises));
  }

  return (
    <div className="decision-maker-page">
      <h1>Make a Decision</h1>
      <p className="home-tagline">
        Answer a few practical questions and get one explainable recommendation — not a ranked
        list of ten.
      </p>

      <form onSubmit={handleSubmit} className="decision-form">
        <div className="filter-field">
          <label htmlFor="dm-target">1. What do you want to improve?</label>
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

        <div className="filter-field">
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

        <fieldset className="decision-constraints">
          <legend>3. What constraints matter?</legend>

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

        <div className="filter-field">
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

      {result && <DecisionResultView result={result} />}
    </div>
  );
}

function DecisionResultView({ result }: { result: DecisionResult }) {
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
      {result.target && (
        <div className="decision-result-block">
          <h2>
            <span aria-hidden="true">🎯</span> Target
          </h2>
          <p className="decision-result-name">{result.target.name}</p>
          <p>{result.target.definition}</p>
        </div>
      )}

      {result.visualObjective && (
        <div className="decision-result-block">
          <h2>
            <span aria-hidden="true">👀</span> Visual objective
          </h2>
          <p>{result.visualObjective}</p>
        </div>
      )}

      <div className="decision-result-block decision-result-best">
        <h2>
          <span aria-hidden="true">🥇</span> Best fit
        </h2>
        <Link to={`/exercises/${result.bestFit.id}`} className="decision-result-name">
          {result.bestFit.name}
        </Link>
        <p>{result.why}</p>
      </div>

      <div className="decision-result-block">
        <h2>
          <span aria-hidden="true">🧬</span> Stimulus
        </h2>
        <p>{result.stimulus}</p>
      </div>

      <div className="decision-result-block">
        <h2>
          <span aria-hidden="true">📊</span> Programming
        </h2>
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
      </div>

      {programming.intensityTechnique && (
        <div className="decision-result-block">
          <h2>
            <span aria-hidden="true">⚡</span> Optional: {programming.intensityTechnique.name}
          </h2>
          <p>{programming.intensityTechnique.when_it_may_help}</p>
          <p className="field-hint">{programming.intensityTechnique.when_not_to_use}</p>
        </div>
      )}

      {result.alternative && (
        <div className="decision-result-block">
          <h2>
            <span aria-hidden="true">🥈</span> Alternative
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
            <span aria-hidden="true">⚠️</span> Watch out
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
            <span aria-hidden="true">🔄</span> Complements
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
    </div>
  );
}
