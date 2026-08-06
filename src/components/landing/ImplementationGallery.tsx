"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

// TODO: ganti dengan foto asli implementasi dari saya
const GALLERY_ITEMS = [
  { id: 1, src: "/gallery/impl-1.jpg", alt: "Implementasi alat pirolisis di masyarakat" },
  { id: 2, src: "/gallery/impl-2.jpg", alt: "Proses pengolahan sampah plastik" },
  { id: 3, src: "/gallery/impl-3.jpg", alt: "Hasil minyak pirolisis" },
  { id: 4, src: "/gallery/impl-4.jpg", alt: "Tim PiRoTech di lapangan" },
  { id: 5, src: "/gallery/impl-5.jpg", alt: "Alat pirolisis tampak samping" },
  { id: 6, src: "/gallery/impl-6.jpg", alt: "Pelatihan penggunaan alat" },
];

export default function ImplementationGallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = GALLERY_ITEMS.find((g) => g.id === selectedId);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_ITEMS.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => setSelectedId(item.id)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-sm group cursor-pointer"
          >
            {/* TODO: ganti placeholder ini dengan <Image src={item.src} /> setelah foto tersedia */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green50 via-brand-sage50/30 to-card-bg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 mx-auto flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-brand-green" />
                </div>
                <p className="text-[11px] text-brand-sage font-medium px-2">
                  {item.alt}
                </p>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-brand-green700/0 group-hover:bg-brand-green700/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-3xl w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* TODO: ganti placeholder ini dengan <Image src={selected.src} /> */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green50 via-brand-sage50/30 to-card-bg flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-green/10 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-brand-green" />
                  </div>
                  <p className="text-sm text-brand-sage font-medium">{selected.alt}</p>
                  <p className="text-xs text-brand-sage/60">Foto akan ditambahkan</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
