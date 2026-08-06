import { Routes, Route, Navigate } from 'react-router-dom';
import { OwnerAuthProvider } from './features/owner-auth/OwnerAuthContext.jsx';
import ProtectedRoute from './components/owner/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CandidateApplicationPage from './pages/CandidateApplicationPage.jsx';
import OwnerLoginPage from './pages/OwnerLoginPage.jsx';
import CandidateRecordsPage from './pages/CandidateRecordsPage.jsx';
import CandidateDetailsPage from './pages/CandidateDetailsPage.jsx';

export default function App() {
  return (
    <OwnerAuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply/:jobSlug" element={<CandidateApplicationPage />} />

        <Route path="/owner/login" element={<OwnerLoginPage />} />
        <Route
          path="/owner/candidates"
          element={
            <ProtectedRoute>
              <CandidateRecordsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/candidates/:id"
          element={
            <ProtectedRoute>
              <CandidateDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OwnerAuthProvider>
  );
}
