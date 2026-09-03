import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  User, 
  BookOpen, 
  Calculator, 
  Flame, 
  CheckCircle2, 
  Lightbulb, 
  Key, 
  Settings, 
  Check, 
  Zap, 
  HelpCircle,
  Volume2,
  Square,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { askMinistryAI } from '../../services/geminiService';
import { speakHumanText, stopHumanSpeech, preloadTeacherSpeech } from '../../utils/khmerVoice';
import HumanVoiceStudioModal from '../common/HumanVoiceStudioModal';

export default function AITutorModal({ isOpen, onClose, initialPrompt = '' }) {
  const { t, lang } = useLanguage();
  const { student, addXP } = useAuth();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);

  // Auto populate prompt if provided
  useEffect(() => {
    if (isOpen && initialPrompt) {
      setInputMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

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
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "សួស្តីប្អូន " + (student.name || '') + "! លោកគ្រូរីករាយណាស់ដែលបានជួបប្អូននៅថ្ងៃនេះ។ មិនថាលំហាត់គណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា ជីវវិទ្យា ឬសំណួរតែងសេចក្តីភាសាខ្មែរ ប្រវត្តិវិទ្យាទេ កូនអាចសួរលោកគ្រូបានទាំងអស់ណា៎! តើថ្ងៃនេះកូនចង់ឱ្យលោកគ្រូជួយពន្យល់ ឬបង្រៀនមេរៀនអ្វីដែរ?",
      time: "ឥឡូវនេះ"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Stop speaking immediately when modal closes or preload greeting on open
  useEffect(() => {
    if (!isOpen) {
      stopHumanSpeech();
      setSpeakingMsgId(null);
    } else {
      if (messages[0]?.text) {
        preloadTeacherSpeech(messages[0].text);
      }
    }
  }, [isOpen]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      stopHumanSpeech();
      setSpeakingMsgId(null);
    };
  }, []);

  const handleClose = () => {
    stopHumanSpeech();
    setSpeakingMsgId(null);
    onClose();
  };

  const handleSpeak = (msgId, text) => {
    if (speakingMsgId === msgId) {
      stopHumanSpeech();
      setSpeakingMsgId(null);
      return;
    }

    stopHumanSpeech();
    setSpeakingMsgId(msgId);

    speakHumanText(text, {
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null)
    });
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: "គណិត៖ រូបមន្តដេរីវេនៃអនុគមន៍",
      prompt: "សូមពន្យល់ពីរបៀបរកដេរីវេនៃអនុគមន៍ f(x) = (2x+1)/(x-3) និងរូបមន្តដេរីវេផលចែក (u/v)'"
    },
    {
      label: "គីមី៖ តុល្យការសមីការ Fe + O2",
      prompt: "សូមជួយធ្វើតុល្យការសមីការគីមី Fe + O2 -> Fe2O3 និងពន្យល់ពីប្រភេទប្រតិកម្ម"
    },
    {
      label: "អក្សរសាស្ត្រ៖ គម្រោងតែងសេចក្តី",
      prompt: "សូមបង្ហាញរចនាសម្ព័ន្ធតែងសេចក្តីបែបពន្យល់ និងគន្លឹះដើម្បីបានពិន្ទុខ្ពស់ក្នុងបាក់ឌុប"
    },
    {
      label: "រូបវិទ្យា៖ ច្បាប់ញូតុនទាំង ៣",
      prompt: "សូមសង្ខេបច្បាប់ចលនាញូតុនទាំងបី និងរូបមន្តគណនាកម្លាំង F = m * a"
    }
  ];

  const handleSendMessage = async (textToSend = inputMessage) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiReplyText = await askMinistryAI(trimmed, messages);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      // ⚡ Pre-buffer teacher audio in background for 0ms instant playback when clicked!
      preloadTeacherSpeech(aiReplyText);
      addXP(15);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full h-[88vh] max-h-[92vh] my-auto flex flex-col overflow-hidden font-kantumruy">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#003366] via-[#005baa] to-[#0284c7] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>លោកគ្រូបង្រៀនគរុកោសល្យ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 font-sans font-bold uppercase">
                  Master Teacher
                </span>
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                គ្រូបង្រៀនពិតប្រាកដ • ជំនួយការដោះស្រាយលំហាត់ និងត្រៀមប្រឡងបាក់ឌុប
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceStudio(true)}
              className="p-2 rounded-xl border bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-xs"
              title="Human Voice Studio - កំណត់សំឡេងមនុស្សពិតៗ"
            >
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">សំឡេងមនុស្ស</span>
            </button>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="បិទការសន្ទនា (Close)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#003366] to-[#005baa] text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                  <GraduationCap className="w-4.5 h-4.5 text-amber-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#005baa] text-white rounded-tr-xs shadow-sm font-sans'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs shadow-xs font-sans whitespace-pre-wrap'
                }`}
              >
                {(msg.text || '').replace(/\*{2,}/g, '').replace(/\*/g, '').replace(/\${1,2}/g, '').replace(/<[^>]*>/g, '').replace(/^#+\s*/gm, '').replace(/^>\s*/gm, '')}
                <div className={`text-[10px] mt-2.5 flex items-center justify-between gap-2 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                        speakingMsgId === msg.id 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 ring-2 ring-rose-200 animate-pulse' 
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#003366] border-slate-200'
                      }`}
                      title={speakingMsgId === msg.id ? "ចុចដើម្បីបញ្ឈប់ការអាន (Click to Stop Voice)" : "ស្តាប់លោកគ្រូអាន (Speak Voice)"}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <Square className="w-3 h-3 fill-white text-white" />
                          <span>⏹️ បញ្ឈប់ការអាន (Stop)</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#005baa]" />
                          <span>🔊 ស្តាប់លោកគ្រូអាន</span>
                        </>
                      )}
                    </button>
                  )}
                  <span className="ml-auto font-mono">{msg.time}</span>
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#005baa] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4.5 h-4.5 text-amber-300 animate-bounce" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center gap-2 text-xs text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span>លោកគ្រូកំពុងរៀបចំការពន្យល់ និងដំណោះស្រាយជូនប្អូន...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>សំណួរគំរូ៖</span>
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#e0f2fe] text-slate-700 hover:text-[#003366] border border-slate-200 hover:border-[#bae6fd] text-xs whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="សួរសំណួរ ឬដាក់លំហាត់មកទីនេះ លោកគ្រូនឹងជួយបង្រៀនមួយជំហានម្តងៗ..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#005baa] focus:ring-2 focus:ring-[#005baa]/20 font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="btn-moeys-primary px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">ផ្ញើ</span>
            </button>
          </form>
        </div>

      </div>

      {showVoiceStudio && (
        <HumanVoiceStudioModal
          isOpen={showVoiceStudio}
          onClose={() => setShowVoiceStudio(false)}
        />
      )}
    </div>,
    document.body
  );
}
