"use client";

import { Scale, Info, Check } from "lucide-react";
import WasteScaleAnimation from "./overview/WasteScaleAnimation";
import PlasticTypeIcon from "./overview/PlasticTypeIcon";

interface WasteInputFormProps {
  weight: string;
  setWeight: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  disabled?: boolean;
}

const PLASTIC_TYPES = [
  { id: "1", name: "PET", desc: "Botol Minum", image: "/plastics/pet.webp" },
  { id: "2", name: "HDPE", desc: "Botol Susu", image: "/plastics/hdpe.webp" },
  { id: "4", name: "LDPE", desc: "Kantong Plastik", image: "/plastics/ldpe.webp" },
  { id: "5", name: "PP", desc: "Tutup Botol", image: "/plastics/pp.webp" },
  { id: "6", name: "PS", desc: "Styrofoam", image: "/plastics/ps.webp" },
  { id: "mix", name: "Campuran", desc: "Mixed Waste", image: "/plastics/mix.webp" },
];

export default function WasteInputForm({ weight, setWeight, type, setType, disabled = false }: WasteInputFormProps) {
  const numericWeight = parseFloat(weight) || 0;

  return (
    <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-brand-green" />
          <h2 className="text-xl font-bold text-brand-green700">Input Sampah</h2>
        </div>
        <p className="text-brand-sage text-sm mb-6 leading-relaxed">
          Masukkan berat dan jenis sampah plastik yang akan diolah untuk melihat simulasi hasil.
        </p>

        <form className="space-y-6">
          {/* Berat Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-green700">Berat Sampah (kg)</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 15"
              disabled={disabled}
              className="w-full px-4 py-3.5 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all disabled:opacity-50"
            />
          </div>

          {/* Visual Picker Jenis Plastik */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-brand-green700 flex items-center justify-between">
              <span>Jenis Plastik</span>
              {type && (
                <span className="text-xs font-normal text-brand-green bg-brand-green50 px-2 py-0.5 rounded-md">
                  {PLASTIC_TYPES.find(t => t.id === type)?.name} Terpilih
                </span>
              )}
            </label>
            
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
              {PLASTIC_TYPES.map((pt) => {
                const isSelected = type === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setType(pt.id)}
                    className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden group
                      ${isSelected 
                        ? "border-brand-green bg-brand-green50 dark:bg-brand-green/10 shadow-sm" 
                        : "border-card-border bg-app-bg hover:border-brand-green/30 hover:bg-brand-sage50"
                      }
                    `}
                  >
                    {/* Checkmark badge if selected */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-green text-white rounded-full flex items-center justify-center shadow-sm z-10">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="w-full aspect-[4/3] rounded-lg mb-2 relative overflow-hidden bg-card-bg flex items-center justify-center border border-card-border/50 group-hover:border-brand-green/20 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 z-0" />
                      
                      {/* Image render */}
                      <img 
                        src={pt.image} 
                        alt={pt.name}
                        loading="lazy"
                        decoding="async" 
                        className="absolute inset-0 w-full h-full object-cover z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300 transform-gpu"
                      />
                      
                      {/* Fallback Icon */}
                      <div className="absolute opacity-0">
                        <PlasticTypeIcon typeId={pt.id} className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <span className={`text-xs font-bold ${isSelected ? "text-brand-green700" : "text-foreground"}`}>
                      {pt.name}
                    </span>
                    <span className="text-[10px] text-brand-sage leading-tight mt-0.5">
                      {pt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {type === "mix" && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1 mt-2 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Yield rate campuran adalah rata-rata estimasi karena komposisi spesifik tidak diketahui.
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8 pt-6 border-t border-card-border">
        <h3 className="text-xs font-bold text-brand-sage uppercase tracking-wider mb-4">Simulasi Visual Kapasitas</h3>
        <WasteScaleAnimation weightKg={numericWeight} maxWeight={50} />
      </div>
    </div>
  );
}
