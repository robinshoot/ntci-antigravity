'use client';

import React, { useState } from 'react';
import { EventData } from '@/lib/mockData';
import { Calendar, MapPin, Users, CheckCircle2, Flag, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface EventCalendarProps {
  events: EventData[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});

  const categories = ['ALL', 'TOURING', 'KOPDAR', 'SOCIAL_CSR', 'ANNIVERSARY', 'WORKSHOP'];

  const filteredEvents = events.filter(
    (e) => activeCategory === 'ALL' || e.category === activeCategory
  );

  const handleRsvp = (id: string) => {
    setRsvpedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-20 bg-[#0D0B0A] border-t border-[#332722] relative text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
            <Calendar className="w-3.5 h-3.5" />
            <span>AGENDA & KALENDER KEGIATAN KLUB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Jadwal Touring, Kopdar & Event Tuan Rumah
          </h2>
          <p className="text-sm text-[#A39690]">
            Setiap kegiatan resmi NTCI diselenggarakan oleh **Chapter Tuan Rumah** sebagai penanggung jawab acara & posko penyelenggara.
          </p>
        </div>

        {/* Category Filters - Scrollable on mobile */}
        <div className="flex items-center justify-start md:justify-center gap-2 mb-10 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none touch-pan-x">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-md ring-2 ring-[#D4AF37]/50'
                  : 'bg-[#171210] text-[#A39690] border border-[#332722] hover:text-white hover:border-[#D4AF37]/40'
              }`}
            >
              {cat === 'ALL' ? 'Semua Agenda' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((ev) => {
            const isAttending = rsvpedEvents[ev.id];
            return (
              <div
                key={ev.id}
                className="relative rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/50 transition-all shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Banner Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={ev.bannerUrl}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171210] via-transparent to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#0D0B0A]/85 backdrop-blur-md text-[10px] font-extrabold text-[#E5C158] border border-[#D4AF37]/40 uppercase tracking-widest">
                    {ev.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/40 text-[#E5C158] font-bold">
                        <Flag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Tuan Rumah: {ev.chapterName}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#A39690] font-semibold">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{ev.attendingCount + (isAttending ? 1 : 0)} Hadir</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#E5C158] transition-colors leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#332722] text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#D9383A] shrink-0" />
                        <span>
                          {new Date(ev.startDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#332722] space-y-2">
                    {ev.chapterSlug && (
                      <Link
                        href={`/chapter/${ev.chapterSlug}`}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] transition-all"
                      >
                        <Flag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Lihat Profil Chapter Tuan Rumah</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        if (!isMemberLoggedIn) {
                          setShowLoginModal(true);
                          return;
                        }
                        handleRsvp(ev.id);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                        isAttending
                          ? 'bg-emerald-500 text-black'
                          : 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] hover:opacity-90'
                      }`}
                    >
                      {isMemberLoggedIn ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isAttending ? '✓ Kamu Terdaftar Hadir' : 'Konfirmasi Hadir (RSVP)'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-[#171210]" />
                          <span>Login untuk Konfirmasi Hadir (RSVP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
