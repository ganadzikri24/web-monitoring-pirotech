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
          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 mb-10 shadow-sm"
        >
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
                Pemberitahuan Penting
              </h2>
              <p className="text-red-600 dark:text-red-300 font-medium">
                Dilarang menggunakan plastik/kemasan yang ada lapisan{" "}
                <span className="italic">metalized film</span> atau aluminium
                foil di dalamnya.
              </p>
              <p className="text-red-500 dark:text-red-400 mt-1 text-sm">
                Contoh: bungkus kopi instan, sachet bumbu, kemasan keripik yang
                mengkilap di bagian dalam.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-6 pl-0 md:pl-11">
            <div>
              <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5" /> Mengapa Dilarang?
              </h3>
              <ul className="list-disc list-outside ml-5 text-red-600 dark:text-red-300 text-sm space-y-1.5">
                <li>Tidak menghasilkan minyak, hanya jadi limbah padat.</li>
                <li>Menimbulkan kerak sangat keras & berisiko menyumbat.</li>
                <li>Menghambat perpindahan panas (proses jadi tidak efisien).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-brand-green700 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green" /> Contoh yang Aman:
              </h3>
              <ul className="list-disc list-outside ml-5 text-brand-sage text-sm space-y-1.5">
                <li>Botol PET, HDPE, PP yang bersih & kering.</li>
                <li>
                  Plastik rumah tangga tanpa lapisan metal (bagian dalam tidak
                  mengkilap).
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Skema Alat */}
        <motion.div {...fadeIn} className="mb-10">
          <h2 className="text-2xl font-bold text-brand-green700 mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-brand-green" />
            Skema Alat
          </h2>
          <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm">
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
        </motion.div>

        {/* Cara Pakai Aman */}
        <motion.div {...fadeIn} className="mb-10">
          <h2 className="text-2xl font-bold text-brand-green700 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-brand-green" />
            Cara Pakai Aman
          </h2>
          <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm">
            <ol className="list-decimal list-inside space-y-3 text-brand-sage mb-8">
              {[
                ["Sortir & bersihkan", " plastik, pastikan kering."],
                ["Masukkan plastik", " ke reaktor sampai batas aman."],
                ["Tutup & kunci", " reaktor, cek semua sambungan rapat."],
                ["Siapkan penampung", " minyak di ujung kondensor."],
                ["Panaskan bertahap", " dan amati alat ukur lokal (termometer/manometer bila tersedia)."],
                ["Selesai", " → matikan pemanas, biarkan dingin, baru buka & bersihkan residu."],
              ].map(([bold, rest], i) => (
                <li key={i}>
                  <strong className="text-brand-green700">{bold}</strong>
                  {rest}
                </li>
              ))}
            </ol>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-brand-green50 rounded-2xl">
              <div>
                <h4 className="font-bold text-brand-green700 mb-2">Lakukan:</h4>
                <ul className="list-disc list-inside text-sm text-brand-sage space-y-1.5">
                  <li>Gunakan sarung tangan & masker, area berventilasi baik.</li>
                  <li>Awali pemanasan perlahan, catat durasi & hasil.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Hindari:</h4>
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1.5">
                  <li>Membuka tutup saat alat masih panas/bertekanan.</li>
                  <li>Memasukkan kemasan berlapis aluminium atau bahan basah.</li>
                  <li>Menjalankan kondensor tanpa pendinginan (jika tipe water-cooled).</li>
                </ul>
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
