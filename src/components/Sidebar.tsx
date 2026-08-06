"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import Logo from "./Logo";

const menuItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard", label: "Dashboard Monitoring", icon: Activity },
  { href: "/log-activity", label: "Log Activity", icon: ClipboardList },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-card-bg border-r border-card-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-card-border">
        <Link href="/overview" className="flex items-center gap-2.5">
          <Logo size="md" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive
                  ? "bg-brand-green50 text-brand-green700"
                  : "text-brand-sage hover:bg-brand-green50/50 hover:text-brand-green700"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-brand-green rounded-r-full -ml-3"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={clsx(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-green" : "text-brand-sage"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-card-border">
        <button
          onClick={async () => {
            // TODO: hapus mock auth & mock data setelah Firebase disetup
            if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
              const { clearMockSession } = await import("@/lib/mockAuth");
              clearMockSession();
              window.location.href = "/login";
              return;
            }

            // TODO: call actual firebase signOut here
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-brand-sage hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium text-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
