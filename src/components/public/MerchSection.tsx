'use client';

import React, { useState } from 'react';
import { MerchandiseData } from '@/lib/mockData';
import { ShoppingBag, QrCode, CheckCircle, X, Sparkles, Lock } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface MerchSectionProps {
  items: MerchandiseData[];
}

export default function MerchSection({ items }: MerchSectionProps) {
  const { isMemberLoggedIn, setShowLoginModal } = useAuth();
  const [selectedMerch, setSelectedMerch] = useState<MerchandiseData | null>(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
  };

  return (
    <section className="py-20 bg-[#0B0E14] border-t border-[#1C2433] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#171210] border border-[#D4AF37]/40 text-xs font-bold text-[#E5C158]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>MERCHANDISE & APPAREL RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Katalog Official Store NTCI
          </h2>
          <p className="text-sm text-[#A39690]">
            Dapatkan atribut resmi klub seperti Jaket Touring Waterproof, Polo Shirt, Sticker Pack 3M menyala, dan Emblem Patch.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-[#171210] border border-[#332722] hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0D0B0A]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0D0B0A]/80 text-[10px] font-mono font-bold text-[#E5C158] border border-[#D4AF37]/30 uppercase">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base truncate">{item.name}</h3>
                </div>

                <p className="text-xs text-[#A39690] leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="text-lg font-black text-[#E5C158]">
                  Rp {item.price.toLocaleString('id-ID')}
                </div>
              </div>

              {isMemberLoggedIn ? (
                <div className="pt-3 border-t border-[#332722] flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedMerch(item);
                      setPaymentSuccess(false);
                    }}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Bayar QRIS</span>
                  </button>
                  <a
                    href={item.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#241D1A] hover:bg-[#332722] border border-[#332722] inline-flex items-center justify-center"
                    title="Pesan via WhatsApp"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="pt-3 border-t border-[#332722]">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-[#E5C158] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#E5C158]" />
                    <span>Login untuk Beli Merchandise</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* QRIS PAYMENT CHECKOUT MODAL */}
      {selectedMerch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#171210] border border-[#332722] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#332722] pb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-white text-base">Pembayaran QRIS Instan NTCI Store</h3>
              </div>
              <button onClick={() => setSelectedMerch(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Pembayaran Berhasil Terverifikasi!</h4>
                <p className="text-xs text-slate-300">
                  Pesanan untuk <strong className="text-[#E5C158]">{selectedMerch.name} (Ukuran: {selectedSize})</strong> telah diproses. Pengurus Divisi Merchandise NTCI akan segera menghubungi WhatsApp Anda untuk konfirmasi alamat pengiriman.
                </p>
                <button
                  onClick={() => setSelectedMerch(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059]"
                >
                  Tutup Konfirmasi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#0D0B0A] border border-[#332722] flex items-center space-x-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#D4AF37]/30">
                    <Image src={selectedMerch.imageUrl} alt={selectedMerch.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{selectedMerch.name}</h4>
                    <p className="text-slate-400 text-[11px]">{selectedMerch.category}</p>
                    <p className="text-[#E5C158] font-extrabold text-sm mt-0.5">
                      Rp {selectedMerch.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[#E5C158] font-bold mb-1">Pilih Ukuran Apparel</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedSize === sz
                            ? 'bg-gradient-to-r from-[#F0C05A] to-[#D4AF37] text-[#171210] border-[#D4AF37]'
                            : 'bg-[#0D0B0A] text-slate-400 border-[#332722] hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QRIS Code Box */}
                <div className="p-4 rounded-2xl bg-white text-center space-y-2 border border-[#D4AF37]/50 shadow-inner">
                  <span className="text-[10px] text-slate-800 font-mono font-extrabold tracking-widest block uppercase">
                    SCAN QRIS DENGAN BCA / MANDIRI / GOPAY / OVO / DANA
                  </span>
                  <div className="relative w-44 h-44 mx-auto border-2 border-slate-900 rounded-xl overflow-hidden p-1 bg-white">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NTCI_STORE_QRIS_${selectedMerch.id}_${selectedMerch.price}`}
                      alt="QRIS Merchant NTCI"
                      width={170}
                      height={170}
                      className="mx-auto"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">NMAX TURBO CLUB INDONESIA STORE • NMID: ID1029384756</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-[#332722]">
                  <button
                    type="button"
                    onClick={() => setSelectedMerch(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#0D0B0A] text-slate-400 border border-[#332722]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] font-extrabold shadow-lg hover:opacity-90"
                  >
                    Simulasi Konfirmasi Pembayaran
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
