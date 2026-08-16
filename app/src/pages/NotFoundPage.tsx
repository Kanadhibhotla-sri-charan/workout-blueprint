import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div>
      <h1>Not found</h1>
      <p>That page or exercise doesn't exist.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
