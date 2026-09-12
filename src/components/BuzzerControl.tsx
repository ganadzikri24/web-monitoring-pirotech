"use client";

import { Volume2, VolumeX, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listenToBuzzer, setBuzzerState, pushNotification } from "@/lib/firebaseUtils";

export default function BuzzerControl() {
  const [buzzer, setBuzzer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToBuzzer((isOn) => {
      setBuzzer(isOn);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async () => {
    // Optimistic update
    const nextState = !buzzer;
    setBuzzer(nextState);
    const success = await setBuzzerState(nextState);
    if (!success) {
      // Revert on failure
      setBuzzer(buzzer);
    } else {
      pushNotification(
        "Status Buzzer Diubah",
        nextState ? "Buzzer telah diaktifkan secara manual." : "Buzzer masuk ke Mode Silent.",
        "warning"
      );
    }
  };

  return (
    <div className="bg-card-bg p-6 lg:p-8 rounded-2xl shadow-sm border border-card-border h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green50 text-brand-green flex items-center justify-center shrink-0">
            <VolumeX className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-green700">Silent Buzzer</h2>
            <p className="text-xs text-brand-sage">Kontrol izin sistem untuk menyalakan buzzer.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-6">
        <motion.button
          onClick={handleToggle}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer ${buzzer
            ? 'bg-brand-green hover:bg-brand-green700 text-white shadow-brand-green/30'
            : 'bg-input-bg border-4 border-card-border text-brand-sage hover:text-foreground'
            }`}
        >
          {buzzer && (
            <span className="absolute inset-0 rounded-full animate-ping border-4 border-brand-green opacity-20"></span>
          )}
          {buzzer ? <Volume2 className="w-12 h-12 mb-1" /> : <VolumeX className="w-12 h-12 mb-1" />}
          <span className="font-bold text-xl">{buzzer ? 'AKTIF' : 'SILENT'}</span>
        </motion.button>

        <div className="mt-8 text-center px-4">
          {buzzer ? (
            <p className="text-sm font-medium text-brand-green700 dark:text-brand-green">
              Buzzer <strong>Aktif</strong> (Diizinkan berbunyi saat Overheat)
            </p>
          ) : (
            <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <VolumeX className="w-4 h-4" /> Buzzer dimatikan (Silent Mode)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
