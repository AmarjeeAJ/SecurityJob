import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo.jsx';
import Card from '../components/common/Card.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-collect', title: '2. Information You Provide' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'tracking', title: '4. Advertising & Analytics' },
  { id: 'sharing', title: '5. Sharing Your Information' },
  { id: 'security', title: '6. How We Protect Your Data' },
  { id: 'retention', title: '7. Data Retention' },
  { id: 'rights', title: '8. Your Rights' },
  { id: 'children', title: '9. Age Eligibility' },
  { id: 'changes', title: '10. Changes to This Policy' },
  { id: 'contact', title: '11. Contact Us' },
];

const LAST_UPDATED = 'August 8, 2026';

// One small icon per section — the "professional company" polish this page
// needed came from consistent iconography and generous whitespace, not stock
// photography, which would have meant pulling in an external asset host this
// app deliberately has none of.
const ICONS = {
  introduction: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM12 16v-4m0-4h.01" />,
  'information-we-collect': <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  'how-we-use': <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7ZM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  tracking: <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M21 7v6h-6" />,
  sharing: <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8-4M8.6 10.5l6.8 4" />,
  security: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Zm-3 10 2 2 4-4" />,
  retention: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v4l3 3" />,
  rights: <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4M20.618 5.984A11 11 0 0 1 12 2 11 11 0 0 1 3.382 5.984 11 11 0 0 0 12 22a11 11 0 0 0 8.618-16.016Z" />,
  children: <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3.5 9h17M4 5h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4.5 8.5 2 2 4-4" />,
  changes: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-3-6.7M21 3v5h-5" />,
  contact: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v12H7l-3 3V4Z" />,
};

function SectionIcon({ id }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600">
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
        {ICONS[id]}
      </svg>
    </span>
  );
}

