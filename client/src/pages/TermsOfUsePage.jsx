import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  FileCheck, 
  Award, 
  AlertCircle, 
  Building, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LAST_UPDATED = 'September 1, 2026';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919828044998';

export default function TermsOfUsePage() {
  useNoIndex();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeSection, setActiveSection] = useState('acceptance');
  const [tocOpen, setTocOpen] = useState(false);

  const SECTIONS = [
    { id: 'acceptance', title: isHindi ? '1. नियमों की स्वीकृति' : '1. Acceptance of Terms', icon: FileCheck },
    { id: 'eligibility', title: isHindi ? '2. उम्मीदवार पात्रता' : '2. Candidate Eligibility', icon: UserCheck },
    { id: 'no-fee', title: isHindi ? '3. ₹0 रजिस्ट्रेशन फीस गारंटी' : '3. Zero Fee Guarantee (₹0 Charge)', icon: Award },
    { id: 'accuracy', title: isHindi ? '4. जानकारी की सटीकता' : '4. Accuracy of Information', icon: CheckCircle2 },
    { id: 'no-guarantee', title: isHindi ? '5. भर्ती प्रक्रिया व प्लेसमेंट' : '5. Nature of Recruitment Bridge', icon: AlertCircle },
    { id: 'conduct', title: isHindi ? '6. स्वीकार्य आचरण व सुरक्षा' : '6. Acceptable Platform Conduct', icon: ShieldCheck },
    { id: 'ip', title: isHindi ? '7. बौद्धिक संपदा अधिकार' : '7. Intellectual Property', icon: Building },
    { id: 'liability', title: isHindi ? '8. दायित्व की सीमा' : '8. Limitation of Liability', icon: Scale },
    { id: 'law', title: isHindi ? '9. कानूनी क्षेत्राधिकार (जयपुर)' : '9. Governing Law & Jurisdiction', icon: Scale },
    { id: 'changes', title: isHindi ? '10. शर्तों में संशोधन' : '10. Terms Modifications', icon: FileCheck },
    { id: 'contact', title: isHindi ? '11. आधिकारिक सहायता डेस्क' : '11. Official Support Desk', icon: HelpCircle },
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
        title={isHindi ? "नियम व शर्तें (Terms of Use) — SecurityJob.in | Avijit Enterprises" : "Terms of Use & Candidate Agreement — SecurityJob.in | Avijit Enterprises"}
        description={isHindi ? "SecurityJob.in (Avijit Enterprises) की नियम व शर्तें — ₹0 रजिस्ट्रेशन फीस, पारदर्शी भर्ती और राजस्थान में सुरक्षा कर्मियों के लिए दिशानिर्देश।" : "Terms of Use governing candidate registration and recruitment placement on SecurityJob.in by Avijit Enterprises."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-light-hero border-b border-slate-200/80 pt-12 pb-16 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              {isHindi ? 'प्लेटफ़ॉर्म नियम व अनुबंध' : 'Platform Terms & Candidate Agreement'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {isHindi ? 'उपयोग की शर्तें एवं नियम' : 'Terms of Use & Guidelines'}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {isHindi ? `अंतिम अद्यतन: ${LAST_UPDATED}` : `Last Updated: ${LAST_UPDATED}`} &middot; {isHindi ? 'लागू: SecurityJob.in एवं Avijit Enterprises' : 'Operated by Avijit Enterprises, Jaipur'}
            </p>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
              {isHindi
                ? 'SecurityJob.in का उपयोग करके या आवेदन फॉर्म सबमिट करके, आप इन सरल व पारदर्शी नियमों से सहमत होते हैं। हमारा लक्ष्य निष्पक्ष और बिचौलिया-मुक्त भर्ती प्रदान करना है।'
                : 'By registering on SecurityJob.in or submitting your candidate application, you agree to the terms below. Our mission is to provide transparent, direct, and zero-fee security placements.'}
            </p>

            {/* 3 High-Trust Highlight Badges */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
                {isHindi ? '100% फ्री उम्मीदवार सेवा' : '100% Free for Workers'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {isHindi ? 'प्रमाणित सुरक्षा कंपनियां' : 'Verified Companies'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isHindi ? 'सीधी एवं सुरक्षित भर्ती' : 'Direct Placements'}
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
                <Scale className="w-4 h-4 text-blue-600" />
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
                  {isHindi ? 'अनुभाग नेविगेशन' : 'Terms Navigation'}
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

              {/* Support Desk Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isHindi ? 'कोई सवाल या संदेह?' : 'Have Terms Questions?'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isHindi ? 'कैंडिडेट हेल्पलाइन डेस्क' : 'Candidate Helpline'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHindi
                    ? 'यदि आपके पास आवेदन प्रक्रिया या नियमों को लेकर कोई प्रश्न है, तो सीधे WhatsApp पर पूछें।'
                    : 'Our support team is ready to answer any questions about our recruitment process.'}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isHindi ? 'नमस्ते, मुझे SecurityJob नियम व शर्तों के बारे में जानकारी चाहिए।' : 'Hello, I have a question regarding the SecurityJob Terms of Use.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isHindi ? 'WhatsApp पर पूछें' : 'Ask on WhatsApp'}
                </a>
              </div>
            </aside>

            {/* Terms Content Card (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10 text-slate-700 text-sm leading-relaxed">
              
              {/* Section 1: Acceptance */}
              <section id="acceptance" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '1. नियमों की स्वीकृति (Acceptance of Terms)' : '1. Acceptance of Terms'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    SecurityJob.in (संचालित: <strong>AVIJIT ENTERPRISES</strong>, जयपुर) का उपयोग करके या आवेदन फॉर्म जमा करके, आप इन उपयोग की शर्तों को पूर्णतः स्वीकार करते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया फॉर्म न भरें।
                  </p>
                ) : (
                  <p>
                    By using SecurityJob.in (operated by <strong>AVIJIT ENTERPRISES</strong>, Jaipur, Rajasthan) or submitting your candidate application, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use this service.
                  </p>
                )}
              </section>

              {/* Section 2: Eligibility */}
              <section id="eligibility" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '2. उम्मीदवार पात्रता (Candidate Eligibility)' : '2. Candidate Eligibility'}
                  </h2>
                </div>
                {isHindi ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>आपकी आयु 18 से 65 वर्ष के बीच होनी चाहिए।</li>
                    <li>आपके पास भारत सरकार द्वारा मान्यता प्राप्त वैध पहचान पत्र (आधार कार्ड, वोटर कार्ड आदि) होना चाहिए।</li>
                    <li>हथियारबंद गार्ड (Armed Guard / Gunman) के लिए वैध और नवीनीकृत आर्म्स लाइसेंस अनिवार्य है।</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>You must be between 18 and 65 years of age to register for security industry positions.</li>
                    <li>You must possess a valid, government-issued photo identity proof (such as an Aadhaar Card or Voter ID).</li>
                    <li>Armed Guard or Gunman candidates must hold a valid, active Indian Arms License registered in the authorized jurisdiction.</li>
                  </ul>
                )}
              </section>

              {/* Section 3: Zero Fee */}
              <section id="no-fee" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '3. ₹0 रजिस्ट्रेशन फीस गारंटी (Zero Registration Fee)' : '3. Zero Registration Fee Guarantee'}
                  </h2>
                </div>
                {isHindi ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed">
                    🛡️ <strong>सतर्कता संदेश:</strong> SecurityJob.in किसी भी उम्मीदवार से किसी भी स्तर पर पैसे नहीं मांगता। यदि कोई व्यक्ति हमारे नाम पर आपसे फॉर्म भरने या नौकरी लगवाने के नाम पर पैसे मांगता है, तो तुरंत हमें रिपोर्ट करें।
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed">
                    🛡️ <strong>Zero-Fee Guarantee:</strong> SecurityJob.in never charges candidates any application fee, registration cost, or placement commission. If anyone demands money under our name, report it immediately to our helpline.
                  </div>
                )}
              </section>

              {/* Section 4: Accuracy */}
              <section id="accuracy" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '4. जानकारी की सटीकता (Accuracy of Information)' : '4. Accuracy of Information'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    उम्मीदवार यह सुनिश्चित करता है कि फॉर्म में दिया गया नाम, मोबाइल नंबर, अनुभव और दस्तावेज 100% सही और वास्तविक हैं। गलत या भ्रामक जानकारी देने पर आवेदन निरस्त किया जा सकता है।
                  </p>
                ) : (
                  <p>
                    You agree to provide true, accurate, and current information regarding your personal identity, contact numbers, work experience, and documentation. Submitting false information will result in immediate disqualification.
                  </p>
                )}
              </section>

              {/* Section 5: Nature of Placement */}
              <section id="no-guarantee" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '5. भर्ती प्रक्रिया व प्लेसमेंट (Recruitment Bridge & Placement)' : '5. Recruitment Bridge & Placement'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    SecurityJob.in उम्मीदवारों को सत्यापित सुरक्षा एजेंसियों व कंपनियों से जोड़ने का कार्य करता है। अंतिम नियुक्ति, ड्यूटी लोकेशन और वेतन संबंधित कंपनी के साक्षात्कार, शारीरिक मापदंड और कंपनी नीतियों पर निर्भर करता है।
                  </p>
                ) : (
                  <p>
                    SecurityJob.in serves as a direct placement facilitator connecting candidates with verified security companies. Final hiring decisions, duty shift allocations, and salary disbursements are governed by the prospective hiring employer.
                  </p>
                )}
              </section>

              {/* Section 6: Conduct */}
              <section id="conduct" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '6. स्वीकार्य आचरण (Acceptable Platform Conduct)' : '6. Acceptable Platform Conduct'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    प्लेटफ़ॉर्म पर स्पैमिंग, दुर्भावनापूर्ण स्क्रिप्ट इंजेक्ट करना, फर्जी नंबर दर्ज करना या ऑटोमेटेड बॉट्स चलाना सख्त वर्जित है। ऐसे कृत्यों के विरुद्ध कानूनी कार्रवाई की जा सकती है।
                  </p>
                ) : (
                  <p>
                    Users must not inject malicious scripts, submit fraudulent or spoofed phone numbers, or use automated scraping bots against this platform. Any unauthorized interference will be subject to civil and criminal liability.
                  </p>
                )}
              </section>

              {/* Section 7: IP */}
              <section id="ip" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <Building className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '7. बौद्धिक संपदा (Intellectual Property)' : '7. Intellectual Property'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    SecurityJob.in ब्रांड, लोगो, वेबसाइट कोड, लेआउट और सामग्री AVIJIT ENTERPRISES की बौद्धिक संपदा हैं। बिना लिखित अनुमति के इसका नकल या दुरुपयोग कानूनन अपराध है।
                  </p>
                ) : (
                  <p>
                    All logos, brand marks, website designs, user interfaces, and software code on SecurityJob.in are the exclusive property of <strong>AVIJIT ENTERPRISES</strong>. Unauthorized copying or redistribution is strictly prohibited.
                  </p>
                )}
              </section>

              {/* Section 8: Liability */}
              <section id="liability" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '8. दायित्व की सीमा (Limitation of Liability)' : '8. Limitation of Liability'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    SecurityJob.in निष्पक्ष भर्ती सुविधा प्रदान करने के लिए पूरी लगन से कार्य करता है। हालांकि, उम्मीदवार और नियोक्ता के बीच कार्यस्थल पर होने वाले किसी भी व्यक्तिगत विवाद के लिए प्लेटफ़ॉर्म प्रत्यक्ष रूप से उत्तरदायी नहीं होगा।
                  </p>
                ) : (
                  <p>
                    SecurityJob.in strives to ensure prompt and fair placement connections. However, the platform shall not be held liable for workplace disputes or contractual discrepancies arising between the candidate and the hiring employer.
                  </p>
                )}
              </section>

              {/* Section 9: Governing Law */}
              <section id="law" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '9. कानूनी क्षेत्राधिकार (Governing Law & Jurisdiction)' : '9. Governing Law & Jurisdiction'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    ये शर्तें भारत के कानूनों के अनुसार शासित होंगी और किसी भी कानूनी विवाद का क्षेत्राधिकार केवल <strong>जयपुर (राजस्थान) की अदालतों</strong> में होगा।
                  </p>
                ) : (
                  <p>
                    These terms are governed by the laws of India. Any legal dispute or proceeding arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Jaipur, Rajasthan</strong>.
                  </p>
                )}
              </section>

              {/* Section 10: Changes */}
              <section id="changes" className="scroll-mt-28 space-y-3 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {isHindi ? '10. शर्तों में संशोधन (Terms Modifications)' : '10. Terms Modifications'}
                  </h2>
                </div>
                {isHindi ? (
                  <p>
                    हम इन शर्तों को किसी भी समय संशोधित करने का अधिकार सुरक्षित रखते हैं। संशोधनों के बाद वेबसाइट का उपयोग आपकी सहमति माना जाएगा।
                  </p>
                ) : (
                  <p>
                    We reserve the right to modify these Terms of Use at any time. Continued use of the platform following any modifications constitutes acceptance of the revised terms.
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
                    {isHindi ? '11. आधिकारिक संपर्क विवरण (Official Support Desk)' : '11. Official Support Desk'}
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
