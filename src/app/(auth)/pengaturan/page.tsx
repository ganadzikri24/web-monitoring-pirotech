"use client";

import ThresholdConfig from "@/components/ThresholdConfig";
import NotificationPanel from "@/components/NotificationPanel";

export default function PengaturanPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-brand-sage leading-relaxed">
          Konfigurasi ambang batas peringatan dan preferensi notifikasi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ThresholdConfig />
        </div>
        <div className="space-y-6">
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}
