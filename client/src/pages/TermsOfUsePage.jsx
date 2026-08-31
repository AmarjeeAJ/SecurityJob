import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Card from '../components/common/Card.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'no-fee', title: '3. No Registration Fee' },
  { id: 'accuracy', title: '4. Accuracy of Information' },
  { id: 'no-guarantee', title: '5. No Guarantee of Employment' },
  { id: 'conduct', title: '6. Acceptable Use' },
  { id: 'ip', title: '7. Intellectual Property' },
  { id: 'liability', title: '8. Limitation of Liability' },
  { id: 'law', title: '9. Governing Law' },
  { id: 'changes', title: '10. Changes to These Terms' },
  { id: 'contact', title: '11. Contact Us' },
];

const LAST_UPDATED = 'August 8, 2026';

const ICONS = {
  acceptance: <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />,
  eligibility: <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 5v2m0 8v2" />,
  'no-fee': <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m5-16.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />,
  accuracy: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm0 5h6M9 12h6M9 16h4" />,
  'no-guarantee': <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />,
  conduct: <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  ip: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />,
  liability: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6v-6m0-3h.01" />,
  law: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 8l-3 6a3 3 0 0 0 6 0l-3-6Zm14 0-3 6a3 3 0 0 0 6 0l-3-6ZM3 8h6m6 0h6M8 3h8" />,
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
      <div className="prose prose-slate mt-4 max-w-none text-sm leading-relaxed text-slate-600 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 [&_strong]:font-semibold [&_strong]:text-navy-900">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfUsePage() {
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm0 5h6M9 12h6M9 16h4" />
          </svg>
        </div>
        <h1 className="relative mt-5 text-2xl font-extrabold text-navy-900 sm:text-4xl">Terms of Use</h1>
        <p className="relative mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="relative mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          These Terms of Use govern your use of the SecurityJob application form and website. By submitting the
          form, you agree to the terms set out below.
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
            <Section id="acceptance" title="1. Acceptance of Terms" index={0}>
              <p>
                By accessing the SecurityJob website or submitting the candidate application form, you agree to be
                bound by these Terms of Use and our{' '}
                <Link to="/privacy-policy" className="font-semibold text-gold-600 hover:underline">
                  Privacy Policy
                </Link>
                . If you do not agree, please do not use this website or submit the form.
              </p>
            </Section>

            <Section id="eligibility" title="2. Eligibility" index={1}>
              <p>
                This platform is intended for candidates aged 18 to 65 seeking employment in India's security
                industry. By submitting an application, you confirm that the information you provide is accurate and
                that you meet this age requirement.
              </p>
            </Section>

            <Section id="no-fee" title="3. No Registration Fee" index={2}>
              <p>
                Registering on SecurityJob is completely free. We will never ask you to pay any amount — for
                registration, verification, training, uniforms or otherwise — to be considered for a role. If anyone
                claiming to represent SecurityJob asks you for money, please do not pay and contact us immediately.
              </p>
            </Section>

            <Section id="accuracy" title="4. Accuracy of Information" index={3}>
              <p>
                You are responsible for ensuring that the details you submit — including your name, contact numbers,
                location, qualifications and work experience — are accurate and up to date. Providing false
                information may result in your application being rejected or removed from consideration.
              </p>
            </Section>

            <Section id="no-guarantee" title="5. No Guarantee of Employment" index={4}>
              <p>
                Submitting the application form registers your interest and does not guarantee an interview, job
                offer or employment of any kind. Our recruitment team contacts candidates when a suitable opportunity
                matching their profile becomes available; response times and outcomes are not guaranteed.
              </p>
            </Section>

            <Section id="conduct" title="6. Acceptable Use" index={5}>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Submit false, misleading or another person's information without their consent</li>
                <li>Attempt to interfere with, disrupt or gain unauthorized access to the website or its systems</li>
                <li>Use the platform for any purpose other than seeking genuine employment opportunities</li>
                <li>Upload malicious files or content through the application form</li>
              </ul>
            </Section>

            <Section id="ip" title="7. Intellectual Property" index={6}>
              <p>
                The SecurityJob name, logo, website design and content are the property of SecurityJob and may not
                be copied, reproduced or used without prior written permission.
              </p>
            </Section>

            <Section id="liability" title="8. Limitation of Liability" index={7}>
              <p>
                SecurityJob facilitates connections between candidates and hiring employers or agencies but is not
                itself the employer. We are not liable for the terms, conduct or outcomes of any employment
                arrangement made between a candidate and a hiring employer or agency.
              </p>
            </Section>

            <Section id="law" title="9. Governing Law" index={8}>
              <p>
                These Terms of Use are governed by the laws of India. Any disputes arising from your use of this
                website or the application form will be subject to the jurisdiction of the courts of India.
              </p>
            </Section>

            <Section id="changes" title="10. Changes to These Terms" index={9}>
              <p>
                We may update these Terms of Use from time to time. The &ldquo;Last updated&rdquo; date at the top
                of this page reflects the most recent revision. Continued use of the website after a change
                constitutes acceptance of the updated terms.
              </p>
            </Section>

            <Section id="contact" title="11. Contact Us" index={10}>
              <p>
                If you have questions about these Terms of Use, please reach out through our{' '}
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
