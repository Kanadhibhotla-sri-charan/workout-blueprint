import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExerciseListPage } from './pages/ExerciseListPage';
import { ExerciseDetailPage } from './pages/ExerciseDetailPage';
import { DecisionMakerPage } from './pages/DecisionMakerPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="exercises" element={<ExerciseListPage />} />
        <Route path="exercises/:id" element={<ExerciseDetailPage />} />
        <Route path="decide" element={<DecisionMakerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
