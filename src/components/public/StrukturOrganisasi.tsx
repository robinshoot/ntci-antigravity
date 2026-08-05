'use client';

import React, { useState } from 'react';
import { CENTRAL_OFFICERS, ChapterData, ChapterOfficer } from '@/lib/mockData';
import { Users, Shield, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

interface StrukturOrganisasiProps {
  chapters?: ChapterData[];
}

export default function StrukturOrganisasi({ chapters = [] }: StrukturOrganisasiProps) {
  const [selectedEntity, setSelectedEntity] = useState<string>('PUSAT');

  // Find active officer list
  let currentTitle = 'Struktur Pengurus Pusat NTCI Nasional';
  let currentDesc = 'Jajaran kepengurusan nasional Nmax Turbo Club Indonesia periode 2024-2029 yang mengelola tata kelola organisasi, keanggotaan, dan kegiatan nasional.';
  let activeOfficers: ChapterOfficer[] = CENTRAL_OFFICERS;

  if (selectedEntity !== 'PUSAT') {
    const chapter = chapters.find((c) => c.slug === selectedEntity);
    if (chapter) {
      currentTitle = `Struktur Pengurus ${chapter.name}`;
      currentDesc = `Bagan susunan pengurus daerah untuk wilayah ${chapter.region} (${chapter.city}). Lokasi Sekre: ${chapter.kopdarLocation}.`;
      if (chapter.officers) {
        activeOfficers = chapter.officers;
      } else {
        activeOfficers = [
          {
            role: 'Ketua Chapter',
            name: chapter.leaderName,
            nra: `NTCI-${chapter.slug.toUpperCase()}-001`,
            phone: chapter.contactPhone,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          },
        ];
      }
    }
  }

  return (
    <section className="py-20 bg-[#080B10] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131924] border border-[#00E5FF]/30 text-xs font-bold text-[#00E5FF]">
            <Users className="w-3.5 h-3.5" />
            <span>BAGAN KEPENGURUSAN PUSAT & CHAPTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Struktur Organisasi NTCI
          </h2>
          <p className="text-sm text-slate-400">
            Pilih kepengurusan nasional atau kepengurusan chapter daerah untuk melihat jajaran pimpinan dan divisi.
          </p>
        </div>

        {/* Entity Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedEntity('PUSAT')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all flex items-center space-x-2 ${
              selectedEntity === 'PUSAT'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-black shadow-lg scale-105'
                : 'bg-[#131924] text-slate-300 border border-[#222C3D] hover:border-[#00E5FF]/40'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Pengurus Pusat (Nasional)</span>
          </button>

          {chapters.map((ch) => (
            <button
              key={ch.slug}
              onClick={() => setSelectedEntity(ch.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                selectedEntity === ch.slug
                  ? 'bg-[#00E5FF] text-black shadow-lg font-extrabold scale-105'
                  : 'bg-[#131924] text-slate-400 border border-[#222C3D] hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{ch.name.replace('NTCI Chapter ', '')}</span>
            </button>
          ))}
        </div>

        {/* Title & Description Banner */}
        <div className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] text-center space-y-2 mb-10 max-w-3xl mx-auto shadow-xl">
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]">
            {selectedEntity === 'PUSAT' ? 'NASIONAL PUSAT' : 'CHAPTER REGIONAL'}
          </span>
          <h3 className="text-xl font-black text-white">{currentTitle}</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">{currentDesc}</p>
        </div>

        {/* Board Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOfficers.map((board, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#00E5FF]/40 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00E5FF]/40 shrink-0 group-hover:scale-105 transition-transform">
                  <Image src={board.avatarUrl} alt={board.name} fill sizes="64px" className="object-cover" />
                </div>

                {/* Text Info */}
                <div className="space-y-1 overflow-hidden">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-bold inline-block">
                    {board.role}
                  </span>
                  <h4 className="font-bold text-white text-base truncate">{board.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-mono text-[#00E5FF] font-bold">{board.nra}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#222C3D] flex items-center justify-between">
                <a
                  href={`https://wa.me/${board.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(board.name)},%20perihal%20${encodeURIComponent(board.role)}%20NTCI`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Kontak Pengurus</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
