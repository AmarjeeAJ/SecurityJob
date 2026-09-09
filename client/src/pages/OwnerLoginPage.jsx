import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Cpu,
  Shield,
  HelpCircle
} from 'lucide-react';
import { ownerLoginSchema } from '../schemas/ownerLoginSchema.js';
import { useOwnerAuth } from '../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import OwnerLiveCandidateStream from '../components/owner/OwnerLiveCandidateStream.jsx';
import OwnerSupportModal from '../components/owner/OwnerSupportModal.jsx';

export default function OwnerLoginPage() {
  useNoIndex();
  const { login, isAuthenticated, checkingSession } = useOwnerAuth();
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(ownerLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Track CapsLock state in real-time
  const handleKeyModifier = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  if (!checkingSession && isAuthenticated) {
    const redirectTo = location.state?.from || '/owner/candidates';
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(data) {
    setFormError('');
    try {
      await login(data.email, data.password);
      navigate('/owner/candidates', { replace: true });
    } catch (error) {
      setFormError(
        error?.response?.data?.message || 'Invalid administrator credentials. Please check your email and security password.'
      );
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#091124] text-slate-800 flex flex-col justify-between relative selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Top Bar for Mobile & Desktop Navigation */}
      <header className="sticky top-0 z-30 w-full bg-[#070d1d]/95 backdrop-blur-md border-b border-white/[0.08] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 shrink-0">
        <Link to="/" className="inline-flex items-center gap-2 group min-w-0 shrink-0">
          <Logo size="sm" variant="dark" showTagline={false} className="sm:hidden" />
          <Logo size="md" variant="dark" showTagline={false} className="hidden sm:flex" />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide">
            <Lock className="w-3 h-3 text-blue-400" />
            Executive Console
          </span>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Gateway 24ms · TLS 1.3 Active</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Owner & Admin Support Desk"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Admin </span>
            <span>Help</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 transition-all group shrink-0 whitespace-nowrap"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Back to </span>
            <span>Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Executive Split Workspace */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto overflow-hidden">
        
        {/* LEFT PANEL: Deep Navy Intelligence & Operations Showcase (Desktop Only) */}
        <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-4 xl:p-6 2xl:p-8 text-white relative overflow-hidden bg-gradient-to-br from-[#091124] via-[#0d1c3d] to-[#091124] border-r border-white/[0.08]">
          
          {/* Subtle Ambient Background Mesh */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
            
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          {/* Top Section */}
          <div className="relative z-10 space-y-2 xl:space-y-3 max-w-xl my-auto">
            {/* Executive Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-bold shadow-md shadow-blue-950/40 backdrop-blur-md">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span>Administrative Operations & Security Console</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-xl xl:text-2xl 2xl:text-3xl font-black tracking-tight leading-tight text-white">
                Executive Candidate <br className="hidden xl:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  {' '}Supervision & Dispatch
                </span>
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                Centralized management for security guard recruitment across Rajasthan. Review verified candidate submissions, audit dual-sided Aadhaar cards, and export deployment batches.
              </p>
            </div>

            {/* Live Operational Metrics HUD */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <div className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-base xl:text-lg font-black text-white">1,420+</div>
                <div className="text-[9px] xl:text-[10px] font-semibold text-blue-300">Verified Candidates</div>
              </div>
              <div className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-base xl:text-lg font-black text-emerald-400">33 / 33</div>
                <div className="text-[9px] xl:text-[10px] font-semibold text-emerald-300">Rajasthan Districts</div>
              </div>
              <div className="px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-base xl:text-lg font-black text-amber-300">100%</div>
                <div className="text-[9px] xl:text-[10px] font-semibold text-amber-300">Aadhaar Audited</div>
              </div>
            </div>

            {/* Interactive Candidate Stream */}
            <div className="pt-1">
              <OwnerLiveCandidateStream />
            </div>
          </div>

          {/* Left Panel Compliance Footer */}
          <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] xl:text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict 256-Bit TLS 1.3 Encryption</span>
            </div>
            <span>Origin IP & Session Audited</span>
          </div>
        </div>

        {/* RIGHT PANEL: Crisp, High-Trust Executive Login Console (Centered & Optimized) */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-3.5 sm:p-6 lg:p-4 xl:p-6 bg-[#f8fafc] relative overflow-y-auto">
          
          {/* Subtle Clean Pattern Background */}
          <div 
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="w-full max-w-md relative z-10">
            
            {/* Mobile Summary Pill (Only visible on small screens) */}
            <div className="lg:hidden mb-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Executive Portal</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                1,420+ Verified Candidates • 33 Rajasthan Districts • Aadhaar Verified
              </p>
            </div>

            {/* Pristine Executive Login Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 xl:p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.09)] border border-slate-200/90 relative">
              
              {/* Header Icon & Title */}
              <div className="text-center mb-5 sm:mb-6">
                <div className="mx-auto w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 mb-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                  Sign in with your verified administrator credentials to access records.
                </p>
              </div>

              {/* Error Notice */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-3.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <span className="font-bold block text-rose-900">Access Denied</span>
                      <span className="text-rose-700">{formError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                noValidate 
                className="space-y-3.5 sm:space-y-4"
                onKeyDown={handleKeyModifier}
                onKeyUp={handleKeyModifier}
              >
                {/* Email Field */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="owner-email"
                      className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700"
                    >
                      Admin Email Address
                    </label>
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-600">Authorized Only</span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@securityjob.in"
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="owner-password"
                      className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700"
                    >
                      Security Password
                    </label>
                    
                    {/* Caps Lock Alert */}
                    {capsLockActive && (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded animate-pulse">
                        Caps Lock ON
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all ${
                        errors.password
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Session Checkbox & Emergency Support Link */}
                <div className="flex items-center justify-between text-xs pt-0.5 pb-0.5">
                  <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">Keep session active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Emergency Access?
                  </button>
                </div>

                {/* High-Impact Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1.5 relative overflow-hidden inline-flex items-center justify-center gap-2 py-3 sm:py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-600/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-blue-200" />
                      <span>Sign In to Executive Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Security Compliance Notice */}
              <div className="pt-4 sm:pt-5 mt-5 sm:mt-6 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    AES-256 GCM
                  </span>
                  <span>•</span>
                  <span>TLS 1.3 Strict</span>
                  <span>•</span>
                  <span>Audited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency / Admin Help Modal */}
      <OwnerSupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      {/* Unified Bottom Footer */}
      <footer className="sticky bottom-0 z-20 w-full bg-[#070d1d] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 shrink-0">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center sm:text-left">
          <div className="text-[11px] sm:text-xs text-slate-400/90 leading-snug">
            &copy; {new Date().getFullYear()} SecurityJob.in · Administrative Command Console · All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[11px] text-slate-400">
            <span className="text-slate-300 font-medium">Rajasthan Security Recruitment Network</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <button 
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors hover:underline"
            >
              Owner Support Desk
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
