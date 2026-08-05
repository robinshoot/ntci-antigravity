'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, UserCheck, Lock } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  interface NavItem {
    name: string;
    href: string;
    fullName?: string;
    highlight?: boolean;
  }

  const primaryNavLinks: NavItem[] = [
    { name: 'Beranda', href: '/' },
    { name: 'Visi & Misi', href: '/visi-misi' },
    { name: 'Struktur', fullName: 'Struktur Organisasi', href: '/struktur' },
    { name: 'Chapter', href: '/chapter' },
    { name: 'Anggota', href: '/anggota' },
    { name: 'AD-ART', href: '/ad-art' },
  ];

  const secondaryNavLinks: NavItem[] = [
    { name: 'Kalender Kegiatan', href: '/kalender' },
    { name: 'Warta & Tips', href: '/warta' },
    { name: 'Merchandise', href: '/merchandise' },
    { name: 'Sponsor & Perks', href: '/sponsor' },
    { name: 'SOS Darurat', href: '/sos', highlight: true },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isSecondaryActive = secondaryNavLinks.some(
    (link) => pathname === link.href
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0D0B0A]/95 backdrop-blur-md border-b border-[#332722] py-3 shadow-2xl'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform duration-300 shrink-0 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                <Image
                  src="/logo.png"
                  alt="Logo Resmi NTCI Indonesia"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 whitespace-nowrap">
                  <span className="font-black text-white text-sm sm:text-lg tracking-wider group-hover:text-[#D4AF37] transition-colors">
                    NTCI INDONESIA
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/40 uppercase tracking-tighter shrink-0">
                    TECH MAX
                  </span>
                </div>
                <span className="hidden sm:block text-[9px] sm:text-[10px] text-[#A39690] font-semibold tracking-widest uppercase whitespace-nowrap">
                  Nmax Turbo Club Indonesia
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {primaryNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Dropdown More (Lainnya) */}
              <div className="relative group" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1 ${
                    isSecondaryActive || dropdownOpen
                      ? 'bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span>Lainnya</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full pt-1.5 w-56 z-50 ${dropdownOpen ? 'block' : 'hidden group-hover:block'}`}>
                  <div className="rounded-2xl bg-[#171210]/95 border border-[#332722] shadow-2xl p-2 backdrop-blur-xl space-y-0.5">
                    {secondaryNavLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                            isActive
                              ? 'bg-[#D4AF37]/20 text-[#E5C158]'
                              : link.highlight
                              ? 'text-[#D9383A] font-extrabold hover:bg-[#D9383A]/15'
                              : 'text-slate-300 hover:text-[#E5C158] hover:bg-white/5'
                          }`}
                        >
                          <span>{link.name}</span>
                          {link.highlight && (
                            <span className="w-2 h-2 rounded-full bg-[#D9383A] animate-pulse" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>

            {/* Action CTAs */}
            <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
              <Link
                href="/registrasi"
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] hover:opacity-95 transition-all shadow-lg flex items-center space-x-1.5 whitespace-nowrap shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Daftar Anggota</span>
              </Link>

              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#E5C158] bg-[#171210] hover:bg-[#241D1A] border border-[#D4AF37]/40 transition-all flex items-center space-x-1.5 whitespace-nowrap shrink-0"
              >
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>CMS Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 rounded-xl bg-[#171210] border border-[#D4AF37]/60 text-[#E5C158] hover:bg-[#241D1A] transition-all shadow-xl focus:outline-none flex items-center space-x-1.5 cursor-pointer active:scale-95"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5 text-[#E5C158]" /> : <Menu className="w-5 h-5 text-[#E5C158]" />}
                <span className="text-xs font-black uppercase tracking-wider text-[#E5C158]">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer Rendered Outside Header Containing Block */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-[#0D0B0A]/98 text-white p-5 pt-20 flex flex-col justify-between overflow-y-auto shadow-2xl animate-fadeIn backdrop-blur-2xl">
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#332722]">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-9 h-9 shrink-0 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                  <Image
                    src="/logo.png"
                    alt="Logo Resmi NTCI Indonesia"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">NTCI INDONESIA</h4>
                  <p className="text-[10px] text-[#A39690] uppercase font-mono font-semibold">Menu Navigasi Mobile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#171210] border border-[#332722] text-xs font-bold text-[#E5C158] cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>

            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {allNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] text-[#171210] shadow-xl'
                        : link.highlight
                        ? 'bg-[#D9383A]/20 text-[#D9383A] border border-[#D9383A]/50 font-black'
                        : 'bg-[#171210] text-slate-200 border border-[#332722] hover:bg-[#241D1A] hover:text-[#E5C158]'
                    }`}
                  >
                    <span>{link.fullName || link.name}</span>
                    {link.highlight && (
                      <span className="w-2 h-2 rounded-full bg-[#D9383A] shrink-0 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Drawer Bottom Actions */}
          <div className="pt-6 border-t border-[#332722] grid grid-cols-2 gap-3 mt-6">
            <Link
              href="/registrasi"
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-center text-[#171210] bg-gradient-to-r from-[#F0C05A] via-[#D4AF37] to-[#C5A059] shadow-xl flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Daftar Anggota</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-center text-[#E5C158] bg-[#171210] border border-[#D4AF37]/50 flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>CMS Admin</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

