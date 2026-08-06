"use client";

import { motion } from "framer-motion";
import { Recycle } from "lucide-react";

interface WasteScaleAnimationProps {
  weightKg: number;
  maxWeight?: number; // e.g. 50kg capacity
}

export default function WasteScaleAnimation({ weightKg, maxWeight = 50 }: WasteScaleAnimationProps) {
  // Calculate scale factor, clamp between 0.2 and 1
  const scale = Math.max(0.2, Math.min(1, weightKg / maxWeight));
  // Make the pile slightly wider based on weight
  const widthScale = Math.max(0.4, Math.min(1, 0.4 + (weightKg / maxWeight) * 0.6));
  
  const isEmpty = weightKg <= 0 || isNaN(weightKg);

  return (
    <div className="relative w-full h-32 flex items-end justify-center overflow-hidden bg-card-bg rounded-2xl border border-card-border shadow-inner p-4">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-brand-sage/50">
          <Recycle className="w-8 h-8 mb-2" />
          <span className="text-xs font-medium">Input berat untuk melihat simulasi</span>
        </div>
      ) : (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: scale, scaleX: widthScale, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative origin-bottom flex items-end justify-center"
        >
          {/* Base of the waste pile */}
          <div className="w-32 h-16 bg-blue-500/20 rounded-[40%] blur-sm absolute bottom-0" />
          
          {/* The actual pile shape */}
          <svg width="120" height="80" viewBox="0 0 120 80" className="relative z-10 drop-shadow-md">
            <path
              d="M10,80 Q30,10 60,0 Q90,10 110,80 Z"
              fill="currentColor"
              className="text-brand-sage dark:text-brand-sage/50"
            />
            {/* Some decorative plastic piece outlines */}
            <rect x="30" y="50" width="15" height="20" rx="3" fill="white" opacity="0.3" transform="rotate(-15 30 50)" />
            <circle cx="70" cy="40" r="10" fill="white" opacity="0.2" />
            <rect x="80" y="60" width="20" height="15" rx="4" fill="white" opacity="0.4" transform="rotate(10 80 60)" />
            <path d="M45,65 L55,50 L65,60 Z" fill="white" opacity="0.3" />
          </svg>
        </motion.div>
      )}

      {/* Grid lines for measurement context */}
      <div className="absolute left-0 bottom-0 top-0 w-8 flex flex-col justify-between py-4 px-2 border-r border-card-border/50 text-[10px] text-brand-sage/40">
        <span>{maxWeight}kg</span>
        <span>{maxWeight / 2}kg</span>
        <span>0kg</span>
      </div>
    </div>
  );
}
