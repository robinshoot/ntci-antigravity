'use client';

import React, { useState, useRef } from 'react';
import { MemberData } from '@/types';
import { X, Camera, Upload, Sparkles, Lock, Shield, Check, AlertCircle, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface EditProfileModalProps {
  member: MemberData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: MemberData) => void;
}

// Curated rider avatars preset
const PRESET_AVATARS = [
  {
    label: 'Tech MAX Rider',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Sport Touring',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Road Captain',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Pioneer Biker',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Night Rider',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Lady Biker',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
];

export default function EditProfileModal({ member, isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState(member.fullName);
  const [phone, setPhone] = useState(member.phone);
  const [domicile, setDomicile] = useState(member.domicile || '');
  const [motorYear, setMotorYear] = useState(member.motorYear || '2024');
  const [motorColor, setMotorColor] = useState(member.motorColor || 'Magma Black');
  const [motorPlate, setMotorPlate] = useState(member.motorPlate || '');
  const [motorMods, setMotorMods] = useState(member.motorMods || '');
  const [avatarUrl, setAvatarUrl] = useState(member.avatarUrl || PRESET_AVATARS[0].url);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Tab for photo selection: 'upload' | 'presets' | 'url'
  const [photoTab, setPhotoTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Handle image upload with auto-resize via canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    // Max 10MB input file
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar (maksimal 10MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Compress & resize image to max 400x400 for optimal fast loading
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
          setErrorMessage('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        id: member.id,
        nra: member.nra,
        fullName,
        phone,
        domicile,
        avatarUrl,
        motorYear,
        motorColor,
        motorPlate,
        motorMods,
        ...(password.trim().length >= 6 ? { password: password.trim() } : {}),
      };

      const res = await fetch('/api/member/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan perubahan');
      }

      setSuccessMessage('Profil Anda berhasil diperbarui!');
      onSuccess(data.user);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat menyimpan profil.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#131924] border border-[#222C3D] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl my-8">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#222C3D] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Edit Profil Mandiri</h3>
              <p className="text-xs text-[#A39690]">
                Ubah foto profil, kontak WhatsApp, dan rincian motor Nmax Turbo Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Feedback */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 font-bold">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6 text-xs">
          
          {/* SECTION 1: FOTO PROFIL */}
          <div className="p-5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] space-y-4">
            <label className="block text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[#00E5FF]" />
                <span>Foto Profil Rider</span>
              </span>
              <span className="text-[11px] font-normal text-[#A39690]">Mendukung JPG, PNG, WebP</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group w-28 h-28 rounded-3xl overflow-hidden border-4 border-[#00E5FF]/50 shadow-xl shrink-0 bg-[#171210]">
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1 cursor-pointer"
                  title="Klik untuk upload foto baru"
                >
                  <Camera className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-[10px] font-bold">Ganti Foto</span>
                </button>
              </div>

              {/* Photo Controls */}
              <div className="flex-1 space-y-3 w-full">
                {/* Method Tabs */}
                <div className="flex rounded-xl bg-[#131924] p-1 border border-[#222C3D]">
                  <button
                    type="button"
                    onClick={() => setPhotoTab('upload')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                      photoTab === 'upload'
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload Perangkat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoTab('presets')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                      photoTab === 'presets'
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pilih Avatar Biker
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoTab('url')}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all ${
                      photoTab === 'url'
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Link URL
                  </button>
                </div>

                {/* Tab 1: Direct File Upload */}
                {photoTab === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#00E5FF]/40 bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 text-[#00E5FF] font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih Foto dari Galeri / Kamera</span>
                    </button>
                  </div>
                )}

                {/* Tab 2: Presets */}
                {photoTab === 'presets' && (
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        title={preset.label}
                        className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl === preset.url
                            ? 'border-[#00E5FF] scale-105 shadow-md shadow-[#00E5FF]/30'
                            : 'border-[#222C3D] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={preset.url} alt={preset.label} fill sizes="44px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab 3: Custom URL */}
                {photoTab === 'url' && (
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-[#131924] border border-[#222C3D] text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          setAvatarUrl(customUrlInput.trim());
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#222C3D] hover:bg-slate-700 text-white font-bold"
                    >
                      Gunakan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: INFORMASI PRIBADI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#222C3D] text-white font-medium focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#222C3D] text-white font-medium focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kota Domisili</label>
              <input
                type="text"
                value={domicile}
                onChange={(e) => setDomicile(e.target.value)}
                placeholder="Contoh: Jakarta Selatan, Bandung, dll."
                className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#222C3D] text-white font-medium focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {/* Read-Only NRA & Chapter */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>Chapter & NRA Resmi</span>
                <span className="text-[10px] text-amber-400 flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Otoritas Admin</span>
                </span>
              </label>
              <div className="p-3 rounded-xl bg-[#0B0E14]/60 border border-[#222C3D] text-slate-400 flex items-center justify-between">
                <span className="font-bold text-slate-300">{member.chapterName || 'Belum Ditugaskan'}</span>
                <span className="font-mono text-xs font-bold text-[#E5C158]">{member.nra}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: DATA SPESIFIKASI MOTOR NMAX TURBO */}
          <div className="p-5 rounded-2xl bg-[#0B0E14] border border-[#222C3D] space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Spesifikasi Unit Nmax Turbo Anda</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Tahun Perakitan</label>
                <select
                  value={motorYear}
                  onChange={(e) => setMotorYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#131924] border border-[#222C3D] text-white font-semibold"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Warna Motor</label>
                <input
                  type="text"
                  value={motorColor}
                  onChange={(e) => setMotorColor(e.target.value)}
                  placeholder="Magma Black, Dark Red, dll."
                  className="w-full p-2.5 rounded-xl bg-[#131924] border border-[#222C3D] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Plat Nomor (Nopol)</label>
                <input
                  type="text"
                  value={motorPlate}
                  onChange={(e) => setMotorPlate(e.target.value)}
                  placeholder="B 1234 NT"
                  className="w-full p-2.5 rounded-xl bg-[#131924] border border-[#222C3D] text-[#00E5FF] font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Catatan Modifikasi / Part Tambahan</label>
              <textarea
                rows={2}
                value={motorMods}
                onChange={(e) => setMotorMods(e.target.value)}
                placeholder="Contoh: Knalpot Akrapovic, Windshield Tall Touring, Y-CVT Sport Mode, Box Givi 43L..."
                className="w-full p-2.5 rounded-xl bg-[#131924] border border-[#222C3D] text-white resize-none"
              />
            </div>
          </div>

          {/* SECTION 4: GANTI PASSWORD (OPSIONAL) */}
          <div className="p-4 rounded-2xl bg-[#0B0E14] border border-[#222C3D] space-y-2">
            <label className="block text-slate-300 font-semibold flex items-center justify-between">
              <span>Ganti Password Akun (Opsional)</span>
              <span className="text-[10px] text-slate-500">Kosongkan jika tidak ingin mengubah</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru (minimal 6 karakter)"
                className="w-full p-3 rounded-xl bg-[#131924] border border-[#222C3D] text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#222C3D]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[#131924] hover:bg-[#1C2433] border border-[#222C3D] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black text-black bg-gradient-to-r from-[#00E5FF] via-[#00B4D8] to-[#3B82F6] hover:opacity-95 transition-all shadow-lg shadow-[#00E5FF]/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
