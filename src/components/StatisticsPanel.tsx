"use client";

import { useEffect, useState } from "react";
import { BarChart3, Banknote, Leaf, Trash2, X, ChevronRight, Activity, Beaker } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "./landing/AnimatedCounter";
import { getBatches } from "@/lib/mockData";
import { calculateEconomicValue, calculateEmissionsSaved } from "@/lib/calculations";
import type { Batch } from "@/lib/types";

export default function StatisticsPanel() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Optional: tracking which card opened it, but we can just show the same full history for all
  const [modalTitle, setModalTitle] = useState("Riwayat Pengolahan");

  useEffect(() => {
    const loadStats = async () => {
      // In production, fetch from Firebase where status === "completed"
      if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
        const allBatches = await getBatches();
        setBatches(allBatches.filter((b) => b.status === "completed"));
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 bg-card-bg rounded-2xl border border-card-border" />;
  }

  // Calculations
  const totalWaste = batches.reduce((sum, b) => sum + b.wasteKg, 0);
  const totalFuel = batches.reduce((sum, b) => sum + (b.fuelLiters || 0), 0);
  
  const avgYield = totalWaste > 0 ? (totalFuel / totalWaste) : 0;
  const economicValue = calculateEconomicValue(totalFuel);
  const emissionsSaved = calculateEmissionsSaved(totalWaste);

  const openModal = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Highlight Card */}
        <div className="bg-brand-green700 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sm">Rata-Rata Hasil</span>
            </div>
            <button onClick={() => openModal("Detail Hasil")} className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white group-hover:translate-x-1 duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold tabular-nums">
                <AnimatedCounter target={avgYield} decimals={2} />
              </span>
              <span className="text-brand-green50 text-sm font-medium">liter/kg</span>
            </div>
            <p className="text-xs text-brand-green50/80 leading-relaxed">
              Rata-rata BBM yang dihasilkan (liter per kg plastik) dari seluruh pengolahan.
            </p>
          </div>
        </div>

        {/* Outline Cards */}
        <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-brand-sage">Dampak Lingkungan</span>
            </div>
            <button onClick={() => openModal("Detail Dampak Lingkungan")} className="p-1 rounded-lg hover:bg-card-border transition-colors text-brand-sage/50 hover:text-emerald-600 group-hover:translate-x-1 duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-500 tabular-nums">
                <AnimatedCounter target={emissionsSaved} decimals={1} />
              </span>
              <span className="text-brand-sage text-sm font-medium">kg CO₂ dihemat</span>
            </div>
            <p className="text-[11px] text-brand-sage/60 mb-2">Vs pembakaran biasa (≈2.9 kg CO₂/kg plastik)</p>
            <p className="text-xs text-brand-sage leading-relaxed">
              Fokus menghemat emisi CO₂ dibandingkan dengan pembakaran sampah plastik biasa.
            </p>
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-green50 text-brand-green p-2.5 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-brand-sage">Total Sampah Diolah</span>
            </div>
            <button onClick={() => openModal("Detail Sampah Diolah")} className="p-1 rounded-lg hover:bg-card-border transition-colors text-brand-sage/50 hover:text-brand-green group-hover:translate-x-1 duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-brand-green700 tabular-nums">
                <AnimatedCounter target={totalWaste} decimals={1} />
              </span>
              <span className="text-brand-sage text-sm font-medium">kg</span>
            </div>
            <p className="text-xs text-brand-sage leading-relaxed mt-4">
              Akumulasi seluruh sampah plastik yang telah diproses.
            </p>
          </div>
        </div>
      </div>

      {/* Drill-down Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card-bg w-full max-w-2xl rounded-2xl shadow-2xl border border-card-border overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-card-border flex items-center justify-between bg-brand-green50 dark:bg-brand-green/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-green rounded-lg text-white">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-brand-green700 text-lg">{modalTitle}</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-card-border text-brand-sage hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  {batches.length === 0 ? (
                    <div className="text-center py-10 text-brand-sage">
                      Belum ada data pengolahan yang selesai.
                    </div>
                  ) : (
                    batches.map((batch, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-card-border bg-input-bg gap-4">
                        <div>
                          <div className="text-sm font-bold text-foreground mb-1">
                            {new Date(batch.startTs).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </div>
                          <div className="text-xs text-brand-sage flex items-center gap-2">
                            <span>Jenis: {batch.plasticType === 'mix' ? 'Campuran' : `Tipe ${batch.plasticType}`}</span>
                            <span className="w-1 h-1 rounded-full bg-card-border" />
                            <span>Durasi: {batch.accumulatedMs ? Math.round(batch.accumulatedMs / 60000) : 0} menit</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="text-right">
                            <div className="text-xs text-brand-sage mb-0.5">Input</div>
                            <div className="text-sm font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1 justify-end">
                              <Trash2 className="w-3 h-3" /> {batch.wasteKg} kg
                            </div>
                          </div>
                          <div className="w-px bg-card-border" />
                          <div className="text-right">
                            <div className="text-xs text-brand-sage mb-0.5">Output BBM</div>
                            <div className="text-sm font-bold text-brand-green flex items-center gap-1 justify-end">
                              <Beaker className="w-3 h-3" /> {batch.fuelLiters?.toFixed(1) || 0} L
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
