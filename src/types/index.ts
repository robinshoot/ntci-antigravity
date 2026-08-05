export interface ChapterOfficer {
  role: string;
  name: string;
  nra: string;
  avatarUrl: string;
  phone: string;
}

export interface ChapterData {
  id: string;
  name: string;
  slug: string;
  region: string;
  city: string;
  leaderName: string;
  viceLeaderName?: string;
  secretaryName?: string;
  treasurerName?: string;
  touringOfficerName?: string;
  humasOfficerName?: string;
  contactPhone: string;
  kopdarLocation: string;
  kopdarSchedule: string;
  status: 'DECLARED' | 'EMBRYO' | 'INACTIVE';
  memberCount: number;
  logoUrl?: string;
  officers?: ChapterOfficer[];
  createdBy?: string;
  updatedBy?: string;
}

export interface MemberData {
  id: string;
  fullName: string;
  nra: string;
  email: string;
  phone: string;
  domicile?: string;
  role: 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER';
  isVerified: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  chapterName: string;
  chapterSlug: string;
  motorModel: string;
  motorYear: string;
  motorPlate: string;
  motorColor: string;
  motorMods?: string;
  avatarUrl: string;
  joinedDate: string;
  points?: number;
  badges?: string[];
  createdBy?: string;
  updatedBy?: string;
}

export interface EventData {
  id: string;
  title: string;
  slug: string;
  category: 'KOPDAR' | 'TOURING' | 'SOCIAL_CSR' | 'ANNIVERSARY' | 'WORKSHOP';
  description: string;
  location: string;
  meetingPoint: string;
  startDate: string;
  endDate?: string;
  chapterName: string;
  chapterSlug?: string;
  bannerUrl: string;
  attendingCount: number;
  createdBy?: string;
  updatedBy?: string;
}

export interface ArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'NEWS' | 'TOURING_REPORT' | 'SAFETY_RIDING' | 'TECH_TIPS';
  authorName: string;
  authorRole: string;
  coverImage: string;
  createdAt: string;
  readTime: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DocumentData {
  id: string;
  title: string;
  category: 'AD_ART' | 'REGULATION' | 'SOP' | 'FORM';
  description: string;
  fileUrl: string;
  fileSize: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MerchandiseData {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  buyUrl: string;
  isAvailable: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface SponsorData {
  id: string;
  name: string;
  category: string;
  discountDetail: string;
  logoUrl: string;
  websiteUrl: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface EmergencyContactData {
  id: string;
  chapterName: string;
  contactPerson: string;
  roleOrLocation: string;
  phone: string;
  createdBy?: string;
  updatedBy?: string;
}

export const CENTRAL_OFFICERS: ChapterOfficer[] = [
  {
    role: 'Ketua Umum Nasional',
    name: 'Bambang "Turbo" Wijaya',
    nra: 'NTCI-JKT-001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+62 812-3456-7890',
  },
  {
    role: 'Wakil Ketua Umum',
    name: 'Heri Prasetyo',
    nra: 'NTCI-JKT-002',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+62 812-9999-8888',
  },
  {
    role: 'Sekretaris Jenderal',
    name: 'Rian Kusuma',
    nra: 'NTCI-BDG-001',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+62 813-7777-6666',
  },
  {
    role: 'Bendahara Umum',
    name: 'Siti Nurhaliza',
    nra: 'NTCI-JKT-014',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    phone: '+62 812-9988-7766',
  },
  {
    role: 'Kabid Touring & Safety',
    name: 'Dicky Hendrawan',
    nra: 'NTCI-BDG-002',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    phone: '+62 813-9876-5432',
  },
  {
    role: 'Kabid Humas & Medkom',
    name: 'Rendy Pratama',
    nra: 'NTCI-SUB-003',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    phone: '+62 856-7891-2345',
  },
];
