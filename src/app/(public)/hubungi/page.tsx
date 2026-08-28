"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, Phone } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30, willChange: "transform, opacity" },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function HubungiKamiPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("https://formsubmit.co/ajax/pirotechsvipb@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeIn} className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green50 text-brand-green mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-green700 mb-4 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="text-brand-sage text-lg leading-relaxed max-w-xl mx-auto">
            Kirim pertanyaan, keluhan, atau saran kamu di sini.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div {...fadeIn} className="lg:col-span-2 space-y-6">
            <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm space-y-5">
              <h3 className="font-bold text-brand-green700 text-lg">Informasi Kontak</h3>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-green700">Email</p>
                  <p className="text-sm text-brand-sage">pirotechsvipb@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-green700">Alamat</p>
                  <p className="text-sm text-brand-sage">Sekolah Vokasi IPB, Bogor, Jawa Barat</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-green50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-green700">Institusi</p>
                  <p className="text-sm text-brand-sage">Sekolah Vokasi IPB</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeIn} className="lg:col-span-3">
            <div className="bg-card-bg p-8 md:p-10 rounded-2xl border border-card-border shadow-sm">
              {success ? (
                <div className="bg-brand-green50 text-brand-green700 p-8 rounded-2xl text-center">
                  <CheckSuccessIcon />
                  <h3 className="font-bold text-lg mt-4 mb-2">
                    Terima kasih! Pesanmu sudah terkirim.
                  </h3>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-brand-green underline text-sm mt-2 hover:text-brand-green700 transition-colors"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium text-center">
                      Gagal mengirim pesan
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-green700">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Nama"
                        className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-green700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-green700">
                      Subjek
                    </label>
                    <input
                      type="text"
                      name="_subject"
                      placeholder="Subjek (opsional)"
                      className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-green700">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Pesan kamu…"
                      className="w-full px-4 py-3 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-green hover:bg-brand-green700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    {loading ? "Mengirim…" : "Kirim"}{" "}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CheckSuccessIcon() {
  return (
    <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/10 flex items-center justify-center">
      <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