function Section({ id, title, index, children }) {
  return (
    <section
      id={id}
      className="reveal scroll-mt-24 border-b border-slate-100 py-8 first:pt-0 last:border-b-0"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-center gap-3">
        <SectionIcon id={id} />
        <h2 className="text-lg font-bold text-navy-900 sm:text-xl">{title}</h2>
      </div>
      <div className="mt-3 flex flex-col gap-3 pl-12 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  useNoIndex(); // policy pages carry no ranking value of their own; keep search focused on /apply

  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        observer.observe(el);
      }
    });

    function handleScroll() {
      setShowBackToTop(window.scrollY > 480);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function goToSection(id) {
    setTocOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="bg-mesh-light min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/apply/security-guard" className="flex items-center gap-2">
              <Logo size="sm" variant="light" showTagline={false} />
            </Link>
            {/* Stays pinned in the sticky bar once the hero scrolls past, so the
                page's identity never disappears no matter how far down you are. */}
            <span className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
              <span className="text-sm font-bold text-navy-900">Privacy Policy</span>
              <span className="text-xs text-slate-400">Updated {LAST_UPDATED}</span>
            </span>
          </div>
          <Link
            to="/apply/security-guard"
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors hover:text-gold-600"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Application</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="reveal relative mx-auto max-w-7xl overflow-hidden px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-16">
        {/* Soft radial glow behind the emblem — decorative, brand-consistent, no external assets. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-6 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-400/25 blur-3xl"
        />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-[0_10px_30px_-8px_rgba(10,21,48,0.5)]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.5 2.5 4.5-4.5" />
          </svg>
        </div>

        <h1 className="relative mt-5 text-2xl font-extrabold text-navy-900 sm:text-4xl">Privacy Policy</h1>
        <p className="relative mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="relative mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          SecurityJob helps security guards and industry professionals find employment opportunities. This page
          explains, in plain language, exactly what information we ask for, why we need it, and how it is protected.
        </p>

        <div className="relative mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2.5">
          {[
            { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 1 0-8 0v2h8Z" />, text: 'Encrypted Connection' },
            { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />, text: 'Access Restricted to Staff' },
            { icon: <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4M20.618 5.984A11 11 0 0 1 12 2 11 11 0 0 1 3.382 5.984 11 11 0 0 0 12 22a11 11 0 0 0 8.618-16.016Z" />, text: 'You Stay in Control' },
          ].map((badge) => (
            <span
              key={badge.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2">
                {badge.icon}
              </svg>
              {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile: collapsible contents list, since a sidebar has nowhere to go on a phone. */}
      <div className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:hidden" style={{ animationDelay: '80ms' }}>
        <Card className="mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-navy-900"
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Contents
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 text-slate-400 transition-transform ${tocOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {tocOpen && (
            <nav className="border-t border-slate-100 px-2 py-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(s.id)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeId === s.id ? 'bg-gold-500/10 font-semibold text-navy-900' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          )}
        </Card>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          {/* Desktop: sticky sidebar with scroll-spy highlighting. */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 flex flex-col gap-0.5 border-l border-slate-200 pl-4">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(s.id)}
                  className={`-ml-px border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                    activeId === s.id
                      ? 'border-gold-500 font-semibold text-navy-900'
                      : 'border-transparent text-slate-400 hover:text-navy-700'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          <Card className="reveal p-6 sm:p-8 lg:p-10" style={{ animationDelay: '120ms' }}>
            <Section id="introduction" title="1. Introduction" index={0}>
              <p>
                SecurityJob (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates a recruitment platform
                that connects security guards and security-industry professionals with employment opportunities
                across India. This Privacy Policy applies to the public application form and describes how
                information submitted through it is used, stored and protected.
              </p>
              <p>
                By submitting the application form, you consent to the practices described in this policy. If you do
                not agree, please do not submit your details.
              </p>
            </Section>

            <Section id="information-we-collect" title="2. Information You Provide" index={1}>
              <p>When you register, we ask you for the following so we can consider you for a role:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Full name, age and gender</li>
                <li>Mobile number and WhatsApp number</li>
                <li>Current city, area/locality and state</li>
                <li>Highest qualification (optional)</li>
                <li>Preferred job roles and preferred working cities</li>
                <li>Prior security work experience, employment status, joining availability and duty-hour preference (only if you indicate you have prior experience)</li>
                <li>A photo identity document for verification purposes (optional)</li>
              </ul>
              <p>
                Any identity document you choose to upload is transmitted securely, stored using a non-identifying
                file reference, and viewable only by our authorized recruitment staff. Providing one is optional and
                is never required to complete your application.
              </p>
              <p>
                We also automatically record technical information about how you reached the form — such as the
                referring page and device type — described in Section 4.
              </p>
            </Section>

            <Section id="how-we-use" title="3. How We Use Your Information" index={2}>
              <p>We use the information you provide to:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Consider you for security-industry job opportunities matching your profile</li>
                <li>Contact you by phone, WhatsApp or SMS about relevant openings</li>
                <li>Maintain a record of your application and any updates you submit later</li>
                <li>Understand which recruitment campaigns are effective, so we can reach more candidates like you</li>
              </ul>
              <p>
                If you submit the form again with the same mobile number, your profile is updated with your latest
                details rather than creating a duplicate record — but a record of each time you applied, and through
                which channel, is retained for our own reference.
              </p>
            </Section>

            <Section id="tracking" title="4. Advertising & Analytics" index={3}>
              <p>
                If you arrive from an online advertisement, we record standard campaign information — such as which
                campaign referred you, your device type and browser — to understand which channels help us reach
                genuine candidates. This helps us run more relevant recruitment campaigns and does not affect
                whether your application is considered.
              </p>
            </Section>

            <Section id="sharing" title="5. Sharing Your Information" index={4}>
              <p>We do not sell your personal information. It may be shared only with:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Our authorized recruitment partners and hiring employers, strictly for the purpose of considering you for a role</li>
                <li>Service providers who host our infrastructure (server hosting, database), bound to protect your data and prohibited from using it for any other purpose</li>
                <li>Law enforcement or regulators, only if legally required to do so</li>
              </ul>
            </Section>

            <Section id="security" title="6. How We Protect Your Data" index={5}>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>All data is transmitted over encrypted HTTPS connections</li>
                <li>The recruitment dashboard is protected by a password-authenticated session with rate-limiting against repeated login attempts</li>
                <li>Uploaded documents use randomized, non-guessable filenames</li>
                <li>Malicious input (such as script or formula injection) is automatically filtered from every submission</li>
                <li>Access to candidate records is restricted to authorized recruitment staff only</li>
              </ul>
            </Section>

            <Section id="retention" title="7. Data Retention" index={6}>
              <p>
                We retain your application details for as long as reasonably necessary to consider you for current
                and future opportunities, or until you request deletion (see Section 8). If you re-apply, your
                profile is refreshed rather than duplicated, while a history of your past submissions is kept for
                our internal recruitment records.
              </p>
            </Section>

            <Section id="rights" title="8. Your Rights" index={7}>
              <p>You may, at any time:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Request a copy of the information we hold about you</li>
                <li>Request correction of inaccurate details</li>
                <li>Request that your information, including any uploaded documents, be deleted from our records</li>
                <li>Withdraw consent to be contacted about future opportunities</li>
              </ul>
              <p>To exercise any of these rights, contact us using the details in Section 11.</p>
            </Section>

            <Section id="children" title="9. Age Eligibility" index={8}>
              <p>
                This platform is intended for candidates aged 18 to 65, in line with standard eligibility for
                security-industry employment in India. This platform is not intended for anyone outside
                this range.
              </p>
            </Section>

            <Section id="changes" title="10. Changes to This Policy" index={9}>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal
                reasons. The &ldquo;Last updated&rdquo; date at the top of this page will always reflect the most
                recent revision. Continued use of the application form after a change constitutes acceptance of the
                updated policy.
              </p>
            </Section>

            <Section id="contact" title="11. Contact Us" index={10}>
              <p>
                If you have questions about this Privacy Policy or how your information is handled, please reach out
                to us through the WhatsApp link provided on your registration confirmation screen, or contact our
                recruitment team directly.
              </p>
            </Section>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} SecurityJob. All rights reserved.
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-gold-300 shadow-lg transition-all duration-300 hover:bg-navy-800 ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
