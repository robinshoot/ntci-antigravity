import React from 'react';
import HeroSection from '@/components/public/HeroSection';
import SponsorSection from '@/components/public/SponsorSection';
import {
  getChapters,
  getMembers,
  getEvents,
  getArticles,
  getSponsors,
} from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Calendar, ArrowRight, Shield, Award, Sparkles, FileText, CheckCircle } from 'lucide-react';

export const revalidate = 60; // SSR / ISR caching for maximum performance

export default async function HomePage() {
  const [chapters, members, events, articles, sponsors] = await Promise.all([
    getChapters(),
    getMembers(),
    getEvents(),
    getArticles(),
    getSponsors(),
  ]);

  const upcomingEvents = events.slice(0, 2);
  const latestArticles = articles.slice(0, 2);

  return (
    <div className="bg-[#0D0B0A] text-slate-200">
      {/* 1. Hero Section */}
      <HeroSection
        memberCount={members.length}
        chapterCount={chapters.length}
        eventCount={events.length}
        demoMember={members[0]}
      />

      {/* 2. Quick Highlight Features (3 Column Grid) */}
      <section className="py-16 bg-[#171210] border-y border-[#332722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase tracking-widest inline-block">
              NMAX TURBO CLUB INDONESIA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Pusat Informasi & Komunitas Resmi
            </h2>
            <p className="text-xs sm:text-sm text-[#A39690]">
              Wadah silaturahmi, touring persaudaraan, dan inovasi teknologi Yamaha Nmax Turbo se-Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Visi & Struktur */}
            <div className="p-6 rounded-3xl bg-[#0D0B0A] border border-[#332722] hover:border-[#D4AF37]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158] group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors">
                  Visi & Landasan Hukum
                </h3>
                <p className="text-xs text-[#A39690] leading-relaxed">
                  Menjadi pelopor keselamatan berkendara (safety riding) dan organisasi otomotif berbadan hukum resmi di Indonesia.
                </p>
              </div>
              <Link
                href="/visi-misi"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E5C158] hover:underline pt-2"
              >
                <span>Pelajari Visi & Misi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: Direktori Chapter */}
            <div className="p-6 rounded-3xl bg-[#0D0B0A] border border-[#332722] hover:border-[#D4AF37]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158] group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors">
                  {chapters.length} Chapter Se-Indonesia
                </h3>
                <p className="text-xs text-[#A39690] leading-relaxed">
                  Jaringan chapter resmi di berbagai provinsi dan daerah, dari Sumatera, Jawa, Bali, hingga Indonesia Timur.
                </p>
              </div>
              <Link
                href="/chapter"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E5C158] hover:underline pt-2"
              >
                <span>Cari Chapter Terdekat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: E-KTA & Anggota */}
            <div className="p-6 rounded-3xl bg-[#0D0B0A] border border-[#332722] hover:border-[#D4AF37]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158] group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors">
                  E-KTA Digital & SOS Storing
                </h3>
                <p className="text-xs text-[#A39690] leading-relaxed">
                  Kartu Tanda Anggota berbasis QR Code unik dan sistem bantuan darurat touring di seluruh rute Indonesia.
                </p>
              </div>
              <Link
                href="/anggota"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E5C158] hover:underline pt-2"
              >
                <span>Direktori Anggota</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events & Latest Warta Teaser Section */}
      <section className="py-16 bg-[#0D0B0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Top Upcoming Events Preview */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#332722] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#E5C158] uppercase font-bold tracking-wider">
                  AGENDA MENDATANG
                </span>
                <h3 className="text-2xl font-black text-white">Event & Touring Terbaru</h3>
              </div>
              <Link
                href="/kalender"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all shrink-0"
              >
                <span>Lihat Semua Agenda ({events.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl bg-[#171210] border border-[#332722] overflow-hidden flex flex-col sm:flex-row hover:border-[#D4AF37]/40 transition-all shadow-xl group"
                >
                  <div className="relative h-48 sm:h-auto sm:w-48 shrink-0 overflow-hidden">
                    <Image
                      src={ev.bannerUrl}
                      alt={ev.title}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#0D0B0A] text-[#E5C158] border border-[#D4AF37]/30">
                        {ev.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-white text-base leading-snug group-hover:text-[#E5C158] transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#A39690] line-clamp-2">
                        {ev.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#332722] text-slate-300">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{ev.location}</span>
                      </span>
                      <Link href="/kalender" className="text-[#E5C158] font-bold hover:underline">
                        Detail Agenda →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Warta & Tips Preview */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#332722] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#E5C158] uppercase font-bold tracking-wider">
                  WARTA & LITERASI TEKNIK
                </span>
                <h3 className="text-2xl font-black text-white">Artikel & Tips Nmax Turbo</h3>
              </div>
              <Link
                href="/warta"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all shrink-0"
              >
                <span>Lihat Semua Artikel ({articles.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#0D0B0A] text-[#E5C158] border border-[#D4AF37]/30">
                        {art.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#A39690] font-mono">{art.readTime}</span>
                    </div>
                    <h4 className="font-bold text-white text-base group-hover:text-[#E5C158] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-[#A39690] line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#332722] text-xs">
                    <span className="text-slate-300 font-semibold">{art.authorName}</span>
                    <Link href="/warta" className="text-[#E5C158] font-bold hover:underline">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Sponsor Section */}
      <SponsorSection sponsors={sponsors} />
    </div>
  );
}
