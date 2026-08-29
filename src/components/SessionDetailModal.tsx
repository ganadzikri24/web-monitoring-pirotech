"use client";

import { useState, useEffect } from "react";
import { X, Download, LineChart as ChartIcon, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { auth } from "@/lib/firebase";

interface SessionDetailModalProps {
  logId: string;
  onClose: () => void;
}

export default function SessionDetailModal({ logId, onClose }: SessionDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get ID token from current user
        const user = auth.currentUser;
        let idToken = "";
        if (user) {
          idToken = await user.getIdToken();
        } else if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "true") {
          throw new Error("User not authenticated");
        }

        const res = await fetch(`/api/sessions/${encodeURIComponent(logId)}/data`, {
          headers: {
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch data (${res.status})`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Error fetching session detail:", err);
        setError(err.message || "Gagal memuat data histori.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logId]);

  const handleExportCSV = () => {
    if (!data || !data.raw || data.raw.length === 0) return;

    // Build CSV string
    const headers = ["timestamp_key", "time_wib", "temperature_c", "pressure_bar", "status", "device_id"];
    const rows = data.raw.map((r: any) => [
      r.key,
      r.timeLabel,
      r.temperature_c,
      r.pressure_bar !== null ? r.pressure_bar : "",
      r.status,
      r.device_id
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sensor_data_${logId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card-bg w-full max-w-5xl rounded-3xl shadow-xl border border-card-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border bg-input-bg/30">
          <div className="flex items-center gap-3">
            <div className="bg-brand-green50 p-2 rounded-xl text-brand-green">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-green700">Detail Sesi Pirolisis</h2>
              <p className="text-sm text-brand-sage">ID Sesi: {logId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-input-border text-brand-sage hover:text-brand-green700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-green">
              <svg className="animate-spin w-8 h-8 mb-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="font-medium">Memuat data histori...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button onClick={onClose} className="text-brand-green font-medium hover:underline">Tutup</button>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-input-bg/50 p-4 rounded-2xl border border-card-border">
                  <p className="text-xs text-brand-sage uppercase tracking-wider mb-1">Tanggal</p>
                  <p className="font-semibold text-foreground">{data.session.tanggal.split(" ")[0]}</p>
                </div>
                <div className="bg-input-bg/50 p-4 rounded-2xl border border-card-border">
                  <p className="text-xs text-brand-sage uppercase tracking-wider mb-1">Durasi</p>
                  <p className="font-semibold text-foreground">{data.session.durasi}</p>
                </div>
                <div className="bg-input-bg/50 p-4 rounded-2xl border border-card-border">
                  <p className="text-xs text-brand-sage uppercase tracking-wider mb-1">BBM Dihasilkan</p>
                  <p className="font-semibold text-brand-green700">{data.session.bbm_liter ?? "-"} L</p>
                </div>
                <div className="bg-input-bg/50 p-4 rounded-2xl border border-card-border">
                  <p className="text-xs text-brand-sage uppercase tracking-wider mb-1">Total Sampel Data</p>
                  <p className="font-semibold text-foreground">{data.totalReadings}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-4 h-[400px]">
                {data.downsampled && data.downsampled.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.downsampled} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                      <XAxis dataKey="minuteLabel" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `${v}°C`} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: '1px solid var(--card-border)',
                          backgroundColor: 'var(--card-bg)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Line type="monotone" dataKey="avgTemp" name="Suhu Rata-rata" stroke="var(--brand-green)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-brand-sage">
                    <p>Tidak ada data sensor untuk sesi ini.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-card-border bg-input-bg/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-brand-sage hover:bg-input-border transition-colors text-sm"
          >
            Tutup
          </button>
          <button
            onClick={handleExportCSV}
            disabled={loading || !data || data.totalReadings === 0}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export Raw CSV
          </button>
        </div>
      </div>
    </div>
  );
}
