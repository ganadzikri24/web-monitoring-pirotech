"use client";

import { AlertTriangle, Info, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

export default function PanduanPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeIn} className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-green700 mb-4 tracking-tight">
            Panduan Penggunaan{" "}
            <span className="text-brand-green">Alat PiRoTech</span>
          </h1>
          <p className="text-brand-sage text-lg leading-relaxed max-w-2xl mx-auto">
            Halaman ini menjelaskan aturan bahan, langkah penggunaan alat, dan
            pertanyaan umum, dengan bahasa sederhana untuk publik.
          </p>
        </motion.div>

        {/* Pemberitahuan Penting */}
        <motion.div
          {...fadeIn}
          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 md:p-8 mb-10 shadow-sm"
        >
          <div className="flex flex-col gap-8">
            {/* Image full width */}
            <div className="w-full bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 p-2 sm:p-4">
              <img 
                src="/panduan/penting.webp" 
                alt="Larangan plastik metalized"
                className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-sm mx-auto bg-white dark:bg-card-bg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="text-red-500/50 text-sm font-medium py-10 text-center w-full">Foto akan ditambahkan</div>';
                }}
              />
            </div>

            <div className="w-full">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                    Pemberitahuan Penting
                  </h2>
                  <p className="text-red-600 dark:text-red-300 font-medium text-lg leading-relaxed">
                    Dilarang menggunakan plastik/kemasan yang ada lapisan{" "}
                    <span className="italic">metalized film</span> atau aluminium
                    foil di dalamnya.
                  </p>
                  <p className="text-red-500 dark:text-red-400 mt-2 text-sm md:text-base">
                    Contoh: bungkus kopi instan, sachet bumbu, kemasan keripik yang
                    mengkilap di bagian dalam.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8 bg-white dark:bg-card-bg p-6 rounded-2xl border border-red-100 dark:border-red-500/10 shadow-sm">
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4 text-lg">
                    <XCircle className="w-6 h-6" /> Mengapa Dilarang?
                  </h3>
                  <ul className="list-disc list-outside ml-6 text-red-600 dark:text-red-300 space-y-2 text-base">
                    <li>Tidak menghasilkan minyak, hanya jadi limbah padat.</li>
                    <li>Menimbulkan kerak sangat keras & berisiko menyumbat.</li>
                    <li>Menghambat perpindahan panas (proses jadi tidak efisien).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-brand-green700 flex items-center gap-2 mb-4 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" /> Contoh yang Aman:
                  </h3>
                  <ul className="list-disc list-outside ml-6 text-brand-sage space-y-2 text-base">
                    <li>Botol PET, HDPE, PP yang bersih & kering.</li>
                    <li>
                      Plastik rumah tangga tanpa lapisan metal (bagian dalam tidak
                      mengkilap).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skema Alat */}
        <motion.div {...fadeIn} className="mb-10">
          <h2 className="text-2xl font-bold text-brand-green700 mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-brand-green" />
            Skema Alat
          </h2>
          <div className="bg-card-bg p-6 md:p-8 rounded-2xl border border-card-border shadow-sm grid lg:grid-cols-2 gap-8 items-center">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] w-full bg-brand-green50 dark:bg-brand-green/10 rounded-xl overflow-hidden border border-brand-green/20">
              <img 
                src="/panduan/skema.webp" 
                alt="Skema Alat Pirolisis"
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center text-brand-green/50 text-sm font-medium z-0">
                Foto akan ditambahkan
              </div>
            </div>

            <div>
              <ol className="list-decimal list-inside space-y-4 text-brand-sage">
                {[
                  ["Reaktor Utama", "tabung silinder besar tempat plastik dipanaskan."],
                  ["Tutup Reaktor Kerucut", "penutup berbentuk kerucut dengan lubang keluarnya uap."],
                  ["Klem Pengunci", "mengunci tutup ke reaktor agar kedap udara."],
                  ["Pipa Penyalur Uap", "menghubungkan tutup reaktor dengan kondensor."],
                  ["Kondensor", "pendingin (koil di dalam) yang mengubah uap menjadi minyak cair."],
                  ["Keran/Saluran Keluaran Minyak", "ujung kondensor tempat minyak pirolisis keluar."],
                  ["Sumber Pemanas (Kompor)", "memberikan panas di bawah reaktor utama."],
                  ["Rangka Penyangga", "struktur yang menopang reaktor dan kondensor."],
                ].map(([title, desc], i) => (
                  <li key={i}>
                    <strong className="text-brand-green700">{title}</strong> — {desc}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Cara Pakai Aman */}
        <motion.div {...fadeIn} className="mb-10">
          <h2 className="text-2xl font-bold text-brand-green700 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-brand-green" />
            Cara Pakai Aman
          </h2>
          <div className="bg-card-bg p-6 md:p-8 rounded-2xl border border-card-border shadow-sm flex flex-col gap-10 items-center">
            
            {/* Image full width */}
            <div className="w-full bg-brand-green50 dark:bg-brand-green/10 rounded-2xl border border-brand-green/20 p-2 sm:p-4">
              <img 
                src="/panduan/aman.webp" 
                alt="Ilustrasi Cara Pakai Aman"
                className="w-full h-auto max-h-[600px] object-contain rounded-xl shadow-sm mx-auto bg-white dark:bg-card-bg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="text-brand-green/50 text-sm font-medium py-16 text-center w-full">Foto akan ditambahkan</div>';
                }}
              />
            </div>

            <div className="w-full space-y-10">
              <ol className="list-decimal list-inside space-y-4 text-brand-sage text-lg">
                {[
                  ["Sortir & bersihkan", " plastik, pastikan kering."],
                  ["Masukkan plastik", " ke reaktor sampai batas aman."],
                  ["Tutup & kunci", " reaktor, cek semua sambungan rapat."],
                  ["Siapkan penampung", " minyak di ujung kondensor."],
                  ["Panaskan bertahap", " dan amati alat ukur lokal (termometer/manometer bila tersedia)."],
                  ["Selesai", " → matikan pemanas, biarkan dingin, baru buka & bersihkan residu."],
                ].map(([bold, rest], i) => (
                  <li key={i} className="pl-2">
                    <strong className="text-brand-green700">{bold}</strong>
                    {rest}
                  </li>
                ))}
              </ol>

              <div className="grid md:grid-cols-2 gap-8 p-8 bg-brand-green50 dark:bg-brand-green900/20 rounded-2xl border border-brand-green/10">
                <div>
                  <h4 className="font-bold text-brand-green700 mb-4 text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" /> Lakukan:
                  </h4>
                  <ul className="list-disc list-outside ml-6 text-brand-sage space-y-3 text-base">
                    <li>Gunakan sarung tangan & masker, pastikan area berventilasi baik.</li>
                    <li>Awali pemanasan secara perlahan, catat durasi & hasil.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-600 dark:text-red-400 mb-4 text-xl flex items-center gap-2">
                    <XCircle className="w-6 h-6" /> Hindari:
                  </h4>
                  <ul className="list-disc list-outside ml-6 text-red-600 dark:text-red-400 space-y-3 text-base">
                    <li>Membuka tutup saat alat masih dalam keadaan panas/bertekanan.</li>
                    <li>Memasukkan kemasan berlapis aluminium atau bahan yang basah.</li>
                    <li>Menjalankan kondensor tanpa pendinginan (jika tipe water-cooled).</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div {...fadeIn} className="mb-14">
          <h2 className="text-2xl font-bold text-brand-green700 mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-brand-green" />
            FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Apakah semua plastik bisa?",
                a: "Tidak. Hindari yang berlapis aluminium (mengkilap di dalam). PET/HDPE/PP yang bersih & kering umumnya aman.",
              },
              {
                q: "Apakah berbahaya?",
                a: "Ikuti prosedur (kedap, ventilasi baik, pemanasan bertahap) dan gunakan APD dasar. Jangan tinggalkan alat tanpa pengawasan.",
              },
              {
                q: "Butuh bantuan?",
                a: "Kirim pertanyaan melalui halaman Hubungi Kami.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-brand-green700 mb-2">
                  Q: {faq.q}
                </h4>
                <p className="text-brand-sage text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeIn}
          className="bg-brand-green700 rounded-2xl p-8 md:p-10 text-center text-white shadow-lg"
        >
          <h3 className="text-2xl font-extrabold mb-2 tracking-tight">
            Punya pertanyaan sebelum mencoba?
          </h3>
          <p className="text-white/70 mb-6">Tim kami siap bantu.</p>
          <Link
            href="/hubungi"
            className="inline-flex items-center gap-2 bg-white text-brand-green700 px-8 py-3 rounded-xl font-bold hover:bg-brand-green50 transition-colors shadow-sm"
          >
            Hubungi Kami <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
