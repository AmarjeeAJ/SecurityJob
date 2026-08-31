import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Card from '../components/common/Card.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'what-you-consent-to', title: '2. What You Are Consenting To' },
  { id: 'communication', title: '3. Consent to Be Contacted' },
  { id: 'documents', title: '4. Consent to Document Upload' },
  { id: 'sharing', title: '5. Consent to Share With Employers' },
  { id: 'withdrawing', title: '6. Withdrawing Your Consent' },
  { id: 'reapplying', title: '7. Re-Applying' },
  { id: 'changes', title: '8. Changes to This Policy' },
  { id: 'contact', title: '9. Contact Us' },
];

const LAST_UPDATED = 'August 8, 2026';

const ICONS = {
  overview: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM12 16v-4m0-4h.01" />,
  'what-you-consent-to': <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4M20.618 5.984A11 11 0 0 1 12 2 11 11 0 0 1 3.382 5.984 11 11 0 0 0 12 22a11 11 0 0 0 8.618-16.016Z" />,
  communication: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a1 1 0 0 1 .95.68l1.2 3.6a1 1 0 0 1-.27 1.05L7.6 9.9a12 12 0 0 0 6.5 6.5l1.58-1.56a1 1 0 0 1 1.05-.27l3.6 1.2a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C10.1 21 3 13.9 3 5Z" />,
  documents: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm0 5h6M9 12h6M9 16h4" />,
  sharing: <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8-4M8.6 10.5l6.8 4" />,
  withdrawing: <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />,
  reapplying: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-3-6.7M21 3v5h-5" />,
  changes: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v4l3 3" />,
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
      <div className="prose prose-slate mt-4 max-w-none text-sm leading-relaxed text-slate-600 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_strong]:font-semibold [&_strong]:text-navy-900">
        {children}
      </div>
    </section>
  );
}

export default function CandidateConsentPolicyPage() {
  useNoIndex();

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
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between mobile-safe-bottom">
      <Navbar variant="light" />

      <div className="reveal relative mx-auto max-w-7xl overflow-hidden px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-6 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-400/25 blur-3xl"
        />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 shadow-[0_10px_30px_-8px_rgba(10,21,48,0.5)]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4M20.618 5.984A11 11 0 0 1 12 2 11 11 0 0 1 3.382 5.984 11 11 0 0 0 12 22a11 11 0 0 0 8.618-16.016Z" />
          </svg>
        </div>
        <h1 className="relative mt-5 text-2xl font-extrabold text-navy-900 sm:text-4xl">Candidate Consent Policy</h1>
        <p className="relative mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="relative mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          This page explains, separately from our Privacy Policy, exactly what you are agreeing to when you check
          the consent box and submit the SecurityJob application form.
        </p>
      </div>

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
            <Section id="overview" title="1. Overview" index={0}>
              <p>
                The SecurityJob application form includes a consent checkbox that must be ticked before you can
                submit your details. This policy explains, in plain language, exactly what that consent covers. It
                supplements — and does not replace — our{' '}
                <Link to="/privacy-policy" className="font-semibold text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            <Section id="what-you-consent-to" title="2. What You Are Consenting To" index={1}>
              <p>By checking the consent box, you confirm that:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>The information you have provided in the form is correct to the best of your knowledge</li>
                <li>SecurityJob and its authorized recruitment partners may contact you regarding suitable employment opportunities</li>
                <li>You have read and agree to this Candidate Consent Policy and our Privacy Policy</li>
              </ul>
            </Section>

            <Section id="communication" title="3. Consent to Be Contacted" index={2}>
              <p>
                You consent to being contacted by phone call, WhatsApp message or SMS at the mobile and WhatsApp
                numbers you provide, regarding job opportunities that match your profile. We do not use your number
                for unrelated marketing.
              </p>
            </Section>

            <Section id="documents" title="4. Consent to Document Upload" index={3}>
              <p>
                If you choose to upload a photo identity document, you consent to it being transmitted securely,
                stored using a non-identifying file reference, and viewed only by authorized recruitment staff for
                verification purposes. Uploading a document is always optional and is never required to complete
                your application.
              </p>
            </Section>

            <Section id="sharing" title="5. Consent to Share With Employers" index={4}>
              <p>
                You consent to your application details being shared with our authorized recruitment partners and
                hiring employers, strictly for the purpose of considering you for a role. We do not sell your
                information, and it is never shared beyond what is described in our{' '}
                <Link to="/privacy-policy" className="font-semibold text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            <Section id="withdrawing" title="6. Withdrawing Your Consent" index={5}>
              <p>
                You may withdraw your consent to be contacted, or request that your information be deleted, at any
                time by reaching out through our{' '}
                <Link to="/contact" className="font-semibold text-gold-600 hover:underline">
                  Contact page
                </Link>
                . Withdrawing consent stops future outreach but does not affect the lawfulness of anything already
                done with your information before withdrawal.
              </p>
            </Section>

            <Section id="reapplying" title="7. Re-Applying" index={6}>
              <p>
                If you submit the application form again using the same mobile number, your existing profile is
                updated with your latest details, and this consent applies to the updated submission as well.
              </p>
            </Section>

            <Section id="changes" title="8. Changes to This Policy" index={7}>
              <p>
                We may update this Candidate Consent Policy from time to time. The &ldquo;Last updated&rdquo; date
                at the top of this page reflects the most recent revision.
              </p>
            </Section>

            <Section id="contact" title="9. Contact Us" index={8}>
              <p>
                If you have questions about this Candidate Consent Policy or wish to withdraw consent, please reach
                out through our{' '}
                <Link to="/contact" className="font-semibold text-gold-600 hover:underline">
                  Contact page
                </Link>{' '}
                or the WhatsApp link provided on your registration confirmation screen.
              </p>
            </Section>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
