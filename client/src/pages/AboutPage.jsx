import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Target, 
  Eye, 
  Building2, 
  HeartHandshake,
  Building,
  MapPin,
  Phone,
  Mail,
  FileCheck
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function AboutPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const stats = [
    { value: '11+', label: isHindi ? 'प्रमुख सिक्योरिटी जॉब पद' : 'Core Security Roles' },
    { value: '₹0', label: isHindi ? 'कैंडिडेट रजिस्ट्रेशन फीस' : 'Candidate Registration Fee' },
    { value: '33+', label: isHindi ? 'राजस्थान के जिले' : 'Rajasthan Districts' },
    { value: '< 2 min', label: isHindi ? 'ऑनलाइन आवेदन का समय' : 'Online Application Time' },
  ];

  const values = isHindi
    ? [
        {
          icon: ShieldCheck,
          title: 'सुरक्षा उद्योग पर विशेष ध्यान',
          desc: 'हम विशेष रूप से प्राइवेट सिक्योरिटी उद्योग के लिए बने हैं — बिना किसी भटकाव के सीधी और पारदर्शी भर्ती।',
        },
        {
          icon: HeartHandshake,
          title: 'उम्मीदवारों के लिए 100% फ्री',
          desc: 'जॉब ढूंढने वाले युवाओं से कभी भी कोई फीस या कमीशन नहीं लिया जाता। हम बिचौलियों के शोषण को समाप्त करते हैं।',
        },
        {
          icon: Building2,
          title: 'वेरिफाइड व विश्वसनीय एम्प्लॉयर्स',
          desc: 'हम केवल लाइसेंस प्राप्त व कानूनी रूप से मान्यता प्राप्त सिक्योरिटी कंपनियों से जुड़ते हैं जो समय पर PF व ESIC देती हैं।',
        },
        {
          icon: Award,
          title: 'कैरियर विकास और सम्मान',
          desc: 'हम मानते हैं कि सुरक्षा एक सम्मानजनक पेशा है, जहाँ गार्ड से लेकर सुपरवाइजर व फील्ड ऑफिसर बनने के पूरे अवसर हैं।',
        },
      ]
    : [
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
        title={isHindi ? "हमारे बारे में — Avijit Enterprises | SecurityJob.in राजस्थान" : "About Us — Avijit Enterprises | SecurityJob.in Rajasthan"}
        description={isHindi ? "SecurityJob.in (Avijit Enterprises, जयपुर) के बारे में जानें — हमारा मिशन, विज़न, सरकारी एमएसएमई पंजीकरण और राजस्थान में सुरक्षा कर्मियों के लिए प्रतिबद्धता।" : "Learn about SecurityJob.in (Avijit Enterprises, Jaipur) — our mission, vision, Govt MSME registration, and commitment to security recruitment in Rajasthan."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-24 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? 'SecurityJob.in के बारे में' : 'About SecurityJob.in'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {isHindi 
                ? 'राजस्थान के सुरक्षा उद्योग के लिए समर्पित भर्ती प्लेटफ़ॉर्म' 
                : "A Dedicated Recruitment Platform for the Security Industry"}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {isHindi
                ? 'सिक्योरिटी गार्ड, सुपरवाइजर, लेडी गार्ड, गनमैन व फील्ड ऑफिसर्स को राजस्थान की प्रमाणित कंपनियों व प्रोजेक्ट्स से सीधे जोड़ना।'
                : 'Connecting security guards, supervisors, gunmen, and management personnel with verified employers and facility contracts across Rajasthan.'}
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
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isHindi ? 'हमारा मिशन (Our Mission)' : 'Our Mission'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'सिक्योरिटी क्षेत्र में बिचौलियों, कमीशन और भर्ती में होने वाली देरी को समाप्त करना और उम्मीदवारों को 100% फ्री, पारदर्शी व मोबाइल-आधारित जॉइनिंग सुविधा देना।'
                    : 'To eliminate exploitation, middlemen fees, and recruitment delays in the private security sector by providing a fast, transparent, and mobile-first hiring bridge between workers and employers.'}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isHindi ? 'हमारा विज़न (Our Vision)' : 'Our Vision'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'राजस्थान व पूरे भारत में सुरक्षा कर्मियों के लिए सबसे भरोसेमंद रोजगार मंच बनना, सुरक्षा मानकों को ऊंचा उठाना और हर गार्ड के काम को सम्मान दिलाना।'
                    : "To become India's most trusted employment ecosystem for security personnel, elevating workforce standards, accelerating agency deployments, and championing worker dignity across the country."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Entity & MSME Registration Profile */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                    {isHindi ? 'कंपनी परिचय व पंजीकरण' : 'Corporate Governance'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    Govt. MSME Registered
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Powered By AVIJIT ENTERPRISES
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    {isHindi
                      ? 'SecurityJob.in का संचालन AVIJIT ENTERPRISES द्वारा किया जाता है, जो भारत सरकार के सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME) में पंजीकृत एक अधिकृत उद्यम है।'
                      : 'SecurityJob.in is proudly operated and managed by AVIJIT ENTERPRISES, an authorized proprietary enterprise registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India.'}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-xs">{isHindi ? 'पंजीकृत कार्यालय पता' : 'Registered Office Address'}</span>
                      <p className="text-white font-medium">159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                  <a href="tel:+919828044998" className="inline-flex items-center gap-1.5 hover:text-white">
                    <Phone className="w-4 h-4 text-blue-400" />
                    +91 98280 44998
                  </a>
                  <span>&middot;</span>
                  <a href="mailto:bansalvicky738@gmail.com" className="inline-flex items-center gap-1.5 hover:text-white">
                    <Mail className="w-4 h-4 text-blue-400" />
                    bansalvicky738@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'हमारे मुख्य सिद्धांत' : 'Core Principles'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {isHindi ? 'हम किन मूल्यों के लिए खड़े हैं' : 'What We Stand For'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="p-6 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4 shadow-2xs">
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
        <section className="py-16 sm:py-20 bg-white text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              {isHindi ? 'क्या आप सिक्योरिटी जॉब के लिए तैयार हैं?' : 'Ready to Join the SecurityJob Network?'}
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              {isHindi
                ? 'अभी अपना फ्री ऑनलाइन फॉर्म भरें या राजस्थान में उपलब्ध जॉब्स देखें।'
                : 'Whether you are an aspiring candidate or a hiring employer, get started today.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                {isHindi ? 'ऑनलाइन फॉर्म भरें (Apply Free)' : 'Apply for a Security Job'}
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs"
              >
                {isHindi ? 'सभी जॉब्स देखें (View Roles)' : 'Browse Security Openings'}
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
