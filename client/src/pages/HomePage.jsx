import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  PhoneCall, 
  Zap,
  Check,
  IndianRupee,
  FileCheck2,
  Factory,
  Building,
  Hotel,
  HeartPulse,
  Landmark,
  ShieldAlert,
  Star,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import JobSearchHero from '../components/jobs/JobSearchHero.jsx';
import SEO from '../components/common/SEO.jsx';
import RoleIcon from '../components/common/RoleIcon.jsx';
import ROLE_SLUGS from '../utils/roleSlugs.js';
import { FEATURED_JOB_ROLES, JOBS_CATALOG } from '../services/jobs.service.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const employeeBenefits = isHindi
    ? [
        {
          icon: Award,
          title: '100% फ्री रजिस्ट्रेशन (Zero Fee)',
          desc: 'कोई भी रजिस्ट्रेशन फीस, इंटरव्यू फीस या कमीशन नहीं। जॉब पाने के लिए किसी को 1 रुपया भी न दें।',
        },
        {
          icon: IndianRupee,
          title: 'पारदर्शी वेतन व भत्तों की जानकारी',
          desc: 'विभिन्न सुरक्षा पदों के लिए वेतन संरचना, बैंक ट्रांसफर या नकद भुगतान और वैधानिक नियमों के तहत मिलने वाले लाभों की स्पष्ट जानकारी।',
        },
        {
          icon: PhoneCall,
          title: 'फोन व WhatsApp पर सीधी सूचना',
          desc: 'फॉर्म भरने के बाद आपकी लोकेशन के नजदीकी जॉब की जानकारी सीधे आपके मोबाइल/WhatsApp पर दी जाती है।',
        },
        {
          icon: ShieldCheck,
          title: 'वेरिफाइड जॉब व सुरक्षित कार्यस्थल',
          desc: 'हर जॉब वैकेंसी पूरी तरह जांची-परखी होती है ताकि आपको सुरक्षित ड्यूटी और समय पर पगार मिले।',
        },
        {
          icon: Users,
          title: 'पुरुष व महिला दोनों के लिए पद',
          desc: 'नए उम्मीदवारों (फ्रेशर) के साथ-साथ अनुभवी गार्ड, गनमैन, सुपरवाइजर व लेडी गार्ड के लिए भर्ती।',
        },
        {
          icon: MapPin,
          title: 'राजस्थान के सभी जिलों में ड्यूटी',
          desc: 'जयपुर, जोधपुर, उदयपुर, कोटा, अजमेर, अलवर, भिवाड़ी, नीमराना, सीकर आदि में कार्यस्थल विकल्प।',
        },
      ]
    : [
        {
          icon: Award,
          title: '100% Free Registration (Zero Fees)',
          desc: 'Zero registration fee, zero interview fee, and zero commission. We never charge job seekers any fees.',
        },
        {
          icon: IndianRupee,
          title: 'Transparent Wage Structures',
          desc: 'Clear details on role-specific salary ranges, bank or cash payment options, and statutory benefit provisions as applicable.',
        },
        {
          icon: PhoneCall,
          title: 'Direct Phone & WhatsApp Updates',
          desc: 'After submitting your application, matching job details and interview schedules are sent directly to your phone.',
        },
        {
          icon: ShieldCheck,
          title: 'Verified Job Openings',
          desc: 'Every vacancy is verified to ensure genuine work environments, fair working hours, and timely wage payments.',
        },
        {
          icon: Users,
          title: 'Jobs for Men & Women (Freshers & Exp)',
          desc: 'Vacancies for freshers (0 experience) as well as experienced guards, armed personnel, and supervisors.',
        },
        {
          icon: MapPin,
          title: 'Duties Across All Rajasthan Districts',
          desc: 'Choose duty locations across Jaipur, Jodhpur, Udaipur, Kota, Ajmer, Alwar, Bhiwadi, Neemrana, and Sikar.',
        },
      ];

  const candidateSteps = isHindi
    ? [
        {
          step: '01',
          title: 'जॉब रोल चुनें (Select Role)',
          desc: 'सिक्योरिटी गार्ड, सुपरवाइजर, लेडी गार्ड, सीसीटीवी ऑपरेटर या गनमैन में से अपना मनपसंद पद चुनें।',
        },
        {
          step: '02',
          title: 'सैलरी व शर्तें देखें (Check Salary)',
          desc: 'महीने का वेतन (₹16,000 - ₹28,000), ड्यूटी घंटे (8h / 12h) और जरूरी कागजात चेक करें।',
        },
        {
          step: '03',
          title: '2 मिनट का फ्री फॉर्म भरें (Apply Free)',
          desc: 'मोबाइल से अपना नाम, नंबर, उम्र और राजस्थान का जिला भरकर सबमिट करें।',
        },
        {
          step: '04',
          title: 'कॉल पाएं व जॉइन करें (Direct Joining)',
          desc: 'कंपनी से फोन/WhatsApp पर जॉइनिंग डेट और साइट लोकेशन की जानकारी प्राप्त करें।',
        },
      ]
    : [
        {
          step: '01',
          title: 'Choose Your Job Role',
          desc: 'Select from roles like Security Guard, Supervisor, Lady Guard, CCTV Operator, or Gunman.',
        },
        {
          step: '02',
          title: 'Check Salary & Shift Criteria',
          desc: 'Review monthly earnings (₹16,000 – ₹28,000/mo), shift hours (8h/12h), and document checklist.',
        },
        {
          step: '03',
          title: 'Fill 2-Minute Mobile Application',
          desc: 'Enter your basic details, phone number, age, and preferred Rajasthan district directly from your phone.',
        },
        {
          step: '04',
          title: 'Direct Call & Site Joining',
          desc: 'Receive a prompt call or WhatsApp message with site location details and joining date.',
        },
      ];

  const rajasthanTopCities = [
    { name: isHindi ? 'Jaipur (जयपुर)' : 'Jaipur', state: 'Rajasthan', openings: isHindi ? '45+ सक्रिय पद' : '45+ Active Vacancies' },
    { name: isHindi ? 'Jodhpur (जोधपुर)' : 'Jodhpur', state: 'Rajasthan', openings: isHindi ? '30+ सक्रिय पद' : '30+ Active Vacancies' },
    { name: isHindi ? 'Udaipur (उदयपुर)' : 'Udaipur', state: 'Rajasthan', openings: isHindi ? '25+ सक्रिय पद' : '25+ Active Vacancies' },
    { name: isHindi ? 'Kota (कोटा)' : 'Kota', state: 'Rajasthan', openings: isHindi ? '25+ सक्रिय पद' : '25+ Active Vacancies' },
    { name: isHindi ? 'Ajmer (अजमेर)' : 'Ajmer', state: 'Rajasthan', openings: isHindi ? '20+ सक्रिय पद' : '20+ Active Vacancies' },
    { name: isHindi ? 'Alwar & Bhiwadi (अलवर/भिवाड़ी)' : 'Alwar & Bhiwadi', state: 'Rajasthan', openings: isHindi ? '40+ इंडस्ट्रियल पद' : '40+ Industrial Jobs' },
    { name: isHindi ? 'Neemrana (नीमराना)' : 'Neemrana', state: 'Rajasthan', openings: isHindi ? '30+ जापानी जोन पद' : '30+ Japanese Zone Jobs' },
    { name: isHindi ? 'Bhilwara (भीलवाड़ा)' : 'Bhilwara', state: 'Rajasthan', openings: isHindi ? '18+ सक्रिय पद' : '18+ Active Vacancies' },
    { name: isHindi ? 'Sikar (सीकर)' : 'Sikar', state: 'Rajasthan', openings: isHindi ? '15+ सक्रिय पद' : '15+ Active Vacancies' },
    { name: isHindi ? 'Bikaner (बीकानेर)' : 'Bikaner', state: 'Rajasthan', openings: isHindi ? '15+ सक्रिय पद' : '15+ Active Vacancies' },
    { name: isHindi ? 'Pali (पाली)' : 'Pali', state: 'Rajasthan', openings: isHindi ? '12+ सक्रिय पद' : '12+ Active Vacancies' },
    { name: isHindi ? 'Sri Ganganagar (गंगानगर)' : 'Sri Ganganagar', state: 'Rajasthan', openings: isHindi ? '12+ सक्रिय पद' : '12+ Active Vacancies' },
  ];

  const filteredCategories =
    selectedCategory === 'All'
      ? ROLE_SLUGS
      : ROLE_SLUGS.filter((r) => {
          if (selectedCategory === 'Guarding & Field') {
            return ['security-guard', 'lady-security-guard', 'cctv-operator', 'armed-guard', 'bouncer', 'bodyguard', 'gunman', 'event-security-guard'].includes(r.slug);
          }
          if (selectedCategory === 'Supervisory & Management') {
            return ['security-supervisor', 'field-officer', 'security-inspector', 'security-manager'].includes(r.slug);
          }
          return r.category === selectedCategory;
        });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "SecurityJob.in — राजस्थान सिक्योरिटी गार्ड व सुपरवाइजर भर्ती 2026 (100% फ्री आवेदन)" : "SecurityJob.in — Find Security Guard & Security Staff Jobs in Rajasthan (100% Free)"}
        description={isHindi ? "राजस्थान के सभी जिलों (जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, नीमराना आदि) में सिक्योरिटी गार्ड भर्ती। ₹0 फीस, सीधा ऑनलाइन आवेदन।" : "Apply for verified Security Guard, Supervisor, Lady Guard, and Armed Guard jobs across Rajasthan (Jaipur, Jodhpur, Udaipur, Kota, Alwar, Neemrana). 100% Free candidate registration."}
      />

      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Compact Title & Prominent Apply Now Button) */}
        {/* ========================================================================= */}
        <section className="bg-light-hero border-b border-slate-200/80 pt-8 pb-12 sm:pt-14 sm:pb-20 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span>
                  {isHindi
                    ? 'राजस्थान विशेष भर्ती पोर्टल · 100% फ्री रजिस्ट्रेशन'
                    : 'Rajasthan Security Jobs Portal · 100% Free Registration'}
                </span>
              </div>

              {/* Main Headline (Clean & Compact) */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {isHindi ? (
                  <>
                    राजस्थान में सिक्योरिटी गार्ड जॉब्स & <span className="text-blue-600">सीधी भर्ती</span>
                  </>
                ) : (
                  <>
                    Security Guard Jobs in Rajasthan & <span className="text-blue-600">Direct Joining</span>
                  </>
                )}
              </h1>

              {/* Sub-headline */}
              <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {isHindi
                  ? 'जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, नीमराना आदि में सिक्योरिटी गार्ड, सुपरवाइजर, गनमैन व लेडी गार्ड की भर्ती। ₹0 रजिस्ट्रेशन फीस और सीधी जॉब जानकारी।'
                  : 'Explore verified Security Guard, Supervisor, Lady Guard, and Armed Guard jobs across Jaipur, Jodhpur, Udaipur, Kota, Alwar, and Neemrana with ₹0 registration fee.'}
              </p>

              {/* Prominent Apply Now Hero Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <Link
                  to="/apply/security-guard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{isHindi ? 'ऑनलाइन फॉर्म भरें (Apply Now)' : 'Apply Now (100% Free)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/roles"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs"
                >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>{isHindi ? `सभी ${ROLE_SLUGS.length} पद देखें` : `Browse All ${ROLE_SLUGS.length} Roles`}</span>
                </Link>
              </div>

              {/* Trust Stat Highlights */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 pt-1 text-[11px] sm:text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  {isHindi ? '₹0 फॉर्म फीस' : '₹0 Application Fee'}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  {isHindi ? `${ROLE_SLUGS.length}+ सिक्योरिटी पद` : `${ROLE_SLUGS.length}+ Security Roles`}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  {isHindi ? 'राजस्थान के 33+ जिले' : '33+ Rajasthan Districts'}
                </span>
              </div>

              {/* Interactive Search Component (Hidden temporarily - remove 'hidden' class to revive) */}
              <div className="hidden pt-2 max-w-4xl mx-auto">
                <JobSearchHero />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR PURPOSE & INTRO SECTION (What is SecurityJob.in & Why It Exists) */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {isHindi ? 'हमारा परिचय एवं मुख्य उद्देश्य' : 'About Our Purpose & Mission'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {isHindi ? (
                  <>
                    SecurityJob.in क्या है और <span className="text-blue-600">हमारा उद्देश्य क्या है?</span>
                  </>
                ) : (
                  <>
                    What is SecurityJob.in & <span className="text-blue-600">Our Core Purpose</span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {isHindi
                  ? 'SecurityJob.in कोई सामान्य दलाल या एजेंसी नहीं है — यह राजस्थान के सुरक्षा कर्मियों को बिना किसी कमीशन या फीस के सीधे सम्मानजनक रोजगार दिलाने की एक पारदर्शी पहल है।'
                  : 'SecurityJob.in is not a fee-charging consultancy or middleman — it is a dedicated, transparent initiative designed to connect Rajasthan’s security workforce directly with genuine employers at zero cost.'}
              </p>
            </div>

            {/* 3 Core Pillars of Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 mb-10 sm:mb-12">
              {/* Pillar 1 */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {isHindi ? 'दलालों व कमीशन से 100% मुक्ति' : 'Zero Brokerage & Zero Fees'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'उम्मीदवारों से रजिस्ट्रेशन या इंटरव्यू के नाम पर 1 रुपया भी नहीं लिया जाता। पहले महीने का वेतन काटने वाले दलालों का चक्कर हमेशा के लिए खत्म।'
                      : 'Job seekers never pay a single rupee. We completely eliminate unscrupulous middlemen who deduct half or full monthly salaries as "commissions."'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-blue-600">
                  {isHindi ? '100% निःशुल्क भर्ती' : '100% Free For Candidates'}
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {isHindi ? 'सुरक्षा कर्मियों का सम्मान व कार्य सुरक्षा' : 'Professional Dignity & Fair Working Standards'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'सिक्योरिटी गार्ड हमारे समाज और प्रतिष्ठानों की रक्षा करते हैं। उन्हें पूरा मान-सम्मान, पारदर्शी कार्य स्थितियां और नियमों के अनुरूप सभी सुविधाएं मिलनी चाहिए।'
                      : 'Security guards protect our communities and workplaces. They deserve utmost professional dignity, transparent work terms, and compliant working conditions.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-emerald-600">
                  {isHindi ? 'पारदर्शी कार्य व वेतन नियम' : 'Transparent Work & Wage Terms'}
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {isHindi ? 'प्रमाणित कंपनियों से सीधा जुड़ाव' : 'Direct Verified Deployment'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'राजस्थान के सभी 33 जिलों (जयपुर, नीमराना, अलवर, कोटा आदि) में जांची-परखी PSARA व कॉरपोरेट कंपनियों में त्वरित जॉइनिंग कॉल व WhatsApp सूचना।'
                      : 'Direct connect with verified, PSARA-compliant agencies and established establishments across Jaipur, Neemrana, Alwar, Kota, and all Rajasthan districts.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-amber-700">
                  {isHindi ? 'सीधा फोन व WhatsApp अलर्ट' : 'Direct Phone & WhatsApp Connect'}
                </div>
              </div>
            </div>

            {/* Contrast Box: Middleman vs SecurityJob.in */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-9 mb-8 sm:mb-10 overflow-hidden relative shadow-xl border border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 relative z-10">
                <div className="space-y-3.5 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'पारंपरिक दलालों की समस्या' : 'The Middleman Problem'}</span>
                  </div>
                  <h4 className="text-base sm:text-xl font-bold text-white">
                    {isHindi ? 'नौकरी के नाम पर सिक्योरिटी गार्ड्स का शोषण' : 'Exploitation by Fraudulent Recruiters'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">✕</span>
                      <span>{isHindi ? 'फॉर्म या यूनिफॉर्म के नाम पर ₹1,500 से ₹5,000 की जबरन वसूली।' : 'Charging ₹1,500 to ₹5,000 upfront fees for fake registration.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">✕</span>
                      <span>{isHindi ? 'पहले महीने की तनख्वाह में से 50% से 100% तक की भारी दलाली।' : 'Taking cuts or first month salary as commission.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">✕</span>
                      <span>{isHindi ? 'PF और ESIC के झूठे वादे, बीमार पड़ने पर कोई मेडिकल सहारा नहीं।' : 'Empty promises of PF & ESIC with no healthcare cards.'}</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3.5 lg:pl-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'SecurityJob.in का पारदर्शी समाधान' : 'The SecurityJob.in Solution'}</span>
                  </div>
                  <h4 className="text-base sm:text-xl font-bold text-white">
                    {isHindi ? '100% फ्री, सम्मानजनक और सुरक्षित भर्ती' : '100% Free, Direct & Dignified Hiring'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isHindi ? 'कैंडिडेट के लिए ₹0 फीस — कोई कमीशन नहीं, कोई छिपा हुआ चार्ज नहीं।' : '₹0 Candidate Fees — Zero commission, zero hidden charges forever.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isHindi ? 'पारदर्शी वेतन भुगतान (बैंक या नकद) व नियोक्ता नियमानुसार वैधानिक भत्ते।' : 'Transparent salary payment (Bank or Cash) and statutory benefits as per employer norms.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isHindi ? 'भारत सरकार के MSME व GST में पंजीकृत AVIJIT ENTERPRISES द्वारा संचालित।' : 'Operated transparently by AVIJIT ENTERPRISES (Govt. MSME & GST Registered).'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Read Full Story / Purpose Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isHindi ? 'हमारा पूरा उद्देश्य व कहानी पढ़ें' : 'Read Our Full Purpose & Story'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 transition-all"
              >
                <span>{isHindi ? 'फ्री आवेदन फॉर्म भरें' : 'Apply Free in 2 Minutes'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECURITY CATEGORIES (Hidden on landing page; available on dedicated /roles page) */}
        {/* ========================================================================= */}
        <section className="hidden py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {isHindi ? 'जॉब पद सूची (Job Catalog)' : 'Job Role Catalog'}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {isHindi ? `राजस्थान में ${ROLE_SLUGS.length}+ सिक्योरिटी जॉब श्रेणियां` : `Explore ${ROLE_SLUGS.length}+ Security Roles in Rajasthan`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isHindi
                    ? 'अपनी पसंद का पद चुनें, वेतन देखें और 2 मिनट में फ्री फॉर्म भरें।'
                    : 'Choose a role to check salary details, qualifications, and submit your free application.'}
                </p>
              </div>

              <Link
                to="/roles"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0"
              >
                <span>{isHindi ? `सभी ${ROLE_SLUGS.length} पद देखें` : `Browse All ${ROLE_SLUGS.length} Roles`}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {['All', 'Guarding & Field', 'Supervisory & Management'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
                  }`}
                >
                  {cat === 'All' 
                    ? (isHindi ? 'सभी पद' : 'All Roles') 
                    : cat === 'Guarding & Field'
                    ? (isHindi ? 'गार्डिंग व फील्ड पद' : 'Guarding & Field')
                    : (isHindi ? 'सुपरविजन व मैनेजमेंट' : 'Supervisory & Management')}
                </button>
              ))}
            </div>

            {/* Grid of Roles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
              {filteredCategories.map((role) => (
                <Link
                  key={role.slug}
                  to={`/jobs/${role.slug}`}
                  className="p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-2 sm:mb-3 transition-colors">
                      <RoleIcon type={role.slug === 'cctv-operator' ? 'camera' : role.slug === 'security-supervisor' ? 'badge' : 'shield'} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {role.label}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {isHindi ? (role.hindiLabel || 'सिक्योरिटी जॉब') : 'Security Job'}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-blue-600">
                    <span>{isHindi ? 'सैलरी देखें' : 'View Salary'}</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCREEN 1: TRANSPARENT SALARY & WELFARE STRUCTURE IN RAJASTHAN */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
                <IndianRupee className="w-3.5 h-3.5" />
                {isHindi ? 'मानक वेतन श्रेणियां' : 'Standard Industry Wage Tiers'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {isHindi ? 'राजस्थान में सुरक्षा पदों की अनुमानित वेतन संरचना' : 'Estimated Salary Ranges by Security Role'}
              </h2>
              <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                {isHindi
                  ? 'पद, अनुभव और कार्यस्थल की श्रेणी के अनुसार अनुमानित मासिक वेतन। वास्तविक वेतन व भत्ते नियोक्ता कंपनी के नियमानुसार तय होते हैं।'
                  : 'Estimated monthly salary ranges based on role, experience, and site requirements. Final wages and allowances are governed by employer policies.'}
              </p>
            </div>

            {/* 3 Tier Salary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Tier 1 */}
              <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                      {isHindi ? 'लेवल 01 · फ्रेशर्स व गार्ड' : 'Tier 01 · General Guarding'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">0 - 2 Yrs Exp</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? 'सिक्योरिटी गार्ड व लेडी गार्ड' : 'Security Guard & Lady Guard'}
                  </h3>
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {isHindi ? 'मासिक वेतन (Monthly Salary)' : 'Estimated Monthly Earnings'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">₹16,000 – ₹24,000</p>
                    <span className="text-xs font-semibold text-emerald-700 block mt-1">
                      {isHindi ? 'वेतन व भत्ते साइट व कंपनी नियमानुसार' : 'Wages & benefits as per employer/site policy'}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? '8 घंटे व 12 घंटे रोटेशनल शिफ्ट' : '8h & 12h Rotational Duty Shifts'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? '10वीं पास / फ्रेशर्स का स्वागत' : '10th Pass / Freshers Welcome'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'यूनिफॉर्म व जूते कंपनी द्वारा' : 'Uniform & Duty Shoes Provided'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'मासिक वेतन (बैंक ट्रांसफर या नकद)' : 'Monthly salary payment (Bank transfer or Cash)'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200">
                  <Link
                    to="/apply/security-guard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all text-center"
                  >
                    <span>{isHindi ? 'गार्ड पद के लिए आवेदन करें' : 'Apply for Guard Role (Free)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="rounded-3xl bg-blue-50/50 border-2 border-blue-500/30 p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all relative">
                <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {isHindi ? 'लोकप्रिय पद' : 'High Demand'}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
                      {isHindi ? 'लेवल 02 · सुपरविजन' : 'Tier 02 · Supervision & Tech'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">1 - 4 Yrs Exp</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? 'सुपरवाइजर व सीसीटीवी ऑपरेटर' : 'Supervisor & CCTV Operator'}
                  </h3>
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-blue-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {isHindi ? 'मासिक वेतन (Monthly Salary)' : 'Estimated Monthly Earnings'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">₹18,000 – ₹25,000</p>
                    <span className="text-xs font-semibold text-emerald-700 block mt-1">
                      {isHindi ? 'वेतन व भत्ते साइट व कंपनी नियमानुसार' : 'Wages & benefits as per employer/site policy'}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'एसी कंट्रोल रूम या साइट सुपरविजन' : 'AC Control Room or On-Site Lead'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? '12वीं पास / बेसिक कंप्यूटर ज्ञान' : '12th Pass / Basic Computer Knowledge'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'वार्षिक इंसेंटिव व बोनस सुविधा' : 'Annual Performance Incentive & Bonus'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'फील्ड ऑफिसर बनने का स्पष्ट अवसर' : 'Fast Path to Field Officer Promotion'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200">
                  <Link
                    to="/apply/security-supervisor"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all text-center"
                  >
                    <span>{isHindi ? 'सुपरवाइजर पद के लिए आवेदन करें' : 'Apply for Supervisor (Free)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      {isHindi ? 'लेवल 03 · हथियारबंद व वीआईपी' : 'Tier 03 · Armed & Specialist'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Licenced / Ex-Def</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? 'आर्म्ड गार्ड, गनमैन व बाउंसर' : 'Armed Guard, Gunman & Bouncer'}
                  </h3>
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {isHindi ? 'मासिक वेतन (Monthly Salary)' : 'Estimated Monthly Earnings'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">₹20,000 – ₹35,000</p>
                    <span className="text-xs font-semibold text-emerald-700 block mt-1">
                      {isHindi ? 'वेतन व भत्ते साइट व कंपनी नियमानुसार' : 'Wages & benefits as per employer/site policy'}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'वैध गन लाइसेंस या भूतपूर्व सैनिक प्राथमिकता' : 'Valid Gun Licence or Ex-Servicemen'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'बैंक, करेंसी चेस्ट, रॉयल वेडिंग व वीआईपी सुरक्षा' : 'Banks, Currency Vaults & Royal Venues'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'मासिक हथियार भत्ता व ठहरने की सुविधा' : 'Monthly Weapon Allowance & Stay Support'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'उच्च मान-सम्मान व सुरक्षित कार्य स्थल' : 'High Respect & Permanent Placements'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-200">
                  <Link
                    to="/apply/armed-guard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all text-center"
                  >
                    <span>{isHindi ? 'आर्म्ड गार्ड के लिए आवेदन करें' : 'Apply for Armed Role (Free)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Platform Highlights Banner */}
            <div className="mt-10 sm:mt-12 p-5 sm:p-7 rounded-3xl bg-slate-900 text-white grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">₹0 Fee</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{isHindi ? 'शून्य रजिस्ट्रेशन शुल्क' : '100% Free Registration'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-400">Direct Apply</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{isHindi ? 'सीधा ऑनलाइन आवेदन' : 'Direct Online Application'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">11+ Roles</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{isHindi ? 'विभिन्न सुरक्षा पद' : 'Diverse Security Roles'}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-purple-400">33 Districts</p>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{isHindi ? 'पूरे राजस्थान में अवसर' : 'Jobs Across Rajasthan'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCREEN 2: DEPLOYMENT SECTORS & WORK ENVIRONMENTS IN RAJASTHAN */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8 sm:mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {isHindi ? 'कार्य स्थल व सेक्टर (Duty Sectors)' : 'Where Will You Work?'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-0.5">
                  {isHindi ? 'राजस्थान में सुरक्षित व प्रतिष्ठित कार्य स्थल' : 'Verified Duty Sectors Across Rajasthan'}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-1.5 max-w-2xl">
                  {isHindi
                    ? 'बिना किसी दलाल के सीधे प्रतिष्ठित फैक्ट्रियों, आईटी पार्कों, महलों, हॉस्पिटलों व बैंकों में नियुक्ति।'
                    : 'Get deployed in safe, structured environments with verified corporate and industrial employers.'}
                </p>
              </div>

              <Link
                to="/roles"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-blue-600 bg-white border border-slate-200 hover:bg-blue-50 transition-all shadow-2xs shrink-0 self-start md:self-auto"
              >
                <span>{isHindi ? 'सभी पद देखें (Explore Roles)' : 'Explore All Roles'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6 Grid Sector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Sector 1 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Factory className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'RIICO औद्योगिक क्षेत्र व फैक्ट्रियां' : 'RIICO Industrial Hubs & Plants'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'भिवाड़ी, नीमराना (जापानी ज़ोन), सीतापुरा (जयपुर) व जोधपुर बोरनाडा के विनिर्माण संयंत्रों में गेट सुरक्षा व पैट्रोलिंग।'
                    : 'Factory entry gates, vehicle registers, material movement security across Bhiwadi, Neemrana, Sitapura, and Jodhpur.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'आवास व मेस सुविधा उपलब्ध' : 'Accommodation Assistance Available'}</span>
                </div>
              </div>

              {/* Sector 2 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'कॉर्पोरेट ऑफिस व आईटी पार्क' : 'Corporate IT Parks & SEZs'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'महिंद्रा वर्ल्ड सिटी (जयपुर), मालवीय नगर व टोंक रोड के प्रमुख कॉर्पोरेट परिसरों में रिसेप्शन व डिजिटल एक्सेस कंट्रोल।'
                    : 'Mahindra World City SEZ, Malviya Nagar & commercial complexes. Air-conditioned lobbies and visitor badge control.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'सम्मानजनक व साफ-सुथरा माहौल' : 'Professional & Respectful Workplaces'}</span>
                </div>
              </div>

              {/* Sector 3 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Hotel className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'रॉयल पैलेस, रिसॉर्ट्स व हेरिटेज होटल' : 'Heritage Palaces & 5-Star Resorts'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'उदयपुर लेक सिटी, जयपुर आमेर/कूकस, जोधपुर व पुष्कर के हेरिटेज होटलों में हॉस्पिटैलिटी व वीआईपी सुरक्षा।'
                    : 'Luxury hospitality venues, destination weddings, royal palaces across Udaipur, Jaipur, Jodhpur, and Pushkar.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'ड्यूटी के दौरान भोजन सुविधा' : 'Duty Meals & High-Tier Payouts'}</span>
                </div>
              </div>

              {/* Sector 4 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'हॉस्पिटल्स व मेडिकल संस्थान' : 'Hospitals & Healthcare Campuses'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'एसएमएस मेडिकल, एम्स जोधपुर व निजी सुपर-स्पेशियलिटी अस्पतालों में सुरक्षा। लेडी गार्ड्स के लिए सुरक्षित डे-शिफ्ट उपलब्ध।'
                    : 'SMS Hospital network, AIIMS Jodhpur, and top private medical institutes. Safe day-shifts preferred for lady guards.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'लेडी गार्ड्स के लिए सबसे सुरक्षित' : 'Safe Environment for Female Guards'}</span>
                </div>
              </div>

              {/* Sector 5 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'बैंक, करेंसी चेस्ट व ज्वेलरी शोरूम' : 'Banks, Currency Chests & Vaults'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'बैंक शाखाओं, एटीएम वॉल्ट्स व कैश लॉजिस्टिक्स वैन में हथियारबंद सुरक्षा। नियमित हथियार रखरखाव भत्ता।'
                    : 'Nationalized and private banks, gold loan branches, and cash management logistics across Rajasthan districts.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'गनमैन हेतु उच्च मासिक मानदेय' : 'Licensed Gunman Special Allowance'}</span>
                </div>
              </div>

              {/* Sector 6 */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {isHindi ? 'गेटेड टाउनशिप व रेजिडेंशियल सोसाइटी' : 'Gated Townships & Premium Societies'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'वैशाली नगर, मानसरोवर, जगतपुरा व कोटा की बड़ी कॉलोनियों में गेट सुरक्षा, बूम बैरियर व सीसीटीवी निगरानी।'
                    : 'Gated residential complexes, society entry gates, boom barriers, and visitor smartphone app check-ins.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'आरामदायक सिटिंग व शिफ्ट ड्यूटी' : 'Comfortable Cabin & Scheduled Shifts'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCREEN 3: ZERO MIDDLEMAN FRAUD PROTECTION & REAL GUARD EXPERIENCES */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Anti-Fraud Comparison Card */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 mb-12 shadow-md">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 mb-3">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {isHindi ? 'सावधान: दलालों व फर्जी एजेंटों से बचें' : 'Notice: Beware of Fake Middlemen & Job Fraud'}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                  {isHindi ? 'SecurityJob.in पर 100% फ्री जॉइनिंग — किसी को ₹1 भी न दें' : 'Direct Employer Hiring — Zero Fees Forever'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  {isHindi
                    ? 'नौकरी के नाम पर वर्दी, मेडिकल या इंटरव्यू फीस मांगना गैरकानूनी है। हमारी पूरी प्रक्रिया हमेशा मुफ्त है।'
                    : 'We connect job seekers directly to licensed security agencies. We never charge registration fees, uniform fees, or commission.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-red-950/40 border border-red-800/40 space-y-2.5">
                  <h3 className="font-bold text-red-300 text-sm sm:text-base flex items-center gap-2">
                    <span>❌</span> {isHindi ? 'दलाल व अनवेरिफाइड एजेंट (Fraud)' : 'Unverified Middlemen & Fake Agents'}
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>• ₹2,000 – ₹5,000 रजिस्ट्रेशन या वर्दी के नाम पर मांगते हैं</li>
                    <li>• हर महीने वेतन में से अवैध कमीशन काटते हैं</li>
                    <li>• न कोई PF कटता है, न ही ESIC मेडिकल कार्ड मिलता है</li>
                    <li>• काम के बाद बिना वेतन दिए साइट से निकाल देते हैं</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 space-y-2.5">
                  <h3 className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {isHindi ? 'SecurityJob.in की पारदर्शी व्यवस्था (Genuine)' : 'SecurityJob.in Verified & Free Standard'}
                  </h3>
                  <ul className="text-xs text-slate-200 space-y-1.5 leading-relaxed">
                    <li>• 100% फ्री रजिस्ट्रेशन — शून्य फीस, शून्य कमीशन हमेशा</li>
                    <li>• पारदर्शी वेतन भुगतान व्यवस्था (बैंक या नकद) का समर्थन</li>
                    <li>• नियोक्ता नियमानुसार वैधानिक भत्तों की स्पष्ट जानकारी</li>
                    <li>• लाइसेंस प्राप्त (PSARA) कंपनियों में सुरक्षित कार्य अवसर</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Guard Testimonials */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'उम्मीदवारों की आवाज (Candidate Stories)' : 'Real Guard Experiences'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {isHindi ? 'राजस्थान के जवानों के सच्चे अनुभव' : 'Trusted by Security Personnel Across Rajasthan'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{isHindi
                    ? 'पहले एक दलाल ने मुझसे ₹2,500 मांगे थे। SecurityJob.in पर मैंने मोबाइल से फ्री फॉर्म भरा और 3 दिन में नीमराना जापानी ज़ोन में ₹18,500 वेतन पर गार्ड ड्यूटी मिल गई। PF भी कट रहा है।'
                    : 'A local agent asked me ₹2,500 for a guard placement. On SecurityJob.in, I applied free from my phone and joined duty in Neemrana within 3 days. Salary is credited on time with PF.'}"
                </p>
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="font-bold text-slate-900 text-sm">Surendra Gurjar</p>
                  <p className="text-[11px] text-slate-500">Security Guard · Neemrana Industrial Hub (Alwar)</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{isHindi
                    ? 'जयपुर के निजी अस्पताल में लेडी गार्ड पद पर जॉइनिंग हुई। दिन की शिफ्ट है, काम सुरक्षित है और पहले ही महीने में ESIC कार्ड बन गया। कोई फीस नहीं लगी।'
                    : 'Joined as a Lady Security Guard at a private hospital in Jaipur. Safe day-shifts, respectful staff, and got my ESIC medical card in the very first month. Zero charges.'}"
                </p>
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="font-bold text-slate-900 text-sm">Priyanka Sharma</p>
                  <p className="text-[11px] text-slate-500">Lady Security Guard · Malviya Nagar (Jaipur)</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{isHindi
                    ? 'आर्मी से रिटायरमेंट के बाद गनमैन की भर्ती देखी। सीधे बैंक करेंसी चेस्ट में तैनाती मिली। ₹28,000 मासिक वेतन और हथियार भत्ते की पारदर्शी व्यवस्था रही।'
                    : 'After army service, I applied for an armed guard position. Got placed at a bank branch in Jodhpur with ₹28,000 monthly pay + weapon allowance. Smooth and transparent process.'}"
                </p>
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="font-bold text-slate-900 text-sm">Subedar (Retd.) Ranveer Singh</p>
                  <p className="text-[11px] text-slate-500">Armed Security Gunman · Jodhpur</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FEATURED JOB VACANCIES IN RAJASTHAN (Hidden temporarily - remove 'hidden' to revive) */}
        {/* ========================================================================= */}
        <section className="hidden py-12 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {isHindi ? 'वर्तमान रिक्तियां (Active Vacancies)' : 'Active Vacancies in Rajasthan'}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {isHindi ? 'राजस्थान में तत्काल भर्ती पद' : 'Urgent Security Job Openings'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isHindi
                    ? 'वेरिफाइड जॉब ओपनिंग्स — निश्चित मासिक वेतन व तुरंत जॉइनिंग।'
                    : 'Verified security job openings with confirmed monthly salary and immediate deployment.'}
                </p>
              </div>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-all shadow-2xs shrink-0 self-start md:self-auto"
              >
                {isHindi ? `सभी ${JOBS_CATALOG.length} पद देखें` : `View All ${JOBS_CATALOG.length} Roles`}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {FEATURED_JOB_ROLES.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. WHY GUARDS & JOB SEEKERS CHOOSE US */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'उम्मीदवारों के लाभ (Benefits)' : 'Candidate Advantages'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {isHindi ? 'SecurityJob.in पर आवेदन क्यों करें?' : 'Why Apply on SecurityJob.in?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isHindi
                  ? 'हम सुरक्षा जवानों को धोखाधड़ी और दलालों से बचाते हैं।'
                  : 'We protect security workers from unverified middlemen and help you start a dependable career.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {employeeBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 sm:space-y-3 card-hover-effect"
                  >
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 4-STEP CANDIDATE APPLICATION PROCESS */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'आसान 4 चरण' : 'Simple 4 Steps'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {isHindi ? 'जॉब पाने का आसान तरीका' : 'How to Get Hired in 4 Easy Steps'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isHindi
                  ? 'मोबाइल से आवेदन करने से लेकर ड्यूटी स्थल पर जॉइनिंग तक।'
                  : 'From mobile application to site joining in just a few days.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {candidateSteps.map((s) => (
                <div
                  key={s.step}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 sm:space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-blue-100 inline-block mb-2 sm:mb-3">
                      {isHindi ? `चरण ${s.step}` : `STEP ${s.step}`}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 text-center">
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span>{isHindi ? 'फ्री आवेदन फॉर्म शुरू करें (Apply Now)' : 'Start Free Candidate Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. RAJASTHAN DISTRICTS & INDUSTRIAL ZONES */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'राजस्थान के प्रमुख जिले (Rajasthan Locations)' : 'Jobs by Rajasthan Location'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {isHindi ? 'जिलेवार सिक्योरिटी रिक्तियां' : 'Security Vacancies Across Rajasthan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isHindi
                  ? 'अपने नजदीकी जिले या औद्योगिक क्षेत्र में उपलब्ध पद देखें।'
                  : 'Explore active vacancies in your home district or industrial zone.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {rajasthanTopCities.map((loc) => (
                <Link
                  key={loc.name}
                  to={`/jobs?city=${encodeURIComponent(loc.name.split(' ')[0])}`}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md hover:bg-white hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-600 mb-1 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{loc.state}</span>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 mt-1">{loc.openings}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CLOSING CANDIDATE CTA */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-slate-50 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-3.5 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isHindi ? '100% फ्री आवेदन · कोई चार्ज नहीं' : '100% Free Application · Zero Charges'}
            </span>

            <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900">
              {isHindi
                ? 'आज ही अपना फ्री फॉर्म भरें और राजस्थान में जॉब पाएं!'
                : 'Ready to Start Your Security Career in Rajasthan?'}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {isHindi
                ? 'अपने मोबाइल से 2 मिनट में फॉर्म पूरा करें। हमारे प्रतिनिधि द्वारा आपको जल्द ही संपर्क किया जाएगा।'
                : 'Complete your free registration in just 2 minutes on your mobile. Start receiving matching security job opportunities in Rajasthan.'}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <span>{isHindi ? 'ऑनलाइन फॉर्म भरें (Apply Free)' : 'Apply for Security Job (Free)'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all shadow-2xs"
              >
                <Briefcase className="w-4 h-4" />
                <span>{isHindi ? 'सभी 19 पद देखें' : 'Browse All 19 Roles'}</span>
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
