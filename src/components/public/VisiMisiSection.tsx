'use client';

import React from 'react';
import { Target, Compass, ShieldCheck, HeartHandshake, Award, Users } from 'lucide-react';

export default function VisiMisiSection() {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />,
      title: 'Safety Riding Utama',
      desc: 'Menaati seluruh peraturan lalu lintas, menggunakan perlengkapan keselamatan standar SNI/DOT, dan mengedepankan etika berkendara sopan di jalan raya.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#FF2E55]" />,
      title: 'Solidaritas & Brotherhood',
      desc: 'Merajut hubungan kekeluargaan tanpa membedakan latar belakang, pekerjaan, atau agama. Saling membantu saat sesama rider mengalami musibah.',
    },
    {
      icon: <Compass className="w-6 h-6 text-[#FFC700]" />,
      title: 'Eksplorasi Keindahan Nusantara',
      desc: 'Mendokumentasikan keindahan alam dan budaya Indonesia melalui agenda touring resmi serta mendukung sektor pariwisata daerah.',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: 'Bakti Sosial & Tanggap Bencana',
      desc: 'Aktif menyelenggarakan program kepedulian sosial, donasi anak yatim, pembersihan lingkungan, dan aksi cepat tanggap bencana.',
    },
  ];

  return (
    <section className="py-20 bg-[#0B0E14] border-t border-[#1C2433] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#131924] border border-[#00E5FF]/30 text-xs font-bold text-[#00E5FF]">
            <Target className="w-3.5 h-3.5" />
            <span>LANDASAN ORGANISASI NTCI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Visi & Misi Nmax Turbo Club Indonesia
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Komitmen kami untuk membangun komunitas pelopor keselamatan berkendara yang solid, bermartabat, dan memberi dampak positif bagi masyarakat Indonesia.
          </p>
        </div>

        {/* Grid Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Visi Card */}
          <div className="relative p-8 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#00E5FF]/40 transition-all shadow-xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide">
              VISI ORGANISASI
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              &quot;Menjadi pelopor klub motor matic terbesar, tersolid, dan terpercaya di Indonesia yang menjunjung tinggi nilai-nilai persaudaraan (Brotherhood), keselamatan berkendara (Safety Riding), serta kontribusi nyata bagi masyarakat dan pariwisata Indonesia.&quot;
            </p>
          </div>

          {/* Misi Card */}
          <div className="relative p-8 rounded-3xl bg-[#131924] border border-[#222C3D] hover:border-[#FF2E55]/40 transition-all shadow-xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2E55]/10 border border-[#FF2E55]/30 flex items-center justify-center text-[#FF2E55] group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide">
              MISI UTAMA
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-[#FF2E55] font-bold">1.</span>
                <span>Membangun jaringan chapter NTCI di seluruh kabupaten/kota se-Indonesia.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#FF2E55] font-bold">2.</span>
                <span>Menyelenggarakan kegiatan touring, kopdar, dan musyawarah yang transparan & edukatif.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#FF2E55] font-bold">3.</span>
                <span>Memfasilitasi perlindungan dan bantuan darurat (SOS) bagi anggota di seluruh rute Indonesia.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#FF2E55] font-bold">4.</span>
                <span>Bekerja sama dengan produsen, kepolisian, dan sponsor untuk kemajuan anggota.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4 Pilar Prinsip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#131924]/60 border border-[#222C3D] hover:border-[#00E5FF]/30 transition-all space-y-3"
            >
              <div className="mb-2">{val.icon}</div>
              <h4 className="font-bold text-white text-base">{val.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
