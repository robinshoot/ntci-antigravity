'use client';

import React from 'react';
import { DocumentData } from '@/lib/mockData';
import { FileText, Download, Shield, CheckCircle, ExternalLink, Lock, LogIn, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AdArtSectionProps {
  documents: DocumentData[];
}

export default function AdArtSection({ documents }: AdArtSectionProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();

  // If user is not logged in as a verified member, block AD-ART access
  if (!isMemberLoggedIn) {
    return (
      <section className="py-28 bg-[#080B10] border-t border-[#1C2433] relative min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-[#131924] border-2 border-[#D4AF37]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden mx-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#E5C158] shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase tracking-widest inline-block">
              RESTRICTED LEGAL DOCUMENTS
            </span>
            <h2 className="text-2xl font-black text-white">Dokumen AD-ART Terkunci</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dokumen Anggaran Dasar, Anggaran Rumah Tangga, dan SOP resmi NTCI ini hanya dapat diakses oleh Anggota Terverifikasi yang telah login.
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
      </section>
    );
  }
  return (
    <section className="py-20 bg-[#080B10] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131924] border border-[#00E5FF]/30 text-xs font-bold text-[#00E5FF]">
            <FileText className="w-3.5 h-3.5" />
            <span>LEGALITAS & LANDASAN HUKUM ORGANISASI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AD-ART & Dokumen Resmi NTCI
          </h2>
          <p className="text-sm text-slate-400">
            Anggaran Dasar, Anggaran Rumah Tangga, dan Standard Operating Procedure (SOP) resmi Nmax Turbo Club Indonesia.
          </p>
        </div>

        {/* Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#00E5FF]/40 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]">
                  {doc.category.replace('_', '-')}
                </span>
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#00E5FF] transition-colors">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#222C3D] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{doc.fileSize}</span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Mengunduh dokumen resmi: ${doc.title}`);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* AD-ART Highlight Overview Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#131924] via-[#1A2332] to-[#131924] border border-[#222C3D] space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#00E5FF]" />
            <span>Ringkasan Asas & Sifat AD-ART NTCI</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D]">
              <h4 className="font-bold text-[#00E5FF] mb-1">Pasal 1: Nama & Kedudukan</h4>
              <p>Nmax Turbo Club Indonesia disingkat NTCI berkedudukan pusat di DKI Jakarta dengan cabang chapter di seluruh Indonesia.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D]">
              <h4 className="font-bold text-[#00E5FF] mb-1">Pasal 2: Asas & Sifat</h4>
              <p>NTCI berasaskan Pancasila dan UUD 1945, bersifat mandiri, kekeluargaan, independen, dan non-politik praktis.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D]">
              <h4 className="font-bold text-[#00E5FF] mb-1">Pasal 3: Keanggotaan</h4>
              <p>Setiap pemilik Yamaha Nmax Turbo ber-KTP Indonesia dan memiliki SIM C aktif berhak mengajukan keanggotaan NTCI.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
