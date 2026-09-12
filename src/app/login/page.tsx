"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      let loginEmail = emailOrUsername;

      // Jika bukan format email, coba lookup username
      if (!emailOrUsername.includes("@")) {
        const res = await fetch(`/api/auth/lookup?username=${encodeURIComponent(emailOrUsername)}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        loginEmail = data.email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const uid = userCredential.user.uid;
      
      // Kirim notifikasi login
      import("@/lib/firebaseUtils").then(({ pushNotification }) => {
        pushNotification(
          "Aktivitas Login", 
          `Akun ${loginEmail} berhasil masuk ke sistem.`, 
          "info", 
          uid
        );
      });

      router.push("/overview");
    } catch (err: any) {
      console.error("Login failed", err);
      setError(true);
      setLoading(false);
    }
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
          <div className="mb-8">
            <Link href="/">
              <Logo size="lg" className="brightness-0 invert" />
            </Link>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-brand-green hover:text-brand-green700 transition-colors font-bold text-sm bg-brand-green50/50 hover:bg-brand-green50 px-5 py-2.5 rounded-full border border-brand-green/20 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Web Utama
            </Link>
          </div>
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
                  Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="masukan email atau username"
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
