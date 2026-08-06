"use client";

import { motion } from "framer-motion";

export default function PyrolysisProcessAnimation() {
  const videoSrc = "/video-proses-pirolisis.webm";
  if (videoSrc) {
    return (
      <div className="w-full h-48 rounded-2xl overflow-hidden border border-card-border shadow-inner">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      </div>
    );
  }

  // Fallback: SVG animation placeholder
  return (
    <div className="w-full h-48 bg-gradient-to-br from-card-bg to-brand-green50 dark:to-brand-green/10 rounded-2xl border border-card-border shadow-inner relative overflow-hidden flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 w-32 h-32 bg-orange-500/20 blur-2xl rounded-full"
      />

      <div className="relative z-10 flex flex-col items-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24 mb-2">
          <rect x="25" y="30" width="50" height="60" rx="8" fill="var(--card-bg)" stroke="var(--brand-sage)" strokeWidth="3" />
          <path d="M25 30 Q50 10 75 30 Z" fill="var(--brand-sage)" opacity="0.8" />

          {[0, 1, 2].map((i) => (
            <motion.path
              key={`flame-${i}`}
              d={`M${40 + i * 10} 90 Q${40 + i * 10 - 5} 75 ${40 + i * 10} 60 Q${40 + i * 10 + 5} 75 ${40 + i * 10} 90 Z`}
              fill="#F59E0B"
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ originY: 1 }}
            />
          ))}

          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`gas-${i}`}
              cx={40 + i * 10}
              r={3}
              fill="var(--brand-sage)"
              opacity="0.5"
              initial={{ cy: 40 }}
              animate={{
                cy: [40, 10, -10],
                opacity: [0, 0.5, 0],
                x: [0, i % 2 === 0 ? -5 : 5, i % 2 === 0 ? -10 : 10],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>

        <div className="flex items-center gap-2 text-brand-green700 font-bold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
          </span>
          Pirolisis Berjalan
        </div>
      </div>
    </div>
  );
}
