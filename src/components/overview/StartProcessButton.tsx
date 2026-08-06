"use client";

import { Play, Pause, Square, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StartProcessButtonProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled: boolean;
  isProcessing: boolean;
  isPaused: boolean;
  isValidInput: boolean;
}

export default function StartProcessButton({
  onStart,
  onPause,
  onResume,
  onStop,
  disabled,
  isProcessing,
  isPaused,
  isValidInput,
}: StartProcessButtonProps) {
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Process is running or paused → show control buttons
  if (isProcessing || isPaused) {
    return (
      <div className="w-full space-y-3">
        {/* Status indicator */}
        <div className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 ${
          isPaused
            ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400"
            : "bg-brand-green50 dark:bg-brand-green/10 border border-brand-green/30 text-brand-green700 dark:text-brand-green"
        }`}>
          {isPaused ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="font-bold">Proses Dijeda</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
              </span>
              <span className="font-bold">Proses Sedang Berjalan</span>
            </>
          )}
        </div>

        {/* Control buttons */}
        <div className="grid grid-cols-2 gap-3 relative">
          {/* Pause / Resume */}
          {isPaused ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onResume}
              className="py-3.5 rounded-xl font-bold text-sm bg-brand-green hover:bg-brand-green700 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" /> Lanjutkan
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onPause}
              className="py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pause className="w-4 h-4" /> Jeda
            </motion.button>
          )}

          {/* Stop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowStopConfirm(true)}
            className="py-3.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4" /> Selesaikan
          </motion.button>

          {/* Stop confirmation overlay */}
          <AnimatePresence>
            {showStopConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 bg-card-bg border border-red-300 dark:border-red-500/30 shadow-lg rounded-xl p-4 z-10 flex flex-col justify-center"
              >
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Yakin ingin mengakhiri proses ini?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowStopConfirm(false)}
                    className="py-2.5 rounded-lg border border-card-border text-brand-sage hover:bg-input-bg transition-colors text-sm font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowStopConfirm(false);
                      onStop();
                    }}
                    className="py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Ya, Selesai
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Not processing → show start button
  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {!showStartConfirm ? (
          <motion.button
            key="start-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isValidInput) return;
              setShowStartConfirm(true);
            }}
            disabled={disabled || !isValidInput}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm
              ${!disabled && isValidInput
                ? "bg-brand-green hover:bg-brand-green700 text-white cursor-pointer hover:shadow-md"
                : "bg-card-border text-muted-foreground cursor-not-allowed opacity-70"
              }
            `}
          >
            Mulai Proses <Play className="w-4 h-4 ml-1" />
          </motion.button>
        ) : (
          <motion.div
            key="confirm-box"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-card-bg border border-brand-green shadow-lg rounded-xl p-4"
          >
            <p className="text-sm font-semibold text-brand-green700 mb-3 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> Yakin ingin memulai?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowStartConfirm(false)}
                className="py-2.5 rounded-lg border border-card-border text-brand-sage hover:bg-brand-sage50 transition-colors text-sm font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowStartConfirm(false);
                  onStart();
                }}
                className="py-2.5 rounded-lg bg-brand-green hover:bg-brand-green700 text-white transition-colors text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Ya, Mulai
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
