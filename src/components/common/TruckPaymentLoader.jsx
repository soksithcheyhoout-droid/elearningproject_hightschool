import React from 'react';

/**
 * TruckPaymentLoader - Ultra-sleek animated delivery truck payment loader
 * Custom branded dynamically for ABA PayWay or Bakong KHQR.
 * Flawlessly contrasts on dark (black/slate) and light backgrounds.
 */
export default function TruckPaymentLoader({ gateway = 'aba' }) {
  const isAba = gateway === 'aba';

  return (
    <div className="truck-loader-container select-none">
      <div className="truckWrapper">
        {/* Animated Truck Body with Suspension */}
        <div className="truckBody">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="-6 0 226 93"
            className="w-full h-auto drop-shadow-md overflow-visible"
          >
            <defs>
              {/* Headlight glowing light cone */}
              <linearGradient id={`headlightBeam-${gateway}`} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                <stop offset="25%" stopColor="#FACC15" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
              </linearGradient>

              {/* ABA Container Gradient */}
              <linearGradient id="abaContainerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#003566" />
                <stop offset="50%" stopColor="#002D56" />
                <stop offset="100%" stopColor="#001F3F" />
              </linearGradient>

              {/* Bakong Container Gradient */}
              <linearGradient id="bakongContainerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#E21A1A" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>

              {/* Window Glass Gradient */}
              <linearGradient id="windowGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* ── Headlight Forward Illuminating Beam Cone ── */}
            <polygon
              points="192,66 224,54 224,78"
              fill={`url(#headlightBeam-${gateway})`}
              className="pointer-events-none"
            />

            {/* ── Truck Cabin (Front Cab) ── */}
            <path
              strokeWidth="2.5"
              stroke={isAba ? '#001830' : '#7F1D1D'}
              fill={isAba ? '#002D56' : '#DC2626'}
              d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
            />

            {/* Cabin Windshield / Window */}
            <path
              strokeWidth="2"
              stroke={isAba ? '#001830' : '#7F1D1D'}
              fill="url(#windowGlassGrad)"
              d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
            />
            {/* Window Glass Reflection Slit */}
            <line
              x1="152"
              y1="37"
              x2="162"
              y2="51"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Cabin Door Handle */}
            <path
              strokeWidth="1.5"
              stroke="#0F172A"
              fill={isAba ? '#00A3E0' : '#FFFFFF'}
              d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
            />

            {/* Front Headlight */}
            <rect
              strokeWidth="1.5"
              stroke="#0F172A"
              fill="#FFFCAB"
              rx="1.5"
              height="7.5"
              width="5"
              y="62.5"
              x="187"
              style={{ filter: 'drop-shadow(2px 0 4px #FACC15)' }}
            />

            {/* Front Bumper */}
            <rect
              strokeWidth="1.5"
              stroke="#0F172A"
              fill="#1E293B"
              rx="1"
              height="11"
              width="4"
              y="81"
              x="193"
            />

            {/* Rear Mudguard Step */}
            <rect
              strokeWidth="1.5"
              stroke={isAba ? '#00A3E0' : '#FFFFFF'}
              fill={isAba ? '#002D56' : '#DC2626'}
              rx="2"
              height="4"
              width="6"
              y="84"
              x="1"
            />

            {/* ══════════ CARGO CONTAINER / BOX ══════════ */}
            {/* Main Container Rect */}
            <rect
              strokeWidth="2.5"
              stroke={isAba ? '#00A3E0' : '#FFFFFF'}
              fill={isAba ? 'url(#abaContainerGrad)' : 'url(#bakongContainerGrad)'}
              rx="4"
              height="90"
              width="121"
              y="1.5"
              x="6.5"
            />

            {/* Top Accent Strip */}
            <rect
              x="6.5"
              y="1.5"
              width="121"
              height="6"
              fill={isAba ? '#00A3E0' : '#FFFFFF'}
              rx="2"
            />

            {/* Subtle Vertical Corrugated Panels */}
            <line x1="26" y1="10" x2="26" y2="85" stroke={isAba ? 'rgba(0,163,224,0.18)' : 'rgba(255,255,255,0.18)'} strokeWidth="1.2" />
            <line x1="108" y1="10" x2="108" y2="85" stroke={isAba ? 'rgba(0,163,224,0.18)' : 'rgba(255,255,255,0.18)'} strokeWidth="1.2" />

            {/* Dynamic Gateway Branding */}
            {isAba ? (
              /* ── ABA PAYWAY BRANDING ── */
              <g className="select-none">
                {/* ABA Bold Title */}
                <text
                  x="67"
                  y="43"
                  textAnchor="middle"
                  fontFamily="'Nunito Sans', 'Inter', system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="28"
                  fill="#FFFFFF"
                  letterSpacing="-0.5"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
                >
                  ABA<tspan fill="#00A3E0">'</tspan>
                </text>

                {/* PAYWAY Pill Badge */}
                <rect
                  x="26"
                  y="53"
                  width="82"
                  height="17"
                  rx="4.5"
                  fill="#00A3E0"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
                />
                <text
                  x="67"
                  y="65.5"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="10"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  letterSpacing="1.8"
                >
                  PAYWAY
                </text>
              </g>
            ) : (
              /* ── BAKONG KHQR BRANDING ── */
              <g className="select-none">
                {/* BAKONG Bold Title */}
                <text
                  x="67"
                  y="43"
                  textAnchor="middle"
                  fontFamily="'Nunito Sans', 'Inter', system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="20"
                  fill="#FFFFFF"
                  letterSpacing="2.2"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
                >
                  BAKONG
                </text>

                {/* KHQR White Pill Badge */}
                <rect
                  x="28"
                  y="53"
                  width="78"
                  height="17"
                  rx="4.5"
                  fill="#FFFFFF"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
                />
                <text
                  x="67"
                  y="65.5"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="11"
                  fill="#E21A1A"
                  textAnchor="middle"
                  letterSpacing="2.5"
                >
                  KHQR
                </text>
              </g>
            )}

            {/* Bottom Dark Foundation Rail */}
            <rect
              x="6.5"
              y="86.5"
              width="121"
              height="5"
              fill={isAba ? '#001428' : '#7F1D1D'}
              rx="1"
            />
          </svg>
        </div>

        {/* ── Truck Tires (High-Contrast Alloy Wheels with Spinning Animation) ── */}
        <div className="truckTires">
          {/* Rear Wheel */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
            {/* Outer Rubber Tire with High Contrast Slate Rim */}
            <circle cx="15" cy="15" r="13" stroke="#475569" strokeWidth="2.5" fill="#0F172A" />
            {/* Silver Alloy Rim */}
            <circle cx="15" cy="15" r="7.5" fill="#E2E8F0" />
            {/* Center Dark Hubcap */}
            <circle cx="15" cy="15" r="3.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            {/* Rotating Wheel Spokes */}
            <g className="wheel-spin">
              <line x1="15" y1="8" x2="15" y2="22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="15" x2="22" y2="15" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>

          {/* Front Wheel */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
            {/* Outer Rubber Tire with High Contrast Slate Rim */}
            <circle cx="15" cy="15" r="13" stroke="#475569" strokeWidth="2.5" fill="#0F172A" />
            {/* Silver Alloy Rim */}
            <circle cx="15" cy="15" r="7.5" fill="#E2E8F0" />
            {/* Center Dark Hubcap */}
            <circle cx="15" cy="15" r="3.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            {/* Rotating Wheel Spokes */}
            <g className="wheel-spin">
              <line x1="15" y1="8" x2="15" y2="22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="15" x2="22" y2="15" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* ── Road Track Line with Animated Dashes ── */}
        <div className="truck-road" />

        {/* ── Street Lamp Passing by with Glowing Lantern Head ── */}
        <svg
          viewBox="0 0 453.459 453.459"
          xmlns="http://www.w3.org/2000/svg"
          className="truck-lampPost"
        >
          {/* Lamppost Pole, Arm, & Lantern Frame (Adapts to dark/light theme) */}
          <path
            d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z"
            fill="currentColor"
          />
          {/* Luminous Warm Lantern Light (Illuminates on Dark Backgrounds) */}
          <path
            d="M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
            fill="#FACC15"
            style={{ filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.85))' }}
          />
        </svg>
      </div>
    </div>
  );
}
