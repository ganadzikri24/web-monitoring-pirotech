"use client";

import { Thermometer, Timer, Activity, Flame } from "lucide-react";
import RealtimeChart from "@/components/RealtimeChart";
import BuzzerControl from "@/components/BuzzerControl";
import ProcessTimer from "@/components/overview/ProcessTimer";
import { useEffect, useState } from "react";
import { listenToMonitoring, MonitoringData } from "@/lib/firebaseUtils";
import { getRunningBatch } from "@/lib/mockData";
import type { Batch } from "@/lib/types";

export default function DashboardPage() {
  const [runningBatch, setRunningBatch] = useState<Batch | null>(null);
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);

  useEffect(() => {
    // We still keep the mock batch for the timer since Firebase RTDB 
    // doesn't have the batch start time logic yet.
    const loadBatch = async () => {
      const batch = await getRunningBatch();
      setRunningBatch(batch);
    };
    loadBatch();
    
    // Subscribe to Firebase RTDB for real telemetry
    const unsubscribe = listenToMonitoring((data) => {
      if (data) {
        setMonitoringData(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const tempC = monitoringData?.suhu || 0;
  const isPaused = runningBatch?.status === "paused";
  
  // Use status from Firebase if available, otherwise fallback
  const status = isPaused 
    ? "PAUSED" 
    : (monitoringData?.status?.toUpperCase() || (runningBatch ? "PYROLYSIS" : "IDLE"));

  // Determine status styles
  let statusBadge = "";
  if (status === "IDLE") statusBadge = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  if (status === "HEATING") statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500";
  if (status === "PYROLYSIS") statusBadge = "bg-brand-green50 text-brand-green700 dark:bg-brand-green/20 dark:text-brand-green";
  if (status === "COOLING") statusBadge = "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
  if (status === "PAUSED") statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"; // yellow/amber for paused

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Dashboard Monitoring</h1>
        <p className="text-brand-sage leading-relaxed">
          Pantau grafik suhu real-time dan kendalikan proses operasional.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Realtime Telemetry */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Indicators Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card-bg p-5 rounded-2xl shadow-sm border border-card-border flex flex-col justify-center">
              <div className="flex items-center gap-2 text-brand-sage mb-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Suhu Saat Ini</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-brand-green700">
                  {tempC.toFixed(1)}
                </span>
                <span className="text-brand-sage font-medium mb-1">°C</span>
              </div>
              <p className="text-[11px] text-brand-green mt-2 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                Dalam ambang aman
              </p>
            </div>

            <div className="bg-card-bg p-5 rounded-2xl shadow-sm border border-card-border flex flex-col justify-center">
              <div className="flex items-center gap-2 text-brand-sage mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${statusBadge}`}>
                  {status}
                </span>
              </div>
            </div>

            <div className="bg-brand-green700 p-5 rounded-2xl shadow-sm flex flex-col justify-center text-white sm:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              <div className="flex items-center gap-2 text-brand-green50 mb-2 relative z-10">
                <Timer className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Durasi Proses</span>
              </div>
              
              <div className="relative z-10">
                {runningBatch ? (
                  <ProcessTimer 
                    startTs={runningBatch.startTs} 
                    pausedAt={runningBatch.pausedAt}
                    accumulatedMs={runningBatch.accumulatedMs || 0}
                    size="lg" 
                    className="text-white" 
                  />
                ) : (
                  <div className="text-xl font-bold text-white/50">--:--:--</div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-card-bg p-6 rounded-3xl shadow-sm border border-card-border flex flex-col h-[480px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-brand-green50 p-2 rounded-xl text-brand-green">
                  <Flame className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-brand-green700">Grafik Suhu Reaktor</h2>
              </div>
              <div className="flex gap-4 text-sm text-brand-sage">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-brand-green inline-block"></span>
                  Suhu Aktual
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-0">
              <RealtimeChart />
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-card-border text-xs">
              <p className="text-brand-sage">Total Sampel: <span className="font-semibold text-brand-green700">1.240 data</span></p>
              <p className="text-brand-sage">Puncak Tertinggi: <span className="font-semibold text-brand-green700">415.2 °C</span></p>
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-4 space-y-6">
          <BuzzerControl />
        </div>
      </div>
    </div>
  );
}
