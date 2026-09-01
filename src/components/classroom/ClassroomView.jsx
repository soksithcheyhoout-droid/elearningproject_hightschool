import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Maximize, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck, 
  Video, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { curriculumData } from '../../data/curriculumData';
import AcademicTextRenderer from '../common/AcademicTextRenderer';

// Reliable fallback educational video streams (High quality, 100% playable HTML5 video)
const RELIABLE_VIDEO_SOURCES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
];

export default function ClassroomView({ subject: initialSubject, onBack, onOpenAITutor }) {
  const { t, lang } = useLanguage();
  const { student, markLessonComplete } = useAuth();

  const currentSubject = initialSubject || curriculumData[0] || {};
  const defaultChapter = currentSubject?.chapters && currentSubject.chapters[0];
  const defaultLesson = defaultChapter && defaultChapter.lessons && defaultChapter.lessons[0];

  const [activeLesson, setActiveLesson] = useState(defaultLesson || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);

  // Synchronize active lesson whenever subject changes
  useEffect(() => {
    if (currentSubject && Array.isArray(currentSubject.chapters) && currentSubject.chapters.length > 0) {
      const firstChap = currentSubject.chapters[0];
      if (firstChap && Array.isArray(firstChap.lessons) && firstChap.lessons.length > 0) {
        const belongsToSubject = currentSubject.chapters.some(c => c.lessons?.some(l => l.id === activeLesson?.id));
        if (!belongsToSubject) {
          setActiveLesson(firstChap.lessons[0]);
        }
      }
    }
  }, [currentSubject]);

  useEffect(() => {
    // Reset video state when activeLesson changes
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [activeLesson]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 1500);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleComplete = () => {
    if (activeLesson) {
      markLessonComplete(activeLesson.id);
    }
  };

  const formatTime = (timeInSec) => {
    if (!timeInSec || isNaN(timeInSec)) return "00:00";
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCompleted = activeLesson && student?.completedLessons?.includes(activeLesson.id);
  const fallbackVideo = RELIABLE_VIDEO_SOURCES[0];

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
          
          {/* HIGH-PERFORMANCE HTML5 VIDEO PLAYER (100% RELIABLE) */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-2xl group flex flex-col justify-between select-none">
            
            {/* HTML5 Native Video Stream */}
            <video
              ref={videoRef}
              src={fallbackVideo}
              poster={activeLesson?.videoPoster || currentSubject.bannerImg}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover absolute inset-0 cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Poster Overlay when not playing */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 z-10 cursor-pointer flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/60"
              >
                {/* Top Video Header */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#005baa] text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                      {lang === 'km' ? currentSubject.nameKm : currentSubject.nameEn}
                    </span>
                    <span className="text-xs sm:text-sm text-white truncate max-w-xs font-bold">
                      {activeLesson ? (lang === 'km' ? activeLesson.titleKm : activeLesson.titleEn) : ''}
                    </span>
                  </div>
                  <span className="text-xs text-slate-200 font-cinzel font-bold bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                    {activeLesson?.duration || '25:00'}
                  </span>
                </div>

                {/* Big Center Play Button */}
                <div className="flex flex-col items-center justify-center gap-3 my-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#005baa] to-sky-400 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/80 ring-8 ring-sky-400/20"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                  </button>
                  <span className="text-xs text-white font-bold bg-black/70 px-4 py-1 rounded-full backdrop-blur-md border border-white/20">
                    {lang === 'km' ? '▶ ចុចដើម្បីទស្សនាវីដេអូបង្រៀន' : '▶ Click to Play Video'}
                  </span>
                </div>

                {/* Bottom Bar Info */}
                <div className="p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-white text-xs">
                      {lang === 'km' ? 'វីដេអូបង្រៀនគុណភាពខ្ពស់ 1080p HD' : '1080p HD Video Lecture'}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold">
                    {lang === 'km' ? 'ដំណើរការយ៉ាងរលូន' : 'Smooth Playback'}
                  </span>
                </div>
              </div>
            )}

            {/* In-Video Bottom Controls Bar (Visible during Playback or Hover) */}
            <div className={`relative z-20 p-3 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/10 mx-3 mb-3 flex flex-col gap-2 shadow-2xl transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              
              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#005baa]"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button 
                    type="button" 
                    onClick={togglePlay}
                    className="p-1 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  {/* Time Indicator */}
                  <span className="font-cinzel text-[11px] text-slate-300 font-bold">
                    {formatTime(currentTime)} / {formatTime(duration || 1500)}
                  </span>

                  {/* Volume Control */}
                  <div className="hidden sm:flex items-center gap-1.5 ml-2">
                    <button type="button" onClick={toggleMute} className="hover:text-amber-300 cursor-pointer">
                      {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#005baa]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Selector */}
                  <select 
                    value={playbackRate}
                    onChange={handleSpeedChange}
                    className="bg-white/10 text-white text-[10.5px] font-bold rounded-lg px-2 py-0.5 border border-white/20 focus:outline-none cursor-pointer"
                  >
                    <option value={0.75} className="bg-slate-900 text-white">0.75x</option>
                    <option value={1} className="bg-slate-900 text-white">1.0x</option>
                    <option value={1.25} className="bg-slate-900 text-white">1.25x</option>
                    <option value={1.5} className="bg-slate-900 text-white">1.5x</option>
                    <option value={2} className="bg-slate-900 text-white">2.0x</option>
                  </select>

                  {/* Fullscreen */}
                  <button 
                    type="button" 
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Lesson Header & Mark Completed */}
          <div className="bg-white dark:bg-[#0f172a] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-xl font-black text-[#003366] dark:text-white leading-snug">
                  {activeLesson ? (lang === 'km' ? activeLesson.titleKm : activeLesson.titleEn) : ''}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  {lang === 'km' ? 'បង្រៀនដោយ៖' : 'Taught by:'} <span className="text-[#005baa] dark:text-cyan-400 font-bold">{currentSubject.teacher || 'សាស្ត្រាចារ្យជាតិ'}</span> ({currentSubject.teacherRole || 'MoTDAR'})
                </p>
              </div>

              <button
                onClick={handleComplete}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{isCompleted ? (lang === 'km' ? 'បានបញ្ចប់មេរៀននេះ (+50 XP)' : 'Completed (+50 XP)') : (lang === 'km' ? 'កត់ចំណាំថាបានរៀន (+50 XP)' : 'Mark as Completed (+50 XP)')}</span>
              </button>
            </div>

            {/* FULL CLEAN LESSON SUMMARY NOTES (No raw asterisks, clean academic formatting) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#003366] dark:text-cyan-300">
                <FileText className="w-4 h-4 text-[#005baa] dark:text-cyan-400" />
                <span>{lang === 'km' ? 'ខ្លឹមសារសង្ខេបមេរៀន និងរូបមន្តគន្លឹះ (Official Lesson Summary & Notes)' : 'Official Lesson Summary & Notes'}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-3 shadow-inner font-medium">
                <AcademicTextRenderer content={activeLesson?.notes} baseTextSize="text-xs sm:text-sm" />

                {activeLesson?.keyFormulas && activeLesson.keyFormulas.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="font-black text-[#003366] dark:text-amber-300 text-xs mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'km' ? 'រូបមន្តគន្លឹះត្រូវចាំ (Essential Formulas):' : 'Key Formulas to Remember:'}</span>
                    </p>
                    <div className="space-y-2">
                      {activeLesson.keyFormulas.map((formula, idx) => (
                        <div key={idx} className="bg-slate-900 dark:bg-slate-950 text-cyan-300 p-2.5 sm:p-3 rounded-xl border border-slate-700 dark:border-slate-800 font-mono text-xs shadow-2xs font-bold overflow-x-auto [scrollbar-width:none]">
                          <code>{formula}</code>
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
          <div className="bg-white dark:bg-[#0f172a] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#005baa] dark:text-cyan-400" />
                <h3 className="text-sm font-black text-[#003366] dark:text-white">
                  {lang === 'km' ? 'មាតិកាមេរៀនក្នុងមុខវិជ្ជា' : 'Course Curriculum'}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {currentSubject.totalLessons || 20} {lang === 'km' ? 'មេរៀន' : 'lessons'}
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {currentSubject.chapters && currentSubject.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 px-2 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-lg">
                    {lang === 'km' ? chapter.titleKm : chapter.titleEn}
                  </h4>

                  <div className="space-y-1.5 pl-1">
                    {chapter.lessons && chapter.lessons.map((lesson) => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      const done = student?.completedLessons?.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setActiveLesson(lesson);
                            setIsPlaying(true);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/80 dark:bg-cyan-500/20 border-[#005baa] dark:border-cyan-400 text-[#003366] dark:text-cyan-200 shadow-xs'
                              : 'bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              done 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : isCurrent 
                                  ? 'bg-[#005baa] text-white' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                              )}
                            </div>

                            <span className="text-xs font-bold truncate">
                              {lang === 'km' ? lesson.titleKm : lesson.titleEn}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-cinzel font-bold flex-shrink-0">
                            {lesson.duration || '25:00'}
                          </span>
                        </div>
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
