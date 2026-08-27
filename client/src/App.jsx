import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OwnerAuthProvider } from './features/owner-auth/OwnerAuthContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import ProtectedRoute from './components/owner/ProtectedRoute.jsx';
import LoadingSkeleton from './components/common/LoadingSkeleton.jsx';
import HomePage from './pages/HomePage.jsx';
import CandidateApplicationPage from './pages/CandidateApplicationPage.jsx';

// The owner dashboard is roughly a third of the app's code and is used by one
// person, while every candidate arriving from a paid ad was downloading it to
// fill in a form. Splitting it out keeps the public bundle to what a candidate
// actually needs — worth it on Indian mobile data, where the payload is the
// slowest part of the first load.
const OwnerLoginPage = lazy(() => import('./pages/OwnerLoginPage.jsx'));
const CandidateRecordsPage = lazy(() => import('./pages/CandidateRecordsPage.jsx'));
const CandidateDetailsPage = lazy(() => import('./pages/CandidateDetailsPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));

export default function App() {
  return (
    <LanguageProvider>
      <OwnerAuthProvider>
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            {/*
              TEMPORARY: the landing page is bypassed so ad traffic lands
              straight on the application form. HomePage is still imported and
              built — to bring it back, restore:
                <Route path="/" element={<HomePage />} />
            */}
            <Route path="/" element={<Navigate to="/apply/security-guard" replace />} />
            <Route path="/apply/:jobSlug" element={<CandidateApplicationPage />} />
            {/* Standalone — its own header/footer, no candidate-form or landing-page chrome. */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

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
        </Suspense>
      </OwnerAuthProvider>
    </LanguageProvider>
  );
}
