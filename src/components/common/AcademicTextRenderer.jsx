import React from 'react';

/**
 * Cleanly strips any remaining stray asterisks or unwanted markdown symbols
 */
export function cleanRawMarkdown(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\*{3,}/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_{2,}/g, '')
    .trim();
}

/**
 * Format inline text by converting **bold** into <strong>, handling math symbols, etc.
 */
export function renderInlineFormatted(text) {
  if (!text || typeof text !== 'string') return null;

  // Split by bold markdown **...** or ***...***
  const parts = text.split(/(\*\*\*?[^*]+\*\*\*?)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('***') && part.endsWith('***')) {
      const inner = part.slice(3, -3);
      return (
        <strong key={index} className="font-extrabold text-[#003366] bg-amber-100/70 px-1.5 py-0.5 rounded-md border border-amber-200/80 mx-0.5">
          {inner}
        </strong>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      // Check if it's a key heading or formula
      const isOfficial = inner.includes('ដំណោះស្រាយ') || inner.includes('ក្រសួង') || inner.includes('ចម្លើយ');
      if (isOfficial) {
        return (
          <strong key={index} className="font-black text-[#003366] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 inline-flex items-center gap-1 my-0.5">
            <span className="w-2 h-2 rounded-full bg-[#005baa] inline-block" />
            {inner}
          </strong>
        );
      }
      return (
        <strong key={index} className="font-black text-[#003366] tracking-tight">
          {inner}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <span key={index} className="font-semibold text-slate-800 italic">
          {inner}
        </span>
      );
    }

    // Clean any stray asterisks that failed regex
    const cleaned = part.replace(/\*/g, '');
    return <span key={index}>{cleaned}</span>;
  });
}

/**
 * Check if a line represents a math equation or formula
 */
function isMathFormulaLine(line) {
  const t = line.trim();
  if (!t) return false;
  return (
    t.includes('lim (') ||
    t.includes('lim(') ||
    t.includes('∫') ||
    t.includes('√(') ||
    t.includes('√') ||
    t.includes('Δ =') ||
    t.includes('Δ\' =') ||
    t.includes('x(t) =') ||
    t.includes('Em =') ||
    t.includes('pH =') ||
    t.includes('Vm(') ||
    t.includes('Z = √') ||
    t.includes('T0 =') ||
    t.includes('cos(') ||
    t.includes('sin(') ||
    t.includes('tan(') ||
    t.includes('10^') ||
    t.includes('10⁻') ||
    t.includes('→') ||
    t.includes('±') ||
    t.includes('×') ||
    t.includes('∧') ||
    t.includes('²') ||
    t.includes('³') ||
    t.includes('dx') ||
    t.includes('mol/s') ||
    t.includes('Hz')
  );
}

/**
 * High-performance, Beautiful Khmer Academic Text & Formula Renderer
 */
export default function AcademicTextRenderer({
  content = '',
  className = '',
  mathBox = true,
  enableListFormat = true,
  baseTextSize = 'text-xs sm:text-sm'
}) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Split into lines
  const rawLines = content.split('\n');

  return (
    <div className={`space-y-2.5 font-kantumruy leading-relaxed text-slate-800 break-words ${baseTextSize} ${className}`}>
      {rawLines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // 1. Official Section Header (e.g. **ដំណោះស្រាយផ្លូវការ...** or I. ផ្តើមសេចក្តី)
        const isMajorHeader = 
          (trimmed.startsWith('**') && trimmed.endsWith('**') && (trimmed.includes('ដំណោះស្រាយ') || trimmed.includes('ខ្លឹមសារ'))) ||
          /^(I|II|III|IV|V|ជំពូក|មេរៀន|ផ្នែក|កត្តា)\./.test(trimmed);

        if (isMajorHeader) {
          const cleanHeader = cleanRawMarkdown(trimmed);
          return (
            <div
              key={lineIdx}
              className="font-black text-xs sm:text-sm text-[#003366] bg-gradient-to-r from-blue-100/80 via-sky-50 to-transparent py-1.5 px-3 rounded-xl border-l-4 border-[#005baa] my-2 shadow-2xs flex items-center gap-2"
            >
              <span className="w-1.5 h-3.5 rounded-full bg-[#005baa]" />
              <span>{cleanHeader}</span>
            </div>
          );
        }

        // 2. Structured List Item (- , * , 1. , ក. , ខ. , គ. )
        if (enableListFormat) {
          const isBullet = /^[-*•]\s+/.test(trimmed);
          const isAlphaStep = /^[ក-អa-zA-Z]\.\s+/.test(trimmed);
          const isNumStep = /^(\d+|[០-៩]+)\.\s+/.test(trimmed);
          const isPlusStep = /^\+\s+/.test(trimmed);

          if (isBullet || isPlusStep) {
            const listText = trimmed.replace(/^[-*•+]\s+/, '');
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1 sm:pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005baa] mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {renderInlineFormatted(listText)}
                </div>
              </div>
            );
          }

          if (isAlphaStep || isNumStep) {
            const match = trimmed.match(/^([ក-អa-zA-Z\d០-៩]+)\.\s+(.*)$/);
            if (match) {
              const prefix = match[1];
              const rest = match[2];
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-1 sm:pl-2 my-1">
                  <span className="font-mono font-black text-[11px] sm:text-xs text-[#005baa] bg-blue-100/70 border border-blue-200/80 rounded-md px-1.5 py-0.5 flex-shrink-0">
                    {prefix}.
                  </span>
                  <div className="flex-1 min-w-0 font-medium">
                    {renderInlineFormatted(rest)}
                  </div>
                </div>
              );
            }
          }
        }

        // 3. Mathematical Formula / Long equation lines
        if (mathBox && isMathFormulaLine(trimmed)) {
          return (
            <div
              key={lineIdx}
              className="my-1.5 p-2 sm:p-2.5 rounded-xl bg-slate-900 text-cyan-200 border border-slate-700/80 font-mono text-[11.5px] sm:text-xs leading-relaxed shadow-xs overflow-x-auto no-scrollbar touch-pan-x [scrollbar-width:none] flex items-center justify-between gap-3 group"
            >
              <div className="whitespace-nowrap tracking-wide select-all">
                {renderInlineFormatted(trimmed)}
              </div>
              <span className="text-[9px] font-sans font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 flex-shrink-0 hidden sm:inline-block">
                FORMULA
              </span>
            </div>
          );
        }

        // 4. Default standard paragraph line
        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
