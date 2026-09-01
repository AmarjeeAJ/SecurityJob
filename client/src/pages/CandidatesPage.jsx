import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck2, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Award, 
  PhoneCall 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function CandidatesPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const careerLevels = isHindi
    ? [
        {
          level: 'स्तर 1 (Level 1)',
          title: 'सिक्योरिटी गार्ड / लेडी गार्ड',
          exp: '0 - 1 वर्ष (फ्रेशर्स के लिए उपयुक्त)',
          salary: '₹15,000 – ₹24,000 / माह',
          desc: 'मुख्य द्वार सुरक्षा, आगंतुक रजिस्टर मेंटेनेंस, परिसर गश्त और बेसिक एक्सेस कंट्रोल।',
        },
        {
          level: 'स्तर 2 (Level 2)',
          title: 'सीनियर गार्ड / गनमैन / बाउंसर',
          exp: '1 - 3 वर्ष का अनुभव',
          salary: '₹20,000 – ₹32,000 / माह',
          desc: 'हाई-वैल्यू एसेट सुरक्षा, हथियार संचालन, वीआईपी प्रोटोकॉल व परिसर सुरक्षा प्रबंधन।',
        },
        {
          level: 'स्तर 3 (Level 3)',
          title: 'सिक्योरिटी सुपरवाइजर / शिफ्ट इंचार्ज',
          exp: '2 - 5 वर्ष का अनुभव',
          salary: '₹24,000 – ₹36,000 / माह',
          desc: 'गार्ड शिफ्ट का नेतृत्व, दैनिक ब्रीफिंग, ड्यूटी रोस्टर तैयार करना और ऑन-साइट समन्वय।',
        },
        {
          level: 'स्तर 4 (Level 4)',
          title: 'फील्ड ऑफिसर / सिक्योरिटी इंस्पेक्टर',
          exp: '4 - 8 वर्ष का अनुभव',
          salary: '₹28,000 – ₹45,000 / माह',
          desc: 'कई साइट्स का औचक निरीक्षण, नाइट ऑडिट, क्लाइंट कोऑर्डिनेशन और गार्ड भर्ती में सहायता।',
        },
        {
          level: 'स्तर 5 (Level 5)',
          title: 'सिक्योरिटी ऑपरेशन्स मैनेजर',
          exp: '6+ वर्ष (पूर्व सैनिक / अनुभवी)',
          salary: '₹45,000 – ₹80,000+ / माह',
          desc: 'कंपनी सिक्योरिटी नीतियां बनाना, बड़े प्रोजेक्ट्स का सुरक्षा अनुबंध और टीम का नेतृत्व।',
        },
      ]
    : [
        {
          level: 'Level 1',
          title: 'Security Guard / Lady Guard',
          exp: '0 - 1 Year (Fresher Friendly)',
          salary: '₹15,000 – ₹24,000 / mo',
          desc: 'Access control, visitor log management, perimeter gate duty, and campus patrols.',
        },
        {
          level: 'Level 2',
          title: 'Senior Guard / Gunman / Bouncer',
          exp: '1 - 3 Years Experience',
          salary: '₹20,000 – ₹32,000 / mo',
          desc: 'High-value asset protection, weapon handling, VIP protocol, and premises security management.',
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

  const checklistDocs = isHindi
    ? [
        {
          title: 'आधार कार्ड (Aadhaar Card)',
          desc: 'आगे और पीछे की साफ़ फोटो या फोटोकॉपी जिसमें जन्मतिथि व पता स्पष्ट हो।',
          required: true,
        },
        {
          title: 'बैंक पासबुक / चेक (Bank Passbook)',
          desc: 'मासिक वेतन सीधे बैंक खाते में जमा कराने के लिए एक्टिव बैंक खाता।',
          required: true,
        },
        {
          title: 'शैक्षणिक मार्कशीट (10th/12th Marksheet)',
          desc: '10वीं, 12वीं या ग्रेजुएशन की मार्कशीट (सुपरवाइजर व उच्च पदों के लिए)।',
          required: true,
        },
        {
          title: 'पासपोर्ट साइज फोटो (Photos)',
          desc: 'कंपनी आईडी कार्ड और वेरिफिकेशन फॉर्म के लिए 2 से 4 रंगीन फोटो।',
          required: true,
        },
        {
          title: 'पुलिस सत्यापन (Police Verification)',
          desc: 'स्थानीय पुलिस थाना सत्यापन प्रमाण पत्र (तेज़ जॉइनिंग के लिए उपयोगी)।',
          required: false,
        },
        {
          title: 'हथियार लाइसेंस (गनमैन पदों के लिए)',
          desc: 'गनमैन व सशस्त्र सुरक्षा गार्ड के लिए वैध गन लाइसेंस कॉपी।',
          required: false,
        },
      ]
    : [
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
        title={isHindi ? "सिक्योरिटी करियर गाइड व वेतन जानकारी — SecurityJob.in" : "Career Guide & Jobs Hub — Security Guard & Supervisor Careers | SecurityJob.in"}
        description={isHindi ? "राजस्थान में सिक्योरिटी गार्ड, सुपरवाइजर व गनमैन करियर में तरक्की का रोडमैप, सैलरी पैकेज और जॉइनिंग के जरूरी दस्तावेजों की पूरी जानकारी।" : "Build a high-growth career in Rajasthan's security sector. Career pathways, salary benchmarks, interview preparation checklist, and free online job application."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-24 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                {isHindi ? 'कैंडिडेट करियर व मार्गदर्शन केंद्र' : 'Employee Career & Growth Hub'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {isHindi ? 'सिक्योरिटी करियर की शुरुआत यहाँ से करें' : 'Security Careers Start Here.'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {isHindi
                  ? 'राजस्थान में प्रमाणित सुरक्षा कंपनियों से सीधे जुड़ें। ₹0 रजिस्ट्रेशन फीस, समय पर वेतन, सरकारी PF व ESIC सुविधा और करियर में आगे बढ़ने का स्पष्ट मार्ग।'
                  : 'Connect with verified security job opportunities across Rajasthan. Enjoy zero registration fees, confirmed statutory benefits (PF & ESIC), and a transparent path for long-term career growth.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/apply/security-guard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  {isHindi ? 'ऑनलाइन फ्री फॉर्म भरें' : 'Start Free Application'}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs"
                >
                  <Briefcase className="w-4 h-4" />
                  {isHindi ? 'सभी 11+ पद देखें' : 'Browse 11+ Security Roles'}
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
                {isHindi ? 'उम्मीदवारों के लाभ' : 'Worker Advantages'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {isHindi ? 'SecurityJob.in से आवेदन क्यों करें?' : 'Why Apply Through SecurityJob?'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? '₹0 फीस — हमेशा फ्री' : 'Zero Fees, Ever'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'हम कभी भी उम्मीदवारों से फॉर्म, इंटरव्यू या जॉइनिंग के लिए कोई पैसा नहीं लेते। रजिस्ट्रेशन 100% मुफ्त है।'
                    : 'We never ask candidates to pay for registration, interview slots, or placement. Registration is 100% free.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? '100% वेरिफाइड जॉब्स' : 'Genuine Job Vacancies'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'केवल वही कंपनियाँ लिस्टेड हैं जो समय पर बैंक वेतन और कानूनी PF व ESIC मेडिकल सुरक्षा प्रदान करती हैं।'
                    : 'We list only verified job openings that offer timely monthly bank salaries and statutory PF/ESIC benefits.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'सीधा फोन / WhatsApp संपर्क' : 'Direct Phone / WhatsApp Match'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'बिना किसी बिचौलिये के। जैसे ही आपकी योग्यता की जॉब मिलती है, अधिकृत एजेंसी सीधे आपको कॉल करती है।'
                    : 'No middleman confusion. When an opening fits your location and experience, you get contacted directly for joining.'}
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
                {isHindi ? 'करियर ग्रोथ रोडमैप' : 'Career Growth Roadmap'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {isHindi ? 'प्राइवेट सिक्योरिटी में करियर विकास' : 'Career Progression in Private Security'}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {isHindi
                  ? 'सुरक्षा क्षेत्र में गार्डिंग से लेकर सुपरविजन और मैनेजमेंट तक आगे बढ़ने के स्पष्ट अवसर मौजूद हैं।'
                  : "Private security is one of India's fastest growing employment sectors. See how you can grow from entry guard duty to multi-site management."}
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isHindi ? 'अनुमानित वेतन' : 'Typical Earnings'}
                    </span>
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
                {isHindi ? 'दस्तावेज चेकलिस्ट' : 'Preparation Checklist'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {isHindi ? 'जॉब जॉइनिंग के लिए जरूरी दस्तावेज' : "Documents You'll Need for Security Jobs"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isHindi
                  ? 'तेज़ जॉइनिंग के लिए इन दस्तावेजों की फोटो अपने मोबाइल में तैयार रखें।'
                  : 'Keep photocopies and photos on your phone ready to get deployed faster.'}
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
                      {doc.required ? (isHindi ? 'अनिवार्य' : 'Mandatory') : (isHindi ? 'वैकल्पिक' : 'Optional')}
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
              {isHindi ? 'क्या आप अपना प्रोफ़ाइल रजिस्टर करने के लिए तैयार हैं?' : 'Ready to Register Your Profile?'}
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {isHindi
                ? 'अपने मोबाइल से केवल 2 मिनट में फॉर्म भरें और आज ही से जॉब कॉल प्राप्त करें।'
                : 'Takes just 2 minutes on your mobile. Start receiving matching security job opportunities today.'}
            </p>
            <div className="mt-8">
              <Link
                to="/apply/security-guard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                {isHindi ? 'ऑनलाइन फ्री फॉर्म भरें' : 'Start Free Candidate Application'}
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
