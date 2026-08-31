import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { ownerLoginSchema } from '../schemas/ownerLoginSchema.js';
import { useOwnerAuth } from '../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

export default function OwnerLoginPage() {
  useNoIndex();
  const { login, isAuthenticated, checkingSession } = useOwnerAuth();
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(ownerLoginSchema) });

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
        error?.response?.data?.message || 'Invalid email or password. Please verify your owner credentials.'
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#070c18] text-white flex flex-col justify-between relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Tech Lighting & Ambient Mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-600/5 blur-[160px]" />
        
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/[0.06]">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Logo size="md" variant="dark" showTagline={false} />
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>256-Bit SSL Encrypted</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Center Console */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Security Showcase */}
          <div className="lg:col-span-6 space-y-6 text-left hidden md:block">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Administrative Operations Console</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Executive Candidate <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Management</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
              Securely review candidate registrations, filter by Rajasthan districts, inspect Aadhaar cards, and export deployment data.
            </p>

            {/* Live Feature Highlights */}
            <div className="grid grid-cols-1 gap-3 pt-2 max-w-md">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/20 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Live Candidate Stream</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time candidate registrations across Rajasthan</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1-Click Excel / CSV Export</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Download filtered batches for field deployment</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/20 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Document Verification</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct preview of front & back Aadhaar cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Authentication Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
              
              {/* Top Card Lighting Accent */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Owner Portal Login</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white">
                  Sign in to Console
                </h2>
                <p className="text-xs text-slate-400">
                  Enter authorized administrator credentials to proceed.
                </p>
              </div>

              {/* Error Notice */}
              {formError && (
                <div className="relative z-10 mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative z-10 space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="owner-email-input"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-300"
                  >
                    Admin Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-email-input"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@securityjob.in"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                        errors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-white/15 focus:border-blue-400'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-rose-400 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="owner-password-input"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-300"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="owner-password-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                        errors.password
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-white/15 focus:border-blue-400'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white focus:outline-none cursor-pointer"
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
                    <p className="text-xs font-medium text-rose-400 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Sign In CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sign In to Owner Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Security Note */}
              <div className="relative z-10 pt-5 mt-5 border-t border-white/[0.08] text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Confidential admin system. Access is strictly audited.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-white/[0.06] text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SecurityJob.in · Administrative Console · All rights reserved.
      </footer>
    </div>
  );
}
