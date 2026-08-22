import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Globe, 
  Users, 
  Swords, 
  Maximize2,
  Minimize2,
  Flame,
  Lightbulb,
  CheckCheck
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { INITIAL_GLOBAL_MESSAGES, INITIAL_PRIVATE_CONTACTS } from '../../data/chatData';

export default function FloatingChatButton({ onOpenFullChat, onLaunchDuelGame }) {
  const { student } = useAuth();
  const levelInfo = computeLevelData(student?.xp || 2915);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'direct'
  const [inputMsg, setInputMsg] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  const [globalMessages, setGlobalMessages] = useState(INITIAL_GLOBAL_MESSAGES);
  const [contacts, setContacts] = useState(INITIAL_PRIVATE_CONTACTS);
  const [activeContactId, setActiveContactId] = useState('c1');

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [isOpen, globalMessages, contacts, activeTab]);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMsg.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    playSound.click();

    if (activeTab === 'global') {
      setGlobalMessages(prev => [
        ...prev,
        {
          id: `float_m_${Date.now()}`,
          sender: student?.name || 'សុខ វិបុល',
          avatar: student?.avatar || '/assets/anime/boy_1.jpg',
          grade: `ថ្នាក់ទី${student?.grade || '12'}`,
          school: student?.school || 'វិទ្យាល័យ',
          role: levelInfo.rankTitleKm,
          roleColor: 'bg-cyan-500 text-slate-950',
          text: inputMsg,
          timestamp: timeStr,
          reactions: {},
          isChallenge: false
        }
      ]);
      setInputMsg('');
    } else {
      setContacts(prev => prev.map(c => {
        if (c.id === activeContactId) {
          return {
            ...c,
            lastMessage: inputMsg,
            lastTime: timeStr,
            messages: [...c.messages, { id: `float_pm_${Date.now()}`, senderId: 'me', text: inputMsg, timestamp: timeStr }]
          };
        }
        return c;
      }));
      setInputMsg('');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="group relative flex items-center justify-center">
          
          {/* Ambient Pulsing Glow Aura */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 opacity-40 blur-xl group-hover:opacity-80 transition-all duration-500 animate-pulse pointer-events-none" />

          {/* Luxury Action Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Student Messenger"
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#0c1527]/98 to-slate-950/98 border border-cyan-400/50 text-cyan-400 shadow-[0_10px_35px_rgba(6,182,212,0.35)] backdrop-blur-2xl hover:border-cyan-300 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden group/btn"
          >
            {/* Top Rim Specular Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />
            
            {/* Specular Light Sweep on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            
            {/* User's Custom Messenger SVG */}
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover/btn:scale-115 group-hover/btn:rotate-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]"
              fill="none"
            >
              <path fill="none" d="M0 0h24v24H0z" stroke="none" />
              <path d="M8 9h8" />
              <path d="M8 13h6" />
              <path
                d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
              />
            </svg>

            {/* Glowing Live Notification Badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                <span className="relative min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-cinzel font-black text-[10px] flex items-center justify-center shadow-lg border-2 border-slate-950">
                  {unreadCount}
                </span>
              </div>
            )}
          </button>

          {/* Hyper-Polished Floating Tooltip */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-300 origin-bottom pointer-events-none z-50">
            <div className="relative px-3.5 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-white text-xs font-black shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-2 whitespace-nowrap font-kantumruy">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-bold">
                Student Messenger • សារជជែក
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-cinzel font-black border border-cyan-500/30">
                LIVE
              </span>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950" />
            </div>
          </div>

        </div>
      </div>

      {/* Floating Messenger Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 h-[32rem] bg-[#0e1726] rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col text-white overflow-hidden animate-fade-in font-kantumruy">
          
          {/* Header */}
          <div className="bg-[#090e17] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-xs text-white block">Student Messenger</span>
                <span className="text-[10px] text-emerald-400 font-bold">🟢 1,480 Online</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat?.();
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Open Full Screen Messenger"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subheader Switcher */}
          <div className="bg-slate-900 px-3 py-2 flex items-center gap-2 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('global')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'global' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'direct' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direct DMs</span>
            </button>
          </div>

          {/* Stream */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {activeTab === 'global' ? (
              globalMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5 text-xs animate-fade-in">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-cyan-500/30 flex-shrink-0 shadow-sm">
                    <img 
                      src={msg.avatar || '/assets/anime/boy_1.jpg'} 
                      alt={msg.sender} 
                      onError={(e) => { e.target.src = '/assets/anime/boy_1.jpg'; }}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-cyan-300 truncate">{msg.sender.split(' ')[0]}</span>
                      <span className="text-[9px] text-slate-500 ml-auto font-cinzel">{msg.timestamp}</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 mt-0.5">
                      <p>{msg.text}</p>
                      {msg.isChallenge && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onLaunchDuelGame?.();
                          }}
                          className="mt-2 w-full py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-md hover:bg-amber-300 transition-colors"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>ចូលលេង 1v1</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              activeContact.messages.map((pm) => {
                const isMe = pm.senderId === 'me';
                return (
                  <div key={pm.id} className={`flex items-end gap-2 text-xs ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-2xl max-w-[80%] ${
                      isMe ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      <p>{pm.text}</p>
                      <span className="text-[9px] text-slate-400 block text-right mt-0.5 font-cinzel">{pm.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mini Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#090e17] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="វាយសារជជែក..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
