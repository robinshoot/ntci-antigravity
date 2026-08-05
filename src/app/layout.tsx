import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B0E14',
};

export const metadata: Metadata = {
  title: {
    default: 'NTCI - Nmax Turbo Club Indonesia | Portal Resmi Komunitas',
    template: '%s | NTCI Indonesia',
  },
  description: 'Wadah resmi persaudaraan, komunikasi, dan informasi anggota Nmax Turbo Club Indonesia (NTCI) se-Nusantara. Visi-misi, chapter, e-KTA, kalender event & bantuan darurat SOS.',
  keywords: ['NTCI', 'Nmax Turbo Club Indonesia', 'Yamaha Nmax Turbo', 'Klub Motor Nmax', 'Komunitas Nmax Indonesia', 'E-KTA Digital NTCI', 'Safety Riding'],
  authors: [{ name: 'Pengurus Pusat NTCI' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0B0E14] text-slate-100 selection:bg-[#00E5FF] selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
