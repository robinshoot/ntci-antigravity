'use client';

import React, { useState } from 'react';
import { ChapterData } from '@/lib/mockData';
import { MapPin, Users, Phone, Calendar, Search, Shield, X, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ChapterListProps {
  chapters: ChapterData[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'DECLARED' | 'EMBRYO' | 'INACTIVE'>('ALL');
  const [activeStructureModal, setActiveStructureModal] = useState<ChapterData | null>(null);

  const regions = ['ALL', ...Array.from(new Set(chapters.map((c) => c.region)))];

  const filteredChapters = chapters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.leaderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === 'ALL' ||
      c.region.trim().toLowerCase() === selectedRegion.trim().toLowerCase();
    const matchesStatus =
      selectedStatus === 'ALL' ||
      String(c.status).toUpperCase() === String(selectedStatus).toUpperCase();
    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <section className="py-20 bg-[#0B0E14] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
            <MapPin className="w-3.5 h-3.5" />
            <span>DIREKTORI CHAPTER & STATUS DEKLARASI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Direktori Chapter Se-Indonesia
          </h2>
          <p className="text-sm text-[#A39690]">
            Setiap chapter memiliki halaman khusus untuk menampilkan seluruh daftar anggota, pengurus resmi, dan jadwal kopdar.
          </p>
        </div>

        {/* Status Filter Tabs - Scrollable on mobile */}
        <div className="flex items-center justify-start md:justify-center gap-2 mb-8 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedStatus('ALL')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              selectedStatus === 'ALL'
                ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-black shadow-lg ring-2 ring-[#D4AF37]/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
            }`}
          >
            Semua Chapter ({chapters.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('DECLARED')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              selectedStatus === 'DECLARED'
                ? 'bg-emerald-400 text-black shadow-lg font-bold ring-2 ring-emerald-400/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-emerald-500/40'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sudah Deklarasi ({chapters.filter((c) => String(c.status).toUpperCase() === 'DECLARED').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('EMBRYO')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
              selectedStatus === 'EMBRYO'
                ? 'bg-amber-400 text-black shadow-lg font-bold ring-2 ring-amber-400/50'
                : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-amber-500/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Chapter Embrio ({chapters.filter((c) => String(c.status).toUpperCase() === 'EMBRYO').length})</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari chapter, kota, atau pengurus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171210] border border-[#332722] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Region Tabs - Scrollable on mobile */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 pt-1 scrollbar-none touch-pan-x">
            {regions.map((reg) => (
              <button
                type="button"
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 shrink-0 ${
                  selectedRegion === reg
                    ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] font-extrabold shadow-md ring-2 ring-[#D4AF37]/50'
                    : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
                }`}
              >
                {reg === 'ALL' ? 'Semua Wilayah' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((ch) => (
            <div
              key={ch.id}
              className="relative p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Status & Member Count Header */}
                <div className="flex items-center justify-between">
                  {ch.status === 'DECLARED' ? (
                    <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      <span>DEKLARASI RESMI</span>
                    </span>
                  ) : ch.status === 'EMBRYO' ? (
                    <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      <span>CHAPTER EMBRIO</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      <span>NONAKTIF</span>
                    </span>
                  )}

                  <div className="flex items-center space-x-1 text-xs text-[#E5C158] font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{ch.memberCount} Biker</span>
                  </div>
                </div>

                {/* Chapter Name */}
                <div>
                  <span className="text-[10px] text-[#A39690] font-mono block uppercase">{ch.region}</span>
                  <Link href={`/chapter/${ch.slug}`} className="text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors block">
                    {ch.name}
                  </Link>
                </div>

                {/* Info List */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#A39690] block text-[10px] uppercase font-medium">Ketua Chapter</span>
                      <span className="font-semibold text-white">{ch.leaderName}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#A39690] block text-[10px] uppercase font-medium">Lokasi Sekre</span>
                      <span>{ch.kopdarLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-[#D9383A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#A39690] block text-[10px] uppercase font-medium">Jadwal Rutin</span>
                      <span>{ch.kopdarSchedule}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-[#332722]">
                <Link
                  href={`/chapter/${ch.slug}`}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-md"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Lihat Anggota ({ch.memberCount} Biker)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveStructureModal(ch)}
                    className="w-full inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[11px] font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] transition-all"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Struktur</span>
                  </button>

                  <a
                    href={`https://wa.me/${ch.contactPhone.replace(/[^0-9]/g, '')}?text=Halo%20Ketua%20${encodeURIComponent(ch.name)},%20saya%20tertarik%20bergabung%20NTCI`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl text-[11px] font-bold text-[#E5C158] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Kontak</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Chapter Officers Modal */}
      {activeStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#131924] border border-[#222C3D] rounded-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222C3D] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] font-bold">
                  STATUS: {activeStructureModal.status === 'DECLARED' ? 'DEKLARASI RESMI' : 'CHAPTER EMBRIO'}
                </span>
                <h3 className="text-xl font-bold text-white">
                  Struktur Pengurus {activeStructureModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveStructureModal(null)}
                className="p-2 rounded-xl bg-[#0B0E14] text-slate-400 hover:text-white border border-[#222C3D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeStructureModal.officers ? (
                activeStructureModal.officers.map((off, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D] flex items-center space-x-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00E5FF]/40 shrink-0">
                      <Image
                        src={off.avatarUrl}
                        alt={off.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-mono text-[#00E5FF] font-bold block truncate">
                        {off.role}
                      </span>
                      <h4 className="font-bold text-white text-sm truncate">{off.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{off.nra}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-xs text-slate-400">
                  Detail struktur pengurus chapter sedang diperbarui.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
