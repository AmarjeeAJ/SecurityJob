import { Link } from 'react-router-dom';
import ROLE_SLUGS, { ROLE_CATEGORIES, POPULAR_ROLES } from '../utils/roleSlugs.js';
import RoleIcon from '../components/common/RoleIcon.jsx';
import Reveal from '../components/common/Reveal.jsx';
import Logo from '../components/common/Logo.jsx';

const TRUST_PILLS = ['No Registration Fee', 'Pan-India Coverage', 'WhatsApp Support', 'Verified Recruiters'];

const FEATURES = [
  { icon: 'shield-check', title: 'Verified Recruitment', text: 'Straight to our team — no bots, no middlemen.' },
  { icon: 'badge', title: 'Every Level Covered', text: 'From guard roles to facility managers.' },
  { icon: 'monitor', title: 'Simple, Fast Form', text: 'Two minutes on your phone, no login.' },
  { icon: 'hand', title: 'We Reach Out', text: 'We contact you by phone or WhatsApp.' },
];

function CompactRoleRow({ role }) {
  return (
    <Link
      to={`/apply/${role.slug}`}
      className="card-glow group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gold-300">
        <RoleIcon type={role.icon} className="h-[18px] w-[18px]" />
      </div>
      <span className="flex-1 text-sm font-semibold text-white/90">{role.label}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold-400" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="bg-aurora min-h-screen text-white">
      {/* ---------- Sticky glass header ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-950/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Logo size="md" variant="dark" />
          <Link
            to="/apply/security-guard"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold
              text-white/90 backdrop-blur-md transition-colors hover:bg-white/10 sm:text-sm"
          >
            Register Now
          </Link>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-500/25 blur-3xl sm:h-96 sm:w-96" />
          <div className="blob blob-delay absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-30">
            <div className="radar-sweep" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300 backdrop-blur-md sm:text-sm">
              <RoleIcon type="shield-check" className="h-4 w-4" />
              Trusted Security Industry Recruitment
            </span>
          </Reveal>

          <Reveal delayMs={100}>
            <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-[5rem]">
              Build Your Career in{' '}
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent text-shimmer">
                Security
              </span>
            </h1>
          </Reveal>

          <Reveal delayMs={200}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              SecurityJob connects security agencies, corporate offices, hospitals, hotels, schools,
              factories and residential sites with security professionals across India. Register once —
              our team reaches out when a suitable opportunity opens up.
            </p>
          </Reveal>

          <Reveal delayMs={300}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/apply/security-guard"
                className="w-full rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-8 py-4 text-base
                  font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition-transform hover:scale-[1.02]
                  active:scale-[0.99] sm:w-auto"
              >
                Register in 2 Minutes
              </Link>
              <a
                href="#roles"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold
                  text-white backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
              >
                Browse Job Roles
              </a>
            </div>
          </Reveal>

          <Reveal delayMs={400}>
            <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium
                    text-white/80 backdrop-blur-md sm:text-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Features bar ---------- */}
      <section className="relative px-4 sm:px-6">
        <Reveal className="mx-auto max-w-6xl" as="div">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl sm:grid-cols-4 sm:divide-y-0">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center gap-2 px-4 py-6 text-center sm:items-start sm:text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300">
                  <RoleIcon type={feature.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-1 text-sm font-bold text-white">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-white/55">{feature.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Popular roles ---------- */}
      <section id="roles" className="relative mx-auto max-w-6xl px-4 pb-6 pt-20 sm:px-6 sm:pt-28">
        <Reveal className="text-center" as="div">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Open Positions</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Choose Your Role</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/65">
            Tap a role to open its registration form. Registration does not guarantee immediate employment —
            our team contacts you when a suitable opportunity is available.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {POPULAR_ROLES.map((role, i) => (
            <Reveal key={role.slug} delayMs={i * 90}>
              <Link to={`/apply/${role.slug}`} className="card-glow group block h-full rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/25 to-gold-500/10 text-gold-300">
                    <RoleIcon type={role.icon} className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-300">
                    Popular
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{role.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{role.description}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                  Apply Now
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- All roles, grouped by category ---------- */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 text-center" as="div">
          <h3 className="text-xl font-bold text-white/90">Browse All Roles</h3>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {ROLE_CATEGORIES.map((category, catIndex) => (
            <Reveal key={category} delayMs={catIndex * 100}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">{category}</h4>
              <div className="flex flex-col gap-2.5">
                {ROLE_SLUGS.filter((r) => r.category === category).map((role) => (
                  <CompactRoleRow key={role.slug} role={role} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="relative px-4 pb-16 sm:px-6">
        <Reveal className="mx-auto max-w-4xl" as="div">
          <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-br from-navy-800 to-navy-950 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Don&apos;t see your exact role?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">
              Register anyway and select "Other" under preferred roles — our recruitment team reviews every
              application.
            </p>
            <Link
              to="/apply/security-guard"
              className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-8 py-3.5 text-sm font-bold
                text-navy-950 shadow-lg shadow-gold-500/25 transition-transform hover:scale-[1.02]"
            >
              Start Your Registration
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-500/20 text-gold-300">
              <RoleIcon type="shield-check" className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white/80">SecurityJob</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45">
            <a href="/privacy-policy" className="hover:text-white/70">Privacy Policy</a>
            <a href="/terms-of-use" className="hover:text-white/70">Terms of Use</a>
            <a href="/candidate-consent-policy" className="hover:text-white/70">Candidate Consent Policy</a>
          </div>
          <p className="text-xs text-white/35">&copy; {new Date().getFullYear()} SecurityJob. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
