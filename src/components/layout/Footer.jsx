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
  Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ setActiveTab }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-[#005baa] text-slate-600 font-kantumruy mt-6 pt-8 pb-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          
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
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors">
                  • ថ្នាក់ទី១០ (មូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors">
                  • ថ្នាក់ទី១១ (បំប៉នសមត្ថភាពសិស្ស)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bacii')} className="hover:text-[#005baa] transition-colors text-[#005baa] font-bold">
                  • ថ្នាក់ទី១២ (ត្រៀមប្រឡងបាក់ឌុបជាតិ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#005baa] transition-colors">
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
                <button onClick={() => setActiveTab('bacii')} className="hover:text-[#005baa] transition-colors">
                  • បណ្ណសារវិញ្ញាសាបាក់ឌុប ២០១៨-២០២៤
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('library')} className="hover:text-[#005baa] transition-colors">
                  • សៀវភៅពុម្ពក្រសួងអប់រំ (E-Textbooks)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lab')} className="hover:text-[#005baa] transition-colors">
                  • បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ STEM
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#005baa] transition-colors">
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
                <span>{t('phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#005baa] flex-shrink-0" />
                <span>{t('email')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
