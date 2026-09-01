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
  KeyRound,
  AlertCircle,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
  Shield,
  HelpCircle,
  Fingerprint,
  Radio,
  ExternalLink,
  BadgeCheck
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
    <div className="min-h-screen bg-[#091124] text-slate-800 flex flex-col justify-between relative selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Top Bar for Mobile & Desktop Navigation */}
      <header className="relative z-20 w-full bg-[#070d1d]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo size="md" variant="dark" showTagline={false} />
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide">
            <Lock className="w-3 h-3 text-blue-400" />
            Executive Console
          </span>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Help</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-400" />
            <span className="hidden sm:inline">Back to</span> Portal
          </Link>
        </div>
      </header>

      {/* Main Executive Split Workspace */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        
        {/* LEFT PANEL: Deep Navy Intelligence & Operations Showcase (Desktop Only) */}
        <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-6 xl:p-8 2xl:p-10 text-white relative overflow-hidden bg-gradient-to-br from-[#091124] via-[#0d1c3d] to-[#091124] border-r border-white/[0.08]">
          
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
          <div className="relative z-10 space-y-4 xl:space-y-5 max-w-xl">
            {/* Executive Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold shadow-md shadow-blue-950/40 backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Administrative Operations & Security Console</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-black tracking-tight leading-[1.15] text-white">
                Executive Candidate <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Supervision & Dispatch
                </span>
              </h1>
              <p className="text-xs xl:text-sm text-slate-300 leading-relaxed">
                Centralized management for security guard recruitment across Rajasthan. Review verified candidate submissions, audit dual-sided Aadhaar cards, and export deployment batches.
              </p>
            </div>

            {/* Live Operational Metrics HUD */}
            <div className="grid grid-cols-3 gap-2.5 pt-0.5">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-xl xl:text-2xl font-black text-white">1,420+</div>
                <div className="text-[10px] font-semibold text-blue-300 mt-0.5">Verified Candidates</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-xl xl:text-2xl font-black text-emerald-400">33 / 33</div>
                <div className="text-[10px] font-semibold text-emerald-300 mt-0.5">Rajasthan Districts</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className="text-xl xl:text-2xl font-black text-amber-300">100%</div>
                <div className="text-[10px] font-semibold text-amber-300 mt-0.5">Aadhaar Audited</div>
              </div>
            </div>

            {/* Interactive Candidate Stream */}
            <div className="pt-1">
              <OwnerLiveCandidateStream />
            </div>

            {/* Core Capability Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">1-Click Excel Export</div>
                  <div className="text-[10px] text-slate-400 truncate">Filtered batch download</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Aadhaar Inspector</div>
                  <div className="text-[10px] text-slate-400 truncate">High-res front & back</div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel Compliance Footer */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Strict 256-Bit TLS 1.3 Encryption</span>
            </div>
            <span className="text-[11px]">Origin IP & Session Audited</span>
          </div>
        </div>

        {/* RIGHT PANEL: Crisp, High-Trust Executive Login Console (Optimized & Set Higher) */}
        <div className="w-full lg:w-5/12 flex items-start justify-center pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 px-4 sm:px-6 xl:px-8 bg-[#f8fafc] relative">
          
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
            <div className="lg:hidden mb-4 p-3 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Executive Portal</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                1,420+ Verified Candidates • 33 Rajasthan Districts • Aadhaar Verified
              </p>
            </div>

            {/* Pristine Executive Login Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_-12px_rgba(15,23,42,0.1)] border border-slate-200/90 relative">
              
              {/* Header Icon & Title */}
              <div className="text-center mb-4 sm:mb-5">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/25 mb-2.5">
                  <Shield className="w-6 h-6" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <KeyRound className="w-3 h-3 text-blue-600" />
                  Owner Portal Authentication
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
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
                    className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 shadow-sm"
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
                className="space-y-3.5"
                onKeyDown={handleKeyModifier}
                onKeyUp={handleKeyModifier}
              >
                {/* Email Field */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="owner-email"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-700"
                    >
                      Admin Email Address
                    </label>
                    <span className="text-[10px] font-bold text-blue-600">Authorized Only</span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@securityjob.in"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="owner-password"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-700"
                    >
                      Security Password
                    </label>
                    
                    {/* Caps Lock Alert */}
                    {capsLockActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded animate-pulse">
                        Caps Lock ON
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all ${
                        errors.password
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Session Checkbox & Emergency Support Link */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className="text-[11px] font-semibold text-slate-600">Keep session active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Emergency Access?
                  </button>
                </div>

                {/* High-Impact Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1.5 relative overflow-hidden inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-600/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              <div className="pt-3.5 mt-3.5 border-t border-slate-100 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    AES-256 GCM
                  </span>
                  <span>•</span>
                  <span>TLS 1.3 Strict</span>
                  <span>•</span>
                  <span>Audited</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Confidential administrative system. Unauthorized access attempts will be prosecuted.
                </p>
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
      <footer className="relative z-20 w-full bg-[#070d1d] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 text-center sm:text-left">
        <div>
          &copy; {new Date().getFullYear()} SecurityJob.in · Administrative Command Console · All rights reserved.
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Rajasthan Security Recruitment Network</span>
          <span>•</span>
          <button 
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Owner Support Desk
          </button>
        </div>
      </footer>
    </div>
  );
}
