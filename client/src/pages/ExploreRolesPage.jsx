import { useState, useMemo } from 'react';
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
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  Search, 
  Sparkles, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { JOBS_CATALOG } from '../services/jobs.service.js';
import ROLE_SLUGS, { ROLE_CATEGORIES } from '../utils/roleSlugs.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// Visual identity and rich icons tailored for security industry roles
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
        Icon: Sparkles,
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

export default function ExploreRolesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const categories = ['All', 'Guard & Protection', 'Supervision & Management'];

  const filteredRoles = useMemo(() => {
    return JOBS_CATALOG.filter((job) => {
      const matchCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchSearch = 
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.hindiTitle && job.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi 
          ? 'राजस्थान में सभी सिक्योरिटी जॉब पद — गार्ड, सुपरवाइजर, गनमैन, सीसीटीवी'
          : 'Explore All Security Roles in Rajasthan — Guard, Supervisor, Gunman, CCTV Operator'}
        description={isHindi
          ? 'राजस्थान में सभी 12+ सिक्योरिटी जॉब पदों की सूची। मासिक वेतन, ड्यूटी घंटे, पात्रता व सीधी भर्ती जानकारी। 100% फ्री आवेदन।'
          : 'Complete catalog of verified security roles across Rajasthan. Compare monthly salary, duty hours, shift criteria, and apply free in 2 minutes.'}
      />

      <Navbar />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="bg-light-hero py-10 sm:py-16 border-b border-slate-200/80 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3.5">
              <Briefcase className="w-3.5 h-3.5" />
              {isHindi ? 'राजस्थान में सभी 12+ सिक्योरिटी पद' : 'All 12+ Security Roles in Rajasthan'}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
              {isHindi ? (
                <>
                  अपनी पसंद का <span className="text-blue-600">सिक्योरिटी पद</span> चुनें व वेतन देखें
                </>
              ) : (
                <>
                  Explore All Verified <span className="text-blue-600">Security Roles</span> in Rajasthan
                </>
              )}
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mt-3 leading-relaxed">
              {isHindi
                ? 'गार्ड, सुपरवाइजर, लेडी गार्ड, गनमैन या सीसीटीवी ऑपरेटर — सभी पदों का वेतन, ड्यूटी घंटे, पात्रता व जॉइनिंग शर्तें चेक करें।'
                : 'Compare transparent salary ranges, shift timings, required qualifications, and statutory PF/ESIC benefits for all active security positions.'}
            </p>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 pt-4 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHindi ? '100% फ्री रजिस्ट्रेशन' : '100% Free Registration'}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHindi ? 'PF + ESIC सहित वेतन' : 'Salary Includes PF + ESIC'}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHindi ? 'पूरे राजस्थान में तैनाती' : 'Deployments Across Rajasthan'}
              </span>
            </div>

            {/* Search Input Filter */}
            <div className="mt-6 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all p-1.5">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'पद खोजें (जैसे Guard, Supervisor, Gunman)...' : 'Search roles (e.g. Guard, Supervisor, Gunman)...'}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Roles Catalog Section */}
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat === 'All' 
                      ? (isHindi ? 'सभी पद (All Roles)' : 'All Roles') 
                      : cat === 'Guard & Protection'
                      ? (isHindi ? 'गार्ड व सुरक्षा पद (Guarding)' : 'Guard & Protection')
                      : (isHindi ? 'सुपरविजन व मैनेजमेंट (Supervision)' : 'Supervision & Management')}
                  </button>
                ))}
              </div>

              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                {filteredRoles.length} {filteredRoles.length === 1 ? 'Role' : 'Roles'} {isHindi ? 'उपलब्ध' : 'Found'}
              </span>
            </div>

            {/* Grid of Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredRoles.map((role) => {
                const visual = getRoleVisual(role.slug);
                const VisualIcon = visual.Icon;

                return (
                  <div
                    key={role.id}
                    className="relative bg-white rounded-3xl border border-slate-200/90 hover:border-blue-300/80 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Top Subtle Hover Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Header with Specialized Role Icon & Category Pill */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl ${visual.bg} ${visual.border} ${visual.text} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300`}
                        >
                          <VisualIcon className="w-6 h-6" />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${visual.badgeBg} ${visual.badgeBorder} ${visual.badgeText} border text-[11px] font-bold`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${visual.pillDot}`} />
                            {isHindi ? visual.labelHi : visual.labelEn}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {role.category}
                          </span>
                        </div>
                      </div>

                      {/* Role Title & Hindi Subtitle */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                          {role.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                          <span>{role.hindiTitle || 'सिक्योरिटी पद'}</span>
                          <span>&middot;</span>
                          <span className="text-slate-600">{role.jobType}</span>
                        </p>
                      </div>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {role.summary}
                      </p>

                      {/* Transparent Monthly Salary Tile */}
                      <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/40 border border-emerald-200/80 p-3.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-emerald-700" />
                            {isHindi ? 'मासिक वेतन (Monthly In-Hand + PF)' : 'Transparent Monthly Salary'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                            PF + ESIC
                          </span>
                        </div>
                        <p className="font-extrabold text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                          {role.salaryDisplay.split('/')[0]}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5 font-medium">
                          {isHindi ? 'साइट नियमानुसार ओवरटाइम (OT) अतिरिक्त देय' : 'Overtime allowance as per site deployment norms'}
                        </p>
                      </div>

                      {/* Specifications Grid with Icons */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        {/* Location */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-white text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-600 block leading-none font-medium">
                              {isHindi ? 'तैनाती' : 'Location'}
                            </span>
                            <span className="font-bold text-slate-800 truncate block text-[11px] mt-0.5">
                              {role.primaryLocation}
                            </span>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-white text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-600 block leading-none font-medium">
                              {isHindi ? 'अनुभव' : 'Experience'}
                            </span>
                            <span className="font-bold text-slate-800 truncate block text-[11px] mt-0.5">
                              {role.experienceLevel.split('(')[0].trim()}
                            </span>
                          </div>
                        </div>

                        {/* Qualification */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-white text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-600 block leading-none font-medium">
                              {isHindi ? 'योग्यता' : 'Education'}
                            </span>
                            <span className="font-bold text-slate-800 truncate block text-[11px] mt-0.5">
                              {role.qualification.split('/')[0].trim()}
                            </span>
                          </div>
                        </div>

                        {/* Shift */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-white text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-600 block leading-none font-medium">
                              {isHindi ? 'ड्यूटी' : 'Shift'}
                            </span>
                            <span className="font-bold text-slate-800 truncate block text-[11px] mt-0.5">
                              {role.shift.split('(')[0].trim()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ========================================================================= */}
                      {/* RESPONSIBILITIES & JOINING DOCUMENTS - HIDDEN AS PER USER REQUEST (DO NOT DELETE) */}
                      {/* ========================================================================= */}
                      <div className="hidden" aria-hidden="true">
                        {/* Responsibilities list preserved in code */}
                        {role.responsibilities && role.responsibilities.length > 0 && (
                          <div className="mt-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-700">
                              {isHindi ? 'मुख्य जिम्मेदारियां' : 'Role Responsibilities'}:
                            </h4>
                            <ul className="mt-1 space-y-1">
                              {role.responsibilities.map((resp, idx) => (
                                <li key={idx} className="text-xs text-slate-600">
                                  • {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Joining Documents required preserved in code */}
                        {role.documentsRequired && role.documentsRequired.length > 0 && (
                          <div className="mt-2 pt-2">
                            <h4 className="text-xs font-bold text-slate-700">
                              {isHindi ? 'जॉइनिंग दस्तावेज' : 'Joining Documents'}:
                            </h4>
                            <ul className="mt-1 space-y-1">
                              {role.documentsRequired.map((doc, idx) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-slate-400" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2.5">
                      <Link
                        to={`/jobs/${role.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-center hover:shadow-2xs"
                      >
                        {isHindi ? 'पूरा विवरण' : 'View Details'}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </Link>

                      <Link
                        to={`/apply/${role.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all text-center"
                      >
                        {isHindi ? 'आवेदन करें' : 'Apply Now'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRoles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
                <p className="text-slate-600 text-sm font-semibold">
                  {isHindi ? 'कोई पद नहीं मिला। कृपया दूसरा शब्द खोजें।' : 'No roles found matching your search.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  {isHindi ? 'सभी पद फिर से देखें' : 'Reset Search'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Closing Quick Apply Banner */}
        <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isHindi ? '100% फ्री ऑनलाइन फॉर्म' : '100% Free Online Application'}
            </span>

            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'पद चुनने में सहायता चाहिए?' : 'Need Help Choosing the Right Security Role?'}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {isHindi
                ? 'यदि आप सुनिश्चित नहीं हैं कि कौन सा पद आपके लिए सबसे सही है, तो जनरल सिक्योरिटी गार्ड फॉर्म भरें। हमारी टीम आपकी योग्यता के अनुसार पद का सुझाव देगी।'
                : 'If you are unsure which position suits you best, start with our standard application. Our verification team will guide you to matching openings.'}
            </p>

            <div className="pt-2">
              <Link
                to="/apply/security-guard"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span>{isHindi ? 'सामान्य आवेदन फॉर्म भरें (General Apply)' : 'Submit General Application (Free)'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
