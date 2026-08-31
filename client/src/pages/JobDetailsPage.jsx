import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  IndianRupee, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Share2, 
  Check 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import RoleIcon from '../components/common/RoleIcon.jsx';
import { getJobBySlug, JOBS_CATALOG } from '../services/jobs.service.js';

export default function JobDetailsPage() {
  const { jobSlug } = useParams();
  const job = getJobBySlug(jobSlug);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Security Role Not Found</h1>
            <p className="text-sm text-slate-600">
              The role you are looking for might have been updated or moved.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Browse All 19+ Roles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related jobs
  const relatedJobs = JOBS_CATALOG.filter(
    (j) => j.category === job.category && j.slug !== job.slug
  ).slice(0, 3);

  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    industry: 'Private Security Services',
    employmentType: 'FULL_TIME',
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'MONTH',
      },
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.primaryLocation,
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={`${job.title} Jobs — Salary ₹${job.salaryMin.toLocaleString('en-IN')} to ₹${job.salaryMax.toLocaleString('en-IN')} | SecurityJob.in`}
        description={`Apply for ${job.title} jobs across ${job.primaryLocation}. Salary ${job.salaryDisplay}. Experience: ${job.experienceLevel}. Shift: ${job.shift}. Free registration.`}
        structuredData={jobSchema}
      />

      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Hero (Light Theme) */}
        <section className="bg-light-hero border-b border-slate-200/80 py-10 sm:py-14 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="mb-4">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to All Jobs
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Details Info */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Employer Placement
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {job.hindiTitle || 'सिक्योरिटी जॉब'} &middot; Full Time Deployment
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  {job.summary}
                </p>
              </div>

              {/* Right Salary & Quick Action Card */}
              <div className="lg:col-span-4">
                <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Estimated Monthly Earnings
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                      {job.salaryDisplay}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      + PF, ESIC & Overtime (as per site rules)
                    </p>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <Link
                      to={`/apply/${job.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all text-center"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      Apply for This Job
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <p className="text-center text-[11px] text-slate-400">
                      100% Free Registration &middot; Direct Employer Match
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Metadata Highlights Bar */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Experience</span>
                  <p className="font-bold text-slate-900 mt-0.5">{job.experienceLevel}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Qualification</span>
                  <p className="font-bold text-slate-900 mt-0.5">{job.qualification}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Shift Timing</span>
                  <p className="font-bold text-slate-900 mt-0.5">{job.shift}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Gender Eligibility</span>
                  <p className="font-bold text-slate-900 mt-0.5">{job.genderEligibility}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Primary Location</span>
                  <p className="font-bold text-slate-900 mt-0.5">{job.primaryLocation}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Registration Fee</span>
                  <p className="font-bold text-emerald-600 mt-0.5">₹0 (Completely Free)</p>
                </div>
              </div>

              {/* Key Responsibilities */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Key Duties & Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <div className="p-1 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility Criteria */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Eligibility & Requirements
                </h2>
                <ul className="space-y-3">
                  {job.eligibility.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <div className="p-1 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits & Perks */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Statutory Benefits & Perks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Documents You Will Need
                </h2>
                <p className="text-xs text-slate-500">
                  Keep photos or photocopies of these ready for fast on-site verification and joining:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.documentsRequired.map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Trust Badge Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">SecurityJob Candidate Guarantee</h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero candidate registration charges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct connection with verified employers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard PF & ESIC statutory benefits</span>
                  </li>
                </ul>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Related Roles in {job.category}</h3>
                  <div className="space-y-3">
                    {relatedJobs.map((rel) => (
                      <Link
                        key={rel.slug}
                        to={`/jobs/${rel.slug}`}
                        className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 transition-all group"
                      >
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600">
                          {rel.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-emerald-600">{rel.salaryDisplay.split('/')[0]}</span>
                          <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar jobSlug={job.slug} title={job.title} />
    </div>
  );
}
