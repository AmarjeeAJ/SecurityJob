import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Target, 
  Eye, 
  Building2, 
  HeartHandshake,
  Building,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  HeartPulse,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Users,
  Check,
  FileCheck2,
  Scale,
  Clock
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx';
import SEO from '../components/common/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function AboutPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const stats = [
    { 
      value: '₹0', 
      label: isHindi ? 'कैंडिडेट फीस (Zero Commission)' : 'Candidate Fee (Zero Commission)',
      sub: isHindi ? 'हमेशा के लिए 100% फ्री' : '100% Free Forever' 
    },
    { 
      value: '33+', 
      label: isHindi ? 'राजस्थान के सभी जिले' : 'Rajasthan Districts Covered',
      sub: isHindi ? 'जयपुर से नीमराना तक' : 'Jaipur to Neemrana' 
    },
    { 
      value: '19+ Roles', 
      label: isHindi ? 'विविध सुरक्षा पद विकल्प' : 'Diverse Security Roles',
      sub: isHindi ? 'गार्ड से सुपरवाइजर तक' : 'From Guard to Supervisor' 
    },
    { 
      value: '< 2 min', 
      label: isHindi ? 'मोबाइल आवेदन समय' : 'Mobile Application Time',
      sub: isHindi ? 'बिना किसी जटिलता के' : 'Zero Bureaucracy' 
    },
  ];

  const pillars = isHindi
    ? [
        {
          icon: Award,
          title: '100% फ्री एवं दलाली-मुक्त भर्ती',
          subtitle: 'Zero Brokerage & Zero Fee Policy',
          desc: 'हमारा सबसे पहला और अटल नियम है: नौकरी पाने वाले किसी भी सुरक्षा गार्ड या सुपरवाइजर से कभी भी ₹1 भी नहीं लिया जाएगा। रजिस्ट्रेशन, इंटरव्यू या साइट जॉइनिंग सब कुछ पूरी तरह निःशुल्क है।',
        },
        {
          icon: HeartPulse,
          title: 'सुरक्षा कर्मियों का सम्मान एवं गरिमा',
          subtitle: 'Restoring Dignity to Private Security',
          desc: 'सुरक्षा गार्ड हमारे उद्योगों, अस्पतालों, आवासीय सोसायटियों और शिक्षण संस्थानों की रक्षा करते हैं। उन्हें समाज में पूरा मान-सम्मान, उचित कार्य परिस्थितियां और मानवीय व्यवहार मिलना अनिवार्य है।',
        },
        {
          icon: Scale,
          title: 'पारदर्शी वेतन व मानक कार्य नियम',
          subtitle: 'Transparent Wages & Standard Norms',
          desc: 'हमारा मंच सुरक्षा क्षेत्र में पारदर्शी वेतन संरचना, बैंक ट्रांसफर या नकद माध्यम से समय पर भुगतान तथा श्रम नियमों व कंपनी नीतियों के अनुसार लागू होने वाले वैधानिक भत्तों की सही जानकारी प्रस्तुत करने का समर्थन करता है।',
        },
        {
          icon: Building2,
          title: 'प्रमाणित व उत्तरदायी कंपनियों से जुड़ाव',
          subtitle: 'Direct Connect with Verified Employers',
          desc: 'हम केवल कानूनी रूप से वैध, PSARA-मान्यता प्राप्त और उत्तरदायी सिक्योरिटी कंपनियों व कॉर्पोरेट संस्थानों के साथ काम करते हैं, ताकि किसी भी उम्मीदवार के साथ कोई धोखा या वेतन की चोरी न हो सके।',
        },
      ]
    : [
        {
          icon: Award,
          title: '100% Free & Zero Brokerage',
          subtitle: 'Permanent Zero-Fee Policy',
          desc: 'Our first and unbreakable pledge: No candidate is ever charged a single rupee. Application, document verification, interview scheduling, and site deployment are 100% free forever.',
        },
        {
          icon: HeartPulse,
          title: 'Professional Dignity for Security Staff',
          subtitle: 'Restoring Dignity to Frontline Protectors',
          desc: 'Security personnel protect our factories, hospitals, residential societies, and campuses. They are the backbone of community safety and deserve profound respect, fair shift rosters, and humane treatment.',
        },
        {
          icon: Scale,
          title: 'Transparent Wage Structures & Norms',
          subtitle: 'Promoting Industry Standards',
          desc: 'Our platform supports clear communication regarding wage structures, salary payments (via bank transfer or cash as per employer policy), and applicable statutory benefits governed by prevailing labor regulations.',
        },
        {
          icon: Building2,
          title: 'Direct Link to Compliant Employers',
          subtitle: 'No Freelance Middlemen or Ghost Contractors',
          desc: 'We connect candidates directly with licensed, PSARA-compliant security agencies and established facility enterprises across Rajasthan, shielding workers from unauthorized sub-brokers.',
        },
      ];


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between mobile-safe-bottom">
      <SEO
        title={isHindi ? "हमारा परिचय एवं मुख्य उद्देश्य — SecurityJob.in राजस्थान" : "Our Purpose & Mission — SecurityJob.in Rajasthan"}
        description={isHindi ? "SecurityJob.in का उद्देश्य: राजस्थान में सुरक्षा कर्मियों को दलालों व कमीशन से मुक्त कर 100% फ्री रजिस्ट्रेशन, पारदर्शी जॉब जानकारी और प्रमाणित नियोक्ताओं से सीधा जोड़ना।" : "The mission of SecurityJob.in: Eliminating recruitment middlemen in Rajasthan by providing 100% free registration, transparent job information, and direct connection with verified employers."}
      />

      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO: The Purpose & Origin */}
        {/* ========================================================================= */}
        <section className="bg-light-hero py-14 sm:py-20 border-b border-slate-200/80 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {isHindi ? 'हमारा परिचय एवं स्थापना का उद्देश्य' : 'About Our Purpose & Founding Mission'}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {isHindi ? (
                <>
                  सुरक्षा कर्मियों का सम्मान, दलालों से मुक्ति और <span className="text-blue-600">पारदर्शी रोजगार</span>
                </>
              ) : (
                <>
                  Restoring Dignity to Security Staff, Ending Exploitation & <span className="text-blue-600">Championing Fair Work</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {isHindi
                ? 'SecurityJob.in कोई सामान्य जॉब बोर्ड या व्यावसायिक दलाल नहीं है। यह राजस्थान के मेहनतकश युवाओं को बिना किसी कमीशन या घूसखोरी के सीधे सुरक्षित और सम्मानजनक सुरक्षा पदों पर नियुक्त कराने की एक पारदर्शी पहल है।'
                : 'SecurityJob.in is not a commercial broker or generic job board. It is a dedicated, zero-fee initiative founded to connect Rajasthan’s hardworking security personnel directly with licensed employers — free from middleman cuts, fraud, and recruitment delays.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-700">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? '100% फ्री रजिस्ट्रेशन' : '100% Free Registration'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? 'शून्य कमीशन (Zero Brokerage)' : 'Zero Middleman Commission'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? 'Avijit Enterprises (MSME पंजीकृत)' : 'Govt MSME Registered Enterprise'}
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STATS STRIP */}
        {/* ========================================================================= */}
        <section className="py-10 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <p className="text-2xl sm:text-4xl font-extrabold text-blue-600">{stat.value}</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{stat.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE REAL PROBLEM: Why SecurityJob.in Was Born */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                {isHindi ? 'सुरक्षा उद्योग की जमीनी सच्चाई' : 'The Ground Reality in Security Recruitment'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                {isHindi ? 'SecurityJob.in की शुरुआत क्यों हुई?' : 'Why Was SecurityJob.in Founded?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'राजस्थान में प्राइवेट सुरक्षा उद्योग में काम करने वाले हजारों गार्ड्स हर साल अनैतिक दलालों और फर्जी एजेंसियों के शोषण का शिकार होते हैं। इस शोषण को जड़ से खत्म करने के लिए हमारा जन्म हुआ।'
                  : 'Every year, thousands of job seekers across Rajasthan fall victim to exploitative sub-agents, fake job promises, and wage deductions. SecurityJob.in was built to end this injustice once and for all.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Pain Point 1 */}
              <div className="p-6 rounded-3xl bg-white border border-red-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'फर्जी रजिस्ट्रेशन व यूनिफॉर्म के नाम पर वसूली' : 'Extortion in the Name of Registration & Uniforms'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'गाँव-कस्बों से आने वाले युवाओं से फॉर्म भरने, इंटरव्यू कराने या यूनिफॉर्म देने के नाम पर ₹1,500 से ₹5,000 तक की अग्रिम राशि ऐंठ ली जाती है, और फिर कोई नौकरी नहीं दी जाती।'
                    : 'Job seekers from rural areas are routinely charged upfront fees ranging from ₹1,500 to ₹5,000 for "interview registration" or uniforms, only to be given fake appointments or ghosted.'}
                </p>
              </div>

              {/* Pain Point 2 */}
              <div className="p-6 rounded-3xl bg-white border border-red-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'पहले महीने की तनख्वाह में से 50% से 100% की दलाली' : 'Massive Wage Deductions by Middlemen'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'अनेक दलाल सुरक्षा गार्ड का पहला वेतन पूरा का पूरा अपनी जेब में रख लेते हैं या हर महीने उसकी तनख्वाह में से ₹1,000-₹2,000 की कटौतियां करते रहते हैं।'
                    : 'Unauthorized middlemen frequently pocket 50% to 100% of a guard’s first month salary, or siphon recurring monthly commissions directly from their hard-earned wages.'}
                </p>
              </div>

              {/* Pain Point 3 */}
              <div className="p-6 rounded-3xl bg-white border border-red-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'PF व ESIC के झूठे वादे, कागजात जब्त करना' : 'Deceptive PF/ESIC Promises & Confiscated IDs'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'गार्ड्स को सैलरी स्लिप नहीं दी जाती, न ही उनका PF नंबर दिया जाता है। दुर्घटना या बीमारी के समय उनका कोई मेडिकल रिकॉर्ड नहीं होता, जिससे उनका परिवार असहाय हो जाता है।'
                    : 'Candidates are often left without official wage slips, UAN numbers, or ESIC health cards. When an injury or illness occurs, workers have zero institutional safety net.'}
                </p>
              </div>

              {/* Pain Point 4 */}
              <div className="p-6 rounded-3xl bg-white border border-red-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'शिकायत व सुनवाई का कोई मंच न होना' : 'Total Lack of Grievance Redressal'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'अनऑर्गनाइज्ड दलाल फोन बंद कर लेते हैं और गार्ड्स अपनी परेशानी लेकर कहाँ जाएं, इसका कोई सहारा नहीं होता।'
                    : 'When sub-agents switch off their phones after placement, security personnel have nowhere to turn for salary disputes, harassment, or delayed joining letters.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR 4 PILLARS OF PURPOSE */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isHindi ? 'हमारे 4 मुख्य स्तंभ' : 'Our 4 Core Pillars'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                {isHindi ? 'हम किन मूल्यों और सिद्धांतों के लिए खड़े हैं' : 'What We Stand For & How We Work'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isHindi ? 'हर उम्मीदवार और हर कंपनी के साथ हमारा रिश्ता इन सिद्धांतों पर टिका है।' : 'Every application and employer relationship is anchored to these four commitments.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-5">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
                        {p.subtitle}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-3">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DIGNITY OF LABOR: The Frontline Protector */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सुरक्षा कर्मियों का सम्मान' : 'Dignity of Labor'}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {isHindi
                  ? 'सिक्योरिटी गार्ड्स केवल कर्मचारी नहीं, हमारे समाज के प्रथम रक्षक हैं'
                  : 'Security Guards Are Frontline Protectors, Not Mere Workers'}
              </h2>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {isHindi
                  ? 'चाहे 45 डिग्री की चिलचिलाती धूप हो या कड़ाके की सर्द रात — सिक्योरिटी गार्ड, लेडी गार्ड और सुपरवाइजर पूरी निष्ठा से खड़े होकर हमारे परिवारों, कारखानों और व्यापारिक प्रतिष्ठानों की सुरक्षा करते हैं। जब तक उनके काम को वह सम्मान और सामाजिक सुरक्षा नहीं मिलेगी जिसके वे हकदार हैं, तब तक समाज सुरक्षित नहीं रह सकता।'
                  : 'Whether standing in scorching Rajasthan summers or guarding through freezing winter nights, security guards, lady guards, and supervisors ensure that businesses operate peacefully and families sleep safely. They deserve profound professional honor, fair hours, and complete institutional protection.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm text-slate-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-1">{isHindi ? 'उचित कार्य घंटे (Fixed Shifts)' : 'Standard Shifts'}</p>
                <p className="text-slate-400 text-xs">{isHindi ? '8 घंटे या 12 घंटे की स्पष्ट ड्यूटी रोस्टर, बिना किसी जबरन ओवरटाइम के।' : 'Standard 8-hour or 12-hour rosters with voluntary overtime compensation.'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-1">{isHindi ? 'पारदर्शी वेतन भुगतान (Bank / Cash)' : 'Transparent Salary Payment'}</p>
                <p className="text-slate-400 text-xs">{isHindi ? 'बैंक ट्रांसफर या नकद माध्यम से नियोक्ता नियमानुसार समय पर पूरा व स्पष्ट वेतन भुगतान।' : 'Timely and full salary disbursement through bank transfer or cash as per employer terms.'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-1">{isHindi ? 'वैधानिक सुरक्षा प्रावधान' : 'Statutory Welfare Standards'}</p>
                <p className="text-slate-400 text-xs">{isHindi ? 'श्रम नियमों के अनुसार लागू होने वाली सामाजिक सुरक्षा व चिकित्सा सुविधाओं की पारदर्शी जानकारी।' : 'Transparent awareness regarding applicable statutory welfare, social security, and medical norms.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ANTI-FRAUD & ZERO FEE CHARTER */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-amber-50/60 border-b border-amber-200/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-white border-2 border-amber-300 p-6 sm:p-10 shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {isHindi ? 'उम्मीदवार सुरक्षा घोषणापत्र' : 'Candidate Protection Charter'}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                    {isHindi ? 'SecurityJob.in का एंटी-फ्रॉड (Anti-Fraud) संकल्प' : 'Our Anti-Fraud Pledge to All Candidates'}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900">
                  {isHindi
                    ? 'कृपया ध्यान दें: SecurityJob.in किसी भी परिस्थिति में किसी भी उम्मीदवार से पैसे नहीं मांगता है।'
                    : 'Important Notice: SecurityJob.in NEVER charges candidates any fee, at any stage of recruitment.'}
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHindi ? 'कोई भी रजिस्ट्रेशन फीस, प्रोसेसिंग चार्ज या इंटरव्यू फीस नहीं।' : 'Zero registration fees, interview fees, or processing charges.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHindi ? 'कोई भी एजेंट अगर हमारे नाम पर पैसे या OTP मांगता है, तो वह फर्जी है।' : 'Anyone demanding money, OTPs, or commissions in our name is fraudulent.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{isHindi ? 'अपने मूल कागजात (आधार, मार्कशीट) किसी भी दलाल को न सौंपें।' : 'Never surrender original Aadhaar or educational certificates to any agency.'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-600">
                  {isHindi ? 'किसी भी संदिग्ध कॉल या वसूली की तुरंत रिपोर्ट करें:' : 'Report suspicious recruiters or demands immediately:'}
                </span>
                <a href="tel:+919929992886" className="font-bold text-blue-600 hover:text-blue-700">
                  हेल्पलाइन: +91 99299 92886
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CORPORATE GOVERNANCE: Avijit Enterprises */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                    {isHindi ? 'कंपनी परिचय व पंजीकरण' : 'Corporate Governance'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                    GST Registered
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    Govt. MSME Registered
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Powered By AVIJIT ENTERPRISES
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {isHindi
                      ? 'SecurityJob.in का संचालन AVIJIT ENTERPRISES द्वारा किया जाता है, जो भारत सरकार के सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME) एवं GST में पंजीकृत एक अधिकृत उद्यम है। हम राजस्थान में पारदर्शी, डिजिटल और कानूनी रूप से संरक्षित रोजगार प्रणाली बनाने के लिए समर्पित हैं।'
                      : 'SecurityJob.in is operated and governed by AVIJIT ENTERPRISES, an authorized proprietary enterprise registered under MSME & GST, Government of India. We are dedicated to creating an ethical, digital, and legally compliant workforce infrastructure in Rajasthan.'}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-xs">{isHindi ? 'पंजीकृत कार्यालय पता (Registered Office)' : 'Registered Office Address'}</span>
                      <p className="text-white font-medium">159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                  <a href="tel:+919929992886" className="inline-flex items-center gap-1.5 hover:text-white">
                    <Phone className="w-4 h-4 text-blue-400" />
                    +91 99299 92886
                  </a>
                  <span>&middot;</span>
                  <a href="mailto:hr@securityjob.in" className="inline-flex items-center gap-1.5 hover:text-white">
                    <Mail className="w-4 h-4 text-blue-400" />
                    hr@securityjob.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CALL TO ACTION (Apply Free) */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              {isHindi ? '100% निःशुल्क व सीधी भर्ती' : '100% Free & Direct Deployment'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isHindi ? 'क्या आप राजस्थान में सिक्योरिटी जॉब ढूंढ रहे हैं?' : 'Looking for a Verified Security Job in Rajasthan?'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {isHindi
                ? 'दलालों को 1 रुपया भी न दें। अभी अपना 2-मिनट का फ्री मोबाइल फॉर्म भरें और सीधा अपने जिले में जॉइनिंग का कॉल पाएं।'
                : 'Never pay any commission or broker fees. Fill our 2-minute mobile application now and get connected directly with verified site openings in your district.'}
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/apply/security-guard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                {isHindi ? 'ऑनलाइन फॉर्म भरें (100% फ्री)' : 'Submit Free Application Now'}
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs transition-all"
              >
                {isHindi ? 'जयपुर कार्यालय से संपर्क करें' : 'Contact Jaipur Office'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
