'use client';

import React, { useState, useMemo } from 'react';
import { MemberData } from '@/lib/mockData';
import { Search, Shield, CheckCircle, Eye, User, Layers, Grid, MapPin, Lock, LogIn, UserCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EktaModal from './EktaModal';
import { useAuth } from '@/context/AuthContext';

interface MemberDirectoryProps {
  members: MemberData[];
}

export default function MemberDirectory({ members }: MemberDirectoryProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GROUPED' | 'GRID'>('GROUPED');
  const [selectedEktaMember, setSelectedEktaMember] = useState<MemberData | null>(null);

  // Extract unique chapters from members
  const uniqueChapters = useMemo(() => {
    const map = new Map<string, string>();
    members.forEach((m) => {
      if (m.chapterName && !map.has(m.chapterName)) {
        map.set(m.chapterName, m.chapterSlug || m.chapterName.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      }
    });
    return Array.from(map.entries()).map(([name, slug]) => ({ name, slug }));
  }, [members]);

  // Filter members based on search and chapter selection
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.motorPlate.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChapter =
        selectedChapter === 'ALL' || m.chapterName === selectedChapter;

      return matchesSearch && matchesChapter;
    });
  }, [members, searchTerm, selectedChapter]);

  // Group members by chapter
  const groupedMembers = useMemo(() => {
    const groups: Record<string, MemberData[]> = {};
    filteredMembers.forEach((m) => {
      const chName = m.chapterName || 'NTCI Nasional';
      if (!groups[chName]) {
        groups[chName] = [];
      }
      groups[chName].push(m);
    });
    return groups;
  }, [filteredMembers]);

  return (
    <section className="py-20 bg-[#0D0B0A] border-t border-[#332722] relative text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
            <Shield className="w-3.5 h-3.5" />
            <span>DIREKTORI ANGGOTA RESMI SE-INDONESIA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Database Anggota NTCI Terverifikasi
          </h1>
          <p className="text-sm text-[#A39690]">
            Daftar rider Nmax Turbo terkelompok berdasarkan **Chapter Daerah**. Klik profil anggota untuk melihat biodata & E-KTA Digital.
          </p>
        </div>

        {/* Filters & Control Bar */}
        <div className="space-y-6 mb-12">
          
          {/* Top Bar: Search & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, NRA, nopol, atau chapter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171210] border border-[#332722] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center space-x-2 bg-[#171210] p-1.5 rounded-xl border border-[#332722] self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('GROUPED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'GROUPED'
                    ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-md'
                    : 'text-[#A39690] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grouped Per Chapter</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'GRID'
                    ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-md'
                    : 'text-[#A39690] hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Semua Grid</span>
              </button>
            </div>
          </div>

          {/* Chapter Filter Tabs - Scrollable on mobile */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={() => setSelectedChapter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
                selectedChapter === 'ALL'
                  ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-md ring-2 ring-[#D4AF37]/50'
                  : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
              }`}
            >
              Semua Chapter ({members.length})
            </button>

            {uniqueChapters.map((ch) => {
              const count = members.filter((m) => m.chapterName === ch.name).length;
              return (
                <button
                  type="button"
                  key={ch.name}
                  onClick={() => setSelectedChapter(ch.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
                    selectedChapter === ch.name
                      ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-md ring-2 ring-[#D4AF37]/50'
                      : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
                  }`}
                >
                  {ch.name.replace('NTCI Chapter ', '')} ({count})
                </button>
              );
            })}
          </div>

        </div>

        {/* Content: Grouped View */}
        {viewMode === 'GROUPED' ? (
          <div className="space-y-12">
            {Object.keys(groupedMembers).length > 0 ? (
              Object.entries(groupedMembers).map(([chapterName, chapterMembers]) => (
                <div key={chapterName} className="space-y-4">
                  {/* Chapter Section Header Banner */}
                  <div className="p-4 rounded-2xl bg-[#171210] border border-[#332722] flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#E5C158]">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{chapterName}</h3>
                        <p className="text-xs text-[#A39690]">{chapterMembers.length} Biker Terdaftar</p>
                      </div>
                    </div>

                    <Link
                      href={`/chapter/${chapterMembers[0]?.chapterSlug || 'jakarta-raya'}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors hidden sm:block"
                    >
                      Lihat Halaman Chapter ➔
                    </Link>
                  </div>

                  {/* Members Cards inside this chapter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapterMembers.map((m) => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        isMemberLoggedIn={isMemberLoggedIn}
                        onShowEkta={() => (isMemberLoggedIn ? setSelectedEktaMember(m) : setShowLoginModal(true))}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-[#A39690] text-sm">
                Tidak ada anggota ditemukan dengan kriteria pencarian tersebut.
              </div>
            )}
          </div>
        ) : (
          /* Content: Flat Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  isMemberLoggedIn={isMemberLoggedIn}
                  onShowEkta={() => (isMemberLoggedIn ? setSelectedEktaMember(m) : setShowLoginModal(true))}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-[#A39690] text-sm">
                Tidak ada anggota ditemukan.
              </div>
            )}
          </div>
        )}

      </div>

      {/* E-KTA Modal */}
      <EktaModal
        member={selectedEktaMember}
        onClose={() => setSelectedEktaMember(null)}
      />
    </section>
  );
}

{/* Sub-component: Member Card */}
function MemberCard({ member, onShowEkta, isMemberLoggedIn }: { member: MemberData; onShowEkta: () => void; isMemberLoggedIn: boolean }) {
  return (
    <div className="relative p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Link
          href={`/anggota/${member.nra}`}
          className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shrink-0 group-hover:scale-105 transition-transform"
        >
          <Image src={member.avatarUrl} alt={member.fullName} fill sizes="64px" className="object-cover" />
        </Link>

        {/* Member Info */}
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="font-mono text-xs font-bold text-[#E5C158]">
              {member.nra}
            </span>
            {member.isVerified && (
              <span className="flex items-center space-x-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle className="w-2.5 h-2.5" />
                <span>VERIFIED</span>
              </span>
            )}
            {member.status === 'INACTIVE' ? (
              <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full border border-slate-700">
                NONAKTIF
              </span>
            ) : (
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                AKTIF
              </span>
            )}
          </div>
          <Link
            href={`/anggota/${member.nra}`}
            className="font-bold text-white text-base truncate block hover:text-[#E5C158] transition-colors"
          >
            {member.fullName}
          </Link>
          <p className="text-xs text-[#A39690] truncate">{member.chapterName}</p>
        </div>
      </div>

      {/* Motor Details */}
      <div className="p-3 rounded-2xl bg-[#0D0B0A] border border-[#332722] text-xs space-y-1">
        <div className="flex justify-between text-slate-400">
          <span>Unit Motor:</span>
          <span className="text-white font-medium truncate">{member.motorModel}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Plat Nomor:</span>
          {isMemberLoggedIn ? (
            <span className="font-mono text-[#E5C158] font-bold">{member.motorPlate}</span>
          ) : (
            <span className="font-mono text-slate-400 font-bold flex items-center space-x-1" title="Login anggota untuk melihat plat nomor">
              <span>{member.motorPlate ? `${member.motorPlate.substring(0, 2)} **** ***` : 'B **** ***'}</span>
              <Lock className="w-3 h-3 text-[#D4AF37]" />
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#332722]">
        <Link
          href={`/anggota/${member.nra}`}
          className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] transition-all"
        >
          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Profil</span>
        </Link>

        <button
          onClick={onShowEkta}
          className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>E-KTA</span>
        </button>
      </div>
    </div>
  );
}
