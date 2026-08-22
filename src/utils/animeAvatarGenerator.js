/**
 * Client-Side Anime Avatar SVG Generator Engine
 * Generates 100% local, high-resolution anime avatar SVG data URIs with zero network latency.
 */

export const SKIN_TONES = {
  white: { base: '#fde0c5', shadow: '#f5be98', blush: '#fca5a5' },
  fair: { base: '#ffe4cc', shadow: '#f3c2a0', blush: '#fca5a5' },
  tan: { base: '#e6b98e', shadow: '#c99665', blush: '#f87171' },
  warm: { base: '#dfad7e', shadow: '#be8755', blush: '#ef4444' },
  cyber: { base: '#d1e8ff', shadow: '#9bc8f5', blush: '#60a5fa' }
};

export const HAIR_COLORS = {
  blonde: { main: '#facc15', highlight: '#fef08a', shadow: '#ca8a04' },
  black: { main: '#1e293b', highlight: '#475569', shadow: '#0f172a' },
  brown: { main: '#78350f', highlight: '#b45309', shadow: '#451a03' },
  blue: { main: '#0284c7', highlight: '#38bdf8', shadow: '#0369a1' },
  pink: { main: '#ec4899', highlight: '#f472b6', shadow: '#be185d' },
  silver: { main: '#cbd5e1', highlight: '#f1f5f9', shadow: '#94a3b8' },
  red: { main: '#dc2626', highlight: '#f87171', shadow: '#991b1b' },
  purple: { main: '#9333ea', highlight: '#c084fc', shadow: '#6b21a8' }
};

export const EYE_COLORS = {
  blue: '#0284c7',
  brown: '#854d0e',
  green: '#16a34a',
  amber: '#d97706',
  purple: '#9333ea',
  red: '#dc2626'
};

export const BG_GRADIENTS = {
  blue: ['#003366', '#0284c7'],
  gold: ['#78350f', '#eab308'],
  cyber: ['#4c1d95', '#06b6d4'],
  sakura: ['#831843', '#f472b6'],
  emerald: ['#064e3b', '#10b981'],
  sunset: ['#991b1b', '#f97316'],
  dark: ['#0f172a', '#334155']
};

/**
 * Intelligent Prompt Parser
 * Automatically extracts character attributes from natural text prompt
 */
