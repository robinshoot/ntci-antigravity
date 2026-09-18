'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { MemberData } from '@/types';

interface AuthContextType {
  currentUser: MemberData | null;
  isMemberLoggedIn: boolean;
  loginMember: (identifier: string, pass: string, membersList?: MemberData[]) => Promise<{ success: boolean; message: string }>;
  logoutMember: () => void;
  updateProfile: (updatedData: Partial<MemberData>) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isMemberLoggedIn: false,
  loginMember: async () => ({ success: false, message: '' }),
  logoutMember: () => {},
  updateProfile: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
});

function AuthInnerProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<MemberData | null>(null);

  // Sync NextAuth session to currentUser
  useEffect(() => {
    if (session?.user) {
      const u = session.user;
      setCurrentUser({
        id: u.id || 'mem-1',
        fullName: u.name || 'Bambang "Turbo" Wijaya',
        nra: u.nra || 'NT-001',
        email: u.email || 'admin@ntci.or.id',
        phone: '+62 812-3456-7890',
        role: u.role || 'SUPER_ADMIN',
        isVerified: u.isVerified ?? true,
        chapterName: u.chapterName || 'NTCI Chapter Jakarta Raya',
        chapterSlug: 'jakarta-raya',
        motorModel: 'Nmax Turbo Tech MAX (2024)',
        motorYear: '2024',
        motorPlate: 'B 1234 NT',
        motorColor: 'Magma Black',
        avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        joinedDate: '15 Januari 2024',
      });
    } else {
      const saved = localStorage.getItem('ntci_member_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.member) {
            setCurrentUser(parsed.member);
          } else {
            setCurrentUser(null);
          }
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [session]);

  // Auto open login modal if redirected by NextAuth Server Middleware
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('loginRequired=true')) {
      setShowLoginModal(true);
    }
  }, []);

  const loginMember = async (identifier: string, pass: string, membersList?: MemberData[]) => {
    if (!identifier.trim() || !pass.trim()) {
      return { success: false, message: 'Harap isi NRA/Email dan Password!' };
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: identifier.trim(),
        password: pass.trim(),
      });

      if (result && !result.error) {
        setShowLoginModal(false);
        return { success: true, message: 'Login NextAuth berhasil!' };
      }
    } catch (e) {
      // Fallback local check
    }

    const query = identifier.trim().toLowerCase();
    const password = pass.trim();

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

    const validPasswords = ['member123', 'admin123', 'admin', 'ntci2026', '123456'];
    const isPassValid = validPasswords.includes(password.toLowerCase());

    if (foundMember && isPassValid) {
      setCurrentUser(foundMember);
      localStorage.setItem('ntci_member_session', JSON.stringify({ member: foundMember, loginTime: Date.now() }));
      setShowLoginModal(false);
      return { success: true, message: `Selamat datang kembali, Bro/Sis ${foundMember.fullName}!` };
    }

    return { success: false, message: 'NRA/Email atau Password salah. Gunakan NRA "NT-001" dan Password "member123".' };
  };

  const logoutMember = () => {
    signOut({ redirect: false });
    setCurrentUser(null);
    localStorage.removeItem('ntci_member_session');
  };

  const updateProfile = (updatedData: Partial<MemberData>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ntci_member_session', JSON.stringify({ member: updated, loginTime: Date.now() }));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isMemberLoggedIn: !!currentUser,
        loginMember,
        logoutMember,
        updateProfile,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
