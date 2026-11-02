"use client";

import React, { useEffect, useState } from "react";

export function WaterTapBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Soft atmospheric water gradient aura in top-right background */}
      <div className="absolute -top-24 right-0 w-[500px] h-[700px] bg-gradient-to-b from-sky-100/40 via-sky-50/20 to-transparent blur-3xl rounded-full opacity-60" />

      {/* Main Architectural Tap & Crystal Dripping Water Container */}
      <div className="absolute top-16 right-2 sm:right-8 md:right-16 lg:right-24 xl:right-32 w-[240px] sm:w-[280px] lg:w-[320px] h-[580px] opacity-75 hover:opacity-95 transition-opacity duration-700">
        <svg
          viewBox="0 0 320 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(14,165,233,0.12)]"
        >
          <defs>
            {/* Chrome Faucet Gradient */}
            <linearGradient id="tapBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="75%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Specular Highlight Strip */}
            <linearGradient id="tapHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>

            {/* Crystal-Clear Water Droplet Gradient */}
            <radialGradient id="crystalWater" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </radialGradient>

            {/* Ultra-Clear Water Sheen */}
            <linearGradient id="waterSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="60%" stopColor="rgba(56, 189, 248, 0.4)" />
              <stop offset="100%" stopColor="rgba(2, 132, 199, 0.7)" />
            </linearGradient>

            {/* Soft Ripple Glow */}
            <radialGradient id="puddleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Caustic Shimmer Pattern */}
            <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* 1. FAUCET / TAP STRUCTURE (Sleek Minimalist Chrome Arch) */}
          {/* ========================================================= */}

          {/* Wall / Inlet Mount Plate */}
          <rect
            x="275"
            y="25"
            width="25"
            height="50"
            rx="5"
            fill="url(#tapBodyGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <rect
            x="280"
            y="30"
            width="8"
            height="40"
            rx="2"
            fill="url(#tapHighlight)"
            opacity="0.6"
          />

          {/* Faucet Handle / Lever (Modern Precision Valve) */}
          <rect
            x="245"
            y="12"
            width="32"
            height="8"
            rx="3"
            fill="url(#tapBodyGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
            opacity="0.9"
          />
          <circle cx="261" cy="28" r="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />

          {/* Primary Gooseneck Pipe Arch */}
          <path
            d="M 280 50 C 240 50, 200 48, 150 48 C 105 48, 88 80, 88 140 L 88 170"
            fill="none"
            stroke="url(#tapBodyGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />

          {/* Polished Chrome Surface Highlight Reflection */}
          <path
            d="M 280 44 C 240 44, 202 42, 152 42 C 108 42, 92 74, 92 140 L 92 170"
            fill="none"
            stroke="url(#tapHighlight)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Shadow Under Faucet Arch */}
          <path
            d="M 276 56 C 238 56, 198 54, 148 54 C 102 54, 84 86, 84 140 L 84 170"
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Spout Aerator Collar */}
          <rect
            x="77"
            y="170"
            width="22"
            height="10"
            rx="2"
            fill="url(#tapBodyGrad)"
            stroke="#64748b"
            strokeWidth="1"
            opacity="0.95"
          />

          {/* Aerator Nozzle Mouth / Tip */}
          <ellipse
            cx="88"
            cy="180"
            rx="11"
            ry="4"
            fill="#334155"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          {/* Inner mesh water aperture */}
          <ellipse cx="88" cy="180" rx="7" ry="2.2" fill="#0284c7" opacity="0.8" />

          {/* ========================================================= */}
          {/* 2. CRYSTAL-CLEAR WATER LEVEL / PUDDLE AT BASE */}
          {/* ========================================================= */}

          {/* Soft Water Base Caustic Pool */}
          <ellipse
            cx="88"
            cy="480"
            rx="75"
            ry="18"
            fill="url(#puddleGlow)"
            className="animate-pulse"
            style={{ animationDuration: "3.6s" }}
          />

          {/* Crystalline Water Surface Lens */}
          <ellipse
            cx="88"
            cy="480"
            rx="52"
            ry="11"
            fill="rgba(224, 242, 254, 0.45)"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
          />
          <ellipse
            cx="88"
            cy="480"
            rx="30"
            ry="6"
            fill="rgba(255, 255, 255, 0.6)"
            opacity="0.6"
          />

          {/* ========================================================= */}
          {/* 3. EXPANDING WATER RIPPLES (Timed with Droplet Impact) */}
          {/* ========================================================= */}

          {/* Ripple Ring 1 */}
          <ellipse
            cx="88"
            cy="480"
            rx="10"
            ry="3.5"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            className="water-ripple-1"
          />

          {/* Ripple Ring 2 */}
          <ellipse
            cx="88"
            cy="480"
            rx="10"
            ry="3.5"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.4"
            className="water-ripple-2"
          />

          {/* Ripple Ring 3 (Soft outer ring) */}
          <ellipse
            cx="88"
            cy="480"
            rx="10"
            ry="3.5"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1"
            className="water-ripple-3"
          />

          {/* Splash Micro-Droplet 1 (Bounces left on impact) */}
          <circle cx="88" cy="480" r="2.2" fill="#ffffff" className="water-splash-left" />

          {/* Splash Micro-Droplet 2 (Bounces right on impact) */}
          <circle cx="88" cy="480" r="1.8" fill="#e0f2fe" className="water-splash-right" />

          {/* ========================================================= */}
          {/* 4. DRIPPING WATER DROPLET (Swelling, Falling, Impact) */}
          {/* ========================================================= */}

          {/* Static hanging water meniscus at the aerator tip */}
          <path
            d="M 83 180 Q 88 185 93 180 Z"
            fill="#38bdf8"
            opacity="0.5"
          />

          {/* Animated Falling Teardrop */}
          <g className="water-drop-fall">
            {/* The Droplet Teardrop Silhouette */}
            <path
              d="M 88,180 C 92.5,188 95,193 95,198 C 95,203 91.8,206.5 88,206.5 C 84.2,206.5 81,203 81,198 C 81,193 83.5,188 88,180 Z"
              fill="url(#crystalWater)"
              stroke="url(#waterSheen)"
              strokeWidth="1"
              filter="url(#waterGlow)"
            />

            {/* Specular White Highlight Sparkle (Realistic clear water gleam) */}
            <ellipse
              cx="85.5"
              cy="196"
              rx="2.2"
              ry="4"
              fill="#ffffff"
              opacity="0.92"
              transform="rotate(-15 85.5 196)"
            />
            {/* Secondary lower reflection rim */}
            <circle
              cx="88"
              cy="204"
              r="2"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              opacity="0.75"
            />
          </g>

          {/* Ambient Micro-Bubbles / Fresh Water Atmosphere */}
          <circle cx="95" cy="310" r="1.2" fill="#38bdf8" opacity="0.4" className="animate-pulse" />
          <circle cx="78" cy="240" r="1.5" fill="#bae6fd" opacity="0.5" className="animate-pulse" />
          <circle cx="102" cy="420" r="1" fill="#7dd3fc" opacity="0.4" />
        </svg>
      </div>

      {/* Scoped CSS Keyframe Animations for Natural Fluid Physics */}
      <style jsx>{`
        /* Droplet Cycle: 3.2s loop
           0% - 38%: Droplet forms & swells at tap nozzle
           38% - 58%: Droplet detaches and falls with gravity acceleration
           58%: Impacts the water surface at y=480 (drop distance: 295px)
           58% - 100%: Droplet invisible while ripples spread
        */
        .water-drop-fall {
          transform-origin: 88px 180px;
          animation: dropCycle 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        @keyframes dropCycle {
          0% {
            transform: translateY(0px) scale(0.2);
            opacity: 0;
          }
          10% {
            transform: translateY(0px) scale(0.65);
            opacity: 0.9;
          }
          28% {
            transform: translateY(3px) scale(1.05);
            opacity: 1;
          }
          38% {
            transform: translateY(6px) scale(1);
            opacity: 1;
          }
          /* Gravity acceleration downwards */
          57% {
            transform: translateY(295px) scale(0.9, 1.25);
            opacity: 1;
          }
          58% {
            transform: translateY(298px) scale(1.3, 0.3);
            opacity: 0.8;
          }
          60% {
            transform: translateY(298px) scale(1.8, 0.1);
            opacity: 0;
          }
          100% {
            transform: translateY(0px) scale(0.2);
            opacity: 0;
          }
        }

        /* Ripple 1: triggers at drop impact (58%) */
        .water-ripple-1 {
          transform-origin: 88px 480px;
          animation: rippleWave1 3.2s ease-out infinite;
        }

        @keyframes rippleWave1 {
          0%, 57% {
            transform: scale(0.1);
            opacity: 0;
            stroke-width: 2.2px;
          }
          59% {
            transform: scale(0.4);
            opacity: 0.9;
            stroke-width: 2px;
          }
          75% {
            transform: scale(2.6);
            opacity: 0.45;
            stroke-width: 1.2px;
          }
          95%, 100% {
            transform: scale(5.2);
            opacity: 0;
            stroke-width: 0.5px;
          }
        }

        /* Ripple 2: slightly delayed follower */
        .water-ripple-2 {
          transform-origin: 88px 480px;
          animation: rippleWave2 3.2s ease-out infinite;
        }

        @keyframes rippleWave2 {
          0%, 64% {
            transform: scale(0.1);
            opacity: 0;
            stroke-width: 2px;
          }
          66% {
            transform: scale(0.4);
            opacity: 0.8;
            stroke-width: 1.6px;
          }
          82% {
            transform: scale(2.4);
            opacity: 0.35;
            stroke-width: 1px;
          }
          98%, 100% {
            transform: scale(4.4);
            opacity: 0;
            stroke-width: 0.4px;
          }
        }

        /* Ripple 3: outermost faint ring */
        .water-ripple-3 {
          transform-origin: 88px 480px;
          animation: rippleWave3 3.2s ease-out infinite;
        }

        @keyframes rippleWave3 {
          0%, 70% {
            transform: scale(0.1);
            opacity: 0;
            stroke-width: 1.6px;
          }
          72% {
            transform: scale(0.4);
            opacity: 0.6;
            stroke-width: 1.2px;
          }
          90% {
            transform: scale(2.8);
            opacity: 0.25;
            stroke-width: 0.8px;
          }
          100% {
            transform: scale(4.8);
            opacity: 0;
            stroke-width: 0.2px;
          }
        }

        /* Splash Micro-Droplets */
        .water-splash-left {
          animation: splashLeft 3.2s ease-out infinite;
        }

        @keyframes splashLeft {
          0%, 57% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          59% {
            transform: translate(-14px, -18px) scale(1);
            opacity: 0.9;
          }
          65% {
            transform: translate(-22px, -4px) scale(0.7);
            opacity: 0.5;
          }
          69%, 100% {
            transform: translate(-26px, 2px) scale(0);
            opacity: 0;
          }
        }

        .water-splash-right {
          animation: splashRight 3.2s ease-out infinite;
        }

        @keyframes splashRight {
          0%, 57% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          59% {
            transform: translate(12px, -15px) scale(1);
            opacity: 0.9;
          }
          64% {
            transform: translate(19px, -3px) scale(0.6);
            opacity: 0.5;
          }
          68%, 100% {
            transform: translate(22px, 2px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
