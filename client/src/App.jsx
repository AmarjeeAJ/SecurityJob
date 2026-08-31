import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OwnerAuthProvider } from './features/owner-auth/OwnerAuthContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import ProtectedRoute from './components/owner/ProtectedRoute.jsx';
import LoadingSkeleton from './components/common/LoadingSkeleton.jsx';

// Core Public Pages (100% Employee / Candidate Focused)
import HomePage from './pages/HomePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailsPage from './pages/JobDetailsPage.jsx';
import CandidateApplicationPage from './pages/CandidateApplicationPage.jsx';

// Lazy-Loaded Information & Guide Pages
const CandidatesPage = lazy(() => import('./pages/CandidatesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const HelpPage = lazy(() => import('./pages/HelpPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage.jsx'));
const CandidateConsentPolicyPage = lazy(() => import('./pages/CandidateConsentPolicyPage.jsx'));

// Owner Portal (Code-Split for performance)
const OwnerLoginPage = lazy(() => import('./pages/OwnerLoginPage.jsx'));
const CandidateRecordsPage = lazy(() => import('./pages/CandidateRecordsPage.jsx'));
const CandidateDetailsPage = lazy(() => import('./pages/CandidateDetailsPage.jsx'));

export default function App() {
  return (
    <LanguageProvider>
      <OwnerAuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] p-6"><LoadingSkeleton rows={10} /></div>}>
          <Routes>
            {/* 1. Landing Page (Pure Employee / Job Seeker focus) */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Find Security Jobs & Discovery */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobSlug" element={<JobDetailsPage />} />

            {/* 3. Candidate Application Form */}
            <Route path="/apply/:jobSlug" element={<CandidateApplicationPage />} />

            {/* 4. Candidate Career Guide & Resources */}
            <Route path="/career-guide" element={<CandidatesPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* 5. Legal & Compliance Policies */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/candidate-consent-policy" element={<CandidateConsentPolicyPage />} />

            {/* 6. Owner Administration */}
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

            {/* 7. Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </OwnerAuthProvider>
    </LanguageProvider>
  );
}
