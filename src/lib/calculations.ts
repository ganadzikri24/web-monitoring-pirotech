import { 
  PLASTIC_TYPES, 
  FUEL_PRICE_PER_LITER, 
  COMBUSTION_EMISSION_FACTOR,
  FUEL_DENSITY_MIN,
  FUEL_DENSITY_MAX
} from "@/config/pirolysis-constants";

export const calculateEstimatedYield = (weightKg: number, plasticTypeId: string) => {
  const plastic = PLASTIC_TYPES.find(p => p.id === plasticTypeId) || PLASTIC_TYPES.find(p => p.id === 'mix');
  if (!plastic) return { fuelLiters: 0, residueKg: 0, yieldRate: 0 };

  const avgYieldRate = (plastic.minYield + plastic.maxYield) / 2;
  const avgDensity = (FUEL_DENSITY_MIN + FUEL_DENSITY_MAX) / 2;
  
  // Yield is in percentage of weight.
  // Weight of fuel (kg) = weightKg * avgYieldRate
  // Volume of fuel (liters) = Weight of fuel / density
  const fuelWeightKg = weightKg * avgYieldRate;
  const fuelLiters = fuelWeightKg / avgDensity;
  
  // Residue is the remaining weight (assuming some loss to gas, residue is approx 10-15%)
  const residueKg = weightKg * 0.1; // simplified

  return {
    fuelLiters: Number(fuelLiters.toFixed(2)),
    residueKg: Number(residueKg.toFixed(2)),
    yieldRate: Number((avgYieldRate * 100).toFixed(1))
  };
};

export const calculateEconomicValue = (fuelLiters: number) => {
  return fuelLiters * FUEL_PRICE_PER_LITER;
};

export const calculateEmissionsSaved = (weightKg: number) => {
  return Number((weightKg * COMBUSTION_EMISSION_FACTOR).toFixed(2));
};
