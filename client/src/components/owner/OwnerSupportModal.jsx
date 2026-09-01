import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  Lock,
  ExternalLink
} from 'lucide-react';

export default function OwnerSupportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0d1527] border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden text-white z-10"
        >
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  Priority Assistance
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">Admin Access Support</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            For security reasons, owner password changes and multi-factor resets require identity verification through our authorized system administration desk.
          </p>

          {/* Support Channels */}
          <div className="space-y-3 mb-6">
            {/* WhatsApp Priority Channel */}
            <a
              href="https://wa.me/919828044998?text=Hello%20SecurityJob%20Admin%20Support,%20I%20need%20assistance%20with%20Owner%20Console%20access."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp Admin Support
                  </h4>
                  <p className="text-xs text-slate-400">Direct instant assistance: +91 98280 44998</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Direct Phone Helpline */}
            <a
              href="tel:+919828044998"
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    Emergency Call Desk
                  </h4>
                  <p className="text-xs text-slate-400">+91 98280 44998 (Mon – Sat, 9 AM – 7 PM IST)</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Email Support */}
            <a
              href="mailto:bansalvicky738@gmail.com?subject=Owner%20Portal%20Access%20Request"
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Email Desk
                  </h4>
                  <p className="text-xs text-slate-400">bansalvicky738@gmail.com</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Security Assurance Checklist */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Administrative Security Checklist:</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pl-5 list-disc">
              <li>All authorization changes are logged with originating IP & device signature.</li>
              <li>Emergency access requests are verified against owner records.</li>
              <li>Database credentials remain protected under AES-256 GCM encryption.</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all cursor-pointer"
            >
              Close & Return to Login
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
