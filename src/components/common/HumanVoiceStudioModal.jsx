import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Mic, 
  Square, 
  Play, 
  Check, 
  Sparkles, 
  Radio, 
  Sliders, 
  UserCheck, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { 
  AVAILABLE_HUMAN_VOICES, 
  getStoredVoicePreference, 
  setStoredVoicePreference, 
  speakHumanText, 
  stopHumanSpeech,
  playLuxuryChime
} from '../../utils/khmerVoice';

export default function HumanVoiceStudioModal({ isOpen, onClose }) {
  const [selectedVoiceId, setSelectedVoiceId] = useState(getStoredVoicePreference());
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [customText, setCustomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [customVoiceAudioUrl, setCustomVoiceAudioUrl] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedVoiceId(getStoredVoicePreference());
      const customVoice = localStorage.getItem('chey_dev_custom_voice_qr');
      if (customVoice) {
        setCustomVoiceAudioUrl(customVoice);
      }
    } else {
      stopHumanSpeech();
      setPlayingVoiceId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePreviewVoice = (voice) => {
    if (playingVoiceId === voice.id) {
      stopHumanSpeech();
      setPlayingVoiceId(null);
      return;
    }

    stopHumanSpeech();
    setPlayingVoiceId(voice.id);

    const textToSpeak = customText.trim() || voice.sampleText;

    speakHumanText(textToSpeak, {
      voiceId: voice.id,
      onStart: () => setPlayingVoiceId(voice.id),
      onEnd: () => setPlayingVoiceId(null),
      onError: () => setPlayingVoiceId(null)
    });
  };

  const handleSelectVoice = (voiceId) => {
    setSelectedVoiceId(voiceId);
    setStoredVoicePreference(voiceId);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestChime = () => {
    playLuxuryChime();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-wide">Human Voice Studio</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Neural 24kHz
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ជ្រើសរើសសំឡេងមនុស្សពិតៗ (Natural Human Voices) សម្រាប់ AI Tutor និង Messenger
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Toast Alert */}
          {saveToast && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-sm font-medium animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>បានផ្លាស់ប្តូរសំឡេងមនុស្សជោគជ័យសម្រាប់គេហទំព័រទាំងមូល!</span>
            </div>
          )}

          {/* Test Custom Text Input */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span>សាកល្បងបញ្ចូលអត្ថបទផ្ទាល់ខ្លួន (Test Your Own Text)</span>
              <button 
                onClick={handleTestChime}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> ស្តាប់សំឡេងកណ្ដឹង Luxury Chime
              </button>
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="ឧទាហរណ៍៖ សួស្តីលោកគ្រូ! សូមពន្យល់រូបមន្តគីមី..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {customText && (
                <button 
                  onClick={() => setCustomText('')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Voice Cards List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" /> សំឡេងមនុស្សពិតៗដែលមានស្រាប់ (Human Voice Profiles)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AVAILABLE_HUMAN_VOICES.map((v) => {
                const isSelected = selectedVoiceId === v.id;
                const isPlaying = playingVoiceId === v.id;

                return (
                  <div 
                    key={v.id}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white text-sm">{v.name}</span>
                        </div>
                        <span className="inline-block mt-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          {v.badge}
                        </span>
                      </div>

                      {/* Active Checkmark or Select Button */}
                      {isSelected ? (
                        <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" /> ជ្រើសរើស
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectVoice(v.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all"
                        >
                          កំណត់ប្រើ
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {v.description}
                    </p>

                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreviewVoice(v)}
                      className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        isPlaying 
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" /> កំពុងនិយាយ... (ចុចដើម្បីផ្អាក)
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> ស្តាប់សាកល្បង (Play Preview)
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            សំឡេងបច្ចុប្បន្ន៖ <span className="text-indigo-300 font-semibold">{AVAILABLE_HUMAN_VOICES.find(v => v.id === selectedVoiceId)?.name || 'Sreymom'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            យល់ព្រម (Done)
          </button>
        </div>

      </div>
    </div>
  );
}
