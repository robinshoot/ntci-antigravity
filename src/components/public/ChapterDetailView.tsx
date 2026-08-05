'use client';

import React, { useState } from 'react';
import { ChapterData, MemberData, EventData } from '@/lib/mockData';
import { MapPin, Users, Phone, Calendar, Shield, ArrowLeft, CheckCircle, Clock, Search, Eye, User, Sparkles, Flag, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EktaModal from './EktaModal';
import { useAuth } from '@/context/AuthContext';

interface ChapterDetailViewProps {
  chapter: ChapterData;
  members: MemberData[];
  events: EventData[];
}

export default function ChapterDetailView({ chapter, members, events }: ChapterDetailViewProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEktaMember, setSelectedEktaMember] = useState<MemberData | null>(null);

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.motorPlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 bg-[#0D0B0A] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link
          href="/chapter"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#A39690] hover:text-[#E5C158] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Chapter</span>
        </Link>

        {/* Chapter Hero Banner Header */}
        <div className="relative rounded-3xl bg-[#171210] border border-[#332722] p-8 shadow-2xl overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {chapter.status === 'DECLARED' ? (
                  <span className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>DEKLARASI RESMI</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>CHAPTER EMBRIO (PROSPEK)</span>
                  </span>
                )}

                <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase">
                  {chapter.region}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">{chapter.name}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39690] block text-[10px] uppercase font-bold">Lokasi Sekre (Sekretariat)</span>
                    <span>{chapter.kopdarLocation}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-[#D9383A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A39690] block text-[10px] uppercase font-bold">Jadwal Kopdar Rutin</span>
                    <span>{chapter.kopdarSchedule}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={`https://wa.me/${chapter.contactPhone.replace(/[^0-9]/g, '')}?text=Halo%20Ketua%20${encodeURIComponent(chapter.name)},%20saya%20tertarik%20bergabung`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-xl flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Hubungi Ketua ({chapter.leaderName})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section 1: Events Hosted by This Chapter */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Flag className="w-5 h-5 text-[#D4AF37]" />
              <span>Agenda & Event Tuan Rumah ({chapter.name})</span>
            </h2>
            <Link href="/kalender" className="text-xs text-[#E5C158] font-bold hover:underline flex items-center space-x-1">
              <span>Semua Agenda Kalender</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40">
                        {ev.category}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{ev.attendingCount} Biker Hadir</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#E5C158] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#A39690] line-clamp-2">{ev.description}</p>

                    <div className="space-y-1 text-xs text-slate-300 border-t border-[#332722] pt-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D9383A]" />
                        <span>{new Date(ev.startDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${chapter.contactPhone.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(chapter.name)},%20saya%20ingin%20RSVP%20Hadir%20pada%20Event%20${encodeURIComponent(ev.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold text-center text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-md block"
                  >
                    RSVP Konfirmasi Hadir
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#171210] border border-[#332722] text-center text-xs text-[#A39690]">
              Belum ada jadwal event besar dalam waktu dekat untuk chapter ini. Agenda rutin tetap berlangsung di Sekre sesuai jadwal Kopdar.
            </div>
          )}
        </div>

        {/* Section 2: Chapter Leadership Officers */}
        {chapter.officers && chapter.officers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#332722]">
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span>Struktur Pengurus {chapter.name}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapter.officers.map((off, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#171210] border border-[#332722] flex items-center space-x-4 shadow-lg hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shrink-0">
                    <Image
                      src={off.avatarUrl}
                      alt={off.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-[#E5C158] font-bold block truncate">
                      {off.role}
                    </span>
                    <h4 className="font-bold text-white text-base truncate">{off.name}</h4>
                    <span className="text-xs text-[#A39690] font-mono">{off.nra}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: All Members List of This Chapter */}
        <div className="space-y-6 pt-4 border-t border-[#332722]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <span>Daftar Anggota Terdaftar ({filteredMembers.length} Biker)</span>
              </h2>
              <p className="text-xs text-[#A39690]">
                Seluruh rider Nmax Turbo yang resmi terdaftar di {chapter.name}.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari anggota atau nopol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171210] border border-[#332722] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Member Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="relative p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <Link href={`/anggota/${m.nra}`} className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shrink-0 group-hover:scale-105 transition-transform">
                    <Image src={m.avatarUrl} alt={m.fullName} fill sizes="64px" className="object-cover" />
                  </Link>

                  {/* Member Info */}
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#E5C158]">
                        {m.nra}
                      </span>
                      {m.isVerified && (
                        <span className="flex items-center space-x-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>VERIFIED</span>
                        </span>
                      )}
                    </div>
                    <Link href={`/anggota/${m.nra}`} className="font-bold text-white text-base truncate block hover:text-[#E5C158] transition-colors">
                      {m.fullName}
                    </Link>
                    <p className="text-xs text-[#A39690] truncate">{m.role.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Motor Details */}
                <div className="p-3 rounded-2xl bg-[#0D0B0A] border border-[#332722] text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Unit Motor:</span>
                    <span className="text-white font-medium truncate">{m.motorModel}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Plat Nomor:</span>
                    {isMemberLoggedIn ? (
                      <span className="font-mono text-[#E5C158] font-bold">{m.motorPlate}</span>
                    ) : (
                      <span className="font-mono text-slate-400 font-bold flex items-center space-x-1" title="Login anggota untuk melihat plat nomor">
                        <span>{m.motorPlate ? `${m.motorPlate.substring(0, 2)} **** ***` : 'B **** ***'}</span>
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#332722]">
                  <Link
                    href={`/anggota/${m.nra}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Profil</span>
                  </Link>

                  <button
                    onClick={() => (isMemberLoggedIn ? setSelectedEktaMember(m) : setShowLoginModal(true))}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>E-KTA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <EktaModal
        member={selectedEktaMember}
        onClose={() => setSelectedEktaMember(null)}
      />
    </div>
  );
}
