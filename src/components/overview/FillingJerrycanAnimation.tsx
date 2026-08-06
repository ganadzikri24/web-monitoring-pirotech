"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FillingJerrycanAnimationProps {
  fillPercent: number; // 0 to 100
  color?: string;
}

function SingleBottle({ fillPercent, color = "#facc15" }: FillingJerrycanAnimationProps) {
  const clampedPercent = Math.max(5, Math.min(100, fillPercent));
  const empty = fillPercent <= 0 || isNaN(fillPercent);

  return (
    <div className="w-16 h-24 relative flex items-end justify-center shrink-0">
      {/* Container back */}
      <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full text-brand-sage/30 dark:text-brand-sage/20">
        <path
          d="M20,30 L30,30 L30,10 C30,4 34,0 40,0 L60,0 C66,0 70,4 70,10 L70,30 L80,30 C91,30 100,39 100,50 L100,120 C100,131 91,140 80,140 L20,140 C9,140 0,131 0,120 L0,50 C0,39 9,30 20,30 Z M40,30 L60,30 L60,15 L40,15 L40,30 Z M15,50 L15,120 C15,123 17,125 20,125 L80,125 C83,125 85,123 85,120 L85,50 C85,47 83,45 80,45 L20,45 C17,45 15,47 15,50 Z"
          fill="currentColor"
        />
      </svg>

      {/* Liquid fill */}
      {!empty && (
        <div className="absolute bottom-[10%] w-[70%] left-[15%] h-[57%] rounded overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${clampedPercent}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="absolute bottom-0 left-0 right-0 w-full origin-bottom"
            style={{ backgroundColor: color, willChange: "height" }}
          >
            {/* Wave */}
            <motion.div
              animate={{ x: ["-10%", "-50%", "-10%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute top-0 left-0 w-[200%] h-1.5 rounded-t-full"
              style={{ backgroundColor: `${color}CC` }}
            />
          </motion.div>
        </div>
      )}

      {/* Container front outline */}
      <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full text-gray-900 dark:text-white">
        <path
          d="M20,30 L30,30 L30,10 C30,4 34,0 40,0 L60,0 C66,0 70,4 70,10 L70,30 L80,30 C91,30 100,39 100,50 L100,120 C100,131 91,140 80,140 L20,140 C9,140 0,131 0,120 L0,50 C0,39 9,30 20,30 Z M40,30 L60,30 L60,15 L40,15 L40,30 Z M15,50 L15,120 C15,123 17,125 20,125 L80,125 C83,125 85,123 85,120 L85,50 C85,47 83,45 80,45 L20,45 C17,45 15,47 15,50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
        />
      </svg>
    </div>
  );
}

interface MultiBottleProps {
  totalLiters: number;
  bottleCapacity?: number;
  color?: string;
}

export default function FillingJerrycanAnimation({
  totalLiters,
  bottleCapacity = 5,
  color = "#facc15",
}: MultiBottleProps) {
  if (totalLiters <= 0 || isNaN(totalLiters)) {
    return (
      <div className="flex items-center justify-center h-28 text-brand-sage/40 text-sm font-medium">
        Menunggu input...
      </div>
    );
  }

  const fullBottles = Math.floor(totalLiters / bottleCapacity);
  const remainder = totalLiters % bottleCapacity;
  const remainderPercent = (remainder / bottleCapacity) * 100;
  const totalBottles = fullBottles + (remainder > 0 ? 1 : 0);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-end justify-center gap-2 max-w-full">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: totalBottles }).map((_, i) => {
            const isLast = i === totalBottles - 1 && remainder > 0;
            const fill = isLast ? remainderPercent : 100;

            return (
              <motion.div
                key={`bottle-${i}`}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              >
                <SingleBottle fillPercent={fill} color={color} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <p className="text-xs font-bold text-brand-sage tabular-nums">
        {(totalLiters / bottleCapacity).toFixed(1)} botol × {bottleCapacity}L
      </p>
    </div>
  );
}

// Keep old single-bottle API compatible for legacy usage
export { SingleBottle };
