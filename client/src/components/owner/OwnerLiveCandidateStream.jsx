import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Radio, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const SAMPLE_CANDIDATES = [
  {
    id: 1,
    name: 'Vikram Singh Shekhawat',
    role: 'Armed Security Guard (12-Bore)',
    district: 'Jaipur Central',
    experience: '6 Yrs Experience',
    badge: 'Gunman License Valid',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-400/25',
    time: 'Just now',
    verified: true,
  },
  {
    id: 2,
    name: 'Kuldeep Gurjar',
    role: 'Senior Site Supervisor',
    district: 'Kota Industrial Hub',
    experience: 'Ex-Paramilitary (BSF)',
    badge: 'Ex-Serviceman Verified',
    badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-400/25',
    time: '3m ago',
    verified: true,
  },
  {
    id: 3,
    name: 'Rajendra Prasad Meena',
    role: 'Security Field Officer',
    district: 'Jodhpur RIICO Zone',
    experience: '4 Yrs Field Ops',
    badge: 'Inspection & Ops OK',
    badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/25',
    time: '7m ago',
    verified: true,
  },
  {
    id: 4,
    name: 'Manish Kumar Sharma',
    role: 'Industrial Security Guard',
    district: 'Bhiwadi / Alwar',
    experience: '4 Yrs Factory Guard',
    badge: 'Aadhaar Verified',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/25',
    time: '12m ago',
    verified: true,
  },
  {
    id: 5,
    name: 'Dharmendra Rathore',
    role: 'Quick Reaction Team (QRT)',
    district: 'Udaipur City Center',
    experience: 'Height 6\'0" • Heavy Driver',
    badge: 'Physical Standards 100%',
    badgeColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-400/25',
    time: '19m ago',
    verified: true,
  },
];

const DISTRICT_HUBS = [
  { name: 'Jaipur', count: '412' },
  { name: 'Jodhpur', count: '286' },
  { name: 'Kota', count: '194' },
  { name: 'Alwar', count: '175' },
  { name: 'Udaipur', count: '148' },
  { name: 'Bikaner', count: '112' },
];

export default function OwnerLiveCandidateStream() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SAMPLE_CANDIDATES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3.5">
      {/* Live Stream Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Live Rajasthan Candidate Inflow
          </span>
        </div>
        <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-400/20">
          Syncing Live
        </span>
      </div>

      {/* Dynamic Animated Candidate Stream Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 p-4 backdrop-blur-xl transition-all shadow-lg">
        <AnimatePresence mode="wait">
          {SAMPLE_CANDIDATES.map((item, idx) => {
            if (idx !== activeIndex) return null;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-3"
              >
                {/* Candidate Meta Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-600/30 border border-white/10">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white tracking-tight">{item.name}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-xs text-blue-300 font-medium">{item.role}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Location & Qualifications Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    {item.district}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    <Award className="w-3 h-3 text-amber-400" />
                    {item.experience}
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${item.badgeColor}`}>
                    <ShieldCheck className="w-3 h-3" />
                    {item.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-blue-400" />
            Active Registration Stream
          </span>
          <div className="flex items-center gap-1.5">
            {SAMPLE_CANDIDATES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? 'w-4 bg-blue-400' : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`Show candidate record ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* District Mini Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 px-1 tracking-wider">
          <span>Active Deployment Districts</span>
          <span className="text-emerald-400 font-semibold lowercase">33 districts connected</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {DISTRICT_HUBS.map((hub) => (
            <div
              key={hub.name}
              className="px-1.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <div className="text-[10px] font-bold text-slate-200 truncate">{hub.name}</div>
              <div className="text-[9px] text-blue-300 font-semibold">{hub.count}+</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
