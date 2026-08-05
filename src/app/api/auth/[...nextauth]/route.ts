import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAllMembersAdmin } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'NRA / Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const query = credentials.identifier.trim().toLowerCase();
        const password = credentials.password.trim();

        let allMembers: any[] = [];
        try {
          allMembers = await getAllMembersAdmin();
        } catch (e) {
          allMembers = [];
        }

        // Match user by email, NRA, or phone
        let user = allMembers.find(
          (m) =>
            m.email?.toLowerCase() === query ||
            (m.nra && m.nra.toLowerCase() === query) ||
            (m.phone && m.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, ''))
        );

        // Fallback default admin if query is admin@ntci.or.id, bambang@ntci.or.id, or NT-001
        if (!user && (query === 'admin@ntci.or.id' || query === 'bambang@ntci.or.id' || query === 'nt-001' || query === 'admin')) {
          user = {
            id: 'mem-1',
            fullName: 'Bambang "Turbo" Wijaya',
            nra: 'NT-001',
            email: 'admin@ntci.or.id',
            phone: '+62 812-3456-7890',
            role: 'SUPER_ADMIN',
            isVerified: true,
            chapterName: 'NTCI Chapter Jakarta Raya',
            chapterSlug: 'jakarta-raya',
            motorModel: 'Nmax Turbo Tech MAX (2024)',
            motorYear: '2024',
            motorPlate: 'B 1234 NT',
            motorColor: 'Magma Black',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            joinedDate: '15 Januari 2024',
          };
        }

        if (!user) {
          return null;
        }

        // Validate password
        const validPasswords = ['member123', 'admin123', 'admin', 'ntci2026', '123456'];
        const isPasswordValid = validPasswords.includes(password.toLowerCase());

        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            nra: user.nra || 'NT-001',
            role: user.role || 'MEMBER',
            chapterName: user.chapterName || 'NTCI Chapter Jakarta Raya',
            avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            isVerified: user.isVerified ?? true,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'ntci-nmax-turbo-club-indonesia-super-secret-key-2026',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nra = user.nra;
        token.role = user.role;
        token.chapterName = user.chapterName;
        token.avatarUrl = user.avatarUrl;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.nra = token.nra;
        session.user.role = token.role;
        session.user.chapterName = token.chapterName;
        session.user.avatarUrl = token.avatarUrl;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
