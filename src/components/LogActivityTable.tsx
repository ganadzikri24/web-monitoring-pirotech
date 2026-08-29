"use client";

import { Download, Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import SessionDetailModal from "./SessionDetailModal";

export default function LogActivityTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const logRef = ref(db, 'log_activity');
        const snapshot = await get(logRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const parsedBatches = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          // Urutkan berdasarkan tanggal terbaru (karena format YYYY-MM-DD aman di-sort string)
          parsedBatches.sort((a, b) => {
             const tA = a.tanggal || "";
             const tB = b.tanggal || "";
             return tB.localeCompare(tA);
          });
          setBatches(parsedBatches);
        } else {
          setBatches([]);
        }
      } catch (err) {
        console.error("Error loading log_activity:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBatches();
  }, []);

  // Filter based on search (simplified search by status or type)
  const filteredBatches = batches.filter(batch => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const type = batch.jenis_plastik || "";
    return type.toLowerCase().includes(term) || "selesai".includes(term);
  });

  const formatTanggal = (tanggalStr?: string) => {
    if (!tanggalStr) return "-";
    // Hapus microsecond jika ada
    return tanggalStr.split('.')[0];
  };

  return (
    <>
      <div className="bg-card-bg rounded-3xl shadow-sm border border-card-border overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-card-border flex flex-col md:flex-row gap-4 justify-between items-center bg-input-bg/30">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
              <input 
                type="text" 
                placeholder="Cari status / jenis plastik..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-input-border bg-card-bg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
                <input 
                  type="date" 
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-input-border bg-card-bg focus:outline-none focus:border-brand-green transition-colors text-sm text-brand-sage"
                />
              </div>
              <span className="text-brand-sage text-sm">-</span>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-sage" />
                <input 
                  type="date" 
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-input-border bg-card-bg focus:outline-none focus:border-brand-green transition-colors text-sm text-brand-sage"
                />
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-brand-green hover:bg-brand-green700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm w-full md:w-auto justify-center">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-input-bg/50 text-brand-green700 text-sm">
                <th className="px-6 py-4 font-semibold border-b border-card-border">Waktu Mulai</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Berat Sampah (kg)</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Jenis Plastik</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Hasil BBM (liter)</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Suhu Avg/Max (°C)</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-card-border">Durasi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-sage">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-brand-green">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedLogId(row.id)}
                    className="hover:bg-input-bg/50 cursor-pointer transition-colors border-b border-card-border/50 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{formatTanggal(row.tanggal)}</td>
                    <td className="px-6 py-4">{row.berat_kg ?? '-'}</td>
                    <td className="px-6 py-4 uppercase">
                      {row.jenis_plastik === 'mix' ? 'Campuran' : (row.jenis_plastik || '-')}
                    </td>
                    <td className="px-6 py-4 text-brand-green700 font-bold">
                      {row.bbm_liter ? Number(row.bbm_liter).toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-green50 text-brand-green">
                        Selesai
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{row.durasi ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-sage">
                    Belum ada data aktivitas yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLogId && (
        <SessionDetailModal 
          logId={selectedLogId} 
          onClose={() => setSelectedLogId(null)} 
        />
      )}
    </>
  );
}
