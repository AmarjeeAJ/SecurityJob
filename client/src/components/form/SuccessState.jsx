import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, MessageSquare, Briefcase, Home, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function SuccessState({ candidateCode, isExistingCandidate, whatsappNumber, onSubmitAnother }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(candidateCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  }

  const whatsappMessage = `Hi SecurityJob Team, I have successfully registered on SecurityJob.in. My Candidate ID is: ${candidateCode}. Please review my profile for suitable job openings.`;

  return (
    <div className="flex flex-col items-center gap-6 py-6 sm:py-8 text-center max-w-lg mx-auto">
      {/* Success Badge */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Application Received
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
          Application Submitted Successfully
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {isExistingCandidate
            ? 'Your previous profile was found and has been updated with your latest information and preferences.'
            : 'Your profile has been registered in our verified recruitment database.'}
        </p>
      </div>

      {/* Candidate Code Box */}
      <div className="w-full rounded-2xl border-2 border-gold-400 bg-gold-50/50 p-5 space-y-2 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-navy-800">
          Your Unique Candidate ID
        </p>
        <p className="font-mono text-2xl sm:text-3xl font-black text-navy-950 tracking-wider">
          {candidateCode}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-gold-700 bg-white/80 px-3 py-1 rounded-lg border border-gold-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard' : 'Copy Candidate ID'}
        </button>
      </div>

      {/* Next Steps Guidance */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 text-left space-y-1.5">
        <p className="font-bold text-navy-900">What happens next?</p>
        <ul className="list-disc pl-4 space-y-1 text-slate-500">
          <li>Our recruitment team will review your preferred roles and locations.</li>
          <li>When a matching vacancy opens up, an agency recruiter will contact you directly via phone or WhatsApp.</li>
          <li>Keep your ID and address documents ready for quick on-site deployment.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-3 pt-2">
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            <MessageSquare className="w-4 h-4" />
            Connect with Recruiter on WhatsApp
          </a>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Browse More Jobs
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <button
          type="button"
          onClick={onSubmitAnother}
          className="text-xs font-semibold text-slate-500 hover:text-navy-900 pt-2 underline underline-offset-2"
        >
          Submit Another Application
        </button>
      </div>
    </div>
  );
}
