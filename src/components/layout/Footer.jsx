import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  ShieldCheck, 
  BookOpen,
  Building2,
  Heart,
  Send,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ setActiveTab }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-[#005baa] text-slate-600 font-kantumruy mt-6 pt-8 pb-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Support & Issue Reporting Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-cyan-50 p-4 sm:p-5 rounded-2xl border border-blue-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005baa] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#003366]">
                {lang === 'km' ? 'ជំនួយការបច្ចេកទេស និងរាយការណ៍បញ្ហា (Technical Support & Bug Report)' : 'Technical Support & Issue Reporting'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                {lang === 'km' 
                  ? 'បើមានបញ្ហាបច្ចេកទេស ឬកំហុសឆ្គងក្នុងប្រព័ន្ធ សូមទាក់ទងមកកាន់ Gmail ឬ Telegram @kaixite តាមរយៈលេខ 097 741 6126' 
                  : 'If you encounter any technical issues, bugs, or errors, please contact via Gmail or Telegram @kaixite at 097 741 6126'}
              </p>
            </div>
          </div>

          {/* Quick Contact Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            <a
              href="mailto:soksithcheyhoout@gmail.com"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#005baa] font-bold text-xs border border-blue-200 flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102"
              title="Send Gmail"
            >
              <Mail className="w-3.5 h-3.5 text-[#005baa]" />
              <span>soksithcheyhoout@gmail.com</span>
            </a>

            <a
              href="https://t.me/kaixite"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102"
              title="Open Telegram @kaixite"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram: @kaixite</span>
            </a>

            <a
              href="tel:0977416126"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102"
              title="Call Phone"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>097 741 6126</span>
            </a>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          {/* Col 1: MoEYS Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/moeys-crest-transparent.png"
                alt="Ministry Official Crest"
                className="w-11 h-11 object-contain drop-shadow-sm"
              />
              <span className="font-extrabold text-[#003366] text-sm font-kantumruy">
                {t('ministryName')}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('footerAbout')}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#005baa] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>នាយកដ្ឋានមធ្យមសិក្សាចំណេះទូទៅ</span>
            </div>
          </div>

          {/* Col 2: High School Curriculum Programs */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#003366] font-kantumruy">
              កម្មវិធីអប់រំកម្រិតវិទ្យាល័យ
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • ថ្នាក់ទី១០ (មូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • ថ្នាក់ទី១១ (បំប៉នសមត្ថភាពសិស្ស)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bacii')} className="hover:text-[#005baa] transition-colors text-[#005baa] font-bold cursor-pointer">
                  • ថ្នាក់ទី១២ (ត្រៀមប្រឡងបាក់ឌុបជាតិ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • កម្មវិធី STEM និងបច្ចេកវិទ្យាឌីជីថល
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#003366] font-kantumruy">
              {t('quickLinks')}
            </h4>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('bacii')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • បណ្ណសារវិញ្ញាសាបាក់ឌុប ២០១៨-២០២៤
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('library')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • សៀវភៅពុម្ពក្រសួងអប់រំ (E-Textbooks)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lab')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ STEM
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#005baa] transition-colors cursor-pointer">
                  • ការគណនានិទ្ទេសបាក់ឌុបស្វ័យប្រវត្តិ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#003366] font-kantumruy">
              {t('contactUs')}
            </h4>
            <div className="text-xs space-y-2.5 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#005baa] flex-shrink-0 mt-0.5" />
                <span>{t('address')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#005baa] flex-shrink-0" />
                <a href="tel:0977416126" className="hover:text-[#005baa] font-mono font-bold">
                  097 741 6126
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#229ED9] flex-shrink-0" />
                <a 
                  href="https://t.me/kaixite" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#229ED9] font-mono font-bold"
                >
                  Telegram: @kaixite
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#005baa] flex-shrink-0" />
                <a href="mailto:soksithcheyhoout@gmail.com" className="hover:text-[#005baa] font-mono">
                  soksithcheyhoout@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#005baa] font-semibold">
              MoTDAR Cambodia Open Education Portal
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
