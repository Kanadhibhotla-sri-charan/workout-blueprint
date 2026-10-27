import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPaletteItems, searchPalette, type PaletteItem, type PaletteKind } from '../utils/commandPalette';

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const items = useMemo(buildPaletteItems, []);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const results = useMemo(() => searchPalette(items, query), [items, query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [active, results]);

  function go(item: PaletteItem | undefined) {
    if (!item) return;
    onClose();
    navigate(item.to);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(results[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }

  let lastKind: PaletteKind | null = null;
  return (
    <div className="command-palette-backdrop" onMouseDown={onClose}>
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search Blueprint"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-palette-input-row">
          <span className="command-palette-prompt" aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            className="command-palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={results[active] ? `cp-${results[active].id}` : undefined}
            placeholder="Search exercises, goals, muscles…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="command-palette-esc">Esc</kbd>
        </div>
        <ul id="command-palette-list" className="command-palette-list" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="command-palette-empty">No match. Try a muscle, a goal or an exercise name.</li>}
          {results.map((item, index) => {
            const heading = item.kind !== lastKind ? item.kind : null;
            lastKind = item.kind;
            return (
              <li key={item.id} role="presentation">
                {heading && <p className="command-palette-group">{heading}</p>}
                <div
                  id={`cp-${item.id}`}
                  role="option"
                  aria-selected={index === active}
                  className={index === active ? 'command-palette-item command-palette-item-active' : 'command-palette-item'}
                  onMouseMove={() => setActive(index)}
                  onClick={() => go(item)}
                >
                  <span className="command-palette-label">{item.label}</span>
                  <span className="command-palette-hint">{item.hint}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="command-palette-footer">
          <kbd>↑</kbd>
          <kbd>↓</kbd> move <kbd>Enter</kbd> open <kbd>Esc</kbd> close
        </p>
      </div>
    </div>
  );
}
