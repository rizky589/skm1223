import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ProgressProvider } from "@/components/progress-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "SKM BPS Kabupaten Labuhanbatu Utara",
  description: "Survei Kepuasan Masyarakat untuk layanan BPS Kabupaten Labuhanbatu Utara."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8fafc"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <ProgressProvider />
        </Suspense>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
        <footer className="border-t border-white/20 px-4 py-8 text-center text-sm font-semibold text-white/85">
          © TIM IPDS 2026. All rights reserved.
        </footer>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
