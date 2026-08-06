"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff, Recycle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // TODO: hapus mock auth & mock data setelah Firebase disetup
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      if (email === "admin@pirotech.id" && password === "admin123") {
        import("@/lib/mockAuth").then(({ setMockSession }) => {
          setMockSession("admin");
          router.push("/overview");
        });
      } else {
        setError(true);
        setLoading(false);
      }
      return;
    }

    // Firebase Auth login (not yet implemented)
    setTimeout(() => {
      router.push("/overview");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-app-bg flex">
      {/* Left side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green700 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute bottom-20 -right-10 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/3" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold tracking-tight">PiRoTech</span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight">
            Monitoring Alat
            <br />
            Pirolisis Plastik
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Pantau dan kendalikan proses pengolahan sampah plastik menjadi bahan
            bakar cair secara real-time dari mana saja.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Dashboard monitoring real-time",
              "Kontrol buzzer & threshold otomatis",
              "Log aktivitas pengolahan lengkap",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 relative">
        <div className="absolute top-6 left-6 z-20 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-brand-green700 dark:text-white/80 hover:text-brand-green transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        <div className="absolute top-6 left-6 z-20 hidden lg:block">
          <Link
            href="/"
            className="flex items-center gap-2 text-brand-green700 dark:text-white/80 hover:text-brand-green transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green50 text-brand-green mb-6 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-brand-green700 mb-2 tracking-tight">
              Masuk ke Dashboard
            </h1>
            <p className="text-brand-sage text-sm">
              Masukkan kredensial untuk mengakses panel PiRoTech
            </p>
          </div>

          <div className="bg-card-bg py-10 px-8 rounded-2xl border border-card-border shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-medium border border-red-200 dark:border-red-500/20"
                >
                  Email atau password salah. Coba lagi.
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-green700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pirotech.id"
                  className="w-full px-4 py-3.5 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-green700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-xl border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all pr-12 placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sage hover:text-brand-green700 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 shadow-sm hover:shadow-md cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Masuk…
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>

              <div className="text-center pt-4 border-t border-card-border">
                <p className="text-xs text-brand-sage">
                  Akun dikelola oleh Admin PiRoTech.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
