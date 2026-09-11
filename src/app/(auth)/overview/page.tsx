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
  stopFirebaseBatch 
} from "@/lib/firebaseUtils";
import type { Batch } from "@/lib/types";

export default function OverviewPage() {
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  // Note: For firebase batches, we might have an 'id' attached to it
  const [batch, setBatch] = useState<(Batch & { id?: string }) | null>(null);

  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

  useEffect(() => {
    const loadBatch = async () => {
      if (isMock) {
        const b = await getRunningBatch();
        setBatch(b);
      } else {
        const fb = await getRunningFirebaseBatch();
        setBatch(fb);
      }
    };
    loadBatch();
    const interval = setInterval(loadBatch, 5000);
    return () => clearInterval(interval);
  }, [isMock]);

  const handleStart = async () => {
    const numWeight = parseFloat(weight);
    if (!numWeight || !type) return;
    
    if (isMock) {
      const newBatch = await startNewBatch(numWeight, type, "admin");
      setBatch(newBatch);
    } else {
      const newBatch = await startFirebaseBatch(numWeight, type, "admin");
      setBatch(newBatch);
    }
  };

  const handlePause = async () => {
    if (isMock) {
      const updated = await pauseBatch();
      if (updated) setBatch(updated);
    } else if (batch && batch.id) {
      const currentMs = batch.accumulatedMs || 0;
      const additionalMs = Date.now() - batch.startTs;
      const totalAccumulated = currentMs + additionalMs;
      
      const success = await pauseFirebaseBatch(batch.id, totalAccumulated);
      if (success) {
        setBatch({ ...batch, status: "paused", pausedAt: Date.now(), accumulatedMs: totalAccumulated });
      }
    }
  };

  const handleResume = async () => {
    if (isMock) {
      const updated = await resumeBatch();
      if (updated) setBatch(updated);
    } else if (batch && batch.id) {
      const success = await resumeFirebaseBatch(batch.id);
      if (success) {
        setBatch({ ...batch, status: "running", startTs: Date.now(), pausedAt: undefined });
      }
    }
  };

  const handleStop = async () => {
    if (isMock) {
      const completed = await stopBatch();
      if (completed) setBatch(null); // Clear — it's now in the log
    } else if (batch && batch.id) {
      let totalAccumulated = batch.accumulatedMs || 0;
      if (batch.status === "running") {
        totalAccumulated += Date.now() - batch.startTs;
      }
      
      const numWeight = batch.wasteKg || 0;
      const t = batch.plasticType || "mix";
      const { fuelLiters } = calculateEstimatedYield(numWeight, t);

      const success = await stopFirebaseBatch(batch.id, totalAccumulated, fuelLiters);
      if (success) setBatch(null);
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

        {isActive && (
          <div className="bg-card-bg border border-card-border px-4 py-3 rounded-xl shadow-sm flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-sage uppercase tracking-wider mb-0.5">
                {isPaused ? "Dijeda" : "Waktu Berjalan"}
              </p>
              <ProcessTimer
                startTs={batch.startTs}
                pausedAt={batch.pausedAt}
                accumulatedMs={batch.accumulatedMs || 0}
                size="sm"
                className="text-brand-green700"
              />
            </div>
            {isPaused && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                DIJEDA
              </span>
            )}
          </div>
        )}
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
