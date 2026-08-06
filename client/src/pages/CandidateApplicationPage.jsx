import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPageConfig } from '../api/candidates.js';
import { initTracking } from '../services/tracking.service.js';
import { captureTrackingData } from '../utils/tracking.js';
import Header from '../components/common/Header.jsx';
import Hero from '../components/common/Hero.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import CandidateApplicationForm from '../features/candidate-registration/CandidateApplicationForm.jsx';

const DEFAULT_JOB_SLUG = 'security-guard';

export default function CandidateApplicationPage() {
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

  const heading = pageConfig?.heading || 'Security Job Openings';

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Header />
      <Hero heading={heading} />

      <main className="mx-auto max-w-2xl px-4 pb-16 pt-2 sm:px-6">
        {!pageConfig && !loadError && (
          <Card>
            <LoadingSkeleton />
          </Card>
        )}

        {(pageConfig || loadError) && (
          <CandidateApplicationForm preselectedRole={pageConfig?.preselectedRole || null} trackingData={trackingData} />
        )}
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} SecurityJob. All rights reserved.
      </footer>
    </div>
  );
}