export function parsePromptToAttributes(prompt = '') {
  const p = prompt.toLowerCase();

  // Gender
  let gender = 'boy';
  if (p.includes('girl') || p.includes('female') || p.includes('woman') || p.includes('ស្រី') || p.includes('lady')) {
    gender = 'girl';
  } else if (p.includes('cyber') || p.includes('robot') || p.includes('bot')) {
    gender = 'cyber';
  }

  // Skin Tone
  let skin = 'fair';
  if (p.includes('white') || p.includes('pale') || p.includes('caucasian')) {
    skin = 'white';
  } else if (p.includes('khmer') || p.includes('asian') || p.includes('tan') || p.includes('cambodian')) {
    skin = 'tan';
  } else if (p.includes('cyber') || p.includes('alien')) {
    skin = 'cyber';
  }

  // Hair Color
  let hairColor = 'black';
  if (p.includes('blonde') || p.includes('yellow') || p.includes('gold')) {
    hairColor = 'blonde';
  } else if (p.includes('brown')) {
    hairColor = 'brown';
  } else if (p.includes('blue') || p.includes('cyan')) {
    hairColor = 'blue';
  } else if (p.includes('pink') || p.includes('rose')) {
    hairColor = 'pink';
  } else if (p.includes('silver') || p.includes('white hair') || p.includes('gray')) {
    hairColor = 'silver';
  } else if (p.includes('red') || p.includes('crimson')) {
    hairColor = 'red';
  } else if (p.includes('purple') || p.includes('violet')) {
    hairColor = 'purple';
  } else if (gender === 'boy' && skin === 'white') {
    hairColor = 'blonde';
  }

  // Hairstyle
  let hairstyle = gender === 'girl' ? 'long' : 'spiky';
  if (p.includes('ponytail')) hairstyle = 'ponytail';
  if (p.includes('short') || p.includes('buzz')) hairstyle = 'short';
  if (p.includes('wavy') || p.includes('curly')) hairstyle = 'wavy';
  if (p.includes('spiky') || p.includes('cool')) hairstyle = 'spiky';

  // Eye Color
  let eyeColor = 'blue';
  if (p.includes('brown eyes')) eyeColor = 'brown';
  if (p.includes('green eyes')) eyeColor = 'green';
  if (p.includes('red eyes')) eyeColor = 'red';
  if (p.includes('purple eyes')) eyeColor = 'purple';
  if (p.includes('amber eyes')) eyeColor = 'amber';
  if (skin === 'tan' && !p.includes('blue eyes')) eyeColor = 'brown';

  // Accessories
  let accessory = 'none';
  if (p.includes('glasses') || p.includes('spectacles') || p.includes('វ៉ែនតា')) accessory = 'glasses';
  if (p.includes('headset') || p.includes('headphone') || p.includes('gaming')) accessory = 'headset';
  if (p.includes('cat') || p.includes('neko') || p.includes('ears')) accessory = 'cat_ears';
  if (p.includes('royal') || p.includes('crown') || p.includes('gold pin')) accessory = 'royal_pin';
  if (p.includes('headband') || p.includes('winner')) accessory = 'headband';

  // Clothing
  let outfit = 'blazer';
  if (p.includes('hoodie') || p.includes('jacket')) outfit = 'hoodie';
  if (p.includes('white shirt') || p.includes('tie') || p.includes('uniform')) outfit = 'uniform';
  if (p.includes('lab') || p.includes('science') || p.includes('coat')) outfit = 'labcoat';
  if (p.includes('royal') || p.includes('gold')) outfit = 'royal';

  // Background
  let background = 'blue';
  if (p.includes('gold') || p.includes('angkor')) background = 'gold';
  if (p.includes('cyber') || p.includes('neon')) background = 'cyber';
  if (p.includes('pink') || p.includes('sakura')) background = 'sakura';
  if (p.includes('green') || p.includes('emerald')) background = 'emerald';
  if (p.includes('sunset') || p.includes('orange')) background = 'sunset';
  if (p.includes('dark') || p.includes('night') || p.includes('space')) background = 'dark';

  return {
    gender,
    skin,
    hairColor,
    hairstyle,
    eyeColor,
    accessory,
    outfit,
    background,
    expression: p.includes('laugh') || p.includes('happy') ? 'happy' : p.includes('confident') || p.includes('cool') ? 'confident' : 'smile'
  };
}

/**
 * Generate Anime Avatar SVG string
 */
