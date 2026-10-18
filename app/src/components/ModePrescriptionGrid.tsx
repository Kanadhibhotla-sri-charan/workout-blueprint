import type { ModePrescription } from '../engine/programmingEngine';
import { formatRange } from '../utils/format';

// Athletic-mode prescription (athletic expansion): shown in place of the
// hypertrophy reps / RIR / weekly-sets grid for exercises with a
// training_mode. Pure presentation of the resolved profile's own numbers.
function amountLabel(p: ModePrescription): string {
  const side = p.perSide ? ' per side' : '';
  if (p.unit === 'seconds') return p.mode === 'conditioning' ? `Work (seconds${side})` : `Hold (seconds${side})`;
  return `Reps${side}`;
}

export function ModePrescriptionGrid({ prescription }: { prescription: ModePrescription }) {
  return (
    <>
      <dl className="demand-grid mode-prescription-grid">
        <div>
          <dt>{amountLabel(prescription)}</dt>
          <dd>{formatRange(prescription.amount)}</dd>
        </div>
        <div>
          <dt>{prescription.mode === 'conditioning' ? 'Rounds' : 'Sets'}</dt>
          <dd>{formatRange(prescription.sets)}</dd>
        </div>
        <div>
          <dt>Rest (seconds)</dt>
          <dd>{formatRange(prescription.restSeconds)}</dd>
        </div>
        <div>
          <dt>Frequency</dt>
          <dd>{formatRange(prescription.frequencyPerWeek)}/week</dd>
        </div>
      </dl>
      {prescription.effort && <p className="field-hint"><strong>Effort</strong> — {prescription.effort}</p>}
    </>
  );
}
