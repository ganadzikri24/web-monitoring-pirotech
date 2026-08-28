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
import type { Batch } from "@/lib/types";

export default function OverviewPage() {
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    const loadBatch = async () => {
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
        const b = await getRunningBatch();
        setBatch(b);
      }
    };
    loadBatch();
    const interval = setInterval(loadBatch, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    const numWeight = parseFloat(weight);
    if (!numWeight || !type) return;
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      const newBatch = await startNewBatch(numWeight, type, "admin");
      setBatch(newBatch);
    }
  };

  const handlePause = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      const updated = await pauseBatch();
      if (updated) setBatch(updated);
    }
  };

  const handleResume = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      const updated = await resumeBatch();
      if (updated) setBatch(updated);
    }
  };

  const handleStop = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      const completed = await stopBatch();
      if (completed) setBatch(null); // Clear — it's now in the log
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
