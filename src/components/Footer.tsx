import Link from "next/link";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/panduan", label: "Panduan" },
  { href: "/hubungi", label: "Hubungi Kami" },
  { href: "/login", label: "Login" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card-bg border-t border-card-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size="md" />
            </div>
            <p className="text-brand-sage text-sm leading-relaxed">
              Monitoring alat pengolah sampah plastik menjadi bahan bakar cair menggunakan teknologi pirolisis berbasis IoT.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-bold text-brand-green700 mb-4 text-sm uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-sage hover:text-brand-green700 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-brand-green700 mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-brand-sage">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-brand-green" />
                <span>info@pirotech.id</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-brand-sage">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-green" />
                <span>Sekolah Vokasi IPB, Bogor</span>
              </li>
            </ul>
          </div>

          {/* Institusi */}
          <div>
            <h4 className="font-bold text-brand-green700 mb-4 text-sm uppercase tracking-wider">
              Institusi
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-brand-sage leading-relaxed">
                Dikembangkan oleh tim mahasiswa Sekolah Vokasi IPB sebagai solusi pengolahan sampah plastik berkelanjutan.
              </p>
              <a
                href="https://sv.ipb.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:text-brand-green700 font-medium transition-colors"
              >
                Sekolah Vokasi IPB <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-sage text-xs">
            © {currentYear} PiRoTech • Sekolah Vokasi IPB. All rights reserved.
          </p>
          <p className="text-brand-sage/60 text-xs">
            Monitoring Pirolisis IoT v0.1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
