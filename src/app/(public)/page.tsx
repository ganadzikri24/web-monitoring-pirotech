"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Gauge,
  Leaf,
  Recycle,
  Banknote,
  Phone,
  Mail,
  MapPin,
  BookOpen,
} from "lucide-react";

import Product3DPreview from "@/components/landing/Product3DPreview";
import WasteToFuelAnimation from "@/components/landing/WasteToFuelAnimation";
import ProcessSteps from "@/components/landing/ProcessSteps";
import AnimatedCounter from "@/components/landing/AnimatedCounter";
import ImplementationGallery from "@/components/landing/ImplementationGallery";
import CalculatorSection from "@/components/landing/CalculatorSection";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const FEATURES = [
  {
    icon: Shield,
    title: "Aman & Terkendali",
    desc: "Dilengkapi sensor suhu dan alarm otomatis yang berbunyi saat melewati ambang batas, menjaga keselamatan operator.",
    color: "text-brand-green",
    bg: "bg-brand-green50",
  },
  {
    icon: Gauge,
    title: "Efisiensi Tinggi",
    desc: "Yield rate hingga 60–70% untuk plastik PP — artinya dari 10 kg plastik bisa dihasilkan hingga 7 liter BBM cair.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    icon: Leaf,
    title: "Ramah Lingkungan",
    desc: "Kurangi emisi CO₂ hingga 2.9 kg per kg plastik dibandingkan pembakaran terbuka konvensional.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: Banknote,
    title: "Bernilai Ekonomis",
    desc: "BBM pirolisis setara solar dapat dijual atau digunakan sendiri, mengubah sampah jadi sumber pendapatan nyata.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ═══════ 1. HERO ═══════ */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeInUp} className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green50 text-brand-green text-sm font-medium border border-brand-green/10">
              <Recycle className="w-4 h-4" />
              Teknologi Pirolisis Plastik
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-green700 tracking-tight leading-[1.1]">
              Ubah Sampah Plastik{" "}
              <span className="text-brand-green">Menjadi Bahan Bakar Cair</span>
            </h1>

            <p className="text-lg text-brand-sage max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Alat pirolisis inovatif yang mengubah limbah plastik menjadi BBM
              setara solar — dikembangkan oleh tim Sekolah Vokasi IPB.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/panduan"
                className="bg-brand-green hover:bg-brand-green700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 text-base shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Lihat Panduan <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hubungi"
                className="bg-card-bg hover:bg-brand-green50 text-brand-green700 border border-card-border hover:border-brand-green/30 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 text-base"
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Product3DPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════ 2. TENTANG ALAT + VIDEO ═══════ */}
      <section className="py-20 md:py-28 px-6 bg-card-bg border-y border-card-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeInUp}>
            {/* Video player slot */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-brand-green50 border border-card-border shadow-lg group">
              <video 
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/video-proses-pirolisis.mp4" type="video/mp4" />
                <source src="/video-proses-pirolisis.webm" type="video/webm" />
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green700 tracking-tight">
              Apa itu PiRoTech?
            </h2>
            <p className="text-brand-sage leading-relaxed">
              <strong className="text-brand-green700">PiRoTech</strong> adalah
              alat pengolah sampah plastik menjadi bahan bakar cair menggunakan
              teknologi{" "}
              <strong className="text-brand-green700">pirolisis</strong> — proses
              dekomposisi termal plastik tanpa oksigen pada suhu tinggi
              (300–450°C).
            </p>
            <p className="text-brand-sage leading-relaxed">
              Indonesia menghasilkan jutaan ton sampah plastik setiap tahun,
              sebagian besar berakhir di TPA atau lautan. PiRoTech hadir sebagai
              solusi: mengubah sampah plastik menjadi bahan bakar cair setara
              solar yang bernilai ekonomis.
            </p>
            <p className="text-brand-sage leading-relaxed">
              Dikembangkan oleh tim mahasiswa{" "}
              <strong className="text-brand-green700">
                Sekolah Vokasi IPB
              </strong>
              , alat ini dirancang untuk skala komunitas dengan biaya terjangkau
              dan mudah dioperasikan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ 3. CARA KERJA ALAT ═══════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green700 tracking-tight mb-4">
              Cara Kerja Alat
            </h2>
            <p className="text-brand-sage leading-relaxed">
              Proses pirolisis mengubah plastik menjadi bahan bakar cair melalui
              6 tahap sederhana yang aman dan terkendali.
            </p>
          </motion.div>

          <ProcessSteps />
        </div>
      </section>

      {/* ═══════ 4. DAMPAK & KALKULATOR INTERAKTIF ═══════ */}
      <section className="py-20 md:py-28 px-6 bg-brand-green700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Dampak Nyata PiRoTech
            </h2>
            <p className="text-white/70 leading-relaxed">
              Setiap kilogram plastik yang diolah berkontribusi pada lingkungan
              yang lebih bersih dan ekonomi yang lebih berkelanjutan. Coba
              kalkulator di bawah untuk melihat estimasi hasilnya.
            </p>
          </motion.div>

          {/* Stats counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              { value: 127, suffix: " kg", label: "Total Sampah Diolah", desc: "Plastik yang berhasil diproses" },
              { value: 66, suffix: " L", label: "BBM Cair Dihasilkan", desc: "Bahan bakar setara solar" },
              { value: 369, suffix: " kg", label: "CO₂ Dihemat", desc: "Vs pembakaran terbuka" },
              { value: 449, prefix: "Rp ", suffix: "rb", label: "Nilai Ekonomis", desc: "Potensi pendapatan dari BBM" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/10 rounded-2xl p-6 border border-white/10 text-center transform-gpu"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="font-semibold text-white/90 text-sm mb-1">{stat.label}</p>
                <p className="text-white/50 text-xs">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive Calculator */}
          <motion.div {...fadeInUp}>
            <CalculatorSection />
          </motion.div>
        </div>
      </section>

      {/* ═══════ 5. KEUNGGULAN ALAT ═══════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green700 tracking-tight mb-4">
              Keunggulan Alat PiRoTech
            </h2>
            <p className="text-brand-sage leading-relaxed">
              Dirancang untuk kemudahan, keamanan, dan efisiensi maksimal dalam
              mengolah sampah plastik menjadi energi terbarukan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-card-bg rounded-2xl p-7 border border-card-border shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group"
                >
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${feat.bg} flex items-center justify-center mx-auto mb-5`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`w-7 h-7 ${feat.color}`} />
                  </motion.div>
                  <h3 className="font-bold text-brand-green700 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-brand-sage leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ 6. GALERI IMPLEMENTASI ═══════ */}
      <section className="py-20 md:py-28 px-6 bg-card-bg border-y border-card-border">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green700 tracking-tight mb-4">
              Implementasi di Lapangan
            </h2>
            <p className="text-brand-sage leading-relaxed">
              Dokumentasi penggunaan alat PiRoTech dalam pengolahan sampah plastik di masyarakat.
            </p>
          </motion.div>
          <ImplementationGallery />
        </div>
      </section>

      {/* ═══════ 7. PANDUAN SINGKAT ═══════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="bg-gradient-to-br from-brand-green50 to-card-bg rounded-3xl p-8 md:p-12 border border-card-border"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-7 h-7 text-brand-green" />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-green700 tracking-tight">
                  Panduan Penggunaan Alat
                </h2>
                <p className="text-brand-sage leading-relaxed">
                  Pelajari cara menggunakan alat PiRoTech dengan aman dan
                  efektif — mulai dari jenis plastik yang diperbolehkan,
                  langkah-langkah operasional, hingga FAQ seputar proses
                  pirolisis.
                </p>
                <Link
                  href="/panduan"
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                >
                  Lihat Panduan Lengkap <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ 8. CTA + KONTAK ═══════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="bg-brand-green700 rounded-3xl p-8 md:p-14 text-center text-white shadow-lg relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Tertarik Menggunakan PiRoTech?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
                Tim kami siap membantu Anda memahami lebih lanjut tentang
                teknologi pirolisis dan bagaimana PiRoTech dapat diterapkan di
                lokasi Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Mail className="w-4 h-4" />
                  info@pirotech.id
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />
                  Sekolah Vokasi IPB, Bogor
                </div>
              </div>

              <Link
                href="/hubungi"
                className="inline-flex items-center gap-2 bg-white text-brand-green700 px-8 py-3.5 rounded-xl font-bold hover:bg-brand-green50 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
