"use client";

import { AlertTriangle, Info, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Wrench, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 30, willChange: "transform, opacity" },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

export default function PanduanPage() {
  return (
    <div className="pt-24 pb-16 bg-gray-50/50 dark:bg-transparent min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeIn} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green700 dark:text-brand-green font-medium text-sm mb-6">
            <Info className="w-4 h-4" />
            Pusat Bantuan & Panduan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Panduan Penggunaan{" "}
            <span className="text-brand-green">Alat PiRoTech</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Pelajari aturan bahan, langkah-langkah pengoperasian, dan cara aman menggunakan mesin pirolisis.
          </p>
        </motion.div>

        {/* 1. Pemberitahuan Penting */}
        <motion.div
          {...fadeIn}
          className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-6 md:p-10 mb-12 shadow-sm overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Pemberitahuan Penting
            </h2>
          </div>

          <div className="w-full mb-10">
             <img 
              src="/panduan/penting.webp" 
              alt="Larangan plastik metalized"
              decoding="async"
              className="w-full h-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="w-full aspect-[21/9] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center"><div class="text-gray-400 text-sm font-medium text-center">Foto Banner<br/><span class="text-xs">(Rasio Rekomendasi: 1920 x 820 piksel)</span></div></div>';
              }}
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-lg leading-relaxed mb-2">
                Dilarang menggunakan plastik/kemasan yang ada lapisan{" "}
                <span className="font-bold text-red-600 dark:text-red-400">metalized film</span> atau aluminium foil di dalamnya.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Contoh: bungkus kopi instan, sachet bumbu, kemasan keripik yang mengkilap di bagian dalam.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-2">
              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
                <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5" /> Mengapa Dilarang?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Tidak menghasilkan minyak, hanya jadi limbah padat.",
                    "Menimbulkan kerak sangat keras & berisiko menyumbat.",
                    "Menghambat perpindahan panas (proses jadi tidak efisien)."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-red-600/90 dark:text-red-400/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" /> Contoh yang Aman
                </h3>
                <ul className="space-y-3">
                  {[
                    "Botol PET, HDPE, PP yang bersih & kering.",
                    "Plastik rumah tangga tanpa lapisan metal (bagian dalam tidak mengkilap)."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-700/90 dark:text-emerald-400/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Skema Alat */}
        <motion.div {...fadeIn} className="mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-brand-green/10 p-3 rounded-xl">
                <Wrench className="w-8 h-8 text-brand-green" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Skema Alat
              </h2>
            </div>

            <div className="w-full mb-10">
              <img 
                src="/panduan/skema.webp" 
                alt="Skema Alat Pirolisis"
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="w-full aspect-[21/9] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center"><div class="text-gray-400 text-sm font-medium text-center">Foto Banner<br/><span class="text-xs">(Rasio Rekomendasi: 1920 x 820 piksel)</span></div></div>';
                }}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { title: "Reaktor Utama", desc: "Tabung silinder besar tempat plastik dipanaskan." },
                { title: "Tutup Reaktor Kerucut", desc: "Penutup berbentuk kerucut dengan lubang keluarnya uap." },
                { title: "Klem Pengunci", desc: "Mengunci tutup ke reaktor agar kedap udara." },
                { title: "Pipa Penyalur Uap", desc: "Menghubungkan tutup reaktor dengan kondensor." },
                { title: "Kondensor", desc: "Pendingin (koil di dalam) yang mengubah uap menjadi minyak cair." },
                { title: "Keran/Saluran Minyak", desc: "Ujung kondensor tempat minyak pirolisis keluar." },
                { title: "Sumber Pemanas", desc: "Memberikan panas di bawah reaktor utama." },
                { title: "Rangka Penyangga", desc: "Struktur yang menopang reaktor dan kondensor." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-green/5 dark:hover:bg-brand-green/10 transition-colors border border-transparent hover:border-brand-green/20">
                  <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3. Cara Pakai Aman */}
        <motion.div {...fadeIn} className="mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-green"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-brand-green/10 p-3 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-brand-green" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Cara Pakai Aman
              </h2>
            </div>
            
            <div className="w-full mb-10">
              <img 
                src="/panduan/aman.webp" 
                alt="Ilustrasi Cara Pakai Aman"
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="w-full aspect-[21/9] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center"><div class="text-gray-400 text-sm font-medium text-center">Foto<br/><span class="text-xs">(Rasio Rekomendasi: 16:9 atau 21:9 Widescreen)</span></div></div>';
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
              {[
                { title: "Sortir & Bersihkan", desc: "Pilah plastik dan pastikan dalam keadaan kering sebelum diproses." },
                { title: "Timbang & Estimasi", desc: "Timbang sampah dan gunakan kalkulator web/aplikasi untuk cek perkiraan hasil BBM." },
                { title: "Masukkan Plastik", desc: "Isi reaktor dengan plastik sampai pada batas aman yang ditentukan." },
                { title: "Tutup & Kunci", desc: "Pasang tutup reaktor dan pastikan semua sambungan terkunci rapat." },
                { title: "Siapkan Penampung", desc: "Letakkan wadah penampung minyak di ujung saluran kondensor." },
                { title: "Pasang Sensor IoT", desc: "Sambungkan kabel sensor dari reaktor ke alat IoT untuk pemantauan presisi." },
                { title: "Nyalakan Sistem", desc: "Mulai nyalakan reaktor, alat IoT akan otomatis menyala dan memantau sistem." },
                { title: "Panaskan Bertahap", desc: "Naikkan suhu pemanas secara perlahan menuju titik optimal (100-200°C)." },
                { title: "Pantau Real-time", desc: "Awasi grafik suhu dan status reaktor secara langsung melalui dashboard web/aplikasi." },
                { title: "Selesai & Bersihkan", desc: "Matikan pemanas, biarkan alat mendingin, lalu buka dan bersihkan residu." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold flex-shrink-0 border border-brand-green/20">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brand-green/5 dark:bg-brand-green/10 p-6 rounded-2xl border border-brand-green/20">
                <h4 className="font-bold text-brand-green700 dark:text-brand-green mb-4 text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Hal yang Wajib Dilakukan
                </h4>
                <ul className="space-y-3">
                  {[
                    "Gunakan alat pelindung (sarung tangan & masker).",
                    "Pastikan area pengoperasian memiliki sirkulasi udara (ventilasi) yang baik.",
                    "Awali pemanasan secara perlahan agar suhu stabil.",
                    "Catat durasi proses dan hasil minyak untuk evaluasi."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0"></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-200 dark:border-red-900/20">
                <h4 className="font-bold text-red-700 dark:text-red-400 mb-4 text-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Hal yang Harus Dihindari
                </h4>
                <ul className="space-y-3">
                  {[
                    "Membuka tutup reaktor saat alat masih dalam keadaan panas atau bertekanan.",
                    "Memasukkan kemasan berlapis aluminium, logam, atau bahan yang basah.",
                    "Menjalankan kondensor tanpa sistem pendinginan yang aktif (jika tipe water-cooled)."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        </motion.div>

        {/* 4. FAQ */}
        <motion.div {...fadeIn} className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-brand-sage" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: "Apakah semua plastik bisa?",
                a: "Tidak. Hindari yang berlapis aluminium (mengkilap di dalam). PET/HDPE/PP yang bersih & kering umumnya aman.",
              },
              {
                q: "Apakah berbahaya?",
                a: "Tidak, selama Anda mengikuti prosedur (kedap, ventilasi baik, pemanasan bertahap) dan gunakan APD dasar.",
              },
              {
                q: "Butuh bantuan teknis?",
                a: "Tim kami siap membantu. Anda bisa mengirim pertanyaan melalui halaman Hubungi Kami.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                  {faq.q}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeIn}
          className="bg-brand-green700 dark:bg-brand-green/20 dark:border dark:border-brand-green/30 rounded-3xl p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Punya pertanyaan sebelum mencoba?
            </h3>
            <p className="text-white/80 dark:text-brand-green-100 text-lg mb-8 max-w-xl mx-auto">
              Tim dukungan teknis kami siap membantu Anda memahami cara kerja alat PiRoTech dengan lebih baik.
            </p>
            <Link
              href="/hubungi"
              className="inline-flex items-center gap-2 bg-white text-brand-green700 dark:bg-brand-green dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-brand-green/90 transition-colors shadow-sm text-lg"
            >
              Hubungi Kami Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

