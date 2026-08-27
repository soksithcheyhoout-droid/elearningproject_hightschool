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
 * Render mathematical radicals (Square root with true overbar/vinculum)
 * Works flawlessly across Android, iOS (iPhone/iPad), Windows, macOS, and Linux
 */
export function renderMathRadicals(text) {
  if (!text || typeof text !== 'string') return text;

  // Match √(expression) or √expression
  const parts = [];
  let remaining = text;
  // Regex to match √(contents inside parens) OR √ followed by algebraic tokens
  const radicalRegex = /√\(([^)]+)\)|√([a-zA-Z0-9²³⁴⁵⁶⁷⁸⁹\d\w+\-*.\/]+)/;

  let keyCounter = 0;
  while (remaining) {
    const match = remaining.match(radicalRegex);
    if (!match) {
      parts.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      parts.push(remaining.substring(0, matchIndex));
    }

    const innerExpression = match[1] !== undefined ? match[1] : match[2];
    parts.push(
      <span
        key={`radical-${keyCounter++}`}
        className="inline-flex items-baseline font-mono font-medium mx-0.5 whitespace-nowrap align-baseline"
      >
        <span className="text-[1.18em] leading-none select-none font-bold text-indigo-600 dark:text-cyan-400 mr-[-1px]">
          √
        </span>
        <span className="border-t-[1.6px] border-current pt-[0.5px] px-1 font-semibold leading-tight inline-block bg-indigo-50/40 dark:bg-cyan-950/30 rounded-t-2xs">
          {renderInlineMathTokens(innerExpression)}
        </span>
      </span>
    );

    remaining = remaining.substring(matchIndex + match[0].length);
  }

  return parts;
}

/**
 * Render inline mathematical tokens (powers, fractions, limits, subscripts)
 */
function renderInlineMathTokens(text) {
  if (!text || typeof text !== 'string') return text;

  // Handle superscripts / exponents like ^(2x) or ^2
  if (text.includes('^')) {
    const expParts = text.split(/\^(\([^)]+\)|[a-zA-Z0-9+-]+)/g);
    return expParts.map((p, idx) => {
      if (idx % 2 === 1) {
        const cleanExp = p.replace(/^\(|\)$/g, '');
        return (
          <sup key={idx} className="text-[0.75em] font-bold text-indigo-600 dark:text-cyan-400">
            {cleanExp}
          </sup>
        );
      }
      return p;
    });
  }

  return text;
}

/**
 * Format inline text by converting **bold**, *italic*, and math tokens with true radicals
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
        <strong
          key={index}
          className="font-extrabold text-[#003366] bg-amber-100/70 px-1.5 py-0.5 rounded-md border border-amber-200/80 mx-0.5"
        >
          {renderMathRadicals(inner)}
        </strong>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      const isOfficial = inner.includes('ដំណោះស្រាយ') || inner.includes('ក្រសួង') || inner.includes('ចម្លើយ');
      if (isOfficial) {
        return (
          <strong
            key={index}
            className="font-black text-[#003366] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 inline-flex items-center gap-1 my-0.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#005baa] inline-block" />
            {renderMathRadicals(inner)}
          </strong>
        );
      }
      return (
        <strong key={index} className="font-black text-[#003366] tracking-tight">
          {renderMathRadicals(inner)}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <span key={index} className="font-semibold text-slate-800 italic">
          {renderMathRadicals(inner)}
        </span>
      );
    }

    // Clean any stray asterisks that failed regex
    const cleaned = part.replace(/\*/g, '');
    return <React.Fragment key={index}>{renderMathRadicals(cleaned)}</React.Fragment>;
  });
}

/**
 * Check if a line is a PURE standalone mathematical formula/equation
 * (e.g. `(√(1+4x) - 1)/... = 4x/...` or `= 2 × 1 × (1/2) = 1` or `lim (x → 0) ...`)
 * Does NOT treat Khmer explanatory sentences as dark boxes!
 */
function isPureStandaloneMathEquation(line) {
  const t = line.trim();
  if (!t) return false;

  // If line contains significant Khmer words, it is an explanatory sentence, NOT a standalone equation box
  const khmerCharCount = (t.match(/[\u1780-\u17FF]/g) || []).length;
  if (khmerCharCount > 8) {
    return false;
  }

  // Pure standalone equations usually start with =, (, lim, ∫, or contain heavy operators with few words
  return (
    t.startsWith('=') ||
    t.startsWith('(') ||
    t.startsWith('lim') ||
    t.startsWith('∫') ||
    t.startsWith('Δ') ||
    t.includes(' = ') ||
    t.includes(' ⇌ ') ||
    t.includes(' => ') ||
    t.includes(' / [') ||
    t.includes(') / (')
  );
}

/**
 * High-performance, Beautiful Khmer Academic Text & Formula Renderer
 * Fully responsive on Android, iPhone, iPad, Windows, macOS, Linux
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
    <div className={`space-y-2 font-kantumruy leading-relaxed text-slate-800 break-words ${baseTextSize} ${className}`}>
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

        // 3. Pure Standalone Mathematical Formula Lines
        if (mathBox && isPureStandaloneMathEquation(trimmed)) {
          return (
            <div
              key={lineIdx}
              className="my-1.5 p-2.5 sm:p-3 rounded-xl bg-[#091122] text-cyan-200 border border-slate-700/80 font-mono text-[12px] sm:text-xs leading-relaxed shadow-sm overflow-x-auto no-scrollbar touch-pan-x [scrollbar-width:none] flex items-center justify-between gap-3 group"
            >
              <div className="whitespace-nowrap tracking-wide select-all flex-1">
                {renderInlineFormatted(trimmed)}
              </div>
              <span className="text-[9px] font-sans font-bold text-cyan-400/70 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 flex-shrink-0 hidden sm:inline-block">
                MATH
              </span>
            </div>
          );
        }

        // 4. Default standard paragraph line (renders Khmer text + beautiful inline math radicals)
        return (
          <p key={lineIdx} className="leading-relaxed text-slate-800">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
