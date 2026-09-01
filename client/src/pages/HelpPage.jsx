import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999900000';

export default function HelpPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = isHindi
    ? [
        {
          category: 'रजिस्ट्रेशन (Registration)',
          question: 'क्या SecurityJob.in पर फॉर्म भरने के कोई पैसे लगते हैं?',
          answer: 'नहीं। इस पोर्टल पर रजिस्ट्रेशन 100% फ्री है और हमेशा फ्री रहेगा। हम उम्मीदवारों से आवेदन, सत्यापन या जॉइनिंग के नाम पर कभी भी कोई फीस या कमीशन नहीं लेते।',
        },
        {
          category: 'जॉइनिंग (Joining)',
          question: 'फॉर्म भरने के बाद जॉब के लिए कॉल कितने दिनों में आता है?',
          answer: 'हमारी टीम रोजाना नए आवेदनों की जांच करती है। आपके चुने हुए पद और पसंदीदा जिले में वैकेंसी उपलब्ध होते ही अधिकृत सिक्योरिटी एजेंसी आपको 2 से 7 दिनों के भीतर फोन या WhatsApp द्वारा संपर्क करती है।',
        },
        {
          category: 'प्रोफ़ाइल (Profile)',
          question: 'क्या मैं फॉर्म भरने के बाद अपने विवरण को बदल या अपडेट कर सकता हूँ?',
          answer: 'हाँ! उसी 10-अंकों वाले मोबाइल नंबर से दोबारा फॉर्म भरें। हमारा सिस्टम आपके पुराने रिकॉर्ड को पहचानकर उसे नई जानकारी से अपडेट कर देता है।',
        },
        {
          category: 'योग्यता (Eligibility)',
          question: 'क्या सिक्योरिटी गार्ड जॉब के लिए पूर्व अनुभव (Experience) जरूरी है?',
          answer: 'नहीं। सिक्योरिटी गार्ड, लेडी गार्ड और इवेंट गार्ड के कई पदों पर फ्रेशर्स (0 अनुभव) का स्वागत है। कंपनियाँ जॉइनिंग के समय बुनियादी ट्रेनिंग देती हैं। पूर्व सैन्य या सुपरवाइजर अनुभव वालों को उच्च पदों पर प्राथमिकता मिलती है।',
        },
        {
          category: 'दस्तावेज (Documents)',
          question: 'सिक्योरिटी जॉइनिंग के समय कौन से दस्तावेज (Documents) जरूरी हैं?',
          answer: 'आपको इन दस्तावेजों की आवश्यकता होगी: (1) आधार कार्ड, (2) बैंक पासबुक / कैंसिल चेक (सैलरी के लिए), (3) 10वीं/12वीं की मार्कशीट, (4) 2-4 पासपोर्ट साइज फोटो, और (5) पुलिस सत्यापन (Police Verification) प्रमाण पत्र।',
        },
        {
          category: 'वेतन (Salary)',
          question: 'सैलरी कब और कैसे मिलती है?',
          answer: 'सैलरी हर महीने की 7 से 10 तारीख के बीच सीधे आपके बैंक खाते में जमा होती है। साथ ही नियमानुसार PF और ESIC मेडिकल सुविधा का लाभ भी मिलता है।',
        },
        {
          category: 'गोपनीयता (Privacy)',
          question: 'क्या मेरा डेटा और आधार कार्ड सुरक्षित है?',
          answer: 'हाँ। आपकी निजी जानकारी और दस्तावेज पूरी तरह सुरक्षित हैं। आपका डेटा केवल अधिकृत जॉब प्लेसमेंट और वेरिफिकेशन के लिए उपयोग किया जाता है।',
        },
      ]
    : [
        {
          category: 'Registration',
          question: 'Does registering on SecurityJob cost anything?',
          answer: 'No. Registration is 100% free and will always stay free for all job seekers. SecurityJob never charges candidates any fees for application, verification, or placement.',
        },
        {
          category: 'Joining',
          question: 'How long until I receive a job call after submitting my application?',
          answer: 'Our recruitment desk reviews incoming candidate profiles daily. When an opening matching your selected role and preferred working city is active, an authorized employer reaches out to you by phone or WhatsApp — usually within 2 to 7 business days.',
        },
        {
          category: 'Profile',
          question: 'Can I update my application details after submitting?',
          answer: 'Yes! Simply submit the application form again using the exact same 10-digit mobile number. Our database automatically recognizes your record and refreshes it with your latest details without creating duplicate accounts.',
        },
        {
          category: 'Eligibility',
          question: 'Do I need prior security experience to apply?',
          answer: 'No. Many security guard and event security roles welcome freshers (0 experience). Employers provide initial on-site training. If you have prior experience in security or armed services, be sure to indicate it for supervisory roles.',
        },
        {
          category: 'Documents',
          question: 'Which documents are required for joining?',
          answer: 'You will need: (1) Aadhaar Card, (2) Bank account passbook/cheque for salary deposit, (3) Educational marksheet (10th/12th), (4) 2-4 passport size photographs, and (5) Police verification certificate if available.',
        },
        {
          category: 'Salary',
          question: 'How and when will my salary be paid?',
          answer: 'Salaries are paid monthly directly into your bank account between the 7th and 10th of every month, alongside statutory PF and ESIC medical benefits.',
        },
        {
          category: 'Privacy',
          question: 'Is my personal information secure on SecurityJob?',
          answer: 'Yes. We strictly adhere to data protection standards. Your data is shared only for verified job placement purposes. We never sell your data to third-party telemarketers.',
        },
      ];

  const categories = isHindi
    ? ['All', 'रजिस्ट्रेशन (Registration)', 'वेतन (Salary)', 'दस्तावेज (Documents)', 'योग्यता (Eligibility)', 'जॉइनिंग (Joining)']
    : ['All', 'Registration', 'Salary', 'Documents', 'Eligibility', 'Joining'];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [searchQuery, activeCategory, faqs]);

  const toggleAccordion = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "उम्मीदवार सहायता व अक्सर पूछे जाने वाले सवाल (FAQs) — SecurityJob.in" : "Help & FAQs for Job Seekers — SecurityJob.in"}
        description={isHindi ? "सिक्योरिटी गार्ड भर्ती, ₹0 रजिस्ट्रेशन फीस, सैलरी, जॉइनिंग और जरूरी दस्तावेजों से जुड़े सामान्य सवालों के जवाब।" : "Frequently asked questions about security job applications, registration fees, document requirements, salary payments, and joining on SecurityJob.in."}
        structuredData={faqSchema}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Search (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-20 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              {isHindi ? 'हेल्प व सामान्य सवाल केंद्र (Help Center)' : 'Job Seeker Help & FAQ Center'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              {isHindi
                ? 'कैंडिडेट रजिस्ट्रेशन, सैलरी, जरूरी दस्तावेज और सीधी जॉइनिंग से जुड़े प्रमुख सवालों के उत्तर पाएं।'
                : 'Find quick answers to common questions about candidate registration, salaries, document verification, and joining.'}
            </p>

            {/* Search Input Box */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? "सवाल खोजें (उदा. फीस, सैलरी, दस्तावेज, जॉइनिंग)..." : "Search questions (e.g. fee, WhatsApp, update profile, salary, documents)..."}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setExpandedIndex(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All' ? (isHindi ? 'सभी सवाल (All)' : 'All Questions') : cat}
                </button>
              ))}
            </div>

            {/* Accordion Items List */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = expandedIndex === index;
                  return (
                    <div
                      key={faq.question}
                      className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          {faq.question}
                        </span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
                <p className="text-sm font-bold text-slate-900">
                  {isHindi ? 'कोई सवाल नहीं मिला' : 'No matching questions found'}
                </p>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'कृपया दूसरे कीवर्ड से खोजें या सीधे संपर्क करें।' : 'Try searching with different keywords or contact our team directly.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white cursor-pointer"
                >
                  {isHindi ? 'सभी सवाल देखें' : 'Show All FAQs'}
                </button>
              </div>
            )}

            {/* Still Have Questions Box */}
            <div className="mt-14 p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">
                  {isHindi ? 'क्या आपका कोई अन्य सवाल है?' : 'Still have a question?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {isHindi
                    ? 'हमारी सपोर्ट टीम WhatsApp और सहायता फॉर्म पर उपलब्ध है।'
                    : 'Our candidate support desk is available on WhatsApp and phone.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isHindi ? 'नमस्ते SecurityJob टीम, मुझे एक सवाल पूछना है।' : 'Hi SecurityJob Team, I have a question regarding my application.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isHindi ? 'WhatsApp हेल्पलाइन' : 'WhatsApp Helpdesk'}
                </a>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  {isHindi ? 'संपर्क फॉर्म (Contact Form)' : 'Contact Form'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
