import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Dice5, 
  Check, 
  Wand2, 
  Crown, 
  CheckCircle2, 
  User, 
  Flame, 
  Heart,
  Search,
  Zap,
  Shield,
  Layers,
  Palette,
  Gamepad2,
  Moon,
  Smile,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_AVATAR_FRAMES, AVATAR_FRAME_CATEGORIES } from '../../data/avatarFramesData';
import api from '../../services/api';

export default function AnimeAvatarGeneratorModal({ isOpen, onClose }) {
  const { student, updateAvatar, updateAvatarFrame, updateProfile } = useAuth();
  const { t, lang } = useLanguage();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 12 Boys & 12 Girls
  const boyAvatars = [
    { id: 'b1', gender: 'boy', name: 'សិស្សប្រុស Anime 01', image: '/assets/anime/boys/boy_1.png' },
    { id: 'b2', gender: 'boy', name: 'សិស្សប្រុស Anime 02', image: '/assets/anime/boys/boy_2.png' },
    { id: 'b3', gender: 'boy', name: 'សិស្សប្រុស Anime 03', image: '/assets/anime/boys/boy_3.png' },
    { id: 'b4', gender: 'boy', name: 'សិស្សប្រុស Anime 04', image: '/assets/anime/boys/boy_4.png' },
    { id: 'b5', gender: 'boy', name: 'សិស្សប្រុស Anime 05', image: '/assets/anime/boys/boy_5.png' },
    { id: 'b6', gender: 'boy', name: 'សិស្សប្រុស Anime 06', image: '/assets/anime/boys/boy_6.png' },
    { id: 'b7', gender: 'boy', name: 'សិស្សប្រុស Anime 07', image: '/assets/anime/boys/boy_7.png' },
    { id: 'b8', gender: 'boy', name: 'សិស្សប្រុស Anime 08', image: '/assets/anime/boys/boy_8.png' },
    { id: 'b9', gender: 'boy', name: 'សិស្សប្រុស Anime 09', image: '/assets/anime/boys/boy_9.png' },
    { id: 'b10', gender: 'boy', name: 'សិស្សប្រុស Anime 10', image: '/assets/anime/boys/boy_10.png' },
    { id: 'b11', gender: 'boy', name: 'សិស្សប្រុស Anime 11', image: '/assets/anime/boys/boy_11.png' },
    { id: 'b12', gender: 'boy', name: 'សិស្សប្រុស Anime 12', image: '/assets/anime/boys/boy_12.png' }
  ];

  const girlAvatars = [
    { id: 'g1', gender: 'girl', name: 'សិស្សស្រី Anime 01', image: '/assets/anime/girls/girl_1.png' },
    { id: 'g2', gender: 'girl', name: 'សិស្សស្រី Anime 02', image: '/assets/anime/girls/girl_2.png' },
    { id: 'g3', gender: 'girl', name: 'សិស្សស្រី Anime 03', image: '/assets/anime/girls/girl_3.png' },
    { id: 'g4', gender: 'girl', name: 'សិស្សស្រី Anime 04', image: '/assets/anime/girls/girl_4.png' },
    { id: 'g5', gender: 'girl', name: 'សិស្សស្រី Anime 05', image: '/assets/anime/girls/girl_5.png' },
    { id: 'g6', gender: 'girl', name: 'សិស្សស្រី Anime 06', image: '/assets/anime/girls/girl_6.png' },
    { id: 'g7', gender: 'girl', name: 'សិស្សស្រី Anime 07', image: '/assets/anime/girls/girl_7.png' },
    { id: 'g8', gender: 'girl', name: 'សិស្សស្រី Anime 08', image: '/assets/anime/girls/girl_8.png' },
    { id: 'g9', gender: 'girl', name: 'សិស្សស្រី Anime 09', image: '/assets/anime/girls/girl_9.png' },
    { id: 'g10', gender: 'girl', name: 'សិស្សស្រី Anime 10', image: '/assets/anime/girls/girl_10.png' },
    { id: 'g11', gender: 'girl', name: 'សិស្សស្រី Anime 11', image: '/assets/anime/girls/girl_11.png' },
    { id: 'g12', gender: 'girl', name: 'សិស្សស្រី Anime 12', image: '/assets/anime/girls/girl_12.png' }
  ];

  const allAvatars = [...boyAvatars, ...girlAvatars];

  const [activeTab, setActiveTab] = useState('frames'); // 'frames' | 'avatars'
  const [frameCategoryFilter, setFrameCategoryFilter] = useState('all');
  const [frameSearch, setFrameSearch] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(student.avatar || '/assets/anime/boys/boy_1.png');
  const [selectedFrame, setSelectedFrame] = useState(student.avatarFrame || '/assets/frames/ki_energy.png');
  const [studentCustomName, setStudentCustomName] = useState(student.name || 'riki.dev');
  const [genderFilter, setGenderFilter] = useState('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sync with current student profile whenever modal opens
  useEffect(() => {
    if (isOpen && student) {
      setSelectedAvatar(student.avatar || '/assets/anime/boys/boy_1.png');
      setSelectedFrame(student.avatarFrame || '/assets/frames/ki_energy.png');
      setStudentCustomName(student.name || student.fullName || student.username || 'riki.dev');
    }
  }, [isOpen, student]);

  const displayedAvatars = allAvatars.filter(item => {
    if (genderFilter === 'all') return true;
    return item.gender === genderFilter;
  });

  const categoryIconMap = {
    all: Sparkles,
    anime: Zap,
    cyber: Bot,
    gaming: Gamepad2,
    fantasy: Wand2,
    mythic: Crown,
    elements: Flame,
    space: Moon,
    animals: Heart,
    aesthetic: Palette
  };

  const displayedFrames = ALL_AVATAR_FRAMES.filter(frame => {
    if (frameCategoryFilter !== 'all' && frame.category !== frameCategoryFilter && frame.id !== 'none') {
      return false;
    }
    if (frameSearch.trim()) {
      const q = frameSearch.toLowerCase();
      return frame.nameKm.toLowerCase().includes(q) || frame.nameEn.toLowerCase().includes(q) || frame.tag.toLowerCase().includes(q);
    }
    return true;
  });

  const currentFrameObj = ALL_AVATAR_FRAMES.find(f => f.image === selectedFrame || f.id === selectedFrame) || ALL_AVATAR_FRAMES[0];

  const handleSelectAvatar = (item) => {
    setSelectedAvatar(item.image);
  };

  const handleSelectFrame = (frame) => {
    setSelectedFrame(frame.image || (frame.isSvg ? frame.id : null));
  };

  const handleRandomize = () => {
    const randomAvatar = allAvatars[Math.floor(Math.random() * allAvatars.length)];
    const validFrames = ALL_AVATAR_FRAMES.filter(f => f.id !== 'none' && f.image);
    const randomFrame = validFrames[Math.floor(Math.random() * validFrames.length)];
    
    setSelectedAvatar(randomAvatar.image);
    setSelectedFrame(randomFrame.image);
  };

  const handleApply = async () => {
    updateAvatar(selectedAvatar);
    updateAvatarFrame(selectedFrame);
    if (studentCustomName.trim()) {
      updateProfile({ name: studentCustomName.trim() });
    }

    try {
      const studentId = student?.id || student?.username || student?.name || 1;
      await api.updateProfile(studentId, {
        avatar: selectedAvatar,
        avatarFrame: selectedFrame,
        avatar_frame: selectedFrame,
        name: studentCustomName.trim() || student?.name,
        username: student?.username,
        email: student?.email
      });
    } catch (e) {
      console.warn('Failed to sync avatar frame to server:', e);
    }

    setCopiedSuccess(true);
    setTimeout(() => {
      setCopiedSuccess(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full my-auto max-h-[92vh] overflow-hidden flex flex-col font-kantumruy">
        
        {/* Modal Header */}
        <div className="px-3.5 py-2.5 sm:px-6 sm:py-4 bg-gradient-to-r from-[#003366] via-[#005baa] to-[#0284c7] text-white flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-base md:text-lg font-extrabold truncate">
                  Avatar & Frame Studio
                </h2>
                <span className="hidden sm:inline-flex bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  {ALL_AVATAR_FRAMES.length}+ ស៊ុមចលនា
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-blue-100 hidden sm:block mt-0.5 truncate">
                កាតាឡុកស៊ុមចលនាបែប Anime, Gaming, Magic & Cyberpunk ឥតគិតថ្លៃ!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            title="បិទ (Close)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1 bg-slate-50/50">
          
          {/* Top Live Preview Hub (Desktop: 2-Col Side-by-side, Mobile: Top Compact Live Bar + Selector Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-start bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            
            {/* Live Preview Card */}
            <div className="md:col-span-5 flex flex-row md:flex-col items-center justify-center text-left md:text-center gap-3 sm:gap-4 p-2.5 sm:p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 md:bg-none rounded-xl border border-slate-200/80 md:border-0">
              
              {/* Perfectly Calibrated Avatar Frame Container */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center flex-shrink-0 select-none">
                
                {/* Pure Circular Avatar Base (Calibrated to 80% to fit frame inner ring) */}
                <div className={`w-[80%] h-[80%] rounded-full overflow-hidden bg-slate-900 shadow-sm flex items-center justify-center ${selectedFrame && selectedFrame !== 'none' ? '' : 'border border-slate-300'}`}>
                  <img
                    src={api.formatAvatarUrl(selectedAvatar || student?.avatar)}
                    alt="Selected Anime Avatar Preview"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      if (!e.currentTarget.src.includes('boy_1.png')) {
                        e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                      }
                    }}
                  />
                </div>

                {/* Animated Frame Decoration Overlay (Exact 100% Frame Canvas) */}
                {selectedFrame && selectedFrame !== 'none' && (
                  <img
                    src={selectedFrame}
                    alt="Animated Frame Overlay"
                    className="absolute inset-0 w-full h-full pointer-events-none object-contain z-10 select-none scale-105 drop-shadow-md"
                    onError={(e) => {
                      const current = e.currentTarget.src;
                      if (current.endsWith('.png')) {
                        e.currentTarget.src = current.replace('.png', '.webp');
                      } else if (current.endsWith('.webp')) {
                        e.currentTarget.src = current.replace('.webp', '.png');
                      }
                    }}
                  />
                )}
              </div>

              {/* Editable Name Input & Quick Action in Modal */}
              <div className="w-full space-y-1 sm:space-y-1.5 flex-1 md:max-w-xs">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-600 block text-left">
                  ឈ្មោះសិស្ស (Student Name):
                </label>
                <input
                  type="text"
                  value={studentCustomName}
                  onChange={(e) => setStudentCustomName(e.target.value)}
                  placeholder="វាយបញ្ចូលឈ្មោះសិស្ស..."
                  className="w-full bg-white md:bg-slate-50 border border-slate-300 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs text-slate-900 font-bold text-left md:text-center focus:outline-none focus:border-[#005baa] focus:bg-white focus:ring-1 focus:ring-[#005baa]"
                />

                {/* Action Buttons under Preview */}
                <div className="flex items-center gap-1.5 sm:gap-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white md:bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-[#005baa] text-[11px] sm:text-xs font-bold text-slate-800 transition-all shadow-2xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
                  >
                    <Dice5 className="w-3.5 h-3.5 text-amber-600" />
                    <span>ចៃដន្យ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#005baa] to-[#0284c7] hover:from-[#003366] hover:to-[#005baa] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
                  >
                    {copiedSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>បានរក្សាទុក!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>ប្រើប្រាស់</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Studio Selector Tabs & Content */}
            <div className="md:col-span-7 space-y-2.5 sm:space-y-3">
              
              {/* Studio Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('frames')}
                  className={`flex-1 py-1.5 sm:py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0 ${
                    activeTab === 'frames'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span className="truncate">ស៊ុមចលនា ({ALL_AVATAR_FRAMES.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('avatars')}
                  className={`flex-1 py-1.5 sm:py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0 ${
                    activeTab === 'avatars'
                      ? 'bg-white text-[#005baa] shadow-xs border border-slate-200 font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#005baa] flex-shrink-0" />
                  <span className="truncate">រូប Anime ({allAvatars.length})</span>
                </button>
              </div>

              {/* Tab 1: Massive Animated Frames Collection */}
              {activeTab === 'frames' && (
                <div className="space-y-2">
                  
                  {/* Category Pills Filter with Sleek Modern Icons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] sm:text-[11px] font-bold scrollbar-none">
                    {AVATAR_FRAME_CATEGORIES.map((cat) => {
                      const IconComponent = categoryIconMap[cat.id] || Sparkles;
                      const isSelected = frameCategoryFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFrameCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            isSelected 
                              ? 'bg-[#005baa] text-white shadow-xs font-bold' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                          <span>{cat.nameKm}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar for Frames */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={frameSearch}
                      onChange={(e) => setFrameSearch(e.target.value)}
                      placeholder="ស្វែងរកស៊ុមចលនា (ឧ. Dragon, Saiyan, Cyberpunk)..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#005baa]"
                    />
                  </div>

                  {/* Frame Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-48 sm:max-h-60 overflow-y-auto pr-1">
                    {displayedFrames.map((frame, idx) => {
                      const isSelected = selectedFrame === frame.image || selectedFrame === frame.id;
                      return (
                        <div
                          key={`${frame.id}_${idx}`}
                          onClick={() => handleSelectFrame(frame)}
                          className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2 sm:gap-2.5 group ${
                            isSelected 
                              ? 'border-[#005baa] ring-2 ring-[#005baa] bg-blue-50/70 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {/* Circular Thumbnail Preview */}
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 relative overflow-visible shadow-2xs">
                            {frame.image ? (
                              <img 
                                src={frame.image} 
                                alt={frame.nameEn} 
                                className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] object-contain max-w-none pointer-events-none select-none" 
                              />
                            ) : (
                              <span className="text-xs text-slate-400">🚫</span>
                            )}
                          </div>

                          {/* Full Name & Tag */}
                          <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight truncate group-hover:text-[#005baa]">
                              {frame.nameKm}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 truncate">
                                {frame.tag}
                              </span>
                              {isSelected && (
                                <span className="text-[8px] sm:text-[9px] font-black text-[#005baa] bg-blue-100 px-1 rounded flex-shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: 24 Anime Avatars Grid */}
              {activeTab === 'avatars' && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs text-slate-500 font-bold">ជ្រើសរើសរូបសិស្ស៖</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setGenderFilter('all')}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer ${genderFilter === 'all' ? 'bg-[#005baa] text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        ទាំងអស់ (២៤)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenderFilter('boy')}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer ${genderFilter === 'boy' ? 'bg-[#005baa] text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        សិស្សប្រុស (១២)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenderFilter('girl')}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer ${genderFilter === 'girl' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        សិស្សស្រី (១២)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-48 sm:max-h-64 overflow-y-auto pr-1">
                    {displayedAvatars.map((item) => {
                      const isSelected = selectedAvatar === item.image;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectAvatar(item)}
                          className={`p-1 rounded-xl border cursor-pointer transition-all flex flex-col items-center group ${
                            isSelected 
                              ? 'border-[#005baa] ring-2 ring-[#005baa] bg-blue-50/60 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>រូបតំណាង និងស៊ុមចលនារក្សាទុកក្នុង Profile សិស្សដោយស្វ័យប្រវត្តិ</span>
          </p>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              បិទ (Close)
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="btn-moeys-gold px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold shadow-sm flex items-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <span>✨ ប្រើប្រាស់ (Save & Apply)</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
