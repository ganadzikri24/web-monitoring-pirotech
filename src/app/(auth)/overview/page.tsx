"use client";

import { useState, useEffect } from "react";
import WasteInputForm from "@/components/WasteInputForm";
import EstimationCard from "@/components/EstimationCard";
import StatisticsPanel from "@/components/StatisticsPanel";
import StartProcessButton from "@/components/overview/StartProcessButton";
import ProcessTimer from "@/components/overview/ProcessTimer";
import PyrolysisProcessAnimation from "@/components/overview/PyrolysisProcessAnimation";
import { calculateEstimatedYield } from "@/lib/calculations";
import { getRunningBatch, startNewBatch, pauseBatch, resumeBatch, stopBatch } from "@/lib/mockData";
import { 
  getRunningFirebaseBatch, 
  startFirebaseBatch, 
  pauseFirebaseBatch, 
  resumeFirebaseBatch, 
  stopFirebaseBatch,
  pushNotification
} from "@/lib/firebaseUtils";
import type { Batch } from "@/lib/types";

export default function OverviewPage() {
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  // Note: For firebase batches, we might have an 'id' attached to it
  const [batch, setBatch] = useState<(Batch & { id?: string }) | null>(null);



  useEffect(() => {
    const loadBatch = async () => {
      const fb = await getRunningFirebaseBatch();
      setBatch(fb);
    };
    loadBatch();
    const interval = setInterval(loadBatch, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      const numWeight = parseFloat(weight);
      if (!numWeight || !type) return;
      
      const newBatch = await startFirebaseBatch(numWeight, type, "admin");
      setBatch(newBatch);
      
      // Trigger notifikasi
      pushNotification(
        "Pembakaran Dimulai", 
        `Sesi baru dimulai dengan berat ${numWeight} kg (${type === 'mix' ? 'Campuran' : type}).`, 
        "info"
      );
    } catch (err: any) {
      alert("Gagal memulai pembakaran: " + (err.message || "Pastikan Firebase Rules mengizinkan write ke /batches"));
      console.error(err);
    }
  };

  const handlePause = async () => {
    try {
      if (batch && batch.id) {
        const currentMs = batch.accumulatedMs || 0;
        const additionalMs = Date.now() - batch.startTs;
        const totalAccumulated = currentMs + additionalMs;
        
        const success = await pauseFirebaseBatch(batch.id, totalAccumulated);
        if (success) {
          setBatch({ ...batch, status: "paused", pausedAt: Date.now(), accumulatedMs: totalAccumulated });
        } else {
          alert("Gagal menjeda pembakaran. Periksa koneksi/aturan Firebase.");
        }
      }
    } catch (err: any) {
      alert("Gagal menjeda pembakaran: " + err.message);
    }
  };

  const handleResume = async () => {
    try {
      if (batch && batch.id) {
        const success = await resumeFirebaseBatch(batch.id);
        if (success) {
          setBatch({ ...batch, status: "running", startTs: Date.now(), pausedAt: undefined });
        } else {
          alert("Gagal melanjutkan pembakaran. Periksa koneksi/aturan Firebase.");
        }
      }
    } catch (err: any) {
      alert("Gagal melanjutkan pembakaran: " + err.message);
    }
  };

  const handleStop = async () => {
    try {
      if (batch && batch.id) {
        let totalAccumulated = batch.accumulatedMs || 0;
        if (batch.status === "running") {
          totalAccumulated += Date.now() - batch.startTs;
        }
        
        const numWeight = batch.wasteKg || 0;
        const t = batch.plasticType || "mix";
        const { fuelLiters } = calculateEstimatedYield(numWeight, t);

        const success = await stopFirebaseBatch(batch.id, totalAccumulated, fuelLiters, numWeight, t);
        if (success) {
          setBatch(null);
        } else {
          alert("Gagal menyelesaikan pembakaran. Periksa koneksi/aturan Firebase.");
        }
      }
    } catch (err: any) {
      alert("Gagal menyelesaikan pembakaran: " + err.message);
    }
  };

  const numericWeight = parseFloat(weight) || 0;
  const { fuelLiters, residueKg, yieldRate } = calculateEstimatedYield(numericWeight, type);

  const isValidInput = numericWeight > 0 && type !== "";
  const isActive = batch !== null;
  const isRunning = batch?.status === "running";
  const isPaused = batch?.status === "paused";

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Overview</h1>
          <p className="text-brand-sage leading-relaxed">
            Ringkasan operasional dan estimasi pengolahan alat PiRoTech.
          </p>
        </div>


      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex-1">
            <WasteInputForm
              weight={weight}
              setWeight={setWeight}
              type={type}
              setType={setType}
              disabled={isActive}
            />
          </div>

          <StartProcessButton
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            disabled={isActive || !isValidInput}
            isProcessing={isRunning}
            isPaused={isPaused}
            isValidInput={isValidInput}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          {isActive && (
            <div className="bg-brand-green700 p-6 rounded-2xl shadow-sm border border-brand-green relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div>
                <p className="text-sm font-semibold text-brand-green50 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {!isPaused && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green50 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isPaused ? 'bg-amber-400' : 'bg-brand-green50'}`}></span>
                  </span>
                  {isPaused ? "Proses Dijeda" : "Waktu Berjalan"}
                </p>
                <div className="mt-2">
                  <ProcessTimer
                    startTs={batch.startTs}
                    pausedAt={batch.pausedAt}
                    accumulatedMs={batch.accumulatedMs || 0}
                    size="lg"
                    className="text-white text-4xl"
                  />
                </div>
              </div>
              {isPaused && (
                <span className="mt-4 md:mt-0 px-4 py-1.5 rounded-full bg-amber-500/30 border border-amber-500/50 text-amber-300 text-sm font-bold shadow-sm">
                  DIJEDA
                </span>
              )}
            </div>
          )}

          <div className="flex-1">
            <EstimationCard
              fuelLiters={fuelLiters}
              residueKg={residueKg}
            />
          </div>

          {isActive && (
            <div className="h-48 shrink-0">
              <PyrolysisProcessAnimation />
            </div>
          )}
        </div>
      </div>

      <div className="pt-10 border-t border-card-border mt-10">
        <h2 className="text-2xl font-bold text-brand-green700 mb-6 tracking-tight">Ringkasan Pengolahan</h2>
        <StatisticsPanel />
      </div>
    </div>
  );
}
