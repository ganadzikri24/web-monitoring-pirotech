"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: 1,
    title: "Sortir & Bersihkan",
    desc: "Pilah sampah plastik sesuai jenis (PET, HDPE, PP, dll.). Bersihkan dari sisa makanan atau kotoran, lalu keringkan. Hindari plastik berlapis aluminium.",
    // TODO: ganti foto tahap Sortir & Bersihkan
    image: "/public/steps/step-sortir.webp",
  },
  {
    step: 2,
    title: "Masukkan ke Reaktor",
    desc: "Masukkan plastik yang sudah bersih dan kering ke dalam reaktor utama hingga batas aman kapasitas. Jangan melebihi kapasitas maksimal.",
    // TODO: ganti foto tahap Masukkan ke Reaktor
    image: "/steps/step-masukkan.jpg",
  },
  {
    step: 3,
    title: "Tutup & Kunci Reaktor",
    desc: "Pasang tutup kerucut dan kunci dengan klem pengunci hingga kedap udara. Pastikan semua sambungan pipa rapat dan tidak bocor.",
    // TODO: ganti foto tahap Tutup & Kunci
    image: "/steps/step-tutup.jpg",
  },
  {
    step: 4,
    title: "Panaskan Bertahap",
    desc: "Nyalakan sumber pemanas (kompor) dan naikkan suhu secara bertahap. Proses pirolisis optimal terjadi pada suhu 300–450°C tanpa oksigen.",
    // TODO: ganti foto tahap Panaskan
    image: "/steps/step-panaskan.jpg",
  },
  {
    step: 5,
    title: "Kondensasi Uap",
    desc: "Uap yang dihasilkan mengalir melalui pipa ke kondensor, di mana uap didinginkan dan berubah menjadi cairan bahan bakar (minyak pirolisis).",
    // TODO: ganti foto tahap Kondensasi
    image: "/steps/step-kondensasi.jpg",
  },
  {
    step: 6,
    title: "Tampung Hasil BBM",
    desc: "Minyak pirolisis cair keluar dari ujung kondensor dan ditampung di wadah. Hasilnya adalah bahan bakar cair setara solar yang siap digunakan.",
    // TODO: ganti foto tahap Tampung Hasil
    image: "/steps/step-hasil.jpg",
  },
];

export default function ProcessSteps() {
  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-card-border hidden lg:block" />

      <div className="space-y-12 lg:space-y-0">
        {STEPS.map((step, i) => {
          const isEven = i % 2 === 0;

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }}
              className="relative"
            >
              {/* Desktop: Zigzag layout */}
              <div
                className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i > 0 ? "lg:pt-16" : ""
                  }`}
              >
                {/* Image side */}
                <div
                  className={`mb-6 lg:mb-0 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-sm group">
                    {/* TODO: ganti dengan foto asli tahap ini */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green50 via-brand-sage50/50 to-card-bg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-green/10 flex items-center justify-center">
                          <span className="text-3xl font-extrabold text-brand-green">
                            {step.step}
                          </span>
                        </div>
                        <p className="text-xs text-brand-sage font-medium">
                          Foto akan ditambahkan
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 ring-1 ring-inset ring-brand-green/0 group-hover:ring-brand-green/20 transition-all duration-300 rounded-2xl" />
                  </div>
                </div>

                {/* Text side */}
                <div
                  className={`${isEven ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4 lg:text-right"}`}
                >
                  <div className={`flex items-center gap-3 mb-3 ${!isEven ? "lg:justify-end" : ""}`}>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-green text-white text-sm font-bold shadow-sm">
                      {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-brand-green700">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-brand-sage leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {/* Center dot on timeline (desktop) */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                  className="w-5 h-5 rounded-full bg-brand-green border-4 border-app-bg shadow-sm"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
