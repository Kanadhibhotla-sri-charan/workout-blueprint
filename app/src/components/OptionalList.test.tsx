// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { OptionalList } from './OptionalList';

afterEach(cleanup);

// Per PHASE-3-MVP.md §23/§25: missing optional metadata must hide its
// section gracefully rather than break the layout or show an empty
// heading. Tested directly against the shared component, synthetically,
// since the live dataset may not currently have a record hitting every
// null/empty combination at once.
describe('OptionalList', () => {
  it('renders nothing for a null field', () => {
    const { container } = render(<OptionalList title="Technique cues" items={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an empty array', () => {
    const { container } = render(<OptionalList title="Technique cues" items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the heading and items when populated', () => {
    const { getByText } = render(<OptionalList title="Technique cues" items={['Keep elbows tucked.']} />);
    expect(getByText('Technique cues')).toBeInTheDocument();
    expect(getByText('Keep elbows tucked.')).toBeInTheDocument();
  });
});
