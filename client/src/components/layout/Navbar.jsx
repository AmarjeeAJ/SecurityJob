import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Briefcase, 
  BookOpen, 
  Info, 
  Phone, 
  HelpCircle, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Logo from '../common/Logo.jsx';
import LanguageToggle from '../common/LanguageToggle.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: isHindi ? 'जॉब खोजें' : 'Find Jobs', href: '/jobs', icon: Briefcase },
    { label: isHindi ? 'कैरियर गाइड' : 'Career Guide', href: '/career-guide', icon: BookOpen },
    { label: isHindi ? 'हमारे बारे में' : 'About Us', href: '/about', icon: Info },
    { label: isHindi ? 'सहायता (FAQ)' : 'Help & FAQs', href: '/help', icon: HelpCircle },
    { label: isHindi ? 'संपर्क करें' : 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-slate-200/90 ${
          scrolled ? 'shadow-md py-2 sm:py-2.5 bg-white/98' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <Logo size="md" variant="light" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                    active
                      ? 'text-blue-600 bg-blue-50/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Language Toggle */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Automatic Language Toggle */}
            <LanguageToggle />

            <Link
              to="/apply/security-guard"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isHindi ? 'फ्री आवेदन करें' : 'Apply for Job Free'}</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Language Toggle & Menu Button */}
          <div className="flex items-center gap-1.5 sm:hidden shrink-0">
            {/* Mobile Language Toggle */}
            <LanguageToggle />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <Logo size="md" variant="light" />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher in Drawer */}
              <div className="px-4 py-3 flex items-center justify-between bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">{isHindi ? 'भाषा चुनें:' : 'Language:'}</span>
                <LanguageToggle />
              </div>

              {/* Drawer Links */}
              <div className="p-4 space-y-1 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                  {isHindi ? 'मेन्यू (Menu)' : 'Navigation Menu'}
                </p>

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 font-bold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer Action */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5">
                <Link
                  to="/apply/security-guard"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isHindi ? 'फ्री आवेदन करें' : 'Apply for Security Job (Free)'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <p className="text-center text-[10px] text-slate-500">
                  {isHindi ? '100% फ्री रजिस्ट्रेशन • सीधी भर्ती' : '100% Free Registration • Direct Joining'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
