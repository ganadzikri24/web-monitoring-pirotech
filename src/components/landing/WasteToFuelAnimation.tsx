"use client";

import { motion } from "framer-motion";

// TODO: ganti dengan file Lottie/video final dari saya
// Animasi ini menggunakan Framer Motion murni sebagai placeholder.
// Menunjukkan alur: botol plastik → masuk reaktor → keluar jadi tetesan BBM

export default function WasteToFuelAnimation() {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-green50 via-card-bg to-amber-50 dark:from-brand-green50/50 dark:via-card-bg dark:to-amber-50/30 border border-card-border">
      <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Reactor body */}
        <rect x="230" y="60" width="140" height="130" rx="10" fill="var(--brand-sage)" opacity="0.3" />
        <rect x="240" y="70" width="120" height="110" rx="6" fill="var(--card-bg)" stroke="var(--brand-sage)" strokeWidth="2" />
        <text x="300" y="130" textAnchor="middle" fill="var(--brand-sage)" fontSize="11" fontWeight="600">REAKTOR</text>

        {/* Condenser pipe */}
        <line x1="370" y1="125" x2="450" y2="125" stroke="var(--brand-sage)" strokeWidth="3" strokeLinecap="round" />
        <rect x="450" y="95" width="50" height="60" rx="6" fill="var(--card-bg)" stroke="var(--brand-sage)" strokeWidth="2" />
        <text x="475" y="130" textAnchor="middle" fill="var(--brand-sage)" fontSize="8" fontWeight="600">KONDENSOR</text>

        {/* Output pipe */}
        <line x1="475" y1="155" x2="475" y2="200" stroke="var(--brand-sage)" strokeWidth="2" />

        {/* Animated plastic bottles (input) */}
        {[0, 1, 2].map((i) => (
          <motion.g
            key={`bottle-${i}`}
            initial={{ x: 30 + i * 25, y: 120, opacity: 1 }}
            animate={{
              x: [30 + i * 25, 180, 260],
              y: [120, 120, 120],
              opacity: [1, 1, 0],
              scale: [1, 1, 0.3],
            }}
            transition={{
              duration: 4,
              delay: i * 1.2,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          >
            {/* Bottle shape */}
            <rect x="0" y="-10" width="12" height="20" rx="3" fill="#3B82F6" opacity="0.7" />
            <rect x="3" y="-14" width="6" height="6" rx="2" fill="#3B82F6" opacity="0.5" />
          </motion.g>
        ))}

        {/* Animated fire under reactor */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`fire-${i}`}
            cx={270 + i * 30}
            cy="195"
            r="6"
            fill="#F59E0B"
            animate={{
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated fuel drops (output) */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`drop-${i}`}
            cx="475"
            r="4"
            fill="#D97706"
            initial={{ cy: 165, opacity: 0 }}
            animate={{
              cy: [165, 210, 230],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.7 + 1,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeIn",
            }}
          />
        ))}

        {/* Collection container */}
        <rect x="460" y="210" width="30" height="25" rx="3" fill="var(--card-bg)" stroke="#D97706" strokeWidth="2" />

        {/* Labels */}
        <text x="80" y="160" textAnchor="middle" fill="var(--brand-sage)" fontSize="9" fontWeight="500">Sampah Plastik</text>
        <text x="475" y="248" textAnchor="middle" fill="#D97706" fontSize="9" fontWeight="600">BBM Cair</text>
      </svg>
    </div>
  );
}
