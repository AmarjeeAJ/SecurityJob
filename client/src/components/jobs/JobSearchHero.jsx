import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import ROLE_SLUGS from '../../utils/roleSlugs.js';
import { RAJASTHAN_CITIES } from '../../utils/locations.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function JobSearchHero({ onSearch = null, initialRole = '', initialCity = '' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ role: selectedRole, city: selectedCity });
    } else {
      const params = new URLSearchParams();
      if (selectedRole) params.append('role', selectedRole);
      if (selectedCity) params.append('city', selectedCity);
      navigate(`/jobs?${params.toString()}`);
    }
  };

  const quickRoles = isHindi
    ? [
        { label: 'Security Guard (गार्ड)', role: 'security-guard' },
        { label: 'Supervisor (सुपरवाइजर)', role: 'security-supervisor' },
        { label: 'Lady Guard (लेडी गार्ड)', role: 'lady-security-guard' },
        { label: 'CCTV Operator (सीसीटीवी)', role: 'cctv-operator' },
        { label: 'Armed Guard (गनमैन)', role: 'armed-guard' },
        { label: 'Bouncer (बाउंसर)', role: 'bouncer' },
      ]
    : [
        { label: 'Security Guard', role: 'security-guard' },
        { label: 'Security Supervisor', role: 'security-supervisor' },
        { label: 'Lady Security Guard', role: 'lady-security-guard' },
        { label: 'CCTV Operator', role: 'cctv-operator' },
        { label: 'Armed Guard', role: 'armed-guard' },
        { label: 'Bouncer', role: 'bouncer' },
      ];

  return (
    <div className="w-full">
      {/* Search Form Container */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-lg shadow-slate-900/5 border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-center"
      >
        {/* Role Selector */}
        <div className="md:col-span-5 relative flex items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-blue-500 transition-all">
          <Briefcase className="w-5 h-5 text-blue-600 shrink-0 mr-2.5" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-role-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'जॉब रोल (Job Role)' : 'Security Job Role'}
            </label>
            <select
              id="search-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none truncate"
            >
              <option value="">{isHindi ? 'सभी सिक्योरिटी रोल (19+ श्रेणियां)' : 'All Security Roles (19+ Categories)'}</option>
              {ROLE_SLUGS.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City Selector (Rajasthan Cities) */}
        <div className="md:col-span-4 relative flex items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-blue-500 transition-all">
          <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mr-2.5" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-city-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'राजस्थान में जिला / शहर' : 'Rajasthan District / City'}
            </label>
            <select
              id="search-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none truncate"
            >
              <option value="">{isHindi ? 'पूरे राजस्थान में (All Rajasthan)' : 'All Rajasthan Districts'}</option>
              {RAJASTHAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Action Button */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full h-full min-h-[3rem] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Search className="w-4 h-4 text-white" />
            <span>{isHindi ? 'जॉब खोजें' : 'Search Jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Search Tag Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span className="text-slate-500 font-semibold hidden sm:inline">
          {isHindi ? 'लोकप्रिय जॉब:' : 'Popular Roles:'}
        </span>
        {quickRoles.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={() => {
              setSelectedRole(pill.role);
              if (onSearch) onSearch({ role: pill.role, city: selectedCity });
              else navigate(`/jobs?role=${pill.role}`);
            }}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 transition-all text-xs font-medium cursor-pointer shadow-2xs"
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
