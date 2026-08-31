import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import { fetchPageConfig } from '../api/candidates.js';
import { initTracking } from '../services/tracking.service.js';
import { captureTrackingData } from '../utils/tracking.js';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import Card from '../components/common/Card.jsx';
import CandidateApplicationForm from '../features/candidate-registration/CandidateApplicationForm.jsx';
import SEO from '../components/common/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import LanguageToggle from '../components/common/LanguageToggle.jsx';

const DEFAULT_JOB_SLUG = 'security-guard';

export default function CandidateApplicationPage() {
  const { language } = useLanguage();
  const { jobSlug = DEFAULT_JOB_SLUG } = useParams();
  const [pageConfig, setPageConfig] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const trackingData = useMemo(() => captureTrackingData(jobSlug), [jobSlug]);

  useEffect(() => {
    initTracking();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPageConfig(null);
    setLoadError(false);

    fetchPageConfig(jobSlug)
      .then((data) => {
        if (!cancelled) setPageConfig(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [jobSlug]);

  const roleLabel = pageConfig?.heading || 'Security Job Application';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SEO
        title={`Apply for ${roleLabel} | SecurityJob.in`}
        description="Free candidate registration for security guard, supervisor, and control-room jobs across India. 2-minute mobile form with zero fees."
      />

      <Navbar />

      <main className="flex-1 pb-16">
        {/* Top Header Banner (Light Theme) */}
        <section className="bg-light-hero py-8 sm:py-10 border-b border-slate-200/80 relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Browse Other Security Roles
                </Link>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Apply for {pageConfig?.heading || 'Security Guard Jobs'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Registration &middot; Zero Agency Fees &middot; Direct Employer Match</span>
                </p>
              </div>

              {/* Language Switcher & Security Badge */}
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Form</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Container */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6">
          {!pageConfig && !loadError && (
            <Card className="p-6 sm:p-10">
              <LoadingSkeleton rows={8} />
            </Card>
          )}

          {(pageConfig || loadError) && (
            <CandidateApplicationForm
              preselectedRole={pageConfig?.preselectedRole || null}
              trackingData={trackingData}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
