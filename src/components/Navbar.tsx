"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/panduan", label: "Panduan" },
  { href: "/hubungi", label: "Hubungi Kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 transform-gpu",
        scrolled
          ? "bg-nav-bg-solid border-b border-nav-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-16 md:h-18 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 shrink-0"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-brand-green700 bg-brand-green50"
                      : "text-brand-sage hover:text-brand-green700 hover:bg-brand-green50/50"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-green rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden md:inline-flex bg-brand-green hover:bg-brand-green700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md"
            >
              Login
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-card-bg border border-card-border flex items-center justify-center hover:bg-brand-green50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-brand-sage" />
              ) : (
                <Menu className="w-5 h-5 text-brand-sage" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-nav-border bg-nav-bg-solid"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-brand-green700 bg-brand-green50"
                        : "text-brand-sage hover:text-brand-green700 hover:bg-brand-green50/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-card-border">
                <Link
                  href="/login"
                  className="block w-full text-center bg-brand-green hover:bg-brand-green700 text-white px-5 py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
