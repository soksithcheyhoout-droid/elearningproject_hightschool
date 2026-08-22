import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize, 
  CheckCircle2, 
  Download, 
  FileText, 
  MessageSquare, 
  Send, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function ClassroomView({ subject, onBack, onOpenAITutor }) {
  const { t, lang } = useLanguage();
  const { student, markLessonComplete } = useAuth();

  const defaultChapter = subject.chapters && subject.chapters[0];
  const defaultLesson = defaultChapter && defaultChapter.lessons && defaultChapter.lessons[0];

  const [activeLesson, setActiveLesson] = useState(defaultLesson || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [activeTab, setActiveTab] = useState('notes');
  
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "ចាន់ សុខា (Chan Sokha)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      time: "២ ម៉ោងមុន",
      text: "លោកគ្រូ ត្រង់រូបមន្តលីមីតរាង 0/0 បើមានរ៉ាឌីកាល់បីជាន់ តើត្រូវគុណកន្សោមឆ្លាស់បែបណាទើបលឿន?"
    },
    {
      id: 2,
      author: "ក្រុមការងារបច្ចេកទេស MoTDAR",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      time: "១ ម៉ោងមុន",
      text: "ប្អូនត្រូវបំបែកជាកន្សោម (A - B) ដោយប្រើរូបមន្ត A³ - B³ = (A-B)(A² + AB + B²) នោះនឹងលុបរ៉ាឌីកាល់បានយ៉ាងងាយ!"
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: student?.name || student?.username || 'Student',
        avatar: student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        time: lang === 'km' ? 'ទើបតែបង្ហោះ' : 'Just now',
        text: newComment
      }
    ]);
    setNewComment('');
  };

  const handleComplete = () => {
    if (activeLesson) {
      markLessonComplete(activeLesson.id);
    }
  };

  const isCompleted = activeLesson && student?.completedLessons?.includes(activeLesson.id);

  return (
    <div className="space-y-6 font-kantumruy">
      
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#005baa] hover:text-[#003876] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'km' ? 'ត្រឡប់ទៅកាន់កម្មវិធីសិក្សាជាតិ' : 'Back to Curriculum Overview'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent text-[#005baa] border border-blue-300/60 font-black text-xs cursor-pointer hover:bg-blue-100/80 transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#005baa]" />
            <span>{lang === 'km' ? 'សួរគ្រូ AI ពីមេរៀននេះ' : 'Ask AI Tutor about this Lesson'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video Player & Notes */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Video Player */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-2xl group flex flex-col justify-between">
            
            <div className="absolute inset-0 z-0">
              <img 
                src={activeLesson?.videoPoster || subject.bannerImg} 
                alt="Lesson Thumbnail" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />
            </div>

            {/* Top Video Header */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#005baa] text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                  {lang === 'km' ? subject.nameKm : subject.nameEn}
                </span>
                <span className="text-xs sm:text-sm text-white truncate max-w-xs font-bold">
                  {activeLesson ? (lang === 'km' ? activeLesson.titleKm : activeLesson.titleEn) : ''}
                </span>
              </div>
              <span className="text-xs text-slate-200 font-cinzel font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {activeLesson?.duration || '25:00'}
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <div className="relative z-10 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#005baa] to-sky-400 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/80"
              >
                {isPlaying ? <Pause className="w-7 h-7 sm:w-8 sm:h-8" /> : <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 mx-4 mb-4 flex items-center gap-3 shadow-lg">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-amber-300 transition-colors cursor-pointer">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div className="w-2/5 h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="font-cinzel text-[11px] text-white">10:45 / 24:30</span>
                
                <select 
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(e.target.value)}
                  className="bg-white/10 text-white text-[11px] font-bold rounded-lg px-2 py-1 border border-white/20 focus:outline-none cursor-pointer"
                >
                  <option value="0.75x" className="bg-slate-900 text-white">0.75x</option>
                  <option value="1x" className="bg-slate-900 text-white">1.0x</option>
                  <option value="1.25x" className="bg-slate-900 text-white">1.25x</option>
                  <option value="1.5x" className="bg-slate-900 text-white">1.5x</option>
                </select>

                <Maximize className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
              </div>
            </div>

          </div>

          {/* Lesson Header & Mark Completed */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-xl font-black text-[#003366] leading-snug">
                  {activeLesson ? (lang === 'km' ? activeLesson.titleKm : activeLesson.titleEn) : ''}
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {lang === 'km' ? 'បង្រៀនដោយ៖' : 'Taught by:'} <span className="text-[#005baa] font-bold">{subject.teacher}</span> ({subject.teacherRole})
                </p>
              </div>

              <button
                onClick={handleComplete}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{isCompleted ? (lang === 'km' ? 'បានបញ្ចប់មេរៀននេះ (+50 XP)' : 'Completed (+50 XP)') : (lang === 'km' ? 'កត់ចំណាំថាបានរៀន (+50 XP)' : 'Mark as Completed (+50 XP)')}</span>
              </button>
            </div>

            {/* Tabs: Notes & Discussion */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                    activeTab === 'notes' ? 'bg-blue-50 text-[#003366] border border-blue-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#005baa]" />
                  <span>{t('chapterNotes') || (lang === 'km' ? 'សេចក្តីសង្ខេបមេរៀន' : 'Lesson Notes')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                    activeTab === 'discussion' ? 'bg-blue-50 text-[#003366] border border-blue-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#005baa]" />
                  <span>{t('qaDiscussion') || (lang === 'km' ? 'សំណួរ & ចម្លើយ' : 'Q&A Discussion')} ({comments.length})</span>
                </button>
              </div>

              {/* Tab Body */}
              <div className="pt-4">
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 shadow-inner font-medium">
                      <div className="whitespace-pre-line">
                        {activeLesson?.notes || (lang === 'km' ? 'គ្មានកំណត់ចំណាំសម្រាប់មេរៀននេះនៅឡើយទេ។' : 'No summary notes available for this lesson yet.')}
                      </div>

                      {activeLesson?.keyFormulas && activeLesson.keyFormulas.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <p className="font-black text-[#003366] text-xs mb-2">
                            ✨ {lang === 'km' ? 'រូបមន្តគន្លឹះត្រូវចាំ (Essential Formulas):' : 'Key Formulas to Remember:'}
                          </p>
                          <div className="space-y-2">
                            {activeLesson.keyFormulas.map((formula, idx) => (
                              <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-300 text-[#003366] font-mono text-xs shadow-2xs font-bold">
                                <code>{formula}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={() => alert(lang === 'km' ? 'ឯកសារសង្ខេបមេរៀនត្រូវបានទាញយកជាទម្រង់ PDF ជោគជ័យ!' : 'Lesson summary PDF downloaded successfully!')}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#003366] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5 text-[#005baa]" />
                        <span>{t('downloadNotes') || (lang === 'km' ? 'ទាញយកឯកសារ PDF' : 'Download PDF')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-4">
                    <form onSubmit={handlePostComment} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t('askQuestion') || (lang === 'km' ? 'ចោទសួរអំពីមេរៀននេះ...' : 'Ask a question about this lesson...')}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white font-medium"
                      />
                      <button type="submit" className="px-4 py-2 bg-[#005baa] hover:bg-[#003876] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('postQuestion') || (lang === 'km' ? 'ផ្ញើសំណួរ' : 'Post')}</span>
                      </button>
                    </form>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={c.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-[#005baa]" />
                              <span className="font-bold text-slate-900">{c.author}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{c.time}</span>
                          </div>
                          <p className="text-slate-700 pl-8 leading-relaxed font-medium">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right 1 Col: Course Playlist */}
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-black text-sm text-[#003366] flex items-center justify-between">
              <span>{lang === 'km' ? 'បញ្ជីមេរៀន MoTDAR' : 'Lesson Playlist'}</span>
              <span className="text-xs text-slate-500 font-bold">
                {subject.totalLessons} {lang === 'km' ? 'មេរៀន' : 'Lessons'}
              </span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,91,170,0.15)_transparent]">
              {subject.chapters?.map((ch) => (
                <div key={ch.id} className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <div className="bg-blue-50/80 p-3 text-xs font-black text-[#003366] border-b border-slate-200">
                    {lang === 'km' ? ch.titleKm : ch.titleEn}
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {ch.lessons?.map((les) => {
                      const isLesActive = activeLesson && activeLesson.id === les.id;
                      const isLesDone = student?.completedLessons?.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveLesson(les);
                            setIsPlaying(false);
                          }}
                          className={`w-full text-left p-3 text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                            isLesActive
                              ? 'bg-blue-50/90 text-[#003366] font-extrabold border-l-4 border-[#005baa]'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isLesDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="line-clamp-2 leading-relaxed">
                              {lang === 'km' ? les.titleKm : les.titleEn}
                            </p>
                            <span className="text-[10px] text-slate-400 font-cinzel font-bold">
                              {les.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

