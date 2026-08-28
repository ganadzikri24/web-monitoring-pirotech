import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PiRoTech — Monitoring Alat Pirolisis Plastik",
  description:
    "Pemantauan dan pengendalian proses pirolisis plastik menjadi bahan bakar cair secara real-time berbasis IoT. Dikembangkan oleh Sekolah Vokasi IPB.",
  keywords: ["pirolisis", "plastik", "bahan bakar cair", "IoT", "monitoring", "PiRoTech", "IPB"],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-app-bg text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
