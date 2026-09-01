import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquare, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight,
  Phone,
  Mail,
  Building,
  Award
} from 'lucide-react';
import Logo from '../common/Logo.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919828044998';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const roleLinks = isHindi
    ? [
        { label: 'Security Guard (गार्ड)', href: '/jobs/security-guard' },
        { label: 'Security Supervisor (सुपरवाइजर)', href: '/jobs/security-supervisor' },
        { label: 'Lady Guard (लेडी गार्ड)', href: '/jobs/lady-security-guard' },
        { label: 'Gunman (गनमैन)', href: '/jobs/gunman' },
        { label: 'Armed Guard (हथियारबंद गार्ड)', href: '/jobs/armed-guard' },
        { label: 'Bouncer (बाउंसर)', href: '/jobs/bouncer' },
        { label: 'Field Officer (फील्ड ऑफिसर)', href: '/jobs/field-officer' },
      ]
    : [
        { label: 'Security Guard Jobs', href: '/jobs/security-guard' },
        { label: 'Security Supervisor Jobs', href: '/jobs/security-supervisor' },
        { label: 'Lady Security Guard Jobs', href: '/jobs/lady-security-guard' },
        { label: 'Gunman & Armed Guard', href: '/jobs/gunman' },
        { label: 'Armed Guard Specialist', href: '/jobs/armed-guard' },
        { label: 'Bouncer & Event Security', href: '/jobs/bouncer' },
        { label: 'Field Officer Jobs', href: '/jobs/field-officer' },
      ];

  const cityLinks = [
    { label: isHindi ? 'Jobs in Jaipur (जयपुर)' : 'Jobs in Jaipur', href: '/jobs?city=Jaipur' },
    { label: isHindi ? 'Jobs in Jodhpur (जोधपुर)' : 'Jobs in Jodhpur', href: '/jobs?city=Jodhpur' },
    { label: isHindi ? 'Jobs in Udaipur (उदयपुर)' : 'Jobs in Udaipur', href: '/jobs?city=Udaipur' },
    { label: isHindi ? 'Jobs in Kota (कोटा)' : 'Jobs in Kota', href: '/jobs?city=Kota' },
    { label: isHindi ? 'Jobs in Ajmer (अजमेर)' : 'Jobs in Ajmer', href: '/jobs?city=Ajmer' },
    { label: isHindi ? 'Jobs in Alwar & Bhiwadi (अलवर/भिवाड़ी)' : 'Jobs in Alwar & Bhiwadi', href: '/jobs?city=Alwar' },
    { label: isHindi ? 'Jobs in Neemrana (नीमराना)' : 'Jobs in Neemrana', href: '/jobs?city=Neemrana' },
    { label: isHindi ? 'Jobs in Sikar (सीकर)' : 'Jobs in Sikar', href: '/jobs?city=Sikar' },
  ];

  const candidateLinks = isHindi
    ? [
        { label: 'सभी जॉब देखें (Find Jobs)', href: '/jobs' },
        { label: 'फ्री फॉर्म भरें (Apply Free)', href: '/apply/security-guard' },
        { label: 'कैरियर गाइड (Career Guide)', href: '/career-guide' },
        { label: 'सवाल व जवाब (Help & FAQs)', href: '/help' },
        { label: 'कैंडिडेट हेल्पलाइन (Contact)', href: '/contact' },
      ]
    : [
        { label: 'Find All Jobs', href: '/jobs' },
        { label: 'Apply for Job (Free)', href: '/apply/security-guard' },
        { label: 'Career Growth Guide', href: '/career-guide' },
        { label: 'Help & FAQs', href: '/help' },
        { label: 'Candidate Support', href: '/contact' },
      ];

  const legalLinks = isHindi
    ? [
        { label: 'हमारे बारे में (About Us)', href: '/about' },
        { label: 'गोपनीयता नीति (Privacy Policy)', href: '/privacy-policy' },
        { label: 'नियम व शर्तें (Terms of Use)', href: '/terms-of-use' },
        { label: 'कैंडिडेट सहमति (Consent Policy)', href: '/candidate-consent-policy' },
        { label: 'Owner Login', href: '/owner/login' },
      ]
    : [
        { label: 'About SecurityJob', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Use', href: '/terms-of-use' },
        { label: 'Candidate Consent Policy', href: '/candidate-consent-policy' },
        { label: 'Owner Login', href: '/owner/login' },
      ];

  return (
    <footer className="bg-slate-50 text-slate-700 border-t border-slate-200/90 pt-14 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Contact Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-200/80">
          {/* Brand Intro */}
          <div className="lg:col-span-6 space-y-4">
            <Logo size="lg" variant="light" />
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg">
              {isHindi
                ? 'राजस्थान का 100% फ्री सिक्योरिटी जॉब पोर्टल। सिक्योरिटी गार्ड, सुपरवाइजर, लेडी गार्ड, गनमैन व बाउंसर की भर्ती। ₹0 फीस और सीधी जॉइनिंग।'
                : "Rajasthan's 100% free job application platform for security guards, supervisors, gunmen, and security staff. Fast 2-minute mobile registration with zero charges and direct job joining."}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isHindi ? '100% फ्री रजिस्ट्रेशन' : '100% Free Registration'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHindi ? 'वेरिफाइड जॉब्स' : 'Verified Openings'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {isHindi ? 'केवल राजस्थान (Rajasthan Only)' : 'Rajasthan Focus'}
              </span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isHindi ? 'राजस्थान में जॉब चाहिए?' : 'Need a Security Job?'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isHindi ? '2 मिनट में फ्री फॉर्म भरें' : 'Free online application'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isHindi
                  ? 'अपने मोबाइल से अभी ऑनलाइन फॉर्म भरें और अपने जिले में जॉब पाएं।'
                  : 'Submit your mobile application in 2 minutes. Get connected with active security job openings in Rajasthan.'}
              </p>
              <Link
                to="/apply/security-guard"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group pt-1"
              >
                {isHindi ? 'फ्री फॉर्म भरें (Apply Free)' : 'Apply for Job Free'}
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isHindi ? 'कैंडिडेट हेल्पलाइन' : 'Candidate Helpdesk'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isHindi ? 'WhatsApp पर सहायता पाएं' : 'WhatsApp application assistance'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isHindi
                  ? 'फॉर्म या जॉब से जुड़ा कोई सवाल हो तो हमारे WhatsApp पर मैसेज करें।'
                  : 'Have questions regarding your application status or open roles? Message our helpdesk.'}
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  isHindi
                    ? 'नमस्ते SecurityJob टीम, मुझे राजस्थान में सिक्योरिटी जॉब चाहिए।'
                    : 'Hi SecurityJob Team, I am looking for a security job in Rajasthan.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 group pt-1"
              >
                {isHindi ? 'WhatsApp पर चैट करें' : 'Chat on WhatsApp'}
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-200/80">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {isHindi ? 'सिक्योरिटी पद (Roles)' : 'Security Roles'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              {roleLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {isHindi ? 'राजस्थान के शहर (Cities)' : 'Rajasthan Cities'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              {cityLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {isHindi ? 'उम्मीदवार सहायता (Resources)' : 'Candidate Resources'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              {candidateLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {isHindi ? 'प्लेटफ़ॉर्म व नीतियां (Legal)' : 'Platform & Policies'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* POWERED BY AVIJIT ENTERPRISES - IMPRESSIVE CORPORATE FOOTER CARD */}
        {/* ========================================================================= */}
        <div className="my-8 p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 text-white shadow-lg border border-slate-800/80">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black tracking-wide uppercase">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  Powered By AVIJIT ENTERPRISES
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Govt. MSME Registered
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Portal
                </span>
              </div>

              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white font-semibold">{isHindi ? 'पंजीकृत कार्यालय' : 'Registered Office'}:</strong> 159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <a
                href="tel:+919828044998"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 98280 44998</span>
              </a>

              <a
                href="mailto:bansalvicky738@gmail.com"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-white" />
                <span>bansalvicky738@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            &copy; {currentYear} SecurityJob.in &middot; Powered by <strong>Avijit Enterprises</strong>. {isHindi ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}
          </p>
          <div className="flex items-center gap-3">
            <Link to="/privacy-policy" className="hover:text-slate-600">Privacy Policy</Link>
            <span>&middot;</span>
            <Link to="/terms-of-use" className="hover:text-slate-600">Terms of Use</Link>
            <span>&middot;</span>
            <Link to="/candidate-consent-policy" className="hover:text-slate-600">Candidate Consent</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
