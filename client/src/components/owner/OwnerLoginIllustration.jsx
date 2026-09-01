import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Lock, 
  Sparkles,
  Fingerprint,
  Radio,
  Cpu
} from 'lucide-react';
import Logo from '../common/Logo.jsx';
import OwnerLiveCandidateStream from './OwnerLiveCandidateStream.jsx';

export default function OwnerLoginIllustration() {
  return (
    <div className="relative hidden h-full min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-[#050914] via-[#0b1329] to-[#050914] p-8 xl:p-12 text-white lg:flex select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        
        {/* Subtle Tech Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" variant="dark" showTagline={true} />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          Owner Console v3.2
        </span>
      </div>

      {/* Centerpiece Hero Showcase */}
      <div className="relative z-10 my-auto py-6 max-w-lg space-y-5">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Centralized Candidate Management System</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
          Security Workforce Recruitment & Deployment
        </h1>

        <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
          Monitor incoming registrations in real time, review identity credentials, filter across 33 Rajasthan districts, and coordinate deployment batches.
        </p>

        {/* Live Stream Telemetry preview */}
        <OwnerLiveCandidateStream />
      </div>

      {/* Bottom Security Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Encrypted Owner Session</span>
        </div>
        <span>SecurityJob.in Administrative Network</span>
      </div>
    </div>
  );
}
