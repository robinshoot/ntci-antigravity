'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, MapPin, Users, Calendar, ArrowRight, Zap, Award, CheckCircle, Sparkles } from 'lucide-react';
import EktaModal from './EktaModal';
import { MemberData } from '@/lib/mockData';

interface HeroSectionProps {
  memberCount: number;
  chapterCount: number;
  eventCount: number;
  demoMember?: MemberData;
}

const DEFAULT_DEMO_MEMBER: MemberData = {
  id: 'demo-1',
  fullName: 'Bambang "Turbo" Wijaya',
  nra: 'NTCI-JKT-001',
  email: 'bambang.turbo@ntci.or.id',
  phone: '+62 812-3456-7890',
  role: 'SUPER_ADMIN',
  isVerified: true,
  chapterName: 'NTCI Chapter Jakarta Raya',
  chapterSlug: 'jakarta-raya',
  motorModel: 'NMAX Turbo Tech MAX Ultimate',
  motorYear: '2024',
  motorPlate: 'B 1904 NTCI',
  motorColor: 'Magma Bronze',
  motorMods: 'Y-CVT Tech Performance, Custom Leather Seat, Touring Box',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  joinedDate: '15 Januari 2024',
};

export default function HeroSection({
  memberCount,
  chapterCount,
  eventCount,
  demoMember,
}: HeroSectionProps) {
  const [selectedEktaMember, setSelectedEktaMember] = useState<MemberData | null>(null);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#0D0B0A]">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#332722_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158] shadow-xl">
              <Zap className="w-4 h-4 text-[#F0C05A] animate-bounce" />
              <span>OFFICIAL COMMUNITY OF YAMAHA NMAX TURBO</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Satu Komunitas, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#E2E8F0]">
                Satu Jiwa Brotherhood
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-[#A39690] max-w-2xl leading-relaxed font-medium">
              Wadah komunikasi dan persaudaraan resmi bagi pengguna **Yamaha Nmax Turbo** se-Nusantara. Mengusung filosofi kemewahan *Tech MAX Ultimate Magma Bronze*, menghubungkan puluhan chapter, touring akbar, dan bantuan darurat SOS.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/registrasi"
                className="flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-xl hover:scale-105"
              >
                <span>Gabung Anggota NTCI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setSelectedEktaMember(demoMember || DEFAULT_DEMO_MEMBER)}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#171210] hover:bg-[#241D1A] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-lg"
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Lihat Contoh E-KTA Digital</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="pt-8 border-t border-[#332722] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center lg:justify-start">
                  <span>{memberCount}+</span>
                </div>
                <p className="text-xs text-[#A39690] font-medium">Anggota Terverifikasi</p>
              </div>

              <div className="space-y-1 border-x border-[#332722] px-2">
                <div className="text-2xl sm:text-3xl font-black text-[#E5C158] flex items-center justify-center lg:justify-start">
                  <span>{chapterCount}</span>
                </div>
                <p className="text-xs text-[#A39690] font-medium">Chapter Se-Indonesia</p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-[#D4AF37] flex items-center justify-center lg:justify-start">
                  <span>{eventCount}+</span>
                </div>
                <p className="text-xs text-[#A39690] font-medium">Agenda & Touring</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-[#332722] bg-[#171210] shadow-2xl group">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
                    alt="Nmax Turbo Tech MAX NTCI"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/40 to-transparent" />
                
                {/* Floating Badge Top Left */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#0D0B0A]/85 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-extrabold text-[#E5C158] shadow-xl">
                  <Award className="w-4 h-4 text-[#F0C05A]" />
                  <span>TECH MAX ULTIMATE EDITION</span>
                </div>

                {/* Floating Card Bottom Content */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0D0B0A]/90 backdrop-blur-md border border-[#332722] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider uppercase font-bold">
                      GRAND TOURING NTCI 2026
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C158] font-bold border border-[#D4AF37]/30">
                      UPCOMING
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">
                    Jelajah Lintas Jalur Selatan Java (Bandung - Jogja)
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#A39690]">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Start: Gedung Sate</span>
                    </div>
                    <span className="text-white font-semibold">10 - 13 Sep 2026</span>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 p-4 rounded-2xl bg-[#171210] border border-[#D4AF37]/40 shadow-2xl backdrop-blur-xl items-center space-x-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#E5C158]" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Digital E-KTA Ready</h5>
                  <p className="text-[10px] text-[#A39690]">Verifikasi QR Code & Akses Promo Partner</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* E-KTA Modal Popup when clicked */}
      <EktaModal
        member={selectedEktaMember}
        onClose={() => setSelectedEktaMember(null)}
      />
    </section>
  );
}
