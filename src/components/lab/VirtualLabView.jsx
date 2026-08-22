import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Atom, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Info, 
  Calculator,
  Compass,
  Layers
} from 'lucide-react';
import { periodicElements } from '../../data/labData';
import { useLanguage } from '../../context/LanguageContext';

export default function VirtualLabView() {
  const { t, lang } = useLanguage();
  const [activeLabTab, setActiveLabTab] = useState('chemistry');
  
  const [selectedElement, setSelectedElement] = useState(periodicElements[0]);
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [gravity] = useState(9.8);
  const canvasRef = useRef(null);

  const angleRad = (angle * Math.PI) / 180;
  const timeOfFlight = (2 * velocity * Math.sin(angleRad)) / gravity;
  const maxHeight = (Math.pow(velocity * Math.sin(angleRad), 2)) / (2 * gravity);
  const maxRange = (Math.pow(velocity, 2) * Math.sin(2 * angleRad)) / gravity;

  useEffect(() => {
    if (activeLabTab !== 'physics') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ground line
    const groundY = height - 40;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(width - 20, groundY);
    ctx.stroke();

    // Trajectory Path
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const scaleX = (width - 80) / Math.max(80, maxRange);
    const scaleY = (height - 80) / Math.max(30, maxHeight);

    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * timeOfFlight;
      const x = velocity * Math.cos(angleRad) * t;
      const y = (velocity * Math.sin(angleRad) * t) - (0.5 * gravity * Math.pow(t, 2));

      const canvasX = 30 + x * scaleX;
      const canvasY = groundY - y * scaleY;

      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();

    // Apex point
    const apexX = 30 + (maxRange / 2) * scaleX;
    const apexY = groundY - maxHeight * scaleY;
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(apexX, apexY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Launch Cannon Point
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(30, groundY, 8, 0, Math.PI * 2);
    ctx.fill();

  }, [velocity, angle, activeLabTab, maxRange, maxHeight, timeOfFlight, gravity]);

  const [trigAngle, setTrigAngle] = useState(45);
  const trigRad = (trigAngle * Math.PI) / 180;
  const sinVal = Math.sin(trigRad).toFixed(4);
  const cosVal = Math.cos(trigRad).toFixed(4);
  const tanVal = Math.abs(Math.cos(trigRad)) < 0.0001 ? 'អសន្ន (Infinity)' : Math.tan(trigRad).toFixed(4);

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001f3f] via-[#003876] to-[#005baa] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-xl border border-white/15">
        {/* Ambient Gradient Lighting */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/15 text-amber-300 border border-white/20 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md shadow-2xs">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'បន្ទប់ពិសោធន៍និម្មិត STEM' : 'Interactive STEM Virtual Lab'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('labTitle') || (lang === 'km' ? 'បន្ទប់ពិសោធន៍ STEM និម្មិតអន្តរកម្ម' : 'Interactive STEM Simulation Lab')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {t('labSubtitle') || (lang === 'km' ? 'ពិសោធន៍តារាងខួបនៃធាតុគីមី ចលនាគ្រាប់ផ្លោងរូបវិទ្យា និងរង្វង់ត្រីកោណមាត្រគណិតវិទ្យា តាមពេលវេលាជាក់ស្តែង។' : 'Real-time interactive simulations for Chemistry Periodic Table, Physics Projectile Mechanics, and Trigonometry Unit Circle.')}
          </p>
        </div>
      </div>

      {/* Lab Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveLabTab('chemistry')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeLabTab === 'chemistry'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{t('periodicTable') || (lang === 'km' ? 'តារាងខួបគីមី' : 'Periodic Table')}</span>
        </button>

        <button
          onClick={() => setActiveLabTab('physics')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeLabTab === 'physics'
              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>{t('physicsSimulation') || (lang === 'km' ? 'ចលនាគ្រាប់ផ្លោង' : 'Projectile Physics')}</span>
        </button>

        <button
          onClick={() => setActiveLabTab('math')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeLabTab === 'math'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{t('mathGrapher') || (lang === 'km' ? 'ត្រីកោណមាត្រ' : 'Trigonometry')}</span>
        </button>
      </div>

      {/* Tab 1: Interactive Chemistry Periodic Table */}
      {activeLabTab === 'chemistry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Elements Grid (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'km' ? 'តារាងខួបនៃធាតុគីមី (ចុចលើធាតុដើម្បីពិនិត្យលក្ខណៈ)' : 'Periodic Table of Chemical Elements'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
              {periodicElements.map((el) => {
                const isSelected = selectedElement && selectedElement.number === el.number;
                return (
                  <button
                    key={el.number}
                    onClick={() => setSelectedElement(el)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-cinzel font-bold">{el.number}</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 font-cinzel">{el.symbol}</span>
                    <span className="text-[10px] text-slate-600 truncate max-w-full font-bold">{lang === 'km' ? el.nameKm : el.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Element Detail Inspector (1 col) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-200 space-y-5 flex flex-col justify-between shadow-sm">
            {selectedElement ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-emerald-800 font-cinzel font-bold">{selectedElement.number}</span>
                    <span className="text-2xl font-black text-emerald-950 font-cinzel">{selectedElement.symbol}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {selectedElement.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-lg text-slate-900">
                    {lang === 'km' ? selectedElement.nameKm : selectedElement.nameEn} ({selectedElement.nameEn})
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'km' ? 'ម៉ាសអាតូម៖' : 'Atomic Mass:'} <span className="font-black text-slate-800 font-cinzel">{selectedElement.mass} g/mol</span>
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">{lang === 'km' ? 'ការរៀបចំអេឡិចត្រុង៖' : 'Electron Config:'}</span>
                    <span className="font-mono text-emerald-700 font-bold">{selectedElement.config}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">{lang === 'km' ? 'ខួប (Period) / ក្រុម (Group)៖' : 'Period / Group:'}</span>
                    <span className="font-cinzel text-slate-800 font-bold">{selectedElement.period} / {selectedElement.group}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 font-medium">
                  <p className="font-black text-emerald-900 mb-1">{lang === 'km' ? 'លក្ខណៈ និងការប្រើប្រាស់៖' : 'Properties & Uses:'}</p>
                  <p>{lang === 'km' ? selectedElement.descriptionKm : selectedElement.descriptionEn}</p>
                </div>
              </div>
            ) : null}

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 text-center font-bold">
              {lang === 'km' ? 'ស្តង់ដារ IUPAC & កម្មវិធីសិក្សាគីមីវិទ្យា MoTDAR' : 'IUPAC Standards & MoTDAR STEM Framework'}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Physics Projectile Motion Simulator */}
      {activeLabTab === 'physics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-sky-800 flex items-center gap-2">
                <Atom className="w-4 h-4 text-sky-600" />
                <span>{lang === 'km' ? 'គន្លងចលនាគ្រាប់ផ្លោង (Projectile Trajectory Simulation)' : 'Projectile Mechanics Simulation'}</span>
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                width={560}
                height={300}
                className="w-full h-auto max-h-[300px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-bold">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">{lang === 'km' ? 'ល្បឿនដើម (Initial Velocity v0):' : 'Initial Velocity (v0):'}</span>
                  <span className="font-black text-sky-700 font-cinzel">{velocity} m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">{lang === 'km' ? 'មុំបាញ់ (Launch Angle θ):' : 'Launch Angle (θ):'}</span>
                  <span className="font-black text-amber-700 font-cinzel">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white to-sky-50/40 border border-sky-200 space-y-4 shadow-sm">
            <h4 className="text-sm font-black text-sky-900">
              {lang === 'km' ? 'លទ្ធផលគណនាស្វ័យប្រវត្តិ' : 'Automated Kinematic Calculations'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">{lang === 'km' ? 'កម្ពស់អតិបរមា (H_max):' : 'Max Height (H_max):'}</span>
                <span className="text-base font-black text-rose-700 font-cinzel">
                  {maxHeight.toFixed(2)} m
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">{lang === 'km' ? 'ចម្ងាយបាញ់បានឆ្ងាយ (R):' : 'Max Range (R):'}</span>
                <span className="text-base font-black text-sky-700 font-cinzel">
                  {maxRange.toFixed(2)} m
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">{lang === 'km' ? 'រយៈពេលចលនា (T_flight):' : 'Time of Flight:'}</span>
                <span className="text-base font-black text-amber-700 font-cinzel">
                  {timeOfFlight.toFixed(2)} s
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-1 font-medium">
              <p className="font-black">{lang === 'km' ? 'រូបមន្តសំខាន់ៗបាក់ឌុប៖' : 'Key BacII Formulas:'}</p>
              <p>• H_max = (v0² · sin²θ) / (2g)</p>
              <p>• R = (v0² · sin(2θ)) / g (θ = 45° for max range)</p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Math Trigonometry Unit Circle */}
      {activeLabTab === 'math' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900">
              {lang === 'km' ? 'រង្វង់ត្រីកោណមាត្រអន្តរកម្ម (Interactive Unit Circle)' : 'Interactive Trigonometric Unit Circle'}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="relative w-64 h-64 border-2 border-slate-300 rounded-full flex items-center justify-center bg-white shadow-inner">
                {/* Axis lines */}
                <div className="absolute w-full h-[1px] bg-slate-300" />
                <div className="absolute h-full w-[1px] bg-slate-300" />
                
                {/* Vector Pointer */}
                <div 
                  className="absolute w-1/2 h-[2.5px] bg-[#005baa] origin-left rounded-full shadow-sm"
                  style={{ 
                    left: '50%',
                    top: '50%',
                    transform: `translateY(-50%) rotate(-${trigAngle}deg)` 
                  }}
                />

                {/* Point on Circle */}
                <div 
                  className="absolute w-3.5 h-3.5 bg-amber-500 rounded-full shadow-md border-2 border-white"
                  style={{
                    left: `${50 + 45 * Math.cos(trigRad)}%`,
                    top: `${50 - 45 * Math.sin(trigRad)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>

              <div className="space-y-3 w-full sm:w-auto">
                <div className="text-xs font-bold text-slate-700">
                  <span>{lang === 'km' ? 'បង្វិលមុំ (Rotate Angle θ):' : 'Angle (θ):'} </span>
                  <span className="text-[#005baa] font-cinzel font-black text-sm">{trigAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={trigAngle}
                  onChange={(e) => setTrigAngle(Number(e.target.value))}
                  className="w-full accent-[#005baa] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white to-amber-50/40 border border-amber-200 space-y-4 shadow-sm">
            <h4 className="text-sm font-black text-amber-950">
              {lang === 'km' ? 'តម្លៃត្រីកោណមាត្រ' : 'Trigonometric Values'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">sin(θ):</span>
                <span className="text-base font-black text-emerald-700 font-cinzel">{sinVal}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">cos(θ):</span>
                <span className="text-base font-black text-[#005baa] font-cinzel">{cosVal}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="text-slate-500 font-medium">tan(θ):</span>
                <span className="text-base font-black text-amber-700 font-cinzel">{tanVal}</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-1 font-medium">
              <p className="font-black mb-1">{lang === 'km' ? 'សមភាពគ្រឹះ៖' : 'Fundamental Identities:'}</p>
              <p>• sin²θ + cos²θ = 1</p>
              <p>• tan θ = sin θ / cos θ</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
