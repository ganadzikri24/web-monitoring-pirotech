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
            {/* Logo with pulse */}
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
              <Logo variant="icon" size="lg" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-brand-green700 tracking-tight">
                PiRoTech
              </h1>
              <p className="text-sm text-brand-sage mt-1">
                Alat Pirolisis Sampah Plastik
              </p>
            </motion.div>

            {/* Loading bar */}
            <div className="w-48 h-1 bg-card-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="h-full bg-brand-green rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
