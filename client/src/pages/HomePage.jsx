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
  FileCheck2
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
          title: 'बैंक खाते में वेतन + PF व ESIC',
          desc: 'महीने की 7 से 10 तारीख तक सीधा बैंक खाते में वेतन, साथ में सरकारी PF और ESIC मेडिकल कार्ड सुविधा।',
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
          title: 'Direct Bank Salary + PF & ESIC',
          desc: 'Monthly salary deposited directly into your bank account on time, with full PF and ESIC medical benefits.',
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
            return ['security-guard', 'lady-security-guard', 'armed-guard', 'bouncer', 'bodyguard', 'gunman', 'event-security-guard', 'dog-handler'].includes(r.slug);
          }
          if (selectedCategory === 'Supervisory & Ops') {
            return ['security-supervisor', 'field-officer', 'facility-supervisor', 'security-inspector', 'security-manager'].includes(r.slug);
          }
          if (selectedCategory === 'Technical & Control') {
            return ['cctv-operator', 'control-room-operator', 'fire-marshal'].includes(r.slug);
          }
          if (selectedCategory === 'Specialized & Logistics') {
            return ['cash-van-driver', 'atm-custodian', 'housekeeping-staff'].includes(r.slug);
          }
          return true;
        });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "SecurityJob.in — राजस्थान सिक्योरिटी गार्ड व सुपरवाइजर भर्ती 2026 (100% फ्री आवेदन)" : "SecurityJob.in — Find Security Guard & Security Staff Jobs in Rajasthan (100% Free)"}
        description={isHindi ? "राजस्थान के सभी जिलों (जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, नीमराना आदि) में सिक्योरिटी गार्ड भर्ती। ₹0 फीस, सीधा ऑनलाइन आवेदन।" : "Apply for verified Security Guard, Supervisor, Lady Guard, and CCTV Operator jobs across Rajasthan (Jaipur, Jodhpur, Udaipur, Kota, Alwar, Neemrana). 100% Free candidate registration."}
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
                    राजस्थान में सिक्योरिटी जॉब्स & <span className="text-blue-600">सीधी भर्ती</span>
                  </>
                ) : (
                  <>
                    Security Jobs in Rajasthan & <span className="text-blue-600">Direct Joining</span>
                  </>
                )}
              </h1>

              {/* Sub-headline */}
              <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {isHindi
                  ? 'जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, नीमराना आदि में सिक्योरिटी गार्ड, सुपरवाइजर व सीसीटीवी ऑपरेटर की भर्ती। ₹0 फीस, सरकारी PF व ESIC सुविधा।'
                  : 'Apply for verified Security Guard, Supervisor, Lady Guard, and CCTV Operator jobs across Jaipur, Jodhpur, Udaipur, Kota, Alwar, and Neemrana. ₹0 fees, statutory PF & ESIC benefits.'}
              </p>

              {/* Prominent Apply Now Hero Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <Link
                  to="/apply/security-guard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isHindi ? 'ऑनलाइन फॉर्म भरें (Apply Now)' : 'Apply Now (100% Free)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs"
                >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>{isHindi ? 'सभी पद देखें (View Roles)' : 'Browse 19+ Roles'}</span>
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
                  {isHindi ? '19+ सिक्योरिटी पद' : '19+ Security Roles'}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  {isHindi ? 'राजस्थान के 33+ जिले' : '33+ Rajasthan Districts'}
                </span>
              </div>

              {/* Interactive Search Component */}
              <div className="pt-2 max-w-4xl mx-auto">
                <JobSearchHero />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECURITY CATEGORIES (19 Roles in Rajasthan) */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {isHindi ? 'जॉब पद सूची (Job Catalog)' : 'Job Role Catalog'}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {isHindi ? 'राजस्थान में 19+ सिक्योरिटी जॉब श्रेणियां' : 'Explore Security Roles in Rajasthan'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isHindi
                    ? 'अपनी पसंद का पद चुनें, वेतन देखें और 2 मिनट में फ्री फॉर्म भरें।'
                    : 'Choose a role to check salary details, qualifications, and submit your free application.'}
                </p>
              </div>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0"
              >
                <span>{isHindi ? 'सभी पद देखें' : 'Browse All 19 Roles'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {['All', 'Guarding & Field', 'Supervisory & Ops', 'Technical & Control', 'Specialized & Logistics'].map((cat) => (
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
                  {cat === 'All' ? (isHindi ? 'सभी पद' : 'All Roles') : cat}
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
        {/* 3. FEATURED JOB VACANCIES IN RAJASTHAN */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200/80">
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
                <Sparkles className="w-4 h-4 text-white" />
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
                <Sparkles className="w-4 h-4" />
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
