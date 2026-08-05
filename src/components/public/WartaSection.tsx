'use client';

import React, { useState } from 'react';
import { ArticleData } from '@/lib/mockData';
import { Newspaper, Clock, User, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';

interface WartaSectionProps {
  articles: ArticleData[];
}

export default function WartaSection({ articles }: WartaSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  return (
    <section className="py-20 bg-[#080B10] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131924] border border-[#00E5FF]/30 text-xs font-bold text-[#00E5FF]">
            <Newspaper className="w-3.5 h-3.5" />
            <span>WARTA NTCI & TEKNIS NMAX TURBO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Artikel, Tips & Berita Komunitas
          </h2>
          <p className="text-sm text-slate-400">
            Dapatkan panduan perawatan Y-CVT, laporan touring lintas kota, serta edukasi etika berkendara resmi NTCI.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="relative rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#00E5FF]/40 transition-all shadow-xl overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedArticle(art)}
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131924] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#0B0E14]/80 backdrop-blur-md text-[10px] font-extrabold text-[#00E5FF] border border-white/10 uppercase">
                  {art.category.replace('_', ' ')}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-[#00E5FF]" />
                      <span>{art.authorName}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222C3D] flex items-center justify-between text-xs font-bold text-[#00E5FF] group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#131924] border border-[#222C3D] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222C3D] pb-3">
              <span className="text-xs font-mono text-[#00E5FF] font-bold">
                {selectedArticle.category.replace('_', ' ')}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl bg-[#0B0E14] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span>Penulis: {selectedArticle.authorName} ({selectedArticle.authorRole})</span>
              <span>•</span>
              <span>{selectedArticle.createdAt}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-60 w-full">
              <Image src={selectedArticle.coverImage} alt={selectedArticle.title} fill sizes="100vw" className="object-cover" />
            </div>

            <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-line pt-2 border-t border-[#222C3D]">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
