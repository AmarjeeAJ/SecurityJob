import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, Briefcase } from 'lucide-react';

export default function MobileBottomBar({ jobSlug = 'security-guard', title = null }) {
  const location = useLocation();
  const isApplyPage = location.pathname.startsWith('/apply');
  const isJobDetail = location.pathname.startsWith('/jobs/') && location.pathname.length > 6;

  // Don't show bottom bar on the application form page (it has its own form actions)
  if (isApplyPage) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-lg">
      <div className="flex items-center gap-2.5">
        {isJobDetail ? (
          <>
            <Link
              to="/jobs"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100"
            >
              <Briefcase className="w-3.5 h-3.5" />
              All Jobs
            </Link>
            <Link
              to={`/apply/${jobSlug}`}
              className="flex-[2] inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply for {title ? title.split(' ')[0] : 'Role'}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/jobs"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              Find Jobs
            </Link>
            <Link
              to="/apply/security-guard"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply Now
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
