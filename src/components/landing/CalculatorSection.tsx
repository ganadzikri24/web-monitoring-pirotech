"use client";

import { useState } from "react";
import { Droplet } from "lucide-react";
import WasteInputForm from "@/components/WasteInputForm";
import EstimationCard from "@/components/EstimationCard";
import { calculateEstimatedYield } from "@/lib/calculations";

export default function CalculatorSection() {
  const [weight, setWeight] = useState("10");
  const [type, setType] = useState("5"); // 5 is PP

  const numericWeight = parseFloat(weight) || 0;
  const { fuelLiters, residueKg, yieldRate } = calculateEstimatedYield(
    numericWeight,
    type
  );

  return (
    <div className="bg-brand-green700/80 rounded-3xl p-6 md:p-10 border border-white/20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Droplet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Kalkulator Estimasi BBM</h3>
          <p className="text-white/60 text-sm">Masukkan berat dan jenis plastik untuk melihat perkiraan hasil</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <WasteInputForm
            weight={weight}
            setWeight={setWeight}
            type={type}
            setType={setType}
          />
        </div>
        <div className="lg:col-span-7">
          <EstimationCard
            fuelLiters={fuelLiters}
            residueKg={residueKg}
          />
        </div>
      </div>
    </div>
  );
}
