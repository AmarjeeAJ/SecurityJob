import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  MapPin,
  Mail,
  Building,
  Award,
  Clock
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import TextInput from '../components/common/TextInput.jsx';
import TextAreaInput from '../components/common/TextAreaInput.jsx';
import { submitContactMessage } from '../services/inquiry.service.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919929992886';

export default function ContactPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    candidateId: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      setErrorMsg(
        isHindi
          ? 'कृपया अपना नाम, मोबाइल नंबर और संदेश दर्ज करें।'
          : 'Please enter your name, mobile number, and message.'
      );
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await submitContactMessage(formData);
      setSubmittedResult(res);
    } catch (err) {
      setErrorMsg(
        isHindi
          ? 'संदेश भेजने में विफल। कृपया सीधे WhatsApp पर संपर्क करें।'
          : 'Failed to send message. Please connect via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "उम्मीदवार सहायता केंद्र (Contact Support) — SecurityJob.in | Avijit Enterprises" : "Candidate Support Desk — SecurityJob.in | Avijit Enterprises"}
        description={isHindi ? "SecurityJob.in (Avijit Enterprises, जयपुर) सहायता डेस्क से संपर्क करें। अपने फॉर्म स्टेटस, नई जॉब्स या जरूरी डॉक्युमेंट्स की जानकारी WhatsApp या फोन +91 98280 44998 पर प्राप्त करें।" : "Get in touch with SecurityJob.in (Avijit Enterprises, Jaipur). Inquire about your application status, job openings, or document verification via WhatsApp or call +91 98280 44998."}
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-20 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Phone className="w-3.5 h-3.5" />
              {isHindi ? 'कैंडिडेट सहायता केंद्र (Support Desk)' : 'Candidate Support Desk'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {isHindi ? 'हम आपकी सहायता के लिए तैयार हैं' : "We're Here to Help You"}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              {isHindi
                ? 'अपने आवेदन फॉर्म, कैंडिडेट आईडी या सिक्योरिटी जॉब वैकेंसी से जुड़ा कोई भी सवाल हो, हमारी सपोर्ट टीम से संपर्क करें।'
                : 'Have a question about your job application, candidate ID, or open security vacancies? Reach out and our support desk will assist you.'}
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Candidate Channels & Corporate Info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. WhatsApp Channel */}
                <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isHindi ? 'WhatsApp हेल्पलाइन' : 'WhatsApp Helpdesk'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        +91 98280 44998 &middot; {isHindi ? 'सबसे तेज़ जवाब' : 'Fastest Response'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'अपनी कैंडिडेट आईडी या जॉब से जुड़ा सवाल सीधे WhatsApp पर भेजें और तुरंत सहायता पाएं।'
                      : 'Message us with your Candidate ID for fast application status checks or general questions about job openings.'}
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(isHindi ? 'नमस्ते SecurityJob टीम, मुझे जॉब संबंधित सहायता चाहिए।' : 'Hi SecurityJob Team, I am looking for a job and have a question.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {isHindi ? 'WhatsApp पर चैट करें' : 'Chat on WhatsApp Now'}
                  </a>
                </div>

                {/* 2. Registered Office & Corporate Entity Card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isHindi ? 'पंजीकृत उद्यम' : 'Registered Enterprise'}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          AVIJIT ENTERPRISES
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-bold">
                        GST Registered
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                        MSME Micro
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 block">
                          {isHindi ? 'कार्यालय का पता' : 'Office Address'}:
                        </strong>
                        <span>159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <strong className="text-slate-800 mr-1">{isHindi ? 'फोन / मोबाइल' : 'Phone'}:</strong>
                        <a href="tel:+919929992886" className="text-blue-600 hover:underline font-bold">
                          +91 99299 92886
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <strong className="text-slate-800 mr-1">{isHindi ? 'ईमेल' : 'Email'}:</strong>
                        <a href="mailto:hr@securityjob.in" className="text-blue-600 hover:underline font-semibold">
                          hr@securityjob.in
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1 text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{isHindi ? 'सोमवार से शनिवार (9:00 AM – 7:00 PM)' : 'Mon – Sat (9:00 AM – 7:00 PM IST)'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Help FAQ Quick Link */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {isHindi ? 'सामान्य सवाल व जवाब' : 'Common Questions'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isHindi ? 'सैलरी, जॉइनिंग व दस्तावेज' : 'Salaries, documents & joining'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/help"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
                  >
                    {isHindi ? 'FAQs देखें' : 'View FAQs'}
                  </Link>
                </div>
              </div>

              {/* Right Column: Contact Message Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {isHindi ? 'संदेश भेजें' : 'Send a Message'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {isHindi ? 'कैंडिडेट सहायता अनुरोध' : 'Candidate Support Request'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isHindi
                        ? 'नीचे अपना विवरण भरें, हमारी टीम जल्द ही आपसे संपर्क करेगी।'
                        : 'Fill in your details below and our team will get back to you promptly.'}
                    </p>
                  </div>

                  {submittedResult ? (
                    <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {isHindi ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message Sent Successfully!'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                        {submittedResult.message || (isHindi ? 'आपका संदेश प्राप्त हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।' : 'Your message has been received. Our team will contact you shortly.')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmittedResult(null)}
                        className="text-xs font-semibold text-blue-600 underline pt-2 cursor-pointer"
                      >
                        {isHindi ? 'दूसरा संदेश भेजें' : 'Send Another Message'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                          {errorMsg}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                          id="name"
                          label={isHindi ? 'आपका पूरा नाम (Full Name)' : 'Your Full Name'}
                          required
                          placeholder={isHindi ? 'उदा. रमेश शर्मा' : 'e.g. Ramesh Sharma'}
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />

                        <TextInput
                          id="mobile"
                          label={isHindi ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}
                          required
                          type="tel"
                          placeholder={isHindi ? 'उदा. 9828044998' : 'e.g. 9828044998'}
                          value={formData.mobile}
                          onChange={(e) => handleChange('mobile', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                          id="candidateId"
                          label={isHindi ? 'कैंडिडेट आईडी (यदि उपलब्ध हो)' : 'Candidate ID (If Registered)'}
                          placeholder={isHindi ? 'उदा. SJ-123456' : 'e.g. SJ-123456'}
                          value={formData.candidateId}
                          onChange={(e) => handleChange('candidateId', e.target.value)}
                        />

                        <TextInput
                          id="email"
                          label={isHindi ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                          type="email"
                          placeholder="e.g. name@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </div>

                      <TextInput
                        id="subject"
                        label={isHindi ? 'विषय / समस्या का प्रकार' : 'Subject / Topic'}
                        placeholder={isHindi ? 'उदा. आवेदन स्थिति / दस्तावेज सत्यापन / सैलरी जानकारी' : 'e.g. Application Status / Document Query / Salary Info'}
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                      />

                      <TextAreaInput
                        id="message"
                        label={isHindi ? 'आपका संदेश / सवाल' : 'Your Message / Query'}
                        required
                        rows={4}
                        placeholder={isHindi ? 'कृपया अपना सवाल या संदेश यहाँ लिखें...' : 'Please write your question here...'}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting 
                          ? (isHindi ? 'संदेश भेजा जा रहा है...' : 'Sending Message...') 
                          : (isHindi ? 'संदेश भेजें (Send Message)' : 'Send Message')}
                      </button>
                    </form>
                  )}
                </div>
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
