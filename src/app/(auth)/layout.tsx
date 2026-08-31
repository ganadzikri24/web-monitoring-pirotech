"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useRole } from "@/lib/useRole";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Existing Firebase Auth logic check
    if (!loading && role === null) {
      router.push("/login");
    }
  }, [role, loading, router]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Optionally show a loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="flex items-center gap-3 bg-card-bg px-6 py-4 rounded-2xl border border-card-border shadow-sm">
          <svg className="animate-spin w-5 h-5 text-brand-green" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-brand-green700 font-medium">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-app-bg overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-[260px] flex flex-col min-w-0 transition-all duration-300">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