export function generateAnimeAvatarSvg(attributes) {
  const {
    gender = 'boy',
    skin = 'fair',
    hairColor = 'blonde',
    hairstyle = 'spiky',
    eyeColor = 'blue',
    accessory = 'none',
    outfit = 'blazer',
    background = 'blue',
    expression = 'smile'
  } = attributes;

  const skinTone = SKIN_TONES[skin] || SKIN_TONES.fair;
  const hair = HAIR_COLORS[hairColor] || HAIR_COLORS.blonde;
  const eyes = EYE_COLORS[eyeColor] || EYE_COLORS.blue;
  const bgGrad = BG_GRADIENTS[background] || BG_GRADIENTS.blue;

  // Hairstyle paths
  const renderBackHair = () => {
    if (hairstyle === 'long') {
      return `<path d="M70 140 Q50 240 60 300 Q140 320 200 320 Q260 320 340 300 Q350 240 330 140 Z" fill="${hair.shadow}"/>
              <path d="M80 160 Q65 250 80 310 Q140 330 200 330 Q260 330 320 310 Q335 250 320 160 Z" fill="${hair.main}"/>`;
    }
    if (hairstyle === 'ponytail') {
      return `<path d="M260 110 Q340 100 360 180 Q370 260 340 300 Q320 280 330 200 Q310 140 260 130 Z" fill="${hair.main}"/>
              <circle cx="270" cy="120" r="16" fill="#f43f5e"/>`;
    }
    return '';
  };

  const renderFrontHair = () => {
    if (hairstyle === 'spiky') {
      return `
        <!-- Spiky Hair Top & Bangs -->
        <path d="M100 130 Q90 60 160 50 Q200 40 240 50 Q310 60 300 130 Q270 90 200 85 Q130 90 100 130 Z" fill="${hair.shadow}"/>
        <path d="M90 120 Q80 70 140 45 Q200 30 260 45 Q320 70 310 120 Q290 85 240 70 Q200 65 160 70 Q110 85 90 120 Z" fill="${hair.main}"/>
        <!-- Hair Tufts -->
        <polygon points="120,60 100,25 150,45" fill="${hair.main}"/>
        <polygon points="160,45 180,15 210,40" fill="${hair.main}"/>
        <polygon points="210,40 240,20 250,50" fill="${hair.main}"/>
        <polygon points="250,50 290,35 280,70" fill="${hair.main}"/>
        <!-- Forehead Bangs -->
        <path d="M110 100 Q140 150 160 110 Q180 160 200 115 Q220 165 250 110 Q280 140 290 100 Q200 80 110 100 Z" fill="${hair.main}"/>
        <path d="M140 60 Q200 50 260 60 Q240 75 200 70 Q160 75 140 60 Z" fill="${hair.highlight}" opacity="0.6"/>
      `;
    }
    if (hairstyle === 'long' || hairstyle === 'ponytail') {
      return `
        <!-- Soft Long Bangs -->
        <path d="M100 130 Q90 60 160 45 Q200 35 240 45 Q310 60 300 130 Q270 85 200 80 Q130 85 100 130 Z" fill="${hair.shadow}"/>
        <path d="M95 110 Q140 160 150 115 Q175 165 200 115 Q225 165 250 115 Q260 160 305 110 Q280 75 200 70 Q120 75 95 110 Z" fill="${hair.main}"/>
        <!-- Side Locks -->
        <path d="M95 110 Q85 180 105 240 Q115 220 110 160 Z" fill="${hair.main}"/>
        <path d="M305 110 Q315 180 295 240 Q285 220 290 160 Z" fill="${hair.main}"/>
        <path d="M130 65 Q200 55 270 65 Q250 80 200 75 Q150 80 130 65 Z" fill="${hair.highlight}" opacity="0.6"/>
      `;
    }
    // Short / Neat
    return `
      <path d="M100 120 Q95 65 160 50 Q200 45 240 50 Q305 65 300 120 Q260 85 200 80 Q140 85 100 120 Z" fill="${hair.main}"/>
      <path d="M105 100 Q150 140 200 110 Q250 140 295 100 Q200 80 105 100 Z" fill="${hair.main}"/>
      <path d="M135 65 Q200 55 265 65 Q245 75 200 70 Q155 75 135 65 Z" fill="${hair.highlight}" opacity="0.5"/>
    `;
  };

  // Outfit
  const renderOutfit = () => {
    if (outfit === 'uniform') {
      return `
        <!-- White School Uniform with Tie -->
        <path d="M110 270 L80 400 L320 400 L290 270 Q200 295 110 270 Z" fill="#ffffff"/>
        <!-- Collar -->
        <polygon points="160,265 200,310 180,265" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="240,265 200,310 220,265" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Red/Navy Tie -->
        <polygon points="194,300 206,300 210,380 200,395 190,380" fill="#dc2626"/>
        <polygon points="192,295 208,295 205,310 195,310" fill="#991b1b"/>
      `;
    }
    if (outfit === 'hoodie') {
      return `
        <!-- Cyber / Casual Hoodie -->
        <path d="M100 270 L60 400 L340 400 L300 270 Q200 300 100 270 Z" fill="#1e1b4b"/>
        <path d="M130 265 Q200 330 270 265 Q240 310 200 315 Q160 310 130 265 Z" fill="#312e81"/>
        <!-- Neon Trim -->
        <path d="M130 270 Q200 335 270 270" stroke="#06b6d4" stroke-width="4" fill="none"/>
        <circle cx="200" cy="350" r="12" fill="#06b6d4" opacity="0.8"/>
      `;
    }
    if (outfit === 'labcoat') {
      return `
        <!-- Science Lab Coat -->
        <path d="M100 270 L60 400 L340 400 L300 270 Q200 300 100 270 Z" fill="#0284c7"/>
        <path d="M110 270 L70 400 L160 400 L175 285 Z" fill="#f8fafc"/>
        <path d="M290 270 L330 400 L240 400 L225 285 Z" fill="#f8fafc"/>
        <polygon points="160,265 200,305 180,265" fill="#f1f5f9"/>
        <polygon points="240,265 200,305 220,265" fill="#f1f5f9"/>
        <line x1="200" y1="305" x2="200" y2="400" stroke="#cbd5e1" stroke-width="2"/>
      `;
    }
    if (outfit === 'royal') {
      return `
        <!-- Royal Cambodian Gold Blazer -->
        <path d="M100 270 L60 400 L340 400 L300 270 Q200 300 100 270 Z" fill="#003366"/>
        <path d="M130 265 L170 400 L230 400 L270 265 Q200 295 130 265 Z" fill="#eab308"/>
        <!-- Gold Brocade trim -->
        <path d="M130 265 L170 400" stroke="#fef08a" stroke-width="3"/>
        <path d="M270 265 L230 400" stroke="#fef08a" stroke-width="3"/>
      `;
    }
    // Default MoEYS Navy Blazer
    return `
      <!-- MoEYS Navy School Blazer -->
      <path d="M100 270 L60 400 L340 400 L300 270 Q200 300 100 270 Z" fill="#003366"/>
      <polygon points="150,265 200,320 170,265" fill="#ffffff"/>
      <polygon points="250,265 200,320 230,265" fill="#ffffff"/>
      <!-- Gold School Crest Badge -->
      <circle cx="135" cy="320" r="10" fill="#eab308" stroke="#fef08a" stroke-width="1.5"/>
      <polygon points="196,305 204,305 208,370 200,380 192,370" fill="#dc2626"/>
    `;
  };

  // Accessories
  const renderAccessories = () => {
    let accSvg = '';
    if (accessory === 'glasses') {
      accSvg += `
        <!-- Smart Round Anime Glasses -->
        <circle cx="155" cy="165" r="24" fill="rgba(255,255,255,0.2)" stroke="#1e293b" stroke-width="3.5"/>
        <circle cx="245" cy="165" r="24" fill="rgba(255,255,255,0.2)" stroke="#1e293b" stroke-width="3.5"/>
        <line x1="179" y1="165" x2="221" y2="165" stroke="#1e293b" stroke-width="4"/>
        <line x1="131" y1="165" x2="110" y2="155" stroke="#1e293b" stroke-width="3"/>
        <line x1="269" y1="165" x2="290" y2="155" stroke="#1e293b" stroke-width="3"/>
        <ellipse cx="148" cy="158" rx="6" ry="3" fill="#ffffff" opacity="0.6"/>
        <ellipse cx="238" cy="158" rx="6" ry="3" fill="#ffffff" opacity="0.6"/>
      `;
    }
    if (accessory === 'headset') {
      accSvg += `
        <!-- Cyber Gamer Headset -->
        <path d="M100 160 A105 105 0 0 1 300 160" fill="none" stroke="#0f172a" stroke-width="10"/>
        <path d="M100 160 A105 105 0 0 1 300 160" fill="none" stroke="#06b6d4" stroke-width="3"/>
        <!-- Earcups -->
        <rect x="85" y="140" width="22" height="45" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
        <rect x="293" y="140" width="22" height="45" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
        <circle cx="96" cy="162" r="6" fill="#06b6d4"/>
        <circle cx="304" cy="162" r="6" fill="#06b6d4"/>
      `;
    }
    if (accessory === 'cat_ears') {
      accSvg += `
        <!-- Cute Cat Ears -->
        <polygon points="105,80 80,10 145,50" fill="${hair.main}"/>
        <polygon points="105,75 90,25 135,52" fill="#f472b6"/>
        <polygon points="295,80 320,10 255,50" fill="${hair.main}"/>
        <polygon points="295,75 310,25 265,52" fill="#f472b6"/>
      `;
    }
    if (accessory === 'royal_pin') {
      accSvg += `
        <!-- Gold Lotus Pin -->
        <circle cx="270" cy="95" r="14" fill="#eab308" stroke="#fef08a" stroke-width="2"/>
        <polygon points="270,83 275,93 285,95 277,101 280,111 270,105 260,111 263,101 255,95 265,93" fill="#fef08a"/>
      `;
    }
    if (accessory === 'headband') {
      accSvg += `
        <!-- Champion Headband -->
        <path d="M95 105 Q200 95 305 105 L303 125 Q200 115 97 125 Z" fill="#dc2626"/>
        <circle cx="200" cy="110" r="7" fill="#ffffff"/>
      `;
    }
    return accSvg;
  };

  // Complete SVG String
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${bgGrad[1]}"/>
      <stop offset="100%" stop-color="${bgGrad[0]}"/>
    </radialGradient>
    
    <!-- Face Shadow -->
    <linearGradient id="skinShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="60%" stop-color="${skinTone.base}"/>
      <stop offset="100%" stop-color="${skinTone.shadow}"/>
    </linearGradient>

    <!-- Eye Gradient -->
    <linearGradient id="eyeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="${eyes}"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Circular Base Frame -->
  <circle cx="200" cy="200" r="190" fill="url(#bgGrad)"/>
  
  <!-- Ambient Sparkles in Background -->
  <circle cx="90" cy="80" r="2.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="310" cy="70" r="3.5" fill="#fef08a" opacity="0.8"/>
  <circle cx="330" cy="220" r="2" fill="#ffffff" opacity="0.5"/>
  <circle cx="70" cy="240" r="3" fill="#ffffff" opacity="0.7"/>

  <!-- Back Hair -->
  ${renderBackHair()}

  <!-- Body / Outfit Base -->
  ${renderOutfit()}

  <!-- Neck -->
  <path d="M175 220 L175 280 Q200 290 225 280 L225 220 Z" fill="${skinTone.shadow}"/>

  <!-- Head Base -->
  <path d="M125 140 Q125 230 200 250 Q275 230 275 140 Q275 90 200 90 Q125 90 125 140 Z" fill="url(#skinShadow)"/>

  <!-- Ears -->
  <ellipse cx="123" cy="165" rx="10" ry="16" fill="${skinTone.base}"/>
  <ellipse cx="123" cy="165" rx="5" ry="9" fill="${skinTone.shadow}"/>
  <ellipse cx="277" cy="165" rx="10" ry="16" fill="${skinTone.base}"/>
  <ellipse cx="277" cy="165" rx="5" ry="9" fill="${skinTone.shadow}"/>

  <!-- Cute Cheeks Blush -->
  <ellipse cx="145" cy="190" rx="14" ry="7" fill="${skinTone.blush}" opacity="0.45"/>
  <ellipse cx="255" cy="190" rx="14" ry="7" fill="${skinTone.blush}" opacity="0.45"/>

  <!-- Left Eye -->
  <g>
    <!-- Eyebrow -->
    <path d="M135 135 Q155 125 175 133" stroke="${hair.shadow}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Eye Base -->
    <path d="M136 160 Q155 142 176 160 Q155 180 136 160 Z" fill="#ffffff"/>
    <ellipse cx="156" cy="162" rx="11" ry="13" fill="url(#eyeGrad)"/>
    <!-- Pupil & Catchlights -->
    <circle cx="156" cy="160" r="5" fill="#0f172a"/>
    <circle cx="152" cy="155" r="4.5" fill="#ffffff"/>
    <circle cx="161" cy="166" r="2" fill="#ffffff"/>
    <!-- Eyelash Line -->
    <path d="M132 158 Q155 138 178 156" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Right Eye -->
  <g>
    <!-- Eyebrow -->
    <path d="M225 133 Q245 125 265 135" stroke="${hair.shadow}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Eye Base -->
    <path d="M224 160 Q245 142 264 160 Q245 180 224 160 Z" fill="#ffffff"/>
    <ellipse cx="244" cy="162" rx="11" ry="13" fill="url(#eyeGrad)"/>
    <!-- Pupil & Catchlights -->
    <circle cx="244" cy="160" r="5" fill="#0f172a"/>
    <circle cx="240" cy="155" r="4.5" fill="#ffffff"/>
    <circle cx="249" cy="166" r="2" fill="#ffffff"/>
    <!-- Eyelash Line -->
    <path d="M222 156 Q245 138 268 158" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Nose -->
  <path d="M200 180 L197 190 L203 190" stroke="${skinTone.shadow}" stroke-width="2" stroke-linecap="round" fill="none"/>

  <!-- Mouth -->
  ${expression === 'happy'
    ? '<path d="M185 205 Q200 230 215 205 Q200 212 185 205 Z" fill="#f43f5e" stroke="#991b1b" stroke-width="2"/>'
    : expression === 'confident'
    ? '<path d="M190 208 Q208 214 218 205" stroke="#991b1b" stroke-width="3" stroke-linecap="round" fill="none"/>'
    : '<path d="M188 208 Q200 218 212 208" stroke="#991b1b" stroke-width="3" stroke-linecap="round" fill="none"/>'
  }

  <!-- Front Hair -->
  ${renderFrontHair()}

  <!-- Accessories -->
  ${renderAccessories()}

  <!-- Outer Border -->
  <circle cx="200" cy="200" r="190" fill="none" stroke="#eab308" stroke-width="5"/>
</svg>
  `.trim();

  // Convert SVG string to data URI
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return svgDataUri;
}
