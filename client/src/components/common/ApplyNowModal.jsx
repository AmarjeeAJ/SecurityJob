import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Clock } from 'lucide-react';
import CandidateApplicationForm from '../../features/candidate-registration/CandidateApplicationForm.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import { captureTrackingData } from '../../utils/tracking.js';

// Configuration Constants
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes recurring interval
const AUTO_DISMISS_MS = 5000; // 5 seconds display duration before auto-closing

export default function ApplyNowModal() {
  const location = useLocation();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoOpened, setIsAutoOpened] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const modalBodyRef = useRef(null);

  // Exclude /apply (already on application page) and /owner (admin portal)
  const isExcludedRoute = useMemo(() => {
    const path = location.pathname;
    return path.startsWith('/apply') || path.startsWith('/owner');
  }, [location.pathname]);

  // Always show modal automatically on refresh/visit, and repeat every 30 minutes
  useEffect(() => {
    if (isExcludedRoute) {
      setIsOpen(false);
      return;
    }

    // Always trigger popup on page load/refresh with smooth 600ms entrance delay
    const initialTimer = setTimeout(() => {
      setIsAutoOpened(true);
      setUserInteracted(false);
      setIsOpen(true);
    }, 600);

    // Also repeat every 30 minutes if user stays on the website
    const recurringInterval = setInterval(() => {
      if (!isExcludedRoute) {
        setIsAutoOpened(true);
        setUserInteracted(false);
        setIsOpen(true);
      }
    }, COOLDOWN_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
    };
  }, [isExcludedRoute]);

  // Auto-dismiss after 5 seconds IF the candidate has not interacted with the form
  useEffect(() => {
    if (!isOpen || !isAutoOpened || userInteracted) {
      return;
    }

    const dismissTimer = setTimeout(() => {
      setIsOpen(false);
      setHasDismissed(true);
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(dismissTimer);
  }, [isOpen, isAutoOpened, userInteracted]);

  // When candidate hovers, touches, clicks, or types in the modal, pause auto-dismiss
  const markInteracted = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
  };

  // Close modal when navigating to excluded routes
  useEffect(() => {
    if (isExcludedRoute) {
      setIsOpen(false);
    }
  }, [isExcludedRoute]);

  // Global listener for custom open event
  useEffect(() => {
    const handleTrigger = () => {
      if (!isExcludedRoute) {
        setIsAutoOpened(false);
        setUserInteracted(true);
        setIsOpen(true);
      }
    };
    window.addEventListener('open-apply-modal', handleTrigger);
    return () => window.removeEventListener('open-apply-modal', handleTrigger);
  }, [isExcludedRoute]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setHasDismissed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
  };

  const handleManualOpen = () => {
    setIsAutoOpened(false);
    setUserInteracted(true);
    setIsOpen(true);
  };

  const trackingData = useMemo(() => {
    const base = captureTrackingData('security-guard');
    return {
      ...base,
      sourceModal: 'auto_visitor_popup',
      utmMedium: base.utmMedium || 'apply_now_popup',
    };
  }, []);

  if (isExcludedRoute) {
    return null;
  }

  return (
    <>
      {/* Floating Re-open Button (displayed on desktop if user dismissed modal, allowing 1-click re-open anytime) */}
      {!isOpen && hasDismissed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          type="button"
          onClick={handleManualOpen}
          className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-white/90 group"
          aria-label="Open Apply Form"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span className="text-xs font-extrabold tracking-wide">
            {isHindi ? 'ऑनलाइन फॉर्म भरें (Apply Now)' : 'Apply for Job Free'}
          </span>
        </motion.button>
      )}

      {/* Popup Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-now-modal-title"
          >
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={markInteracted}
              onTouchStart={markInteracted}
              onFocusCapture={markInteracted}
              onKeyDownCapture={markInteracted}
              onClickCapture={markInteracted}
            >
              {/* Modal Top Header (Sticky) */}
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-3.5 sm:px-6 py-3 border-b border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2
                        id="apply-now-modal-title"
                        className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate"
                      >
                        {isHindi ? 'सिक्योरिटी जॉब आवेदन फॉर्म' : 'Security Job Online Application'}
                      </h2>
                      <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        ₹0 फ्री
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-700 font-semibold">
                        {isHindi ? 'सीधी भर्ती (Zero Fees)' : 'Direct Match (Zero Fees)'}
                      </span>
                      <span>&bull;</span>
                      {isAutoOpened && !userInteracted ? (
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                          {isHindi ? '5s में स्वतः बंद होगा' : 'Auto-close in 5s'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {isHindi ? '2 मिनट में भरें' : '2-Min Form'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Language Switcher + Close Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <LanguageToggle />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label={isHindi ? 'फॉर्म बंद करें' : 'Close apply form'}
                    title={isHindi ? 'बंद करें (Close)' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 5-Second Auto-dismiss Progress Bar (active only when untouched) */}
              {isAutoOpened && !userInteracted && (
                <div className="relative h-1 w-full bg-slate-100 overflow-hidden" title="5 सेकंड में स्वतः बंद (छूने पर खुला रहेगा)">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-amber-500"
                  />
                </div>
              )}

              {/* Modal Body Container with Inner Scroll */}
              <div
                ref={modalBodyRef}
                className="flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-5 bg-slate-50/70"
              >
                <CandidateApplicationForm
                  preselectedRole="Security Guard"
                  trackingData={trackingData}
                  isModal={true}
                  onClose={handleClose}
                  scrollContainerRef={modalBodyRef}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
