import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    nra?: string | null;
    role?: 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER';
    chapterName?: string | null;
    avatarUrl?: string | null;
    isVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      nra?: string | null;
      role?: 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER';
      chapterName?: string | null;
      avatarUrl?: string | null;
      isVerified?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    nra?: string | null;
    role?: 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER';
    chapterName?: string | null;
    avatarUrl?: string | null;
    isVerified?: boolean;
  }
}
