"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

interface PreloaderProps {
  onFinished: () => void;
}

export default function Preloader({ onFinished }: PreloaderProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show preloader for at least 1.5s, then fade out
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" as const }}
          className="fixed inset-0 z-[9999] bg-app-bg flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Logo size="lg" />
            </motion.div>

            {/* Loading bar */}
            <div className="w-48 h-1.5 bg-card-border/50 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 0.5, x: "200%" }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut",
                  repeat: Infinity
                }}
                className="absolute inset-y-0 left-0 h-full w-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(22,163,74,0.7)] origin-left"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
