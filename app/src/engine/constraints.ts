import { DEMAND_LEVELS } from '../utils/filters';

// "At most" comparison for the three-level demand fields (setup_time,
// fatigue_cost, stability_demand, skill_demand), used for a user-stated
// tolerance ("I can handle up to medium fatigue"). Deterministic index
// comparison over the fixed low/medium/high enum from
// scripts/lib/taxonomy.js — not an interpretation of what "medium" means,
// just where it sits in the fixed order.
export function meetsMaxDemand(actual: string, maxAllowed: string | null): boolean {
  if (maxAllowed === null) return true;
  const actualIndex = DEMAND_LEVELS.indexOf(actual as (typeof DEMAND_LEVELS)[number]);
  const maxIndex = DEMAND_LEVELS.indexOf(maxAllowed as (typeof DEMAND_LEVELS)[number]);
  return actualIndex <= maxIndex;
}
