'use client';

import React, { useState } from 'react';
import { EmergencyContactData } from '@/lib/mockData';
import { AlertTriangle, Phone, Wrench, Shield, MapPin, Search, PhoneCall } from 'lucide-react';

interface EmergencySosSectionProps {
  contacts: EmergencyContactData[];
}

export default function EmergencySosSection({ contacts }: EmergencySosSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roleOrLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 bg-[#0B0E14] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Alert */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FF2E55]/20 via-[#131924] to-[#FF2E55]/10 border border-[#FF2E55]/40 shadow-2xl mb-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF2E55]/20 text-[#FF2E55] text-xs font-bold border border-[#FF2E55]/30">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>NTCI EMERGENCY STORING ASSISTANCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Bantuan Darurat Touring & Towing
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Alami kendala mesin, kecelakaan, atau butuh towing/storing saat touring di jalur luar kota? Hubungi posko emergency chapter NTCI terdekat!
              </p>
            </div>
            
            <a
              href="tel:+6281234567890"
              className="px-6 py-3.5 rounded-xl font-black text-white bg-[#FF2E55] hover:bg-[#FF2E55]/90 transition-all shadow-xl flex items-center space-x-2 shrink-0 animate-pulse"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Center SOS Pusat</span>
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari chapter, lokasi rute, atau kontak mekanik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131924] border border-[#222C3D] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF2E55]"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#FF2E55]/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF2E55]/10 text-[#FF2E55]">
                  {c.chapterName}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-[#00E5FF]" />
                  <span>{c.contactPerson}</span>
                </h3>
                <p className="text-xs text-slate-300 flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{c.roleOrLocation}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-[#222C3D]">
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=SOS%20NTCI!%20Saya%20mengalami%20kendala%20darurat%20di%20jalan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF2E55]/20 hover:bg-[#FF2E55]/30 border border-[#FF2E55]/40 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#FF2E55]" />
                  <span>Hubungi Via WhatsApp: {c.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
