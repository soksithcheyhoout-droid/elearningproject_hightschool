import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Zap, 
  Award, 
  Flame, 
  Clock, 
  Search, 
  Filter, 
  Play, 
  Atom, 
  Landmark, 
  Crown, 
  ChevronRight, 
  Star,
  CheckCircle2,
  ShieldCheck,
  Building2,
  BookOpen,
  Sword,
  Swords,
  Layers,
  Coins,
  Wand2,
  Grid,
  Key,
  Users,
  Monitor,
  Smartphone,
  Bot
} from 'lucide-react';
import { playgroundGamesData } from '../../data/playgroundGamesData';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import PlaygroundGameModal from './PlaygroundGameModal';
import BossBattleGameModal from './BossBattleGameModal';
import MemoryMatchGameModal from './MemoryMatchGameModal';
import Science2048GameModal from './Science2048GameModal';
import api from '../../services/api';
import WordleAcademicModal from './WordleAcademicModal';
import GoldQuestGameModal from './GoldQuestGameModal';
import KahootSpeedArenaModal from './KahootSpeedArenaModal';
import DuelMultiplayerModal from './DuelMultiplayerModal';
import EnglishAudioSpellingModal from './EnglishAudioSpellingModal';
import { Headphones } from 'lucide-react';

export default function PlaygroundArenaView() {
  const { student } = useAuth();
  const { lang } = useLanguage();

  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Game Modals State
  const [activeGame, setActiveGame] = useState(null);
  const [bossBattleGame, setBossBattleGame] = useState(null);
  const [goldQuestGame, setGoldQuestGame] = useState(null);
  const [kahootGame, setKahootGame] = useState(null);
  const [duelGame, setDuelGame] = useState(null);
  const [initialRoomCode, setInitialRoomCode] = useState(null);
  const [showMemoryMatch, setShowMemoryMatch] = useState(false);
  const [show2048Game, setShow2048Game] = useState(false);
  const [showWordleGame, setShowWordleGame] = useState(false);
  const [showEnglishSpellGame, setShowEnglishSpellGame] = useState(false);

  // Auto-open multiplayer duel if invited via ?room=... link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setInitialRoomCode(roomParam);
        setDuelGame(playgroundGamesData[0]);
      }
    } catch (e) {}
  }, []);

  const levelInfo = computeLevelData(student?.xp || 3568);

  const is1v1Search = searchQuery.toLowerCase().includes('1v1') || searchQuery.toLowerCase().includes('duel') || searchQuery.toLowerCase().includes('bot');

  const filteredGames = playgroundGamesData.filter((game) => {
    const matchesStream = selectedStream === 'all' || game.stream === selectedStream || game.stream === 'all';
    const matchesDiff = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
    const matchesSub = selectedSubject === 'all' || game.subjectKey === selectedSubject;
    
    let matchesSearch = true;
    if (searchQuery.trim() && !is1v1Search) {
      const q = searchQuery.toLowerCase();
      matchesSearch = (
        game.titleKm.toLowerCase().includes(q) ||
        game.titleEn.toLowerCase().includes(q) ||
        game.subject.toLowerCase().includes(q) ||
        game.descriptionKm.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
      );
    }

    return matchesStream && matchesDiff && matchesSub && matchesSearch;
  });

  const scienceCount = playgroundGamesData.filter(g => g.stream === 'science' || g.stream === 'all').length;
  const socialCount = playgroundGamesData.filter(g => g.stream === 'social' || g.stream === 'all').length;

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* HERO SPOTLIGHT FEATURED BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#005baa] border-2 border-amber-400/80 shadow-xl text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Watermark Logo in Banner Background */}
        <div className="absolute right-4 sm:right-1/4 lg:right-72 top-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Arena Watermark Crest"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-cinzel">
                <Crown className="w-3.5 h-3.5" />
                <span>#1 FEATURED ARENA OF THE DAY</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-black font-cinzel flex items-center gap-1">
                <Swords className="w-3.5 h-3.5" />
                <span>1V1 LIVE DUEL ENABLED</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-bold flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-300" />
                <span>{lang === 'km' ? '៥.១k សិស្សកំពុងប្រកួត' : '5.1k Active Players'}</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {lang === 'km' ? 'សង្វៀនប្រកួត 1v1 & Team Battle' : '1v1 Live Duel & Team Battle Arena'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                {lang === 'km' ? 'ប្រកួតល្បឿន 1v1 ភ្លាមៗជាមួយ AI Scholar Bots ឬបង្កើតបន្ទប់ (Room Code) ដើម្បី Invite មិត្តភក្តិ ឬលេងជាក្រុម 2v2 Team Squad ដណ្តើមពានរង្វាន់!' : 'Compete head-to-head in real-time 1v1 speed duels with AI Bots or create private Room Codes to battle friends.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="hacker-button-container">
                <button
                  type="button"
                  onClick={() => setDuelGame({
                    id: 'arena-1v1-master',
                    titleKm: 'សង្វៀនប្រកួត 1v1 Arena',
                    titleEn: '1v1 Live Academic Duel',
                    stream: selectedStream === 'all' ? (student?.stream || 'science') : selectedStream,
                    subject: 'សង្វៀនប្រកួត'
                  })}
                  className="hacker-button"
                  data-text={lang === 'km' ? '⚔️ បង្កើតបន្ទប់ប្រកួត 1v1 (START 1V1 DUEL)' : '⚔️ START 1V1 DUEL'}
                >
                  <Swords className="w-4 h-4 fill-current relative z-10 text-purple-300" />
                  <span className="relative z-10 font-bold">{lang === 'km' ? 'បង្កើតបន្ទប់ប្រកួត 1v1 (START 1V1 DUEL)' : 'Start 1v1 Live Duel'}</span>
                  
                  <div className="neon-frame" />
                  <div className="circuit-traces">
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                  </div>
                  <div className="code-fragments">
                    <span className="code-fragment">0x1A</span>
                    <span className="code-fragment">1100</span>
                    <span className="code-fragment">DUEL</span>
                    <span className="code-fragment">1V1</span>
                    <span className="code-fragment">WIN</span>
                  </div>
                  <div className="interference" />
                  <div className="scan-bars">
                    <div className="scan-bar" />
                    <div className="scan-bar" />
                    <div className="scan-bar" />
                  </div>
                  <div className="text-glow" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setGoldQuestGame(filteredGames[0] || playgroundGamesData[0])}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? 'លេង Blooket Gold Quest' : 'Play Gold Quest'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEnglishSpellGame(true)}
                className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm border border-cyan-300/40 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <Headphones className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{lang === 'km' ? '🎧 English Practice: Listen & Spell' : '🎧 English Practice: Listen & Spell'}</span>
              </button>
            </div>

          </div>

          {/* Gamer Live Stats Card with Avatar Frame */}
          <div className="w-full lg:w-80 bg-slate-950/60 backdrop-blur-md rounded-3xl p-5 border border-white/20 space-y-4 shadow-inner">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <div className={`w-[80%] h-[80%] rounded-full overflow-hidden shadow-md bg-slate-900 ${student?.avatarFrame ? '' : 'border-2 border-amber-400'}`}>
                  <img 
                    src={api.formatAvatarUrl(student?.avatar)} 
                    alt={student?.name || 'Student'} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      if (!e.currentTarget.src.includes('boy_1.png')) {
                        e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                      }
                    }}
                  />
                </div>
                {student?.avatarFrame && (
                  <img 
                    src={student.avatarFrame} 
                    alt="Frame" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110" 
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
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] font-cinzel">
                  Lv.{levelInfo.level}
                </div>
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-cinzel">
                  PLAYER PROFILE
                </span>
                <h4 className="font-extrabold text-sm text-white truncate">{student?.name || 'Student'}</h4>
                <span className="text-[11px] text-blue-200 font-cinzel">Level {levelInfo.level} ({student?.xp || 0} XP)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px] font-bold text-blue-200">
                <span>{lang === 'km' ? 'កម្រិតបច្ចុប្បន្ន' : 'Level Progress'}</span>
                <span className="text-amber-300 font-cinzel">{levelInfo.progressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                  style={{ width: `${levelInfo.progressPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold pt-1">
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-[10px] text-slate-400 block">1V1 DUELS</span>
                <span className="text-rose-400 font-cinzel">LIVE 1v1</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <span className="text-[10px] text-slate-400 block">STREAK</span>
                <span className="text-amber-400 font-cinzel">{student?.streakDays || 0} {lang === 'km' ? 'ថ្ងៃ' : 'Days'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 6 TOP GAME ENGINES (1v1 DUEL, BLOOKET, KAHOOT, RPG, 2048, WORDLE) */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#005baa]" />
            <h3 className="text-base sm:text-lg font-black text-[#003366]">
              {lang === 'km' ? 'ម៉ាស៊ីនហ្គេម Arcade & 1v1 Multiplayer ទាំង ៧' : '7 Core Educational Game Engines'}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:block">
            1v1 vs Bot / Friends + AI Audio Spell + Blooket + Kahoot + RPG + 2048 + Wordle
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
          
          {/* 1. 1v1 Duel Arena */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-rose-600">1V1 DUEL</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  99
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-rose-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>{lang === 'km' ? 'សង្វៀនប្រកួត 1v1' : '1v1 Live Duel'}</span>
                  <Swords className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {lang === 'km' ? 'ប្រកួត 1v1 ជាមួយ AI Bots ឬ Invite មិត្តភក្តិតាម Room Code និង 2v2 Team Squad!' : 'Head-to-head live duel against AI Bots or invite friends via Room Code!'}
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px] font-bold">{lang === 'km' ? 'ទម្រង់៖' : 'Mode:'}</span>
                  <span className="font-bold text-slate-700 truncate">1v1 Bot/Room</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px] font-bold">{lang === 'km' ? 'រង្វាន់ XP៖' : 'XP Reward:'}</span>
                  <span className="font-black text-amber-600 font-cinzel">+400 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setDuelGame({
                  id: 'arena-1v1-master',
                  titleKm: 'សង្វៀនប្រកួត 1v1 Arena',
                  titleEn: '1v1 Live Academic Duel',
                  stream: selectedStream === 'all' ? (student?.stream || 'science') : selectedStream,
                  subject: 'សង្វៀនប្រកួត'
                })}
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <Swords className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">{lang === 'km' ? 'ចូលលេង 1v1 Duel (Play 1v1)' : 'Play 1v1 Duel'}</span>
                <span className="sm:hidden">{lang === 'km' ? 'លេង 1v1' : 'Play 1v1'}</span>
              </button>
            </div>
          </div>

          {/* 2. Blooket Gold Quest */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-slate-500">BLOOKET</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  99
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-amber-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>រុករករតនសម្បត្តិមាស</span>
                  <Coins className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  ឆ្លើយសំណួរដើម្បីបើកហឹបកំណប់អាថ៌កំបាំង ៣ ដណ្តើមយករតនសម្បត្តិកាក់មាស & Jackpot!
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">ប្រភេទ៖</span>
                  <span className="font-bold text-slate-700 truncate">Gold Chest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">រង្វាន់ XP៖</span>
                  <span className="font-black text-amber-600 font-cinzel">+500 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setGoldQuestGame(filteredGames[0] || playgroundGamesData[0])}
                className="w-full py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#003366] hover:bg-amber-600 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">លេង Gold Quest (Play)</span>
                <span className="sm:hidden">លេង Gold Quest</span>
              </button>
            </div>
          </div>

          {/* 3. Kahoot Speed Arena */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-slate-500">KAHOOT</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  98
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-purple-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>ប្រកួតល្បឿន Kahoot</span>
                  <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  ប្រកួតល្បឿន ១២ វិនាទីលើប្លុកឆ្លើយ ៤ ពណ៌ 🔺🔷🟡🟩 ដណ្តើមជើងឯកលើ Podium!
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">ប្រភេទ៖</span>
                  <span className="font-bold text-slate-700 truncate">Speed Quiz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">រង្វាន់ XP៖</span>
                  <span className="font-black text-amber-600 font-cinzel">+400 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setKahootGame(filteredGames[0] || playgroundGamesData[0])}
                className="w-full py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#003366] hover:bg-purple-600 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">លេង Kahoot Speed (Play)</span>
                <span className="sm:hidden">លេង Kahoot</span>
              </button>
            </div>
          </div>

          {/* 4. RPG Boss Duel */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-slate-500">RPG BATTLE</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  98
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-rose-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>សមរភូមិ Boss វិជ្ជា</span>
                  <Sword className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Turn-based RPG Combat វាយប្រហារ Boss ដោយកាំរស្មី ដាវពន្លឺ និងមន្តអាគម 50:50!
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">ប្រភេទ៖</span>
                  <span className="font-bold text-slate-700 truncate">RPG Combat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">រង្វាន់ XP៖</span>
                  <span className="font-black text-amber-600 font-cinzel">+450 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setBossBattleGame(filteredGames[0] || playgroundGamesData[0])}
                className="w-full py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#003366] hover:bg-rose-600 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">លេងប្រយុទ្ធ Boss (Play)</span>
                <span className="sm:hidden">លេង Boss</span>
              </button>
            </div>
          </div>

          {/* 5. 2048 Science Evolution */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-slate-500">PUZZLE</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  99
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-amber-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>2048 ធាតុវិទ្យាសាស្ត្រ</span>
                  <Grid className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  រុញផ្គុំធាតុគីមី H + H ➔ He ➔ Li ➔ C ➔ O រហូតដល់មាសសុទ្ធ 2048!
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">ប្រភេទ៖</span>
                  <span className="font-bold text-slate-700 truncate">2048 Fusion</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">រង្វាន់ XP៖</span>
                  <span className="font-black text-amber-600 font-cinzel">+500 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setShow2048Game(true)}
                className="w-full py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#003366] hover:bg-amber-600 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">លេងផ្គុំ 2048 (Play)</span>
                <span className="sm:hidden">លេង 2048</span>
              </button>
            </div>
          </div>

          {/* 6. Wordle Academic Master */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-[9px] sm:text-xs">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  <span className="font-bold text-[8.5px] sm:text-[11px] text-slate-500">WORDLE</span>
                </div>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] sm:text-xs font-black font-cinzel">
                  95
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5">
                <h4 className="text-xs sm:text-lg font-black text-[#003366] group-hover:text-emerald-600 transition-colors flex items-center justify-between line-clamp-1">
                  <span>ទាយពាក្យ Wordle</span>
                  <Key className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                </h4>
                <p className="hidden sm:block text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  ទាយពាក្យគន្លឹះបាក់ឌុបក្នុងចំនួន ៦ ដង ជាមួយតម្រុយពណ៌ និងក្តារចុចនិម្មិត!
                </p>
              </div>

              <div className="pt-1 sm:pt-2 border-t border-slate-100 space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">ប្រភេទ៖</span>
                  <span className="font-bold text-slate-700 truncate">Word Guess</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[8.5px] sm:text-[11px]">រង្វាន់ XP៖</span>
                  <span className="font-black text-amber-600 font-cinzel">+350 XP</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-5 pt-0">
              <button
                type="button"
                onClick={() => setShowWordleGame(true)}
                className="w-full py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#003366] hover:bg-emerald-600 text-white font-black text-[10.5px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                <span className="hidden sm:inline">លេងទាយ Wordle (Play)</span>
                <span className="sm:hidden">លេង Wordle</span>
              </button>
            </div>
          </div>

          {/* 7. English Practice: Listen and Spell */}
          <div className="col-span-2 lg:col-span-3 bg-gradient-to-r from-[#031b38] via-[#052b57] to-[#01142a] rounded-2xl sm:rounded-3xl border-2 border-cyan-400/50 hover:border-cyan-300 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30 border border-cyan-300/40">
                <Headphones className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-black tracking-wider uppercase border border-cyan-400/30">
                    SMART AUDIO 3X VOICE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-400/30">
                    LOW • MEDIUM • HARD
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-black border border-amber-400/30">
                    +600 XP
                  </span>
                </div>
                <h4 className="text-base sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {lang === 'km' ? 'English Practice: Listen and Spell (ស្តាប់ & សរសេរអក្ខរាវិរុទ្ធ)' : 'English Practice: Listen and Spell'}
                </h4>
                <p className="text-xs text-blue-100/80 max-w-xl line-clamp-2">
                  {lang === 'km' 
                    ? 'ប្រព័ន្ធបញ្ចេញសំឡេងពាក្យអង់គ្លេស ៣ ដងយឺតៗច្បាស់ៗ (Earth... 3x Go!) តាមកម្រិត Low, Medium, Hard តាមស្តង់ដារជាតិ MoTDAR!' 
                    : 'Listen to slow, clear English voice pronunciations 3 times in sequence (Low, Medium, Hard difficulties) with smart dictation!'}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto relative z-10">
              <button
                type="button"
                onClick={() => setShowEnglishSpellGame(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-cyan-500/25 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'km' ? 'ចូលអនុវត្តស្តាប់ (Start Practice)' : 'Start Practice'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* DUAL-STREAM GAME FILTER CONTROLS */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#005baa]" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#003366]">
              សង្វៀនហ្គេមហាត់សមវិជ្ជា (Academic Gaming Arena - {playgroundGamesData.length} Master Games)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            ហ្គេមសរុប៖ {playgroundGamesData.length} (វិទ្យាសាស្ត្រ៖ {scienceCount}, សង្គម៖ {socialCount})
          </span>
        </div>

        {/* 4 Main Stream & English Practice Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedStream('all')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedStream === 'all'
                ? 'bg-gradient-to-r from-[#003366] to-[#005baa] text-white border-[#003366] shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>ហ្គេមទាំងពីរផ្នែក ({playgroundGamesData.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStream('science')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedStream === 'science'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-400/40'
                : 'bg-blue-50/50 hover:bg-blue-100/70 text-[#003366] border-blue-200'
            }`}
          >
            <Atom className="w-4 h-4 text-cyan-300" />
            <span>ថ្នាក់វិទ្យាសាស្ត្រពិត ({scienceCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStream('social')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedStream === 'social'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-sm ring-2 ring-amber-400/40'
                : 'bg-amber-50/50 hover:bg-amber-100/70 text-amber-950 border-amber-200'
            }`}
          >
            <Landmark className="w-4 h-4 text-amber-200" />
            <span>ថ្នាក់វិទ្យាសាស្ត្រសង្គម ({socialCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEnglishSpellGame(true)}
            className="p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-indigo-900/40 hover:from-cyan-600 hover:to-blue-600 text-cyan-900 hover:text-white border-cyan-400/60 shadow-xs"
          >
            <Headphones className="w-4 h-4 text-cyan-500 hover:text-white animate-pulse" />
            <span className="truncate">English Practice (Low/Med/Hard)</span>
          </button>
        </div>

        {/* Search & Difficulty Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs font-bold pt-1">
          <div className="sm:col-span-8 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="វាយ '1v1', 'bot', ឬឈ្មោះមេរៀន (ឧ. លីមីត, ចំនួនកុំផ្លិច, ADN, ប្រវត្តិ)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#005baa] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-2xl px-3 py-2.5 focus:outline-none focus:border-[#005baa] cursor-pointer"
            >
              <option value="all">គ្រប់កម្រិតលំបាកទាំងអស់ (All Tiers)</option>
              <option value="beginner">កម្រិតងាយស្រួល (Beginner Tier)</option>
              <option value="intermediate">កម្រិតមធ្យម (Intermediate Tier)</option>
              <option value="master">កម្រិតបាក់ឌុបឆ្នើម (BacII Master Tier)</option>
            </select>
          </div>
        </div>

        {/* Quick Subject Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-[11px] font-bold">
          {[
            { key: 'all', label: 'គ្រប់មុខវិជ្ជាទាំងអស់' },
            { key: 'math', label: 'គណិតវិទ្យា' },
            { key: 'physics', label: 'រូបវិទ្យា' },
            { key: 'chemistry', label: 'គីមីវិទ្យា' },
            { key: 'biology', label: 'ជីវវិទ្យា' },
            { key: 'khmer', label: 'អក្សរសាស្ត្រខ្មែរ' },
            { key: 'history', label: 'ប្រវត្តិវិទ្យា' },
            { key: 'geography', label: 'ភូមិវិទ្យា' },
            { key: 'civics', label: 'សីលធម៌-ពលរដ្ឋ' },
            { key: 'english', label: 'ភាសាអង់គ្លេស' }
          ].map((sub) => (
            <button
              key={sub.key}
              type="button"
              onClick={() => setSelectedSubject(sub.key)}
              className={`px-3 py-1 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub.key
                  ? 'bg-[#003366] text-white border-[#003366] shadow-2xs font-extrabold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

      </div>

      {/* GAME CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>បញ្ជីហ្គេមអាចលេងបាន ({filteredGames.length} Games)</span>
          </h4>
        </div>

        {filteredGames.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <Gamepad2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">រកមិនឃើញហ្គេមស្របតាមតម្រងនេះទេ</h4>
            <p className="text-xs text-slate-500">សូមកំណត់តម្រងឡើងវិញ ឬស្វែងរកពាក្យគន្លឹះផ្សេង។</p>
            <button
              onClick={() => { setSelectedStream('all'); setSelectedDifficulty('all'); setSelectedSubject('all'); setSearchQuery(''); }}
              className="btn-moeys-primary text-xs py-1.5 px-4 font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              កំណត់តម្រងឡើងវិញ (Reset Filters)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredGames.map((game) => {
              const isSocial = game.stream === 'social';
              return (
                <div 
                  key={game.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#005baa] p-2.5 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-2 sm:gap-4 group"
                >
                  <div className="space-y-1.5 sm:space-y-2.5">
                    
                    {/* Card Top Badges */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`text-[7.5px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-md sm:rounded-full flex items-center gap-0.5 sm:gap-1 ${
                        isSocial ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {isSocial ? <Landmark className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" /> : <Atom className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#005baa]" />}
                        <span>{isSocial ? 'សង្គម' : 'វិទ្យាសាស្ត្រ'}</span>
                      </span>

                      <span className="text-[7.5px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
                        <span>+{game.xpReward} XP</span>
                      </span>
                    </div>

                    {/* Game Title */}
                    <div>
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                        {game.subject} • {game.category}
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#003366] group-hover:text-[#005baa] transition-colors line-clamp-1">
                        {game.titleKm}
                      </h4>
                    </div>

                    {/* Description (Desktop only) */}
                    <p className="hidden sm:block text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {game.descriptionKm}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-[11px] text-slate-500 pt-0.5 sm:pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#005baa]" />
                        <span>{game.timeLimitSeconds} វិ.</span>
                      </span>
                      <span>•</span>
                      <span>{game.questions && game.questions.length >= 8 ? game.questions.length : 15} សំណួរ</span>
                    </div>

                  </div>

                  {/* 3 Action Buttons (Sprint, 1v1 Duel, Gold Quest) */}
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveGame(game)}
                      className="btn-moeys-primary py-1.5 sm:py-2 px-0.5 sm:px-1 text-[8.5px] sm:text-[10px] font-extrabold shadow-xs flex items-center justify-center gap-0.5 cursor-pointer rounded-lg sm:rounded-xl"
                      title="លេងបែប Speed Sprint"
                    >
                      <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white" />
                      <span>Sprint</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDuelGame(game)}
                      className="py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-[8.5px] sm:text-[10px] shadow-xs flex items-center justify-center gap-0.5 cursor-pointer transition-all"
                      title="ប្រកួត 1v1 vs Bot / មិត្តភក្តិ"
                    >
                      <Swords className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>1v1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGoldQuestGame(game)}
                      className="py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-[8.5px] sm:text-[10px] shadow-xs flex items-center justify-center gap-0.5 cursor-pointer transition-all"
                      title="រុករករតនសម្បត្តិ Blooket"
                    >
                      <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>Gold</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Speed Sprint Quiz Modal */}
      {activeGame && (
        <PlaygroundGameModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* 1v1 & Team Multiplayer Duel Modal */}
      {duelGame && (
        <DuelMultiplayerModal
          game={duelGame}
          initialRoomCode={initialRoomCode}
          onClose={() => {
            setDuelGame(null);
            setInitialRoomCode(null);
          }}
        />
      )}

      {/* RPG Boss Battle Modal */}
      {bossBattleGame && (
        <BossBattleGameModal
          game={bossBattleGame}
          onClose={() => setBossBattleGame(null)}
        />
      )}

      {/* Blooket Gold Quest Modal */}
      {goldQuestGame && (
        <GoldQuestGameModal
          game={goldQuestGame}
          onClose={() => setGoldQuestGame(null)}
        />
      )}

      {/* Kahoot Speed Arena Modal */}
      {kahootGame && (
        <KahootSpeedArenaModal
          game={kahootGame}
          onClose={() => setKahootGame(null)}
        />
      )}

      {/* 3D Memory Card Match Modal */}
      {showMemoryMatch && (
        <MemoryMatchGameModal
          onClose={() => setShowMemoryMatch(false)}
        />
      )}

      {/* 2048 Scientific Evolution Modal */}
      {show2048Game && (
        <Science2048GameModal
          onClose={() => setShow2048Game(false)}
        />
      )}

      {/* Wordle Academic Modal */}
      {showWordleGame && (
        <WordleAcademicModal
          onClose={() => setShowWordleGame(false)}
        />
      )}

      {/* English AI Audio Dictation / Spelling Bee Modal */}
      {showEnglishSpellGame && (
        <EnglishAudioSpellingModal
          isOpen={showEnglishSpellGame}
          onClose={() => setShowEnglishSpellGame(false)}
        />
      )}

    </div>
  );
}
