"use client";

// Animasi ini menggunakan CSS Animation murni sebagai pengganti Framer Motion.
// Menunjukkan alur: botol plastik → masuk reaktor → keluar jadi tetesan BBM

export default function WasteToFuelAnimation() {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-green50 via-card-bg to-amber-50 dark:from-brand-green50/50 dark:via-card-bg dark:to-amber-50/30 border border-card-border">
      <style>{`
        @keyframes bottle-move-0 {
          0% { transform: translateX(0); opacity: 1; }
          70% { transform: translateX(150px); opacity: 1; }
          100% { transform: translateX(230px); opacity: 0; }
        }
        @keyframes bottle-move-1 {
          0% { transform: translateX(0); opacity: 1; }
          70% { transform: translateX(125px); opacity: 1; }
          100% { transform: translateX(205px); opacity: 0; }
        }
        @keyframes bottle-move-2 {
          0% { transform: translateX(0); opacity: 1; }
          70% { transform: translateX(100px); opacity: 1; }
          100% { transform: translateX(180px); opacity: 0; }
        }
        @keyframes fire-flicker {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fuel-drop {
          0% { cy: 165; opacity: 0; }
          30% { opacity: 1; }
          100% { cy: 230; opacity: 0; }
        }
        .bottle-0 { animation: bottle-move-0 4s ease-in-out infinite; }
        .bottle-1 { animation: bottle-move-1 4s 1.2s ease-in-out infinite; }
        .bottle-2 { animation: bottle-move-2 4s 2.4s ease-in-out infinite; }
        .fire-0 { animation: fire-flicker 1s ease-in-out infinite; }
        .fire-1 { animation: fire-flicker 1s 0.3s ease-in-out infinite; }
        .fire-2 { animation: fire-flicker 1s 0.6s ease-in-out infinite; }
        .drop-0 { animation: fuel-drop 2s 1s ease-in infinite; }
        .drop-1 { animation: fuel-drop 2s 1.7s ease-in infinite; }
        .drop-2 { animation: fuel-drop 2s 2.4s ease-in infinite; }
      `}</style>
      <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Reactor body */}
        <rect x="230" y="60" width="140" height="130" rx="10" fill="var(--brand-sage)" opacity="0.3" />
        <rect x="240" y="70" width="120" height="110" rx="6" fill="var(--card-bg)" stroke="var(--brand-sage)" strokeWidth="2" />
        <text x="300" y="130" textAnchor="middle" fill="var(--brand-sage)" fontSize="11" fontWeight="600">REAKTOR</text>

        {/* Condenser pipe */}
        <line x1="370" y1="125" x2="450" y2="125" stroke="var(--brand-sage)" strokeWidth="3" strokeLinecap="round" />
        <rect x="450" y="95" width="50" height="60" rx="6" fill="var(--card-bg)" stroke="var(--brand-sage)" strokeWidth="2" />
        <text x="475" y="130" textAnchor="middle" fill="var(--brand-sage)" fontSize="8" fontWeight="600">KONDENSOR</text>

        {/* Output pipe */}
        <line x1="475" y1="155" x2="475" y2="200" stroke="var(--brand-sage)" strokeWidth="2" />

        {/* Animated plastic bottles (input) — CSS animations */}
        <g className="bottle-0" style={{ transformOrigin: "42px 120px" }}>
          <rect x="30" y="110" width="12" height="20" rx="3" fill="#3B82F6" opacity="0.7" />
          <rect x="33" y="106" width="6" height="6" rx="2" fill="#3B82F6" opacity="0.5" />
        </g>
        <g className="bottle-1" style={{ transformOrigin: "67px 120px" }}>
          <rect x="55" y="110" width="12" height="20" rx="3" fill="#3B82F6" opacity="0.7" />
          <rect x="58" y="106" width="6" height="6" rx="2" fill="#3B82F6" opacity="0.5" />
        </g>
        <g className="bottle-2" style={{ transformOrigin: "92px 120px" }}>
          <rect x="80" y="110" width="12" height="20" rx="3" fill="#3B82F6" opacity="0.7" />
          <rect x="83" y="106" width="6" height="6" rx="2" fill="#3B82F6" opacity="0.5" />
        </g>

        {/* Animated fire under reactor — CSS animations */}
        <circle className="fire-0" cx="270" cy="195" r="6" fill="#F59E0B" />
        <circle className="fire-1" cx="300" cy="195" r="6" fill="#F59E0B" />
        <circle className="fire-2" cx="330" cy="195" r="6" fill="#F59E0B" />

        {/* Animated fuel drops (output) — CSS animations */}
        <circle className="drop-0" cx="475" cy="165" r="4" fill="#D97706" />
        <circle className="drop-1" cx="475" cy="165" r="4" fill="#D97706" />
        <circle className="drop-2" cx="475" cy="165" r="4" fill="#D97706" />

        {/* Collection container */}
        <rect x="460" y="210" width="30" height="25" rx="3" fill="var(--card-bg)" stroke="#D97706" strokeWidth="2" />

        {/* Labels */}
        <text x="80" y="160" textAnchor="middle" fill="var(--brand-sage)" fontSize="9" fontWeight="500">Sampah Plastik</text>
        <text x="475" y="248" textAnchor="middle" fill="#D97706" fontSize="9" fontWeight="600">BBM Cair</text>
      </svg>
    </div>
  );
}
