import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Filter, 
  Search, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import JobFilters from '../components/jobs/JobFilters.jsx';
import SEO from '../components/common/SEO.jsx';
import { filterJobs, JOBS_CATALOG } from '../services/jobs.service.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    searchQuery: searchParams.get('search') || '',
    role: searchParams.get('role') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    experience: searchParams.get('experience') || '',
    jobType: searchParams.get('jobType') || '',
    salaryMin: Number(searchParams.get('salaryMin') || 0),
    gender: searchParams.get('gender') || '',
  });

  // Sync state when URL params change
  useEffect(() => {
    setFilters({
      searchQuery: searchParams.get('search') || '',
      role: searchParams.get('role') || '',
      category: searchParams.get('category') || '',
      city: searchParams.get('city') || '',
      experience: searchParams.get('experience') || '',
      jobType: searchParams.get('jobType') || '',
      salaryMin: Number(searchParams.get('salaryMin') || 0),
      gender: searchParams.get('gender') || '',
    });
  }, [searchParams]);

  // Handle filter changes and update URL search params
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.append('search', newFilters.searchQuery);
    if (newFilters.role) params.append('role', newFilters.role);
    if (newFilters.category) params.append('category', newFilters.category);
    if (newFilters.city) params.append('city', newFilters.city);
    if (newFilters.experience) params.append('experience', newFilters.experience);
    if (newFilters.jobType) params.append('jobType', newFilters.jobType);
    if (newFilters.salaryMin) params.append('salaryMin', String(newFilters.salaryMin));
    if (newFilters.gender) params.append('gender', newFilters.gender);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const empty = {
      searchQuery: '',
      role: '',
      category: '',
      city: '',
      experience: '',
      jobType: '',
      salaryMin: 0,
      gender: '',
    };
    setFilters(empty);
    setSearchParams(new URLSearchParams());
  };

  // Compute filtered jobs
  const filteredJobs = useMemo(() => {
    return filterJobs(filters);
  }, [filters]);

  const activeFilterCount = Object.entries(filters).filter(([key, val]) => {
    if (!val || val === 'All' || val === 0 || val === '') return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title="राजस्थान में सिक्योरिटी जॉब्स — सिक्योरिटी गार्ड, सुपरवाइजर, सीसीटीवी भर्ती"
        description="जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, भिवाड़ी, नीमराना आदि राजस्थान के सभी जिलों में सिक्योरिटी गार्ड भर्ती। 100% फ्री आवेदन।"
      />

      <Navbar />

      <main className="flex-1">
        {/* Top Header Banner (Light Theme & Rajasthan Focus) */}
        <section className="bg-light-hero py-10 sm:py-14 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                {isHindi ? 'राजस्थान वेरिफाइड जॉब्स' : 'Rajasthan Verified Openings'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {isHindi ? 'राजस्थान में सिक्योरिटी जॉब खोजें' : 'Find Security Jobs in Rajasthan'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                {isHindi
                  ? 'जयपुर, जोधपुर, उदयपुर, कोटा, अलवर, नीमराना आदि में गार्ड, सुपरवाइजर व सीसीटीवी ऑपरेटर की भर्ती।'
                  : 'Discover active guarding, supervision, CCTV, and facility openings across Rajasthan with transparent monthly salaries.'}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content: Sidebar + Job Results */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile Filter Action & Results Count Bar */}
            <div className="flex items-center justify-between pb-6 lg:hidden">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} {isHindi ? 'उपलब्ध' : 'Found'}
                </p>
                {activeFilterCount > 0 && (
                  <p className="text-[11px] text-slate-500">{activeFilterCount} active filters</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                {isHindi ? 'फ़िल्टर विकल्प' : 'Filter Options'}
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px]">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Desktop Filter Sidebar (4 cols) */}
              <div className="hidden lg:block lg:col-span-4 sticky top-24">
                <JobFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Job Results Grid (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Desktop Top Summary Bar */}
                <div className="hidden lg:flex items-center justify-between pb-2 border-b border-slate-200/80 text-xs text-slate-500 font-medium">
                  <span>
                    {isHindi ? 'दिखा रहे हैं' : 'Showing'} <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> {isHindi ? 'सक्रिय सिक्योरिटी पद' : 'active security roles in Rajasthan'}
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                    >
                      {isHindi ? 'सभी फ़िल्टर हटाएं' : 'Clear all filters'} ({activeFilterCount})
                    </button>
                  )}
                </div>

                {filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold text-xl">
                      🔍
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isHindi ? 'कोई मेल खाती जॉब नहीं मिली' : 'No matching roles found'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {isHindi
                        ? 'कृपया अपने फ़िल्टर बदलें या सामान्य सर्च करें।'
                        : 'Try adjusting your city or role filter to see other available openings.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isHindi ? 'सभी पद देखें' : 'View All Openings'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Filter Slide-out Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-white rounded-t-3xl overflow-y-auto p-5 shadow-2xl lg:hidden"
            >
              <JobFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                onClose={() => setMobileFilterOpen(false)}
              />
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  {isHindi ? `दिखाएं (${filteredJobs.length} पद)` : `Show ${filteredJobs.length} Results`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
