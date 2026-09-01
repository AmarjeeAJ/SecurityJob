import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Database, 
  Scale, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LAST_UPDATED = 'September 1, 2026';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919929992886';

export default function PrivacyPolicyPage() {
  useNoIndex();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeSection, setActiveSection] = useState('introduction');
  const [tocOpen, setTocOpen] = useState(false);

  const SECTIONS = [
    { id: 'introduction', title: isHindi ? '1. प्रस्तावना व कार्यक्षेत्र' : '1. Introduction & Scope', icon: FileText },
    { id: 'information-we-collect', title: isHindi ? '2. एकत्र की जाने वाली जानकारी' : '2. Information You Provide', icon: Database },
    { id: 'how-we-use', title: isHindi ? '3. जानकारी का उपयोग' : '3. How We Use Your Data', icon: Users },
    { id: 'tracking', title: '4. Advertising & Traffic Attribution', icon: Eye },
    { id: 'sharing', title: isHindi ? '5. प्रमाणित नियोक्ताओं से साझाकरण' : '5. Sharing With Verified Employers', icon: Building },
    { id: 'security', title: isHindi ? '6. डेटा सुरक्षा उपाय' : '6. How We Protect Your Data', icon: Lock },
    { id: 'retention', title: isHindi ? '7. डेटा संरक्षण अवधि' : '7. Data Retention Policy', icon: Database },
    { id: 'rights', title: isHindi ? '8. उम्मीदवार के अधिकार' : '8. Your Rights as a Candidate', icon: Scale },
    { id: 'children', title: isHindi ? '9. आयु व पात्रता मानक' : '9. Age & Industry Eligibility', icon: ShieldCheck },
    { id: 'changes', title: isHindi ? '10. नीति में संशोधन' : '10. Policy Updates & Versioning', icon: FileText },
    { id: 'contact', title: isHindi ? '11. आधिकारिक सहायता डेस्क' : '11. Official Contact Desk', icon: HelpCircle },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [language]);

  function goToSection(id) {
    setTocOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "गोपनीयता नीति (Privacy Policy) — SecurityJob.in | Avijit Enterprises" : "Privacy Policy & Candidate Data Protection — SecurityJob.in | Avijit Enterprises"}
        description={isHindi ? "SecurityJob.in (Avijit Enterprises) की गोपनीयता नीति जानें — हम उम्मीदवारों का डेटा कैसे सुरक्षित रखते हैं, कोई फीस नहीं लेते और सीधी भर्ती सुनिश्चित करते हैं।" : "Learn how SecurityJob.in (Avijit Enterprises) collects, protects, and handles candidate information with strict security and privacy standards."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-light-hero border-b border-slate-200/80 pt-12 pb-16 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              {isHindi ? 'कानूनी अनुपालन व डेटा सुरक्षा' : 'Legal Compliance & Data Protection'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {isHindi ? 'गोपनीयता एवं डेटा सुरक्षा नीति' : 'Privacy & Data Protection Policy'}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {isHindi ? `अंतिम अद्यतन: ${LAST_UPDATED}` : `Last Updated: ${LAST_UPDATED}`} &middot; {isHindi ? 'लागू: SecurityJob.in एवं Avijit Enterprises' : 'Governing: SecurityJob.in & Avijit Enterprises'}
            </p>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
              {isHindi
                ? 'SecurityJob.in राजस्थान के सुरक्षा कर्मियों को प्रमाणित सिक्योरिटी कंपनियों से जोड़ने का 100% फ्री प्लेटफ़ॉर्म है। यह पृष्ठ सरल शब्दों में समझाता है कि आपकी जानकारी कैसे सुरक्षित रखी जाती है।'
                : 'SecurityJob.in helps security guards and security professionals connect with verified employers across Rajasthan. This document explains, in plain language, how your personal information is collected, stored, and protected.'}
            </p>

            {/* 3 High-Trust Highlight Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isHindi ? 'उम्मीदवारों के लिए ₹0 फीस' : '₹0 Candidate Charges'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Lock className="w-4 h-4 text-blue-600" />
                {isHindi ? 'SSL/TLS 1.3 एन्क्रिप्टेड' : 'TLS 1.3 Encrypted'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                {isHindi ? 'डेटा कभी नहीं बेचा जाता' : 'No Data Reselling'}
              </span>
            </div>
          </div>
        </section>

        {/* Mobile Collapsible Table of Contents */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:hidden">
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setTocOpen(!tocOpen)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-bold text-slate-900 bg-slate-50/80 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {isHindi ? 'विषय सूची (Table of Contents)' : 'Table of Contents'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
            </button>
            {tocOpen && (
              <nav className="p-3 border-t border-slate-100 space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSection(s.id)}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      activeSection === s.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            
            {/* Desktop Sticky Sidebar (4 cols) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
                  {isHindi ? 'अनुभाग नेविगेशन' : 'Sections Navigation'}
                </h3>
                <nav className="space-y-1">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    const isSelected = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => goToSection(s.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{s.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Help Desk Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isHindi ? 'डेटा संबंधी सवाल?' : 'Have Data Questions?'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isHindi ? 'सीधे सपोर्ट डेस्क से बात करें' : 'Contact candidate desk'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHindi
                    ? 'यदि आप अपनी जानकारी अपडेट या हटाना चाहते हैं, तो हमारी हेल्पलाइन पर संपर्क करें।'
                    : 'To request data deletion, profile updates, or inquiries regarding privacy, connect with our support desk.'}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isHindi ? 'नमस्ते, मुझे SecurityJob प्राइवेसी पॉलिसी के संबंध में सहायता चाहिए।' : 'Hello, I have a question regarding the SecurityJob Privacy Policy.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isHindi ? 'WhatsApp सहायता' : 'WhatsApp Helpdesk'}
                </a>
              </div>
            </aside>

            {/* Policy Content Card (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10 text-slate-700 text-sm leading-relaxed">
              
              {/* Section 1: Introduction */}
              <section id="introduction" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '1. प्रस्तावना व कार्यक्षेत्र (Introduction & Scope)' : '1. Introduction & Scope'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    SecurityJob.in (&ldquo;हम&rdquo;, &ldquo;प्लेटफ़ॉर्म&rdquo;) का संचालन <strong>AVIJIT ENTERPRISES</strong> (पंजीकृत कार्यालय: 159, आनंद नगर, सिरसी रोड, वैशाली नगर, जयपुर, राजस्थान – 302021) द्वारा किया जाता है। हमारा मुख्य उद्देश्य राजस्थान में सुरक्षा गार्डों, सुपरवाइजरों, गनमैन और सुरक्षा कर्मियों को सीधे और पारदर्शी रूप से रोजगार के अवसरों से जोड़ना है।
                  </p>
                ) : (
                  <p>
                    SecurityJob.in (&ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated by <strong>AVIJIT ENTERPRISES</strong> (Registered Office: 159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021). Our primary objective is to connect security guards, supervisors, gunmen, and security personnel across Rajasthan directly and transparently with verified employment opportunities.
                  </p>
                )}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs font-semibold leading-relaxed">
                  💡 <strong>{isHindi ? 'मुख्य आश्वासन:' : 'Key Assurance:'}</strong> {isHindi ? 'SecurityJob.in किसी भी उम्मीदवार से किसी भी प्रकार की रजिस्ट्रेशन फीस, कमीशन या फॉर्म चार्ज नहीं लेता। यह प्लेटफ़ॉर्म सभी नौकरी तलाशने वाले सुरक्षा कर्मियों के लिए 100% निःशुल्क है।' : 'SecurityJob.in never charges candidates any registration fee, commission, or processing fee. This platform is 100% free for all job seekers.'}
                </div>
              </section>

              {/* Section 2: Information You Provide */}
              <section id="information-we-collect" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '2. एकत्र की जाने वाली जानकारी (Information You Provide)' : '2. Information You Provide'}
                  </h2>
                </div>
                <p>
                  {isHindi
                    ? 'जब आप हमारा ऑनलाइन आवेदन फॉर्म भरते हैं, तो हम केवल वही जानकारी एकत्र करते हैं जो रोजगार मिलान और सत्यापन के लिए आवश्यक है:'
                    : 'When you register through our application form, we only collect information essential for employment matching and verification:'}
                </p>
                {isHindi ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li><strong>व्यक्तिगत पहचान:</strong> पूरा नाम, उम्र (18–65 वर्ष), और लिंग।</li>
                    <li><strong>संपर्क विवरण:</strong> 10-अंकीय मोबाइल नंबर और WhatsApp नंबर (नौकरी अलर्ट व साक्षात्कार कॉल के लिए)।</li>
                    <li><strong>स्थान प्राथमिकता:</strong> वर्तमान शहर, इलाका/मोहल्ला, और काम करने के लिए पसंदीदा जिले (उदा. जयपुर, जोधपुर, कोटा, अलवर)।</li>
                    <li><strong>कैरियर व अनुभव:</strong> पसंदीदा पद (गार्ड, सुपरवाइजर, गनमैन आदि), कार्य अनुभव (महीनों में), और पूर्व कंपनी।</li>
                    <li><strong>दस्तावेज (वैकल्पिक):</strong> आधार कार्ड या पहचान दस्तावेज (केवल आयु व पता सत्यापन के लिए सुरक्षित रूप से अपलोड)।</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li><strong>Personal Identity:</strong> Full name, age (18–65 years), and gender.</li>
                    <li><strong>Contact Details:</strong> 10-digit mobile number and WhatsApp number (for job alerts and interview calls).</li>
                    <li><strong>Location Preferences:</strong> Current city, locality/area, and preferred job locations across Rajasthan (e.g., Jaipur, Jodhpur, Kota, Alwar).</li>
                    <li><strong>Career & Experience:</strong> Preferred job roles (Guard, Supervisor, Gunman, etc.), work experience (in months), and previous company.</li>
                    <li><strong>Identification Document (Optional):</strong> Aadhaar card or identity document (securely uploaded solely for age and identity verification).</li>
                  </ul>
                )}
              </section>

              {/* Section 3: How We Use Your Data */}
              <section id="how-we-use" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '3. डेटा का उपयोग (How We Use Your Information)' : '3. How We Use Your Information'}
                  </h2>
                </div>
                <p>
                  {isHindi
                    ? 'आपके द्वारा प्रदान की गई जानकारी का उपयोग निम्नलिखित वैध उद्देश्यों के लिए किया जाता है:'
                    : 'The information you submit is used exclusively for the following recruitment purposes:'}
                </p>
                {isHindi ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>आपकी योग्यता और जिले के अनुसार उचित सुरक्षा नौकरी में आपका चयन करना।</li>
                    <li>साक्षात्कार, जॉइनिंग और ड्यूटी विवरण के लिए आपको फोन, WhatsApp या SMS द्वारा सूचित करना।</li>
                    <li>यदि आप पुनः फॉर्म भरते हैं, तो नया डुप्लिकेट खाता बनाने के बजाय आपके मौजूदा प्रोफाइल को अपडेट करना।</li>
                    <li>सुरक्षा एजेंसियों और नियोक्ताओं द्वारा समय पर वेतन, PF और ESIC का अनुपालन सुनिश्चित करना।</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>Matching and considering your profile for verified security job opportunities suited to your location and qualifications.</li>
                    <li>Contacting you via phone call, WhatsApp, or SMS regarding interview schedules, joining dates, and location details.</li>
                    <li>Updating your existing profile when you submit new information rather than creating duplicate accounts.</li>
                    <li>Ensuring statutory compliance (such as timely wage disbursement, PF, and ESIC benefits) with hiring security employers.</li>
                  </ul>
                )}
              </section>

              {/* Section 4: Advertising & Attribution */}
              <section id="tracking" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '4. विज्ञापनों की ट्रैकिंग (Advertising & Attribution)' : '4. Advertising & Traffic Attribution'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    यदि आप Facebook, Instagram या Google विज्ञापन पर क्लिक करके आते हैं, तो हमारा सिस्टम केवल अभियान का नाम और रेफरल स्रोत रिकॉर्ड करता है ताकि हम समझ सकें कि कौन सा चैनल अधिक उम्मीदवारों तक पहुँचने में मदद कर रहा है। यह तकनीकी डेटा आपके नौकरी चयन को प्रभावित नहीं करता।
                  </p>
                ) : (
                  <p>
                    When you visit through online promotions (such as Meta or Google ads), our system records standard traffic attribution (such as campaign name and referral source) to measure recruitment reach. This technical data does not affect your hiring eligibility.
                  </p>
                )}
              </section>

              {/* Section 5: Sharing With Employers */}
              <section id="sharing" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '5. डेटा साझाकरण (Sharing With Verified Employers)' : '5. Sharing With Verified Employers'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    हम उम्मीदवारों का डेटा किसी भी बाहरी मार्केटिंग कंपनी या टेलीकॉलर को कभी नहीं बेचते। आपका विवरण केवल उन प्रमाणित सुरक्षा कंपनियों व नियोक्ताओं के साथ साझा किया जाता है जिनके पास सक्रिय रिक्तियां हैं और जो आपको सीधे रोजगार प्रदान कर रहे हैं।
                  </p>
                ) : (
                  <p>
                    We never sell candidate personal data to external marketing companies, advertisers, or third-party telecallers. Your information is shared strictly with verified security agencies and hiring employers with active vacancies.
                  </p>
                )}
              </section>

              {/* Section 6: How We Protect Data */}
              <section id="security" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '6. सुरक्षा उपाय (How We Protect Your Data)' : '6. How We Protect Your Data'}
                  </h2>
                </div>
                {isHindi ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li><strong>TLS 1.3 एन्क्रिप्शन:</strong> सभी फॉर्म सबमिशन और डेटा संचार आधुनिक HTTPS एन्क्रिप्शन के माध्यम से होते हैं।</li>
                    <li><strong>अनाधिकृत पहुंच पर रोक:</strong> एडमिनिस्ट्रेटर कंसोल सुरक्षित पासवर्ड हैशिंग (Bcrypt) और सत्र नियंत्रण द्वारा सुरक्षित है।</li>
                    <li><strong>सुरक्षित दस्तावेज भंडारण:</strong> अपलोड किए गए दस्तावेज रैंडम हैश फाइलों में सुरक्षित रहते हैं और केवल अधिकृत कर्मचारियों के लिए दृश्यमान होते हैं।</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li><strong>TLS 1.3 Encryption:</strong> All application form submissions and data exchanges use modern HTTPS encryption.</li>
                    <li><strong>Strict Access Controls:</strong> The administrative console is secured with Bcrypt password hashing and rate-limited authentication.</li>
                    <li><strong>Secure Document Vault:</strong> Uploaded verification documents are stored with randomized non-guessable identifiers and are accessible only to authorized staff.</li>
                  </ul>
                )}
              </section>

              {/* Section 7: Retention */}
              <section id="retention" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '7. डेटा संरक्षण अवधि (Data Retention Policy)' : '7. Data Retention Policy'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    हम आपके आवेदन को तब तक सुरक्षित रखते हैं जब तक आप उपयुक्त नौकरी में नियुक्त नहीं हो जाते या जब तक आप अपना डेटा हटाने का अनुरोध नहीं करते।
                  </p>
                ) : (
                  <p>
                    We retain your candidate profile for as long as reasonably necessary to connect you with active job openings, or until you request profile deletion.
                  </p>
                )}
              </section>

              {/* Section 8: Your Rights */}
              <section id="rights" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '8. उम्मीदवार के अधिकार (Your Rights as a Candidate)' : '8. Your Rights as a Candidate'}
                  </h2>
                </div>
                <p>
                  {isHindi
                    ? 'एक पंजीकृत उम्मीदवार के रूप में आपके पास निम्नलिखित पूर्ण अधिकार हैं:'
                    : 'As a registered applicant, you retain complete authority over your submitted data:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block text-xs">
                      {isHindi ? 'डेटा सुधार (Profile Correction):' : 'Profile Correction:'}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {isHindi ? 'आप कभी भी अपना मोबाइल नंबर, शहर या अनुभव अपडेट कर सकते हैं।' : 'You can update your phone number, city, or experience preferences anytime.'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <strong className="text-slate-900 block text-xs">
                      {isHindi ? 'डेटा विलोपन (Data Deletion):' : 'Data Deletion:'}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {isHindi ? 'आप अपने प्रोफाइल और अपलोड किए गए दस्तावेजों को हटाने का अनुरोध कर सकते हैं।' : 'You can request full removal of your candidate record and uploaded documents.'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 9: Age Eligibility */}
              <section id="children" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '9. आयु व पात्रता मानक (Age & Industry Eligibility)' : '9. Age & Industry Eligibility'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    यह प्लेटफ़ॉर्म विशेष रूप से 18 से 65 वर्ष के उम्मीदवारों के लिए है, जो भारतीय श्रम कानून और निजी सुरक्षा विनियमन (PSARA) के मानकों के अनुरूप है। 18 वर्ष से कम उम्र के व्यक्तियों के आवेदन स्वीकार नहीं किए जाते।
                  </p>
                ) : (
                  <p>
                    This platform is intended strictly for candidates aged 18 to 65, in accordance with Indian labor laws and the Private Security Agencies (Regulation) Act (PSARA). Applications from individuals under 18 years of age are not accepted.
                  </p>
                )}
              </section>

              {/* Section 10: Changes */}
              <section id="changes" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '10. नीति में संशोधन (Policy Updates & Versioning)' : '10. Policy Updates & Versioning'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    हम कानूनी सुधारों या नए फीचर्स के अनुसार इस नीति को समय-समय पर अपडेट कर सकते हैं। कोई भी महत्वपूर्ण बदलाव होने पर इस पृष्ठ पर नवीनतम तिथि दिखाई जाएगी।
                  </p>
                ) : (
                  <p>
                    We may update this policy periodically to reflect statutory updates or new platform features. Any significant updates will be clearly reflected with the revised date at the top of this page.
                  </p>
                )}
              </section>

              {/* Section 11: Contact */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '11. आधिकारिक सहायता डेस्क (Official Contact Desk)' : '11. Official Contact Desk'}
                  </h2>
                </div>
                <p>
                  {isHindi
                    ? 'यदि आपके पास अपनी गोपनीयता या व्यक्तिगत डेटा के संबंध में कोई प्रश्न है, तो कृपया हमारे आधिकारिक पते या हेल्पलाइन पर संपर्क करें:'
                    : 'If you have questions about this Privacy Policy or how your information is handled, please contact our official desk:'}
                </p>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">AVIJIT ENTERPRISES (SecurityJob.in Compliance)</p>
                  <p className="text-slate-600">159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021</p>
                  <p className="text-slate-600"><strong>{isHindi ? 'फोन / WhatsApp:' : 'Phone / WhatsApp:'}</strong> +91 99299 92886 &middot; <strong>{isHindi ? 'ईमेल:' : 'Email:'}</strong> hr@securityjob.in</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
