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
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Shield,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Building2,
  MapPin
} from 'lucide-react';
import { ownerLoginSchema } from '../schemas/ownerLoginSchema.js';
import { useOwnerAuth } from '../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import OwnerSupportModal from '../components/owner/OwnerSupportModal.jsx';
import shieldEmblem from '../assets/shield-emblem.png';

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
        error?.response?.data?.message || 'Invalid administrator credentials. Please check your email and password.'
      );
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-[#e2f1fd] to-[#d4ebfc] text-slate-900 flex flex-col justify-between relative selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Ambient Lighting Accents across the full canvas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] xl:w-[600px] h-[500px] xl:h-[600px] bg-sky-300/35 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] xl:w-[600px] h-[500px] xl:h-[600px] bg-blue-300/25 rounded-full blur-[140px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(14, 116, 144, 0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header - Edge to Edge */}
      <header className="relative z-30 w-full bg-white/85 backdrop-blur-md border-b border-sky-200/70 px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <Logo size="sm" variant="light" showTagline={false} className="sm:hidden" />
          <Logo size="md" variant="light" showTagline={false} className="hidden sm:flex" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-400/25 text-blue-700 text-[11px] font-bold tracking-wide">
            <Lock className="w-3 h-3 text-blue-600" />
            Console
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
            title="Owner Support Desk"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Admin </span>
            <span>Help</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xs shadow-blue-500/20 transition-all group"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-200 shrink-0" />
            <span className="hidden sm:inline">Back to </span>
            <span>Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Full-Bleed Workspace (Fills width & height, responsive and non-clipping) */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row w-full items-center justify-center overflow-y-auto lg:overflow-hidden py-6 lg:py-2">
        
        {/* LEFT PANEL: Crazy Modern Official Brand Hologram / Orbital Console (Responsive & Balanced) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-center items-center px-6 xl:px-12 2xl:px-16 py-2 xl:py-4 h-full min-h-0 relative overflow-hidden">
          <div className="w-full max-w-md xl:max-w-lg space-y-2.5 lg:space-y-3 xl:space-y-4 text-center my-auto">
            
            {/* Header Block - Compact & Focused */}
            <div className="space-y-1 lg:space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-500/25 text-blue-700 text-[11px] xl:text-xs font-bold tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>EXECUTIVE OWNER CONSOLE</span>
              </div>

              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Administrative Command <br />
                <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                  & Security Operations
                </span>
              </h2>

              <p className="text-xs xl:text-sm text-slate-600 leading-relaxed font-medium max-w-sm xl:max-w-md mx-auto">
                Authorized supervisory portal for managing Rajasthan security guard deployments and verified records.
              </p>
            </div>

            {/* Centerpiece: Responsive Orbital Brand Shield (Prominent yet height-contained) */}
            <div className="relative my-1 lg:my-2 py-3 lg:py-4 flex items-center justify-center">
              {/* Rotating glowing ambient rings */}
              <div className="absolute w-60 h-60 lg:w-68 lg:h-68 xl:w-76 xl:h-76 rounded-full border border-blue-400/25 animate-[spin_24s_linear_infinite] pointer-events-none" />
              <div className="absolute w-48 h-48 lg:w-54 lg:h-54 xl:w-60 xl:h-60 rounded-full border border-sky-400/35 border-dashed animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />
              <div className="absolute w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-gradient-to-tr from-blue-400/20 to-sky-300/30 blur-2xl pointer-events-none" />

              {/* Official Transparent Brand Emblem - Prominent & Balanced */}
              <div className="relative z-10 p-4 sm:p-5 lg:p-5.5 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200/90 shadow-[0_18px_40px_-10px_rgba(14,116,144,0.22)] flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src={shieldEmblem}
                  alt="SecurityJob.in Official Emblem"
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 xl:w-34 xl:h-34 object-contain drop-shadow-md"
                />
              </div>

              {/* Floating Orbit Badges */}
              <div className="absolute top-0 right-2 lg:right-4 xl:right-6 bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 flex items-center gap-1.5 z-20">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Owner Verified</span>
              </div>

              <div className="absolute bottom-0 left-2 lg:left-4 xl:left-6 bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 flex items-center gap-1.5 z-20">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Encrypted Access</span>
              </div>
            </div>

            {/* Bottom Info Row - Clean & Unclipped */}
            <div className="flex items-center justify-center gap-3 lg:gap-5 text-xs xl:text-sm text-slate-600 font-semibold pt-0.5">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600" />
                Executive Security Clearance
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600" />
                33 Rajasthan Districts
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Executive Login Card (Seamless, Centered & Fully Responsive) */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center px-4 sm:px-6 xl:px-12 py-2 lg:py-6 h-full min-h-0 relative">
          <div className="w-full max-w-[390px] my-auto">
            {/* Executive Login Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-sky-200/90 rounded-xl p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(14,116,144,0.12)] ring-1 ring-white/80 relative">
              
              {/* Header Icon & Title */}
              <div className="text-center mb-4 sm:mb-5">
                <div className="mx-auto w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/15 border border-blue-400/30 flex items-center justify-center text-blue-600 mb-2.5 shadow-2xs">
                  <Shield className="w-5 h-5" />
                </div>

                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Owner Login
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to access the administration console.
                </p>
              </div>

              {/* Error Notice */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-semibold block text-rose-900">Authentication Failed</span>
                      <span className="text-[11px] text-rose-700">{formError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                noValidate 
                className="space-y-3 sm:space-y-3.5"
                onKeyDown={handleKeyModifier}
                onKeyUp={handleKeyModifier}
              >
                {/* Email Field */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="owner-email"
                    className="block text-[11px] font-bold tracking-wide uppercase text-slate-600"
                  >
                    Admin Email
                  </label>
                  
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@securityjob.in"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50/80 hover:bg-white focus:bg-white border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 shadow-2xs transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-medium text-rose-600 mt-0.5 flex items-center gap-1">
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
                      className="block text-[11px] font-bold tracking-wide uppercase text-slate-600"
                    >
                      Password
                    </label>
                    
                    {/* Caps Lock Alert */}
                    {capsLockActive && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
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
                      className={`w-full pl-9 pr-9 py-2 rounded-lg bg-slate-50/80 hover:bg-white focus:bg-white border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 shadow-2xs transition-all ${
                        errors.password
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer transition-colors"
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
                    <p className="text-[11px] font-medium text-rose-600 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Session Checkbox & Emergency Access Link */}
                <div className="flex items-center justify-between text-xs pt-0.5 pb-0.5">
                  <label className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1.5 group relative inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-600/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency / Admin Help Modal */}
      <OwnerSupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      {/* Footer - Edge to Edge */}
      <footer className="relative z-20 w-full bg-white/85 backdrop-blur-md border-t border-sky-200/70 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 shrink-0 shadow-2xs">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SecurityJob.in · Administrative Console
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-600 font-medium">Rajasthan Recruitment Network</span>
            <span className="text-slate-300">•</span>
            <button 
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors hover:underline"
            >
              Support Desk
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
