export default function Hero({ heading }) {
  return (
    <div className="bg-white pb-8 pt-6 text-center sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">{heading}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
          Register your details for current and upcoming security jobs. Apply for opportunities in security
          agencies, corporate offices, hospitals, hotels, schools, factories, events and residential sites.
        </p>
        <div className="mx-auto mt-4 flex max-w-lg items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-800 sm:text-sm">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <span>
            Registration does not guarantee immediate employment. Our recruitment team may contact you when a
            suitable opportunity is available.
          </span>
        </div>
      </div>
    </div>
  );
}
