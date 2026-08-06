export const PLASTIC_TYPES = [
  { id: '1', name: 'PET (Botol Minum)', code: '1', minYield: 0.30, maxYield: 0.40 },
  { id: '2', name: 'HDPE (Botol Susu, Galon)', code: '2', minYield: 0.55, maxYield: 0.65 },
  { id: '4', name: 'LDPE (Kantong Plastik)', code: '4', minYield: 0.50, maxYield: 0.60 },
  { id: '5', name: 'PP (Tutup Botol, Kemasan Makanan)', code: '5', minYield: 0.50, maxYield: 0.60 },
  { id: '6', name: 'PS (Styrofoam)', code: '6', minYield: 0.60, maxYield: 0.70 },
  { id: 'mix', name: 'Campuran', code: 'Mix', minYield: 0.40, maxYield: 0.55 },
];

export const FUEL_PRICE_PER_LITER = 6800;
export const COMBUSTION_EMISSION_FACTOR = 2.9; // kg CO2 per kg plastic
export const LANDFILL_EMISSION_FACTOR = 1.2; // kg CO2 per kg plastic
export const FUEL_DENSITY_MIN = 0.78; // kg/liter
export const FUEL_DENSITY_MAX = 0.85; // kg/liter
