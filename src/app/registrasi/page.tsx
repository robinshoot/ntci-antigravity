'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegistrasiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [assignedNra, setAssignedNra] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [domicile, setDomicile] = useState('');
  const [chapter, setChapter] = useState('NTCI Chapter Jakarta Raya');
  const [motorYear, setMotorYear] = useState('2024');
  const [motorPlate, setMotorPlate] = useState('');
  const [motorColor, setMotorColor] = useState('Magma Black');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          domicile,
          motorYear,
          motorPlate,
          motorColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pendaftaran');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#0D0B0A] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#171210] border border-[#332722] rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
            <Shield className="w-3.5 h-3.5" />
            <span>FORMULIR PENDAFTARAN ANGGOTA NTCI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Gabung Bersama NTCI Indonesia
          </h1>
          <p className="text-xs sm:text-sm text-[#A39690]">
            Lengkapi data diri Anda. Pendaftaran ini akan ditinjau dan diotorisasi oleh Admin NTCI untuk penentuan Chapter & penerbitan NRA E-KTA.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Pendaftaran Berhasil & Tersimpan!</h3>
            <p className="text-xs text-slate-300">
              Data pendaftaran Anda telah resmi tersimpan di database dan sedang <strong className="text-[#E5C158]">Menunggu Otorisasi Admin NTCI</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Admin akan memverifikasi berkas, menentukan Chapter daerah Anda, serta menerbitkan Nomor NRA & E-KTA digital resmi Anda.
            </p>
            <div className="pt-2">
              <Link
                href="/anggota"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059]"
              >
                <span>Lihat Direktori Anggota</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap (Sesuai KTP)</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Aktif</label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+62 812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#332722] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#E5C158] font-bold mb-1">Kota / Kabupaten Domisili</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Bandung / Solo / Jakarta Selatan"
                  value={domicile}
                  onChange={(e) => setDomicile(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D0B0A] border border-[#D4AF37]/50 text-white font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#332722] space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Detail Spesifikasi Nmax Turbo</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tahun Perakitan</label>
                  <input
                    type="text"
                    value={motorYear}
                    onChange={(e) => setMotorYear(e.target.value)}
                    placeholder="2024"
                    className="w-full p-2.5 rounded-xl bg-[#171210] border border-[#332722] text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Plat Nomor (Nopol)</label>
                  <input
                    type="text"
                    required
                    value={motorPlate}
                    onChange={(e) => setMotorPlate(e.target.value)}
                    placeholder="B 1234 NMX"
                    className="w-full p-2.5 rounded-xl bg-[#171210] border border-[#332722] text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Warna Unit</label>
                  <input
                    type="text"
                    value={motorColor}
                    onChange={(e) => setMotorColor(e.target.value)}
                    placeholder="Magma Black"
                    className="w-full p-2.5 rounded-xl bg-[#171210] border border-[#332722] text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-xl text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#171210]" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <span>Kirim Pendaftaran & Ajukan E-KTA</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
