import { Link } from 'react-router-dom';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-2 p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 p-12 text-center">
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m21 21-4.3-4.3" />
      </svg>
      <p className="font-medium text-slate-500">No candidates match the current filters.</p>
      <p className="text-sm text-slate-400">Try adjusting your search or clearing a filter.</p>
    </div>
  );
}

/** Compact card used on narrow screens instead of the horizontally-scrolling table. */
function CandidateCard({ c }) {
  return (
    <Link
      to={`/owner/candidates/${c.id}`}
      className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-gold-400/60 hover:bg-gold-500/5 bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900">{c.fullName}</p>
          <p className="font-mono text-xs text-slate-400">{c.candidateCode}</p>
        </div>
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
          {c.mobileNumber}
        </span>
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          {c.currentCity}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        <span className="font-medium text-navy-700">{c.preferredRoles.join(' | ') || '—'}</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        {c.source && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{c.source}</span>
        )}
        {c.joiningAvailability && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{c.joiningAvailability}</span>
        )}
        <span className="ml-auto text-slate-400">{formatDate(c.lastSubmittedAt)}</span>
      </div>
    </Link>
  );
}

const TH_CLASSES = 'px-4 py-4 whitespace-nowrap';

export default function CandidateTable({ candidates, loading }) {
  if (loading) return <LoadingState />;
  if (candidates.length === 0) return <EmptyState />;

  return (
    <>
      {/* Mobile: card list — a 14-column table is unusable on a phone screen. */}
      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {candidates.map((c) => (
          <CandidateCard key={c.id} c={c} />
        ))}
      </div>

      {/* Desktop: full data table. */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1040px] border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-b from-navy-900 to-navy-800 text-left text-[11px] font-bold uppercase tracking-wider text-gold-300">
              <th className={`${TH_CLASSES} sticky left-0 z-20 bg-navy-900`}>Candidate</th>
              <th className={TH_CLASSES}>Mobile</th>
              <th className={TH_CLASSES}>City</th>
              <th className={TH_CLASSES}>Preferred Roles</th>
              <th className={TH_CLASSES}>Preferred Locations</th>
              <th className={TH_CLASSES}>Security Exp.</th>
              <th className={TH_CLASSES}>Joining</th>
              <th className={TH_CLASSES}>Source</th>
              <th className={TH_CLASSES}>Campaign</th>
              <th className={TH_CLASSES}>Latest Submission</th>
              <th className={`${TH_CLASSES} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr
                key={c.id}
                className={`group border-b border-slate-100 transition-colors hover:bg-gold-500/[0.06] ${i % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}`}
              >
                {/*
                  The sticky cell needs its OWN fully opaque background, not the
                  same translucent "/60" tint the row uses — during horizontal
                  scroll a sticky cell paints over whatever sits behind it in the
                  viewport, and a semi-transparent fill lets the scrolled-away
                  columns show through underneath, causing ghosted/overlapping text.
                */}
                <td className={`sticky left-0 z-[1] px-4 py-3.5 transition-colors group-hover:bg-amber-50 ${i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-gold-300">
                      {c.fullName?.[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy-900">{c.fullName}</p>
                      <p className="font-mono text-[11px] text-slate-400">{c.candidateCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{c.mobileNumber}</td>
                <td className="px-4 py-3.5 text-slate-600">{c.currentCity}</td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {c.preferredRoles.length > 0
                      ? c.preferredRoles.map((r) => (
                          <span key={r} className="whitespace-nowrap rounded-full bg-navy-800/5 px-2 py-0.5 text-xs font-medium text-navy-700">
                            {r}
                          </span>
                        ))
                      : '—'}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{c.preferredLocations.join(' | ') || '—'}</td>
                <td className="px-4 py-3.5 text-slate-600">{c.securityExperienceMonths} mo</td>
                <td className="px-4 py-3.5">
                  {c.joiningAvailability ? (
                    <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {c.joiningAvailability}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3.5">
                  {c.source ? (
                    <span className="whitespace-nowrap rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{c.source}</span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3.5 text-slate-500">{c.campaign || '—'}</td>
                <td className="px-4 py-3.5 text-slate-500">{formatDate(c.lastSubmittedAt)}</td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    to={`/owner/candidates/${c.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-navy-800/15 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:bg-gold-500 hover:text-navy-950"
                  >
                    View
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
