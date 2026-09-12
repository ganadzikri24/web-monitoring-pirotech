"use client";

import { Thermometer, Timer, Activity, Flame, AlertTriangle } from "lucide-react";
import RealtimeChart from "@/components/RealtimeChart";
import BuzzerControl from "@/components/BuzzerControl";
import ProcessTimer from "@/components/overview/ProcessTimer";
import { useEffect, useState, useRef } from "react";
import { listenToMonitoring, MonitoringData, listenToConfig, ConfigData, getRunningFirebaseBatch } from "@/lib/firebaseUtils";
import { useRole } from "@/lib/useRole";
import { motion, AnimatePresence } from "framer-motion";
import type { Batch } from "@/lib/types";

export default function DashboardPage() {
  const [runningBatch, setRunningBatch] = useState<Batch | null>(null);
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [config, setConfig] = useState<ConfigData>({ overheat_limit: 50, warning_percent: 90 });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const loadBatch = async () => {
      const batch = await getRunningFirebaseBatch();
      setRunningBatch(batch);
    };
    loadBatch();
    
    const unsubscribeConfig = listenToConfig((conf) => {
      if (conf) setConfig(conf);
    });

    const unsubscribeData = listenToMonitoring((data) => {
      setMonitoringData(data);
    });

    return () => {
      unsubscribeConfig();
      unsubscribeData();
    };
  }, []);

  const tempC = monitoringData ? monitoringData.suhu : null;
  const isPaused = runningBatch?.status === "paused";
  const isDisconnected = monitoringData === null;
  
  // Warning Logic
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (tempC !== null && config) {
      const warningThreshold = (config.warning_percent / 100) * config.overheat_limit;
      if (tempC >= warningThreshold && tempC < config.overheat_limit) {
        setShowWarning(true);
        if (!hasNotifiedRef.current) {
          import("@/lib/firebaseUtils").then(({ pushNotification }) => {
            pushNotification(
              "Peringatan Suhu",
              `Suhu mencapai batas Warning (${tempC.toFixed(1)}°C)`,
              "warning"
            );
          });
          hasNotifiedRef.current = true;
        }
      } else if (tempC >= config.overheat_limit) {
        setShowWarning(false);
        if (!hasNotifiedRef.current) {
          import("@/lib/firebaseUtils").then(({ pushNotification }) => {
            pushNotification(
              "Suhu Kritis (Overheat)",
              `Suhu mencapai ambang kritis (${tempC.toFixed(1)}°C)!`,
              "critical"
            );
          });
          hasNotifiedRef.current = true;
        }
      } else {
        setShowWarning(false);
        hasNotifiedRef.current = false; // Reset if temp drops back to normal
      }
    } else {
      setShowWarning(false);
    }
  }, [tempC, config]);

  // Use status from Firebase if available, otherwise fallback
  const status = isDisconnected 
    ? "PERANGKAT MATI" 
    : isPaused 
      ? "PAUSED" 
      : (monitoringData?.status?.toUpperCase() || (runningBatch ? "PYROLYSIS" : "IDLE"));

  // Determine status styles
  let statusBadge = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"; // IDLE
  if (status === "PERANGKAT MATI") statusBadge = "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500";
  if (status === "HEATING") statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500";
  if (status === "PYROLYSIS") statusBadge = "bg-brand-green50 text-brand-green700 dark:bg-brand-green/20 dark:text-brand-green";
  if (status === "COOLING") statusBadge = "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
  if (status === "PAUSED") statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative">
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-bold"
          >
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Peringatan: Suhu mencapai batas Warning ({tempC?.toFixed(1)}°C)
          </motion.div>
        )}
      </AnimatePresence>

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
                  {tempC !== null ? tempC.toFixed(1) : "-"}
                </span>
                <span className="text-brand-sage font-medium mb-1">°C</span>
              </div>
              <p className="text-[11px] text-brand-green mt-2 font-medium flex items-center gap-1">
                {isDisconnected ? (
                  <span className="text-red-500">Koneksi Terputus</span>
                ) : tempC !== null && tempC >= config.overheat_limit ? (
                  <span className="text-red-500">Overheat!</span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                    Dalam ambang aman
                  </>
                )}
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
