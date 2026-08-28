"use client";

import { useMemo } from "react";
import { Droplet, Flame, Percent, CheckCircle } from "lucide-react";

interface EstimationCardProps {
  fuelLiters: number;
  residueKg: number;
}

export default function EstimationCard({ fuelLiters, residueKg }: EstimationCardProps) {
  const hasData = fuelLiters > 0;

  // Memoize the bottle display to avoid recalculating on every render
  const bottleDisplay = useMemo(() => {
    if (fuelLiters <= 0 || isNaN(fuelLiters)) {
      return (
        <div className="flex items-center justify-center h-28 text-brand-sage/40 text-sm font-medium">
          Menunggu input...
        </div>
      );
    }
    const bottleCapacity = 5;
    const fullBottles = Math.floor(fuelLiters / bottleCapacity);
    const remainder = fuelLiters % bottleCapacity;
    const totalBottles = Math.min(fullBottles + (remainder > 0 ? 1 : 0), 10); // cap at 10 bottles
    const remainderPercent = (remainder / bottleCapacity) * 100;

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-end justify-center gap-2 max-w-full">
          {Array.from({ length: totalBottles }).map((_, i) => {
            const isLast = i === totalBottles - 1 && remainder > 0;
            const fill = isLast ? remainderPercent : 100;
            const clampedFill = Math.max(5, Math.min(100, fill));

            return (
              <div key={i} className="w-16 h-24 relative flex items-end justify-center shrink-0">
                {/* Container back */}
                <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full text-white/30">
                  <path
                    d="M20,30 L30,30 L30,10 C30,4 34,0 40,0 L60,0 C66,0 70,4 70,10 L70,30 L80,30 C91,30 100,39 100,50 L100,120 C100,131 91,140 80,140 L20,140 C9,140 0,131 0,120 L0,50 C0,39 9,30 20,30 Z M40,30 L60,30 L60,15 L40,15 L40,30 Z M15,50 L15,120 C15,123 17,125 20,125 L80,125 C83,125 85,123 85,120 L85,50 C85,47 83,45 80,45 L20,45 C17,45 15,47 15,50 Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Liquid fill — pure CSS transition instead of Framer Motion */}
                <div className="absolute bottom-[10%] w-[70%] left-[15%] h-[57%] rounded overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 w-full origin-bottom transition-[height] duration-700 ease-out"
                    style={{ height: `${clampedFill}%`, backgroundColor: "#facc15" }}
                  >
                    {/* Static wave top */}
                    <div
                      className="absolute top-0 left-0 w-full h-1.5 rounded-t-full"
                      style={{ backgroundColor: "#facc15CC" }}
                    />
                  </div>
                </div>

                {/* Container front outline */}
                <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full text-white">
                  <path
                    d="M20,30 L30,30 L30,10 C30,4 34,0 40,0 L60,0 C66,0 70,4 70,10 L70,30 L80,30 C91,30 100,39 100,50 L100,120 C100,131 91,140 80,140 L20,140 C9,140 0,131 0,120 L0,50 C0,39 9,30 20,30 Z M40,30 L60,30 L60,15 L40,15 L40,30 Z M15,50 L15,120 C15,123 17,125 20,125 L80,125 C83,125 85,123 85,120 L85,50 C85,47 83,45 80,45 L20,45 C17,45 15,47 15,50 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                </svg>
              </div>
            );
          })}
        </div>
        <p className="text-xs font-bold text-white tabular-nums">
          {(fuelLiters / bottleCapacity).toFixed(1)} botol × {bottleCapacity}L
        </p>
      </div>
    );
  }, [fuelLiters]);

  return (
    <div className="bg-brand-green700 p-8 rounded-2xl shadow-lg text-white h-full flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Perkiraan Hasil Pengolahan</h2>
      </div>
      
      <div className="flex-1 grid sm:grid-cols-2 gap-6 relative z-10">
        {/* BBM Estimation */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-brand-green50 mb-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Droplet className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Estimasi BBM Cair</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold tabular-nums tracking-tight">
                {fuelLiters.toFixed(2)}
              </span>
              <span className="text-brand-green50 font-medium">liter</span>
            </div>
          </div>

          <div className="mt-auto flex justify-center items-end min-h-28">
            {bottleDisplay}
          </div>
        </div>

        {/* Other Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 text-brand-green50 mb-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Flame className="w-4 h-4 text-orange-300" />
              </div>
              <span className="font-semibold text-sm">Estimasi Residu Padat</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums">
                {residueKg.toFixed(2)}
              </span>
              <span className="text-brand-green50 text-sm">kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
