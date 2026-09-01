import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  UserCheck, 
  PhoneCall, 
  FileText, 
  Building, 
  RotateCcw, 
  AlertCircle, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LAST_UPDATED = 'September 1, 2026';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919828044998';

export default function CandidateConsentPolicyPage() {
  useNoIndex();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeSection, setActiveSection] = useState('overview');
  const [tocOpen, setTocOpen] = useState(false);

  const SECTIONS = [
    { id: 'overview', title: isHindi ? '1. सहमति नीति का उद्देश्य' : '1. Consent Policy Overview', icon: FileCheck },
    { id: 'what-you-consent-to', title: isHindi ? '2. आप किन बातों की सहमति देते हैं' : '2. What You Agree To', icon: CheckCircle2 },
    { id: 'communication', title: isHindi ? '3. कॉल व अलर्ट की अनुमति' : '3. Communication & Job Alerts', icon: PhoneCall },
    { id: 'documents', title: isHindi ? '4. दस्तावेज सत्यापन सुरक्षा' : '4. Document Verification Consent', icon: FileText },
    { id: 'sharing', title: isHindi ? '5. नियोक्ताओं से मिलान' : '5. Sharing With Hiring Agencies', icon: Building },
    { id: 'withdrawing', title: isHindi ? '6. सहमति वापस लेने की सुविधा' : '6. Withdrawing Your Consent', icon: RotateCcw },
    { id: 'reapplying', title: isHindi ? '7. प्रोफाइल अपडेट व पुनः आवेदन' : '7. Re-Applying & Profile Updates', icon: UserCheck },
    { id: 'changes', title: isHindi ? '8. नीति में संशोधन' : '8. Policy Modifications', icon: Scale },
    { id: 'contact', title: isHindi ? '9. आधिकारिक सहायता डेस्क' : '9. Official Support Desk', icon: HelpCircle },
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
        title={isHindi ? "उम्मीदवार सहमति नीति (Candidate Consent) — SecurityJob.in | Avijit Enterprises" : "Candidate Consent & Placement Policy — SecurityJob.in | Avijit Enterprises"}
        description={isHindi ? "SecurityJob.in उम्मीदवार सहमति नीति — जानिए फॉर्म सबमिट करते समय आप किन बातों की सहमति देते हैं और आपके अधिकार क्या हैं।" : "Candidate Consent and data handling policy on SecurityJob.in by Avijit Enterprises, Jaipur."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-light-hero border-b border-slate-200/80 pt-12 pb-16 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              {isHindi ? 'उम्मीदवार सहमति व सत्यापन' : 'Candidate Consent & Verification'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {isHindi ? 'उम्मीदवार सहमति नीति' : 'Candidate Consent Policy'}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {isHindi ? `अंतिम अद्यतन: ${LAST_UPDATED}` : `Last Updated: ${LAST_UPDATED}`} &middot; {isHindi ? 'लागू: SecurityJob.in एवं Avijit Enterprises' : 'Operated by Avijit Enterprises, Jaipur'}
            </p>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
              {isHindi
                ? 'यह पृष्ठ अलग से स्पष्ट करता है कि जब आप फॉर्म में सहमति बॉक्स चेक करते हैं, तो आप किन शर्तों की अनुमति दे रहे हैं और आपके डेटा पर आपका क्या नियंत्रण है।'
                : 'This document transparently explains what permissions you grant when checking the consent checkbox on the application form and how you stay in full control of your details.'}
            </p>

            {/* 3 High-Trust Highlight Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isHindi ? 'स्पष्ट व पारदर्शी सहमति' : 'Explicit Transparent Opt-In'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {isHindi ? 'सुरक्षित दस्तावेज सत्यापन' : 'Encrypted Document Vault'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                {isHindi ? 'सहमति वापस लेने की सुविधा' : 'Withdraw Anytime'}
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
                <FileCheck className="w-4 h-4 text-blue-600" />
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
                  {isHindi ? 'अनुभाग नेविगेशन' : 'Consent Navigation'}
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

              {/* Support Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isHindi ? 'सहमति संबंधी सवाल?' : 'Consent Questions?'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isHindi ? 'कैंडिडेट हेल्पडेस्क' : 'Direct Support Desk'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHindi
                    ? 'यदि आप अपनी सहमति वापस लेना चाहते हैं या दस्तावेज हटाना चाहते हैं, तो तुरंत संपर्क करें।'
                    : 'To revoke consent or remove your uploaded verification files, message our team.'}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isHindi ? 'नमस्ते, मुझे Candidate Consent Policy के बारे में सहायता चाहिए।' : 'Hello, I have a question regarding the Candidate Consent Policy.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isHindi ? 'WhatsApp हेल्पलाइन' : 'WhatsApp Desk'}
                </a>
              </div>
            </aside>

            {/* Consent Content Card (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10 text-slate-700 text-sm leading-relaxed">
              
              {/* Section 1: Overview */}
              <section id="overview" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '1. सहमति नीति का उद्देश्य (Consent Policy Overview)' : '1. Consent Policy Overview'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    जब आप SecurityJob.in पर अपना आवेदन जमा करते हैं और सहमति चेकबॉक्स को चुनते हैं, तो आप अपनी पहचान और संपर्क विवरण को सुरक्षित रूप से संसाधित करने की अनुमति देते हैं।
                  </p>
                ) : (
                  <p>
                    When submitting your application on SecurityJob.in and checking the consent box, you grant explicit consent for us to process your contact details and job preferences for security recruitment matching.
                  </p>
                )}
              </section>

              {/* Section 2: What you consent to */}
              <section id="what-you-consent-to" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '2. आप किन बातों की सहमति देते हैं (What You Agree To)' : '2. What You Are Consenting To'}
                  </h2>
                </div>
                {isHindi ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>अपने नाम, उम्र, जिले और कार्य अनुभव को प्रमाणित सुरक्षा कंपनियों के समक्ष प्रस्तुत करने की अनुमति।</li>
                    <li>नौकरी रिक्तियों, साक्षात्कार समय और चयन स्थिति की सूचना प्राप्त करने की अनुमति।</li>
                    <li>सरकारी श्रम विनियमों (PSARA, न्यूनतम मजदूरी) के अनुपालन में अपना प्रोफाइल दर्ज कराने की अनुमति।</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>Allowing your name, age, city preferences, and security experience to be presented to verified hiring employers.</li>
                    <li>Receiving notifications regarding job vacancies, interview schedules, and placement status.</li>
                    <li>Enabling statutory verification in compliance with Indian Private Security Agencies regulations (PSARA).</li>
                  </ul>
                )}
              </section>

              {/* Section 3: Communication */}
              <section id="communication" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '3. कॉल व संदेश की अनुमति (Communication & Job Alerts)' : '3. Communication & Job Alerts'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    आप सहमत होते हैं कि हमारी रिक्रूटमेंट टीम या अधिकृत नियोक्ता आपके दिए गए मोबाइल नंबर या WhatsApp पर जॉब इंटरव्यू, सैलरी विवरण और जॉइनिंग स्थान की जानकारी देने के लिए कॉल या मैसेज कर सकते हैं।
                  </p>
                ) : (
                  <p>
                    You authorize our recruitment coordinators and verified hiring employers to contact you via phone call, WhatsApp, or SMS regarding job matches, interview timings, salary structures, and duty locations.
                  </p>
                )}
              </section>

              {/* Section 4: Document Verification */}
              <section id="documents" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '4. पहचान पत्र सत्यापन (Document Verification Consent)' : '4. Document Verification Consent'}
                  </h2>
                </div>
                {isHindi ? (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs font-semibold leading-relaxed">
                    🔒 <strong>दस्तावेज सुरक्षा:</strong> आधार कार्ड या आईडी अपलोड करना पूरी तरह स्वैच्छिक (वैकल्पिक) है। अपलोड किए गए पहचान पत्र केवल आपकी उम्र और पहचान सत्यापन के लिए उपयोग होते हैं और कभी किसी अन्य उद्देश्य के लिए साझा नहीं किए जाते।
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs font-semibold leading-relaxed">
                    🔒 <strong>Document Security:</strong> Uploading an Aadhaar or identity document is entirely optional. Uploaded files are used solely to verify age and identity eligibility and are never shared for unauthorized third-party purposes.
                  </div>
                )}
              </section>

              {/* Section 5: Sharing With Employers */}
              <section id="sharing" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '5. नियोक्ताओं के साथ मिलान (Sharing With Hiring Agencies)' : '5. Sharing With Hiring Agencies'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    हम केवल उन्हीं नियोक्ताओं के साथ आपका प्रोफाइल साझा करते हैं जिनके पास राजस्थान के जिलों (जयपुर, कोटा, जोधपुर आदि) में वास्तविक और वेतन-सत्यापित सुरक्षा पद खाली हैं।
                  </p>
                ) : (
                  <p>
                    Your profile is shared only with verified security agencies and direct corporate employers having active, wage-compliant openings across Rajasthan districts (Jaipur, Kota, Jodhpur, Udaipur, etc.).
                  </p>
                )}
              </section>

              {/* Section 6: Withdrawing */}
              <section id="withdrawing" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '6. सहमति वापस लेना (Withdrawing Your Consent)' : '6. Withdrawing Your Consent'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    आप कभी भी अपनी सहमति वापस ले सकते हैं। इसके लिए बस हमारे WhatsApp सपोर्ट नंबर या ईमेल पर अपना नाम और कैंडिडेट कोड भेजें, और आपका डेटा हमारे एक्टिव डेटाबेस से हटा दिया जाएगा।
                  </p>
                ) : (
                  <p>
                    You retain the right to withdraw your consent at any time. Simply message our WhatsApp support desk or email us with your Candidate Code, and your profile will be removed from our active database.
                  </p>
                )}
              </section>

              {/* Section 7: Reapplying */}
              <section id="reapplying" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '7. प्रोफाइल अपडेट (Re-Applying & Profile Updates)' : '7. Re-Applying & Profile Updates'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    यदि आपका मोबाइल नंबर वही रहता है और आप दोबारा फॉर्म भरते हैं, तो आपका पुराना प्रोफाइल नवीनतम विवरण (जैसे नया शहर या अनुभव) के साथ अपडेट हो जाता है।
                  </p>
                ) : (
                  <p>
                    If you submit a new application with the same registered mobile number, your profile is refreshed with your latest details (e.g. updated location or experience) rather than creating duplicate accounts.
                  </p>
                )}
              </section>

              {/* Section 8: Modifications */}
              <section id="changes" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '8. नीति में संशोधन (Policy Modifications)' : '8. Policy Modifications'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    यदि सहमति के नियमों में कोई महत्वपूर्ण बदलाव किया जाता है, तो इसकी सूचना वेबसाइट पर प्रकाशित की जाएगी।
                  </p>
                ) : (
                  <p>
                    Any amendments to our consent and verification practices will be posted on this page with an updated timestamp.
                  </p>
                )}
              </section>

              {/* Section 9: Contact */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '9. आधिकारिक सहायता डेस्क (Official Support Desk)' : '9. Official Support Desk'}
                  </h2>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">AVIJIT ENTERPRISES (SecurityJob.in Compliance)</p>
                  <p className="text-slate-600">159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021</p>
                  <p className="text-slate-600"><strong>{isHindi ? 'हेल्पलाइन:' : 'Helpline:'}</strong> +91 98280 44998 &middot; <strong>{isHindi ? 'ईमेल:' : 'Email:'}</strong> bansalvicky738@gmail.com</p>
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
