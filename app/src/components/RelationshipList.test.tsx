// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RelationshipList } from './RelationshipList';

afterEach(cleanup);

function renderList(entries: string[] | null) {
  return render(
    <MemoryRouter>
      <RelationshipList title="Overlaps with" description="test" entries={entries} />
    </MemoryRouter>
  );
}

// Per PHASE-3-MVP.md §23/§25: missing optional metadata hides gracefully;
// resolvable entries become real links; prose stays plain text rather than
// a broken link (§10.4's "the UI must preserve these distinctions").
describe('RelationshipList', () => {
  it('renders nothing for a null field', () => {
    const { container } = renderList(null);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an empty array', () => {
    const { container } = renderList([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('resolves a bare-id entry to a real link', () => {
    const { getByRole } = renderList(['cable-fly']);
    const link = getByRole('link', { name: 'Cable Fly' });
    expect(link).toHaveAttribute('href', '/exercises/cable-fly');
  });

  it('renders an unresolvable prose entry as plain text, not a broken link', () => {
    const { getByText, queryByRole } = renderList(['A bent-knee raise, which covers the soleus.']);
    expect(getByText('A bent-knee raise, which covers the soleus.')).toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });
});
