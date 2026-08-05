'use client';

import { generateQrCodeSvg } from '@/lib/qrcode';

import React from 'react';
import { MemberData } from '@/lib/mockData';
import { X, Printer, Shield, CheckCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface EktaModalProps {
  member: MemberData | null;
  onClose: () => void;
}

export default function EktaModal({ member, onClose }: EktaModalProps) {
  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#171210] border border-[#332722] rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#332722] pb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-extrabold text-white tracking-wide">
              E-KTA Digital NTCI Indonesia (Tech MAX Edition)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0D0B0A] text-slate-400 hover:text-white border border-[#332722]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div id="printable-ekta" className="relative">
          {/* Credit Card Shaped Digital E-KTA */}
          <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#0D0B0A] via-[#1F1714] to-[#120E0D] border-2 border-[#D4AF37]/50 p-6 shadow-2xl overflow-hidden flex flex-col justify-between group">
            {/* Background Tech Decorative Pattern */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#332722_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0C05A] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#171210] rounded-[9px] flex items-center justify-center">
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0C05A] to-[#E2E8F0] text-sm">
                      NTCI
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm tracking-wider uppercase">
                    Nmax Turbo Club Indonesia
                  </h4>
                  <p className="text-[9px] text-[#E5C158] font-mono tracking-widest uppercase font-bold">
                    TECH MAX ULTIMATE E-KTA
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-bold text-[#E5C158]">
                <CheckCircle className="w-3 h-3 text-[#E5C158]" />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Card Body Info */}
            <div className="relative z-10 grid grid-cols-3 gap-4 items-center my-2">
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-lg">
                <Image
                  src={member.avatarUrl}
                  alt={member.fullName}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="col-span-2 space-y-1">
                <div>
                  <span className="text-[9px] text-[#A39690] uppercase tracking-widest block font-medium">
                    Nama Anggota
                  </span>
                  <h3 className="font-extrabold text-white text-base truncate">
                    {member.fullName}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[8px] text-[#A39690] uppercase tracking-widest block font-medium">
                      NRA (No. Registrasi)
                    </span>
                    <span className="font-mono font-black text-[#E5C158]">
                      {member.nra}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#A39690] uppercase tracking-widest block font-medium">
                      Chapter
                    </span>
                    <span className="font-bold text-slate-200 truncate block">
                      {member.chapterName.replace('NTCI Chapter ', '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Info */}
            <div className="relative z-10 flex items-end justify-between border-t border-[#D4AF37]/30 pt-3">
              <div className="space-y-0.5">
                <span className="text-[8px] text-[#A39690] uppercase tracking-widest block font-medium">
                  Spesifikasi Kendaraan
                </span>
                <p className="text-[10px] text-slate-300 font-semibold">
                  {member.motorModel} ({member.motorYear}) • Plat {member.motorPlate}
                </p>
              </div>

              {/* Vector SVG QR Code */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-[#D4AF37]/60 shadow-md relative overflow-hidden bg-white p-0.5"
                dangerouslySetInnerHTML={{ __html: generateQrCodeSvg(`NTCI_VERIFIED_${member.nra || 'MEMBER'}`, 52) }}
              />
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#332722]">
          <p className="text-xs text-[#A39690] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Tunjukkan E-KTA ini untuk klaim promo & diskon partner NTCI</span>
          </p>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Halo, ini E-KTA Digital NTCI Resmi atas nama ${member.fullName} (NRA: ${member.nra}). Verifikasi resmi NTCI: https://ntci.or.id/anggota/${member.nra}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722]"
            >
              <span>Bagikan WhatsApp</span>
            </a>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
