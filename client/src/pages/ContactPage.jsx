import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Users, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import TextInput from '../components/common/TextInput.jsx';
import TextAreaInput from '../components/common/TextAreaInput.jsx';
import { submitContactMessage } from '../services/inquiry.service.js';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999900000';

export default function ContactPage() {
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
      setErrorMsg('Please enter your name, mobile number, and message.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await submitContactMessage(formData);
      setSubmittedResult(res);
    } catch (err) {
      setErrorMsg('Failed to send message. Please connect via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title="Candidate Support Desk — SecurityJob.in"
        description="Get in touch with SecurityJob.in candidate support. Inquire about your application status, job openings, or document verification via WhatsApp or message."
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero Section (Light Theme) */}
        <section className="bg-light-hero py-16 sm:py-20 border-b border-slate-200/80 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Phone className="w-3.5 h-3.5" />
              Candidate Support Desk
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              We're Here to Help You
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Have a question about your job application, candidate ID, or open security vacancies? Reach out and our support desk will assist you.
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Candidate Channels (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* WhatsApp Channel */}
                <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-xs">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">WhatsApp Helpdesk</h3>
                      <p className="text-xs text-slate-500">Fastest response for candidates</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Message us with your Candidate ID for fast application status checks or general questions about job openings.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi SecurityJob Team, I am looking for a job and have a question.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat on WhatsApp Now
                  </a>
                </div>

                {/* Candidate Quick Link */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">New Job Seeker?</h3>
                      <p className="text-xs text-slate-500">Free online application</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If you haven't applied yet, register your profile for free in 2 minutes to start getting matched with jobs.
                  </p>
                  <Link
                    to="/apply/security-guard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                  >
                    Start Free Application
                  </Link>
                </div>

                {/* Help FAQ Quick Link */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Read FAQs</h3>
                      <p className="text-xs text-slate-500">Common candidate questions</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Check answers to common questions about salaries, documents, and joining.
                  </p>
                  <Link
                    to="/help"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                  >
                    View Help & FAQs
                  </Link>
                </div>
              </div>

              {/* Right Column: Contact Message Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Send a Message
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      Candidate Support Request
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Fill in your details below and our team will get back to you promptly.
                    </p>
                  </div>

                  {submittedResult ? (
                    <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                        {submittedResult.message}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmittedResult(null)}
                        className="text-xs font-semibold text-blue-600 underline pt-2 cursor-pointer"
                      >
                        Send Another Message
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
                          label="Your Full Name"
                          required
                          placeholder="e.g. Ramesh Sharma"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />

                        <TextInput
                          id="mobile"
                          label="Mobile Number"
                          required
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={formData.mobile}
                          onChange={(e) => handleChange('mobile', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                          id="candidateId"
                          label="Candidate ID (If Registered)"
                          placeholder="e.g. SJ-123456"
                          value={formData.candidateId}
                          onChange={(e) => handleChange('candidateId', e.target.value)}
                        />

                        <TextInput
                          id="email"
                          label="Email Address (Optional)"
                          type="email"
                          placeholder="e.g. ramesh@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </div>

                      <TextInput
                        id="subject"
                        label="Subject / Topic"
                        placeholder="e.g. Application Status / Document Query / Salary Info"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                      />

                      <TextAreaInput
                        id="message"
                        label="Your Message / Query"
                        required
                        rows={4}
                        placeholder="Please write your question here..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
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
