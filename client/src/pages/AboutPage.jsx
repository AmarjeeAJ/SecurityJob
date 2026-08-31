import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Target, 
  Eye, 
  Building2, 
  HeartHandshake
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';

export default function AboutPage() {
  const stats = [
    { value: '19+', label: 'Specialized Security Roles' },
    { value: '₹0', label: 'Candidate Registration Fee' },
    { value: '50+', label: 'Indian Cities Covered' },
    { value: '< 2 min', label: 'Online Application Time' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Industry-Dedicated Focus',
      desc: 'We are built specifically for the private security industry — not a generic job board filled with unrelated white-collar listings.',
    },
    {
      icon: HeartHandshake,
      title: 'Free & Transparent for Candidates',
      desc: 'Security job seekers never pay a single rupee. We protect workers from exploitative commission middlemen.',
    },
    {
      icon: Building2,
      title: 'Compliant & Verified Employers',
      desc: 'We partner with licensed security companies and employers committed to statutory labour benefits (PF, ESIC).',
    },
    {
      icon: Award,
      title: 'Dignity & Career Growth',
      desc: 'We believe private security is a vital nation-building profession with clear paths from guarding to supervision and management.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title="About Us — India's Dedicated Security Employment Platform | SecurityJob.in"
        description="Learn about SecurityJob.in — our mission, vision, and commitment to connecting security professionals with verified employers across India."
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-24 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              About SecurityJob.in
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              A Dedicated Recruitment Platform for India's Security Industry
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connecting security guards, supervisors, CCTV operators, and management personnel with verified employers and facility contracts across India.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4">
                  <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">{stat.value}</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Our Mission</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To eliminate exploitation, middlemen fees, and recruitment delays in the private security sector by providing a fast, transparent, and mobile-first hiring bridge between workers and employers.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To become India's most trusted employment ecosystem for security personnel, elevating workforce standards, accelerating agency deployments, and championing worker dignity across the country.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Core Principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                What We Stand For
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 sm:py-20 bg-slate-50 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Ready to Join the SecurityJob Network?
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Whether you are an aspiring candidate or a hiring employer, get started today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Apply for a Security Job
              </Link>
              <Link
                to="/employers"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs"
              >
                Hire Security Staff (For Employers)
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
