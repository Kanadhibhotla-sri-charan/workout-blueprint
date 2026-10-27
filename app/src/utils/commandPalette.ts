import { useEffect } from 'react';
import { aestheticOutcomes, exercises, functionalGoals } from '../data';
import { getMuscleGroups } from '../engine/packageEngine';
import { humanize } from './format';

// Command palette: one search box, reachable from anywhere (Ctrl/⌘+K or
// "/"), that jumps straight to an exercise, a Decide goal or a Build
// muscle group. Pure navigation over existing routes and URL formats —
// it never computes a recommendation itself.

export type PaletteKind = 'Page' | 'Fix a look' | 'Function' | 'Build' | 'Exercise';

export interface PaletteItem {
  id: string;
  kind: PaletteKind;
  label: string;
  hint: string;
  to: string;
  /** Extra words that should match (e.g. how people describe a problem). */
  keywords: string;
}

const KIND_ORDER: PaletteKind[] = ['Page', 'Fix a look', 'Function', 'Build', 'Exercise'];
const MAX_RESULTS = 40;

export function buildPaletteItems(): PaletteItem[] {
  const pages: PaletteItem[] = [
    { id: 'page-home', kind: 'Page', label: 'Home', hint: 'Start page', to: '/', keywords: 'start' },
    { id: 'page-explore', kind: 'Page', label: 'Explore', hint: 'All exercises', to: '/exercises', keywords: 'library list browse' },
    { id: 'page-decide', kind: 'Page', label: 'Decide', hint: 'Fix a problem', to: '/decide', keywords: 'recommend problem' },
    { id: 'page-build', kind: 'Page', label: 'Build', hint: 'Muscle packages', to: '/build', keywords: 'package program' },
  ];
  const outcomes: PaletteItem[] = aestheticOutcomes.map((o) => ({
    id: `outcome-${o.id}`,
    kind: 'Fix a look',
    label: o.display_name,
    hint: humanize(o.region),
    to: `/decide?outcome=${encodeURIComponent(o.id)}&goal=build-base`,
    keywords: [o.region, ...(o.common_user_phrasings ?? [])].join(' '),
  }));
  const goals: PaletteItem[] = functionalGoals.map((g) => ({
    id: `function-${g.id}`,
    kind: 'Function',
    label: g.name,
    hint: humanize(g.parent_region),
    to: `/decide?function=${encodeURIComponent(g.id)}&goal=build-base`,
    keywords: `${g.parent_region} ${g.definition}`,
  }));
  const groups: PaletteItem[] = getMuscleGroups().map((g) => ({
    id: `build-${g.id}`,
    kind: 'Build',
    label: g.name,
    hint: 'All-round package',
    to: `/build/${g.id}`,
    keywords: 'package build',
  }));
  const exerciseItems: PaletteItem[] = exercises.map((e) => ({
    id: `exercise-${e.id}`,
    kind: 'Exercise',
    label: e.name,
    hint: e.body_regions.map(humanize).join(' · '),
    to: `/exercises/${e.id}`,
    keywords: [...e.body_regions, ...e.equipment, ...e.primary_targets].join(' '),
  }));
  return [...pages, ...outcomes, ...goals, ...groups, ...exerciseItems];
}

/** Every query word must appear; label matches rank above keyword-only matches. */
export function searchPalette(items: PaletteItem[], query: string): PaletteItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return items.filter((i) => i.kind !== 'Exercise' && i.kind !== 'Function').slice(0, MAX_RESULTS);
  const scored: { item: PaletteItem; score: number }[] = [];
  for (const item of items) {
    const label = item.label.toLowerCase();
    const haystack = `${label} ${item.keywords.toLowerCase()} ${item.kind.toLowerCase()}`;
    if (!words.every((w) => haystack.includes(w))) continue;
    let score = 0;
    if (label.startsWith(words[0])) score += 3;
    score += words.filter((w) => label.includes(w)).length;
    scored.push({ item, score });
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      KIND_ORDER.indexOf(a.item.kind) - KIND_ORDER.indexOf(b.item.kind) ||
      a.item.label.localeCompare(b.item.label)
  );
  return scored.slice(0, MAX_RESULTS).map((s) => s.item);
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export function useCommandPaletteShortcut(open: () => void) {
  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        open();
      } else if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
}

