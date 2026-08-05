'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, Mail, MapPin, AlertTriangle, Globe, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0B0A] border-t border-[#332722] pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0C05A] via-[#D4AF37] to-[#8C6B1C] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#171210] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F0C05A] to-[#D4AF37] text-lg">
                    NTCI
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-lg tracking-wider">
                  NTCI INDONESIA
                </span>
                <span className="text-[9px] font-extrabold text-[#D4AF37] uppercase tracking-widest">
                  Tech MAX Ultimate Edition
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A39690] leading-relaxed max-w-sm">
              Wadah komunikasi resmi dan persaudaraan bagi seluruh pemilik dan pecinta skuter matic Yamaha Nmax Turbo se-Indonesia. Menjunjung tinggi persaudaraan, etika berkendara (Safety Riding), dan aksi kepedulian sosial.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-[#171210] border border-[#332722] flex items-center justify-center text-slate-300 hover:text-[#E5C158] hover:border-[#D4AF37]/50 transition-colors" title="Website Official">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-[#171210] border border-[#332722] flex items-center justify-center text-slate-300 hover:text-[#D9383A] hover:border-[#D9383A]/50 transition-colors" title="Komunitas Chat">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-[#171210] border border-[#332722] flex items-center justify-center text-slate-300 hover:text-[#E5C158] hover:border-[#D4AF37]/50 transition-colors" title="Bagikan">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Menu Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/visi-misi" className="hover:text-white transition-colors">Visi & Misi</Link></li>
              <li><Link href="/struktur" className="hover:text-white transition-colors">Struktur Organisasi</Link></li>
              <li><Link href="/chapter" className="hover:text-white transition-colors">Directory Chapter</Link></li>
              <li><Link href="/anggota" className="hover:text-white transition-colors">Direktori Anggota</Link></li>
              <li><Link href="/ad-art" className="hover:text-white transition-colors">Dokumen AD-ART</Link></li>
              <li><Link href="/kalender" className="hover:text-white transition-colors">Kalender Agenda</Link></li>
            </ul>
          </div>

          {/* Col 3: Komunitas & Perks */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Fitur & Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sos" className="text-[#D9383A] font-bold hover:underline">NTCI SOS Touring</Link></li>
              <li><Link href="/warta" className="hover:text-white transition-colors">Warta & Tips Teknis</Link></li>
              <li><Link href="/merchandise" className="hover:text-white transition-colors">Katalog Merchandise</Link></li>
              <li><Link href="/sponsor" className="hover:text-white transition-colors">Sponsor & Diskon Partner</Link></li>
              <li><Link href="/registrasi" className="hover:text-white transition-colors">Form Pendaftaran Anggota</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Login Admin CMS</Link></li>
            </ul>
          </div>

          {/* Col 4: Sekretariat Pusat */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Sekretariat Pusat
            </h4>
            <div className="space-y-2 text-xs text-[#A39690]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Gedung Sekretariat NTCI Pusat, Jl. Asia Afrika No. 8, Senayan, Jakarta Pusat</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+62 812-3456-7890 (Humas)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>sekretariat@ntci.or.id</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sos"
                className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold bg-[#D9383A]/10 text-[#D9383A] border border-[#D9383A]/30 hover:bg-[#D9383A]/20 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Bantuan Darurat SOS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#332722] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A39690] space-y-4 sm:space-y-0">
          <p>© 2026 Nmax Turbo Club Indonesia (NTCI). All Rights Reserved.</p>
          <p className="flex items-center space-x-2">
            <span>Powered by Next.js & Supabase</span>
            <span className="text-[#D4AF37]">|</span>
            <span className="text-[#E5C158] font-bold">Tech MAX Ultimate Theme</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
