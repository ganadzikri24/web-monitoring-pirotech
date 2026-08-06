import LogActivityTable from "@/components/LogActivityTable";

export default function LogActivityPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green700 mb-2">Log Aktivitas Pengolahan</h1>
        <p className="text-brand-sage">Riwayat lengkap setiap sesi pengolahan sampah plastik.</p>
      </div>

      <LogActivityTable />
    </div>
  );
}
