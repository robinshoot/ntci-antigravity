import React from 'react';
import { SponsorData } from '@/lib/mockData';
import { Award, ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';

interface SponsorSectionProps {
  sponsors: SponsorData[];
}

export default function SponsorSection({ sponsors }: SponsorSectionProps) {
  return (
    <section className="py-20 bg-[#080B10] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131924] border border-[#00E5FF]/30 text-xs font-bold text-[#00E5FF]">
            <Award className="w-3.5 h-3.5" />
            <span>PARTNER & BENEFIT KARTU ANGGOTA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sponsor & Diskon Khusus Pemegang E-KTA
          </h2>
          <p className="text-sm text-slate-400">
            Nikmati berbagai penawaran harga khusus, diskon servis, dan cashback di bengkel & merchant partner resmi NTCI.
          </p>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#00E5FF]/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-28 w-full rounded-2xl bg-[#0B0E14] overflow-hidden border border-[#222C3D]">
                  <Image src={sp.logoUrl} alt={sp.name} fill sizes="250px" className="object-contain p-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]">
                  {sp.category}
                </span>
                <h3 className="font-bold text-white text-base">{sp.name}</h3>
                <div className="p-3 rounded-2xl bg-[#0B0E14] border border-[#222C3D] text-xs text-slate-300 flex items-start space-x-2">
                  <Tag className="w-4 h-4 text-[#FF2E55] shrink-0 mt-0.5" />
                  <span>{sp.discountDetail}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#222C3D]">
                <a
                  href={sp.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-[#1C2433] hover:text-white transition-all border border-[#222C3D]"
                >
                  <span>Kunjungi Merchant</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
