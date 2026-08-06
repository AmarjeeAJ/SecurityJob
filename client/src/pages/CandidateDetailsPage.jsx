import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCandidateDetails } from '../api/ownerCandidates.js';
import apiClient from '../api/client.js';
import OwnerHeader from '../components/owner/OwnerHeader.jsx';
import Card from '../components/common/Card.jsx';
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx';
import ErrorBanner from '../components/form/ErrorBanner.jsx';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-navy-900">{value || value === 0 ? value : '—'}</p>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/15 text-gold-600">{icon}</div>
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

const uploadsOrigin = (apiClient.defaults.baseURL || '').replace(/\/api\/?$/, '');

const ICONS = {
  user: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.5-6 8-6s8 2 8 6" /></svg>,
  briefcase: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2" /><path strokeLinecap="round" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  shield: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" /></svg>,
  trending: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M21 7v6h-6" /></svg>,
};

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchCandidateDetails(id)
      .then((data) => {
        if (!cancelled) setCandidate(data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Candidate not found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="bg-mesh-light min-h-screen">
      <OwnerHeader />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          to="/owner/candidates"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-gold-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Candidate Records
        </Link>

        {loading && <Card><LoadingSkeleton rows={10} /></Card>}
        {error && <ErrorBanner message={error} />}

        {candidate && (
          <div className="flex flex-col gap-5">
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-800 text-xl font-bold text-gold-300">
                  {candidate.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-bold text-navy-900">{candidate.full_name}</h1>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">{candidate.candidate_code}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    candidate.consent_given ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {candidate.consent_given ? 'Consent Given' : 'No Consent'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                <Field label="Mobile Number" value={candidate.mobile_number} />
                <Field label="WhatsApp Number" value={candidate.whatsapp_number} />
                <Field label="Age" value={candidate.age} />
                <Field label="Gender" value={candidate.gender} />
                <Field label="Current City" value={candidate.current_city} />
                <Field label="Current Area" value={candidate.current_area} />
                <Field label="State" value={candidate.state} />
              </div>
            </Card>

            <SectionCard icon={ICONS.briefcase} title="Job Preferences & Experience">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Preferred Roles" value={candidate.roles.map((r) => r.role_name).join(' | ')} />
                <Field label="Preferred Locations" value={candidate.preferredLocations.join(' | ')} />
                <Field label="Security Experience" value={`${candidate.security_experience_months} months`} />
                <Field label="Employment Status" value={candidate.current_employment_status} />
                <Field label="Joining Availability" value={candidate.joining_availability} />
                <Field label="Duty-Hour Preference" value={candidate.duty_hour_preference} />
              </div>
            </SectionCard>

            {/* Legacy fields (documents, older optional profile data) only render when a record
                actually has them — the current form no longer collects any of this. */}
            {(candidate.documents.length > 0 || candidate.additional_message) && (
              <SectionCard icon={ICONS.shield} title="Documents & Notes">
                {candidate.documents.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {candidate.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={`${uploadsOrigin}${doc.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-navy-800 px-3 py-2 text-xs font-semibold text-navy-800 transition-colors hover:bg-navy-800 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        View {doc.document_type}
                      </a>
                    ))}
                  </div>
                )}

                {candidate.additional_message && (
                  <div className={candidate.documents.length > 0 ? 'mt-4 border-t border-slate-100 pt-4' : ''}>
                    <Field label="Additional Message" value={candidate.additional_message} />
                  </div>
                )}
              </SectionCard>
            )}

            <SectionCard icon={ICONS.trending} title="Campaign Sources">
              <div className="flex flex-col gap-2">
                {candidate.sources.map((s, i) => (
                  <div key={i} className="flex flex-wrap justify-between gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-navy-900">{s.source} / {s.medium} / {s.campaign}</span>
                    <span className="text-slate-500">
                      {s.submission_count}x &middot; last {formatDateTime(s.last_seen_at)}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="mb-2 mt-5 text-sm font-bold text-navy-900">Submission History</h3>
              <div className="flex flex-col gap-2">
                {candidate.submissions.map((s, i) => (
                  <div key={i} className="flex flex-wrap justify-between gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-600">
                    <span>{s.landing_page_slug} — {s.source} / {s.medium}</span>
                    <span>{formatDateTime(s.submitted_at)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <Field label="First Registered" value={formatDateTime(candidate.first_registered_at)} />
                <Field label="Latest Submission" value={formatDateTime(candidate.last_submitted_at)} />
              </div>
            </SectionCard>
          </div>
        )}
      </main>
    </div>
  );
}
