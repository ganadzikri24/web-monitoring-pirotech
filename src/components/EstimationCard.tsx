"use client";

import { Droplet, Flame, Percent, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import FillingJerrycanAnimation from "./overview/FillingJerrycanAnimation";

interface EstimationCardProps {
  fuelLiters: number;
  residueKg: number;
  yieldRate: number;
}

export default function EstimationCard({ fuelLiters, residueKg, yieldRate }: EstimationCardProps) {
  const hasData = fuelLiters > 0;

  return (
    <div className="bg-brand-green700 p-8 rounded-2xl shadow-lg text-white h-full flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Perkiraan Hasil Pengolahan</h2>
      </div>
      
      <div className="flex-1 grid sm:grid-cols-2 gap-6 relative z-10">
        {/* BBM Estimation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-brand-green50 mb-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Droplet className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Estimasi BBM Cair</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <motion.span 
                key={fuelLiters}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold tabular-nums tracking-tight"
              >
                {fuelLiters.toFixed(2)}
              </motion.span>
              <span className="text-brand-green50 font-medium">liter</span>
            </div>
          </div>

          <div className="mt-auto flex justify-center items-end min-h-28">
            <FillingJerrycanAnimation totalLiters={fuelLiters} />
          </div>
        </div>

        {/* Other Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 text-brand-green50 mb-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Flame className="w-4 h-4 text-orange-300" />
              </div>
              <span className="font-semibold text-sm">Estimasi Residu Padat</span>
            </div>
            <div className="flex items-baseline gap-2">
              <motion.span 
                key={residueKg}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tabular-nums"
              >
                {residueKg.toFixed(2)}
              </motion.span>
              <span className="text-brand-green50 text-sm">kg</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden group">
            <div className="flex items-center gap-3 text-brand-green50 mb-3 relative z-10">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Percent className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Yield Rate (Efisiensi)</span>
            </div>
            
            <div className="flex items-baseline gap-2 relative z-10">
              <motion.span 
                key={yieldRate}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tabular-nums"
              >
                {yieldRate.toFixed(1)}
              </motion.span>
              <span className="text-brand-green50 text-sm">%</span>
            </div>

            {/* Circular progress background effect */}
            {hasData && (
              <svg className="absolute -right-4 -bottom-4 w-28 h-28 opacity-20 transform -rotate-90 group-hover:opacity-30 transition-opacity">
                <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="8" className="text-brand-green700" />
                <motion.circle 
                  cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="8" 
                  className="text-white"
                  strokeDasharray="301.6"
                  initial={{ strokeDashoffset: 301.6 }}
                  animate={{ strokeDashoffset: 301.6 - (301.6 * yieldRate) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
