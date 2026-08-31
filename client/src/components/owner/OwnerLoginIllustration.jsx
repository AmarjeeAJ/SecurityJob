import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  Lock, 
  Award,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import Logo from '../common/Logo.jsx';

export default function OwnerLoginIllustration() {
  const highlights = [
    {
      icon: Users,
      title: 'Real-Time Candidate Pipeline',
      desc: 'Instant access to all security guard, supervisor & technical applications across Rajasthan.',
    },
    {
      icon: FileSpreadsheet,
      title: 'One-Click Excel / CSV Export',
      desc: 'Download filtered candidate profiles, contact numbers, and Aadhaar records securely.',
    },
    {
      icon: ShieldCheck,
      title: 'Document & Aadhaar Verification',
      desc: 'Review front & back Aadhaar cards, experience claims, and duty preferences.',
    },
  ];

  return (
    <div className="relative hidden h-full min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-[#0b1329] to-blue-950 p-8 xl:p-12 text-white lg:flex select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        
        {/* Subtle Tech Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" variant="dark" showTagline={true} />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold backdrop-blur-md">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          Owner Console v2.0
        </span>
      </div>

      {/* Centerpiece Hero Showcase */}
      <div className="relative z-10 my-auto py-8 max-w-lg space-y-6">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Centralized Candidate Management System</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
          Security Recruitment Management Portal
        </h1>

        <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
          Monitor candidate registrations, review identity credentials, filter by Rajasthan districts, and coordinate direct candidate deployments.
        </p>

        {/* Feature Cards Grid */}
        <div className="space-y-3 pt-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-md transition-all flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/20 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Security Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Encrypted Owner Session</span>
        </div>
        <span>SecurityJob.in System Management</span>
      </div>
    </div>
  );
}
