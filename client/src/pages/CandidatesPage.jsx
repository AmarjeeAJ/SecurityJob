import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck2, 
  CheckCircle2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Award,
  PhoneCall,
  Check
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';

export default function CandidatesPage() {
  const careerLevels = [
    {
      level: 'Level 1',
      title: 'Security Guard / Lady Guard',
      exp: '0 - 1 Year (Fresher Friendly)',
      salary: '₹15,000 – ₹24,000 / mo',
      desc: 'Access control, visitor log management, perimeter gate duty, and campus patrols.',
    },
    {
      level: 'Level 2',
      title: 'Senior Guard / CCTV Operator',
      exp: '1 - 3 Years Experience',
      salary: '₹20,000 – ₹30,000 / mo',
      desc: 'Multi-screen video surveillance, alarm monitoring, gate pass audits, and radio coordination.',
    },
    {
      level: 'Level 3',
      title: 'Security Supervisor / Shift Incharge',
      exp: '2 - 5 Years Experience',
      salary: '₹24,000 – ₹36,000 / mo',
      desc: 'Lead guard shifts, conduct daily briefings, manage duty rosters, and handle site operations.',
    },
    {
      level: 'Level 4',
      title: 'Field Officer / Quality Inspector',
      exp: '4 - 8 Years Experience',
      salary: '₹28,000 – ₹45,000 / mo',
      desc: 'Multi-site operational audits, night surprise visits, client account checks, and recruitment support.',
    },
    {
      level: 'Level 5',
      title: 'Security Operations Manager',
      exp: '6+ Years (Ex-Defence / Experienced)',
      salary: '₹45,000 – ₹80,000+ / mo',
      desc: 'Formulate campus security policies, manage security contracts, disaster response, and team leadership.',
    },
  ];

  const checklistDocs = [
    {
      title: 'Aadhaar Card',
      desc: 'Clear front and back copies with matching birth year and address.',
      required: true,
    },
    {
      title: 'Bank Account Passbook / Cheque',
      desc: 'Your active savings bank account details for direct monthly salary deposit.',
      required: true,
    },
    {
      title: 'Educational Marksheet',
      desc: '10th, 12th, or graduation certificate for supervisory & technical roles.',
      required: true,
    },
    {
      title: 'Passport Size Photographs',
      desc: '2 to 4 recent passport size color photos for company ID cards.',
      required: true,
    },
    {
      title: 'Police Verification / Character Certificate',
      desc: 'Local police verification certificate (helpful for faster deployment).',
      required: false,
    },
    {
      title: 'Arms Licence (For Armed Roles Only)',
      desc: 'Valid arms licence copy for Gunman and Armed Escort positions.',
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title="Career Guide & Jobs Hub — Security Guard & Supervisor Careers | SecurityJob.in"
        description="Build a high-growth career in India's private security sector. Career pathways, salary benchmarks, interview preparation checklist, and free online job application."
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-24 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                Employee Career & Growth Hub
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Security Careers Start Here.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Connect with verified security job opportunities across India. Enjoy zero registration fees, confirmed statutory benefits (PF & ESIC), and a transparent path for long-term career growth.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/apply/security-guard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Start Free Application
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs"
                >
                  <Briefcase className="w-4 h-4" />
                  Browse 19+ Security Roles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Worker Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Why Apply Through SecurityJob?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Zero Fees, Ever</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We never ask candidates to pay for registration, interview slots, or placement. Registration is 100% free.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Genuine Job Vacancies</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We list only verified job openings that offer timely monthly bank salaries and statutory PF/ESIC benefits.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Direct Phone / WhatsApp Match</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No middleman confusion. When an opening fits your location and experience, you get contacted directly for joining.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Progression Ladder */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Career Growth Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Career Progression in Private Security
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Private security is one of India's fastest growing employment sectors. See how you can grow from entry guard duty to multi-site management.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {careerLevels.map((item, i) => (
                <div
                  key={item.level}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover-effect"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black text-sm border border-blue-100">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase text-blue-600">{item.level}</span>
                        <span className="text-slate-300">&middot;</span>
                        <span className="text-xs text-slate-500">{item.exp}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Typical Earnings</span>
                    <p className="text-sm sm:text-base font-extrabold text-emerald-700">{item.salary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Document Readiness Checklist */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center justify-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Preparation Checklist
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Documents You'll Need for Security Jobs
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Keep photocopies and photos on your phone ready to get deployed faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {checklistDocs.map((doc) => (
                <div key={doc.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.required
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {doc.required ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 sm:py-20 bg-slate-50 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Ready to Register Your Profile?
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Takes just 2 minutes on your mobile. Start receiving matching security job opportunities today.
            </p>
            <div className="mt-8">
              <Link
                to="/apply/security-guard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Start Free Candidate Application
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
