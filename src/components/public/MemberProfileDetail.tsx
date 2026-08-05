'use client';

import React, { useState } from 'react';
import { MemberData } from '@/lib/mockData';
import { Shield, CheckCircle, MapPin, Calendar, Phone, Mail, Award, ArrowLeft, Printer, Sparkles, UserCheck, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EktaModal from './EktaModal';
import { useAuth } from '@/context/AuthContext';

interface MemberProfileDetailProps {
  member: MemberData;
}

export default function MemberProfileDetail({ member }: MemberProfileDetailProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();
  const [showEktaModal, setShowEktaModal] = useState(false);

  // If user is not logged in as a verified member, block profile detail view
  if (!isMemberLoggedIn) {
    return (
      <div className="pt-28 pb-20 bg-[#080B10] min-h-screen text-slate-200 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#131924] border-2 border-[#D4AF37]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#E5C158] shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase tracking-widest inline-block">
              RESTRICTED MEMBER PROFILE
            </span>
            <h2 className="text-2xl font-black text-white">Profil Anggota Terkunci</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Profil lengkap rider & e-KTA anggota NTCI ini hanya dapat diakses oleh Anggota Terverifikasi yang telah login.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] font-extrabold text-xs shadow-xl hover:opacity-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Anggota (Login)</span>
            </button>

            <Link
              href="/registrasi"
              className="w-full py-3 rounded-xl bg-[#0B0E14] text-slate-300 hover:text-white border border-[#222C3D] text-xs font-bold flex items-center justify-center space-x-2 block"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Daftar Anggota Baru</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#080B10] min-h-screen text-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/anggota"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Anggota</span>
        </Link>

        {/* Profile Header Hero Card */}
        <div className="relative rounded-3xl bg-[#131924] border border-[#222C3D] p-8 shadow-2xl overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF2E55]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {/* Avatar */}
            <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-[#00E5FF]/40 shadow-2xl shrink-0">
              <Image
                src={member.avatarUrl}
                alt={member.fullName}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                  {member.nra}
                </span>

                {member.isVerified && (
                  <span className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>VERIFIED MEMBER</span>
                  </span>
                )}

                <span className="px-3 py-1 rounded-xl bg-[#FF2E55]/10 text-[#FF2E55] text-xs font-bold border border-[#FF2E55]/30 uppercase">
                  {member.role.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-black text-white">{member.fullName}</h1>
                <p className="text-sm font-semibold text-[#00E5FF] flex items-center justify-center md:justify-start space-x-1.5 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{member.chapterName}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#222C3D]">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Bergabung: {member.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#222C3D]">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => setShowEktaModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] hover:opacity-90 transition-all shadow-xl"
                >
                  <Shield className="w-4 h-4" />
                  <span>Buka E-KTA Digital</span>
                </button>

                <a
                  href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(member.fullName)},%20salam%20satu%20aspal%20NTCI!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1C2433] hover:bg-[#222C3D] border border-[#222C3D] transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Kirim Pesan WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Motorcycle Specifications & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Motor Spec */}
          <div className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              <span>Spesifikasi Kendaraan Nmax Turbo</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] flex justify-between items-center">
                <span className="text-slate-400 font-medium">Model Kendaraan</span>
                <span className="font-bold text-white text-sm">{member.motorModel}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] flex justify-between items-center">
                <span className="text-slate-400 font-medium">Plat Nomor (Nopol)</span>
                <span className="font-mono text-base font-extrabold text-[#00E5FF]">{member.motorPlate}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] flex justify-between items-center">
                <span className="text-slate-400 font-medium">Warna Unit</span>
                <span className="font-semibold text-white">{member.motorColor}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] flex justify-between items-center">
                <span className="text-slate-400 font-medium">Tahun Perakitan</span>
                <span className="font-semibold text-white">{member.motorYear}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Modifications & Perks Status */}
          <div className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#FF2E55]" />
                <span>Modifikasi & Status Keanggotaan</span>
              </h3>

              {member.motorMods && (
                <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D] space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Catatan Modifikasi</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {member.motorMods}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Poin Keaktifan Rider:</span>
                  <span className="text-[#00E5FF] font-mono font-extrabold text-sm">{member.points || 150} Poin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Proteksi SOS Emergency:</span>
                  <span className="text-emerald-400 font-bold">TERLINDUNGI</span>
                </div>
              </div>

              {/* Badges Section */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Lencana Prestasi Komunitas</span>
                <div className="flex flex-wrap gap-2">
                  {(member.badges || ['Pioneer Biker', 'Y-CVT Tech Rider']).map((badge, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-bold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#00E5FF]" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEktaModal(true)}
              className="w-full py-3 rounded-2xl text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Download Kartu E-KTA</span>
            </button>
          </div>

        </div>

      </div>

      <EktaModal
        member={showEktaModal ? member : null}
        onClose={() => setShowEktaModal(false)}
      />
    </div>
  );
}
