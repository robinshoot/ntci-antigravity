'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemberData } from '@/types';

interface AuthContextType {
  currentUser: MemberData | null;
  isMemberLoggedIn: boolean;
  loginMember: (identifier: string, pass: string, membersList?: MemberData[]) => { success: boolean; message: string };
  logoutMember: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isMemberLoggedIn: false,
  loginMember: () => ({ success: false, message: '' }),
  logoutMember: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<MemberData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Load member session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ntci_member_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.member) {
          setCurrentUser(parsed.member);
        }
      } catch (e) {
        localStorage.removeItem('ntci_member_session');
      }
    }
  }, []);

  const loginMember = (identifier: string, pass: string, membersList?: MemberData[]) => {
    if (!identifier.trim() || !pass.trim()) {
      return { success: false, message: 'Harap isi NRA/Email dan Password!' };
    }

    const query = identifier.trim().toLowerCase();
    const password = pass.trim();

    // Default fallback sample member: Bambang "Turbo" Wijaya (NT-001)
    let foundMember: MemberData | undefined;

    if (membersList && membersList.length > 0) {
      foundMember = membersList.find(
        (m) =>
          m.isVerified &&
          (m.nra.toLowerCase() === query ||
            m.email.toLowerCase() === query ||
            m.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, ''))
      );
    }

    // Default Demo Member if matched or generic login test
    if (!foundMember && (query === 'nt-001' || query === 'bambang@ntci.or.id' || query === 'admin@ntci.or.id' || query === '081234567890')) {
      foundMember = {
        id: 'mem-1',
        fullName: 'Bambang "Turbo" Wijaya',
        nra: 'NT-001',
        email: 'bambang@ntci.or.id',
        phone: '+62 812-3456-7890',
        domicile: 'Jakarta Selatan',
        role: 'SUPER_ADMIN',
        isVerified: true,
        status: 'ACTIVE',
        chapterName: 'NTCI Chapter Jakarta Raya',
        chapterSlug: 'jakarta-raya',
        motorModel: 'Nmax Turbo Tech MAX (2024)',
        motorYear: '2024',
        motorPlate: 'B 1234 NT',
        motorColor: 'Magma Black Gold',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        joinedDate: '15 Januari 2024',
        points: 450,
        badges: ['Pioneer Biker', 'Y-CVT Tech Rider', 'Road Captain'],
      };
    }

    // Validate password (supports member123, admin123, admin, ntci2026 for demo ease)
    const validPasswords = ['member123', 'admin123', 'admin', 'ntci2026', '123456'];
    const isPassValid = validPasswords.includes(password.toLowerCase());

    if (foundMember && isPassValid) {
      setCurrentUser(foundMember);
      localStorage.setItem(
        'ntci_member_session',
        JSON.stringify({ member: foundMember, loginTime: Date.now() })
      );
      setShowLoginModal(false);
      return { success: true, message: `Selamat datang kembali, Bro/Sis ${foundMember.fullName}!` };
    }

    if (foundMember && !isPassValid) {
      return { success: false, message: 'Password salah. Gunakan password "member123" atau "admin123" untuk demo.' };
    }

    return { success: false, message: `Anggota dengan NRA/Email "${identifier}" tidak ditemukan atau belum terverifikasi.` };
  };

  const logoutMember = () => {
    setCurrentUser(null);
    localStorage.removeItem('ntci_member_session');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isMemberLoggedIn: !!currentUser,
        loginMember,
        logoutMember,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
