import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Shield,
  Award,
  Crosshair,
  Video,
  Zap,
  Compass,
  Building2,
  UserCheck,
  FileCheck,
  FileText,
  MapPin, 
  IndianRupee, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Ticket,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function getRoleVisual(slug) {
  switch (slug) {
    case 'security-guard':
      return {
        Icon: ShieldCheck,
        bg: 'bg-blue-50/90',
        border: 'border-blue-200',
        text: 'text-blue-600',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        pillDot: 'bg-blue-500',
        labelEn: 'Standard Guarding',
        labelHi: 'सुरक्षा गार्ड'
      };
    case 'lady-security-guard':
      return {
        Icon: UserCheck,
        bg: 'bg-rose-50/90',
        border: 'border-rose-200',
        text: 'text-rose-600',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        pillDot: 'bg-rose-500',
        labelEn: 'Female Personnel',
        labelHi: 'महिला सुरक्षा'
      };
    case 'security-supervisor':
      return {
        Icon: Award,
        bg: 'bg-amber-50/90',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200',
        pillDot: 'bg-amber-500',
        labelEn: 'Site Supervision',
        labelHi: 'सुपरविजन'
      };
    case 'armed-guard':
    case 'gunman':
      return {
        Icon: Crosshair,
        bg: 'bg-slate-100',
        border: 'border-slate-300',
        text: 'text-slate-800',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-800',
        badgeBorder: 'border-slate-300',
        pillDot: 'bg-slate-700',
        labelEn: 'Armed Security',
        labelHi: 'सशस्त्र गनमैन'
      };
    case 'cctv-operator':
      return {
        Icon: Video,
        bg: 'bg-sky-50/90',
        border: 'border-sky-200',
        text: 'text-sky-600',
        badgeBg: 'bg-sky-50',
        badgeText: 'text-sky-700',
        badgeBorder: 'border-sky-200',
        pillDot: 'bg-sky-500',
        labelEn: 'Surveillance / CCTV',
        labelHi: 'सीसीटीवी कंट्रोल'
      };
    case 'bouncer':
      return {
        Icon: Zap,
        bg: 'bg-orange-50/90',
        border: 'border-orange-200',
        text: 'text-orange-600',
        badgeBg: 'bg-orange-50',
        badgeText: 'text-orange-800',
        badgeBorder: 'border-orange-200',
        pillDot: 'bg-orange-500',
        labelEn: 'Crowd & VIP Safety',
        labelHi: 'बाउंसर व क्राउड'
      };
    case 'field-officer':
      return {
        Icon: Compass,
        bg: 'bg-teal-50/90',
        border: 'border-teal-200',
        text: 'text-teal-700',
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-800',
        badgeBorder: 'border-teal-200',
        pillDot: 'bg-teal-500',
        labelEn: 'Area Operations',
        labelHi: 'फील्ड ऑफिसर'
      };
    case 'bodyguard':
      return {
        Icon: Shield,
        bg: 'bg-purple-50/90',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-800',
        badgeBorder: 'border-purple-200',
        pillDot: 'bg-purple-500',
        labelEn: 'VIP Close Protection',
        labelHi: 'बॉडीगार्ड / PSO'
      };
    case 'event-security-guard':
      return {
        Icon: Ticket,
        bg: 'bg-indigo-50/90',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        badgeBg: 'bg-indigo-50',
        badgeText: 'text-indigo-700',
        badgeBorder: 'border-indigo-200',
        pillDot: 'bg-indigo-500',
        labelEn: 'Events & Expos',
        labelHi: 'इवेंट गार्ड'
      };
    case 'security-inspector':
      return {
        Icon: FileCheck,
        bg: 'bg-emerald-50/90',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-800',
        badgeBorder: 'border-emerald-200',
        pillDot: 'bg-emerald-500',
        labelEn: 'Compliance & Audit',
        labelHi: 'इंस्पेक्टर व ऑडिट'
      };
    case 'security-manager':
      return {
        Icon: Building2,
        bg: 'bg-slate-900',
        border: 'border-slate-800',
        text: 'text-amber-400',
        badgeBg: 'bg-slate-800',
        badgeText: 'text-amber-300',
        badgeBorder: 'border-slate-700',
        pillDot: 'bg-amber-400',
        labelEn: 'Campus Security Head',
        labelHi: 'सिक्योरिटी मैनेजर'
      };
    default:
      return {
        Icon: ShieldCheck,
        bg: 'bg-blue-50/90',
        border: 'border-blue-200',
        text: 'text-blue-600',
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200',
        pillDot: 'bg-blue-500',
        labelEn: 'Security Role',
        labelHi: 'सुरक्षा पद'
      };
  }
}

export default function JobCard({ job }) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  if (!job) return null;

  const visual = getRoleVisual(job.slug);
  const VisualIcon = visual.Icon;

  return (
    <div className="group relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Subtle Hover Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${visual.bg} ${visual.border} ${visual.text} border shadow-2xs group-hover:scale-105 transition-transform duration-300`}>
              <VisualIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                  {job.title}
                </h3>
                {job.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    <Sparkles className="w-2.5 h-2.5" />
                    {isHindi ? 'अर्जेंट भर्ती' : 'Urgent Hiring'}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'वेरिफाइड जॉब प्लेसमेंट' : 'Verified Employer Placement'}</span>
              </p>
            </div>
          </div>

          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full ${visual.badgeBg} ${visual.badgeBorder} ${visual.badgeText} border px-2.5 py-1 text-[11px] font-bold`}>
            <span className={`w-1.5 h-1.5 rounded-full ${visual.pillDot}`} />
            {isHindi ? visual.labelHi : visual.labelEn}
          </span>
        </div>

        {/* Description Summary */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3.5">
          {job.summary}
        </p>

        {/* Transparent Salary Tile */}
        <div className="mb-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/40 border border-emerald-200/80 p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-700" />
              {job.salaryPeriod === 'day' ? (isHindi ? 'दैनिक भुगतान' : 'Daily Pay') : (isHindi ? 'मासिक वेतन' : 'Monthly Salary')}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
              {isHindi ? 'कंपनी नियमानुसार' : 'Site Norms'}
            </span>
          </div>
          <p className="font-extrabold text-slate-900 text-base mt-0.5 tracking-tight flex items-baseline gap-1">
            <span>{job.salaryDisplay.split('/')[0]}</span>
            <span className="text-xs font-semibold text-slate-500">
              {job.salaryPeriod === 'day' ? (isHindi ? '/ दिन' : '/ day') : (isHindi ? '/ माह' : '/ mo')}
            </span>
          </p>
        </div>

        {/* Highlights & Metadata Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate font-semibold text-slate-800">{job.primaryLocation.split('&')[0]}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{job.experienceLevel.split('(')[0]}</span>
          </div>

          {/* Qualification */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{job.qualification.split('/')[0]}</span>
          </div>

          {/* Shift */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{job.shift.split('(')[0]}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RESPONSIBILITIES & JOINING DOCUMENTS - HIDDEN AS PER USER REQUEST (DO NOT DELETE) */}
        {/* ========================================================================= */}
        <div className="hidden" aria-hidden="true">
          {job.responsibilities && (
            <ul>{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
          )}
          {job.documentsRequired && (
            <ul>{job.documentsRequired.map((d, i) => <li key={i}>{d}</li>)}</ul>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
        <Link
          to={`/jobs/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-center"
        >
          {isHindi ? 'विवरण देखें' : 'View Details'}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          to={`/apply/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all text-center"
        >
          {isHindi ? 'आवेदन करें' : 'Apply Now'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

