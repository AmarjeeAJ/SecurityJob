import { Link } from 'react-router-dom';
import { 
  MapPin, 
  IndianRupee, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import RoleIcon from '../common/RoleIcon.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function JobCard({ job }) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  if (!job) return null;

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 card-hover-effect flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <RoleIcon type={job.slug === 'security-supervisor' ? 'badge' : 'shield'} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                {job.featured && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    <Sparkles className="w-2.5 h-2.5" />
                    {isHindi ? 'अर्जेंट' : 'Urgent'}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHindi ? 'वेरिफाइड जॉब प्लेसमेंट' : 'Verified Employer Placement'}</span>
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/80">
            {job.category}
          </span>
        </div>

        {/* Description Summary */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {job.summary}
        </p>

        {/* Highlights & Metadata Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
          {/* Salary */}
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{job.salaryDisplay.split('/')[0]}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.primaryLocation.split('&')[0]}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.experienceLevel}</span>
          </div>

          {/* Qualification */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.qualification}</span>
          </div>

          {/* Shift */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.shift.split('(')[0]}</span>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.genderEligibility}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        <Link
          to={`/jobs/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-center"
        >
          {isHindi ? 'विवरण देखें' : 'View Details'}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          to={`/apply/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all text-center"
        >
          {isHindi ? 'आवेदन करें' : 'Apply Now'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
