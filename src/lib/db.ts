import { prisma } from './prisma';
import {
  ChapterData,
  MemberData,
  EventData,
  ArticleData,
  DocumentData,
  MerchandiseData,
  SponsorData,
  EmergencyContactData,
} from './mockData';

// Fetch all chapters directly from Vercel Postgres Database
export async function getChapters(): Promise<ChapterData[]> {
  const chapters = await prisma.chapter.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return chapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    region: c.region,
    city: c.city,
    leaderName: c.leaderName,
    contactPhone: c.contactPhone,
    kopdarLocation: c.kopdarLocation,
    kopdarSchedule: c.kopdarSchedule,
    status: (c.status as 'DECLARED' | 'EMBRYO' | 'INACTIVE') || 'DECLARED',
    memberCount: c._count.members,
    logoUrl: c.logoUrl || undefined,
  }));
}

export async function getChapterBySlug(slug: string): Promise<ChapterData | undefined> {
  const c = await prisma.chapter.findFirst({
    where: {
      OR: [
        { slug: { equals: slug, mode: 'insensitive' } },
        { id: slug },
      ],
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  if (!c) return undefined;

  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    region: c.region,
    city: c.city,
    leaderName: c.leaderName,
    contactPhone: c.contactPhone,
    kopdarLocation: c.kopdarLocation,
    kopdarSchedule: c.kopdarSchedule,
    status: (c.status as 'DECLARED' | 'EMBRYO' | 'INACTIVE') || 'DECLARED',
    memberCount: c._count.members,
    logoUrl: c.logoUrl || undefined,
  };
}

export async function getMembersByChapter(chapterSlug: string): Promise<MemberData[]> {
  const members = await prisma.user.findMany({
    where: {
      isVerified: true,
      chapter: {
        slug: { equals: chapterSlug, mode: 'insensitive' },
      },
    },
    include: { chapter: true },
    orderBy: { createdAt: 'desc' },
  });

  return members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    nra: m.nra || 'PENDING',
    email: m.email,
    phone: m.phone,
    domicile: m.domicile || undefined,
    role: m.role as 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER',
    isVerified: m.isVerified,
    status: ((m as Record<string, unknown>).status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    chapterName: m.chapter ? m.chapter.name : 'Pengurus Pusat',
    chapterSlug: m.chapter ? m.chapter.slug : 'pusat',
    motorModel: m.motorYear ? `Nmax Turbo (${m.motorYear})` : 'Nmax Turbo',
    motorYear: m.motorYear || '2024',
    motorPlate: m.motorPlate || '-',
    motorColor: m.motorColor || '-',
    motorMods: m.motorMods || undefined,
    avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: new Date(m.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    points: ((m as Record<string, unknown>).points as number) ?? 150,
    badges: ((m as Record<string, unknown>).badges as string) ? ((m as Record<string, unknown>).badges as string).split(',') : ['Pioneer Biker', 'Y-CVT Tech Rider'],
  }));
}

export async function getMemberByNra(nra: string): Promise<MemberData | undefined> {
  const m = await prisma.user.findFirst({
    where: {
      isVerified: true,
      OR: [
        { nra: { equals: nra, mode: 'insensitive' } },
        { id: nra },
      ],
    },
    include: { chapter: true },
  });

  if (!m) return undefined;

  return {
    id: m.id,
    fullName: m.fullName,
    nra: m.nra || 'PENDING',
    email: m.email,
    phone: m.phone,
    domicile: m.domicile || undefined,
    role: m.role as 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER',
    isVerified: m.isVerified,
    status: ((m as Record<string, unknown>).status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    chapterName: m.chapter ? m.chapter.name : 'Pengurus Pusat',
    chapterSlug: m.chapter ? m.chapter.slug : 'pusat',
    motorModel: m.motorYear ? `Nmax Turbo (${m.motorYear})` : 'Nmax Turbo',
    motorYear: m.motorYear || '2024',
    motorPlate: m.motorPlate || '-',
    motorColor: m.motorColor || '-',
    motorMods: m.motorMods || undefined,
    avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: new Date(m.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    points: ((m as Record<string, unknown>).points as number) ?? 150,
    badges: ((m as Record<string, unknown>).badges as string) ? ((m as Record<string, unknown>).badges as string).split(',') : ['Pioneer Biker', 'Y-CVT Tech Rider'],
  };
}

export async function getMembers(): Promise<MemberData[]> {
  const members = await prisma.user.findMany({
    where: { isVerified: true },
    include: { chapter: true },
    orderBy: { createdAt: 'desc' },
  });

  return members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    nra: m.nra || 'PENDING',
    email: m.email,
    phone: m.phone,
    domicile: m.domicile || undefined,
    role: m.role as 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER',
    isVerified: m.isVerified,
    status: ((m as Record<string, unknown>).status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    chapterName: m.chapter ? m.chapter.name : 'Pengurus Pusat',
    chapterSlug: m.chapter ? m.chapter.slug : 'pusat',
    motorModel: m.motorYear ? `Nmax Turbo (${m.motorYear})` : 'Nmax Turbo',
    motorYear: m.motorYear || '2024',
    motorPlate: m.motorPlate || '-',
    motorColor: m.motorColor || '-',
    motorMods: m.motorMods || undefined,
    avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: new Date(m.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    points: ((m as Record<string, unknown>).points as number) ?? 150,
    badges: ((m as Record<string, unknown>).badges as string) ? ((m as Record<string, unknown>).badges as string).split(',') : ['Pioneer Biker', 'Y-CVT Tech Rider'],
  }));
}

export async function getAllMembersAdmin(): Promise<MemberData[]> {
  const members = await prisma.user.findMany({
    include: { chapter: true },
    orderBy: { createdAt: 'desc' },
  });

  return members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    nra: m.nra || 'PENDING',
    email: m.email,
    phone: m.phone,
    domicile: m.domicile || undefined,
    role: m.role as 'SUPER_ADMIN' | 'CHAPTER_ADMIN' | 'MEMBER',
    isVerified: m.isVerified,
    status: ((m as Record<string, unknown>).status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
    chapterName: m.chapter ? m.chapter.name : 'Pengurus Pusat',
    chapterSlug: m.chapter ? m.chapter.slug : 'pusat',
    motorModel: m.motorYear ? `Nmax Turbo (${m.motorYear})` : 'Nmax Turbo',
    motorYear: m.motorYear || '2024',
    motorPlate: m.motorPlate || '-',
    motorColor: m.motorColor || '-',
    motorMods: m.motorMods || undefined,
    avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedDate: new Date(m.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }));
}

export async function getEvents(): Promise<EventData[]> {
  const events = await prisma.event.findMany({
    include: {
      chapter: true,
      _count: { select: { rsvps: true } },
    },
    orderBy: { startDate: 'asc' },
  });

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    category: e.category as EventData['category'],
    description: e.description,
    location: e.location,
    meetingPoint: e.meetingPoint || e.location,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : undefined,
    chapterName: e.chapter ? e.chapter.name : 'Pengurus Pusat NTCI',
    chapterSlug: e.chapter ? e.chapter.slug : undefined,
    bannerUrl: e.bannerUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    attendingCount: e._count.rsvps,
  }));
}

export async function getEventsByChapter(chapterSlug: string): Promise<EventData[]> {
  const events = await prisma.event.findMany({
    where: {
      chapter: {
        slug: { equals: chapterSlug, mode: 'insensitive' },
      },
    },
    include: {
      chapter: true,
      _count: { select: { rsvps: true } },
    },
    orderBy: { startDate: 'asc' },
  });

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    category: e.category as EventData['category'],
    description: e.description,
    location: e.location,
    meetingPoint: e.meetingPoint || e.location,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : undefined,
    chapterName: e.chapter ? e.chapter.name : 'Pengurus Pusat NTCI',
    chapterSlug: e.chapter ? e.chapter.slug : undefined,
    bannerUrl: e.bannerUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    attendingCount: e._count.rsvps,
  }));
}

export async function getArticles(): Promise<ArticleData[]> {
  const articles = await prisma.article.findMany({
    include: { author: true },
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category as ArticleData['category'],
    authorName: a.author ? a.author.fullName : 'Pengurus Pusat',
    authorRole: a.author && a.author.role === 'SUPER_ADMIN' ? 'Pengurus Pusat' : 'Admin Chapter',
    coverImage: a.coverImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(a.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    readTime: '5 Menit Baca',
  }));
}

export async function getDocuments(): Promise<DocumentData[]> {
  const docs = await prisma.document.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
  });

  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category as DocumentData['category'],
    description: d.description || '',
    fileUrl: d.fileUrl,
    fileSize: '1.8 MB',
    updatedAt: new Date(d.updatedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }));
}

export async function getMerchandise(): Promise<MerchandiseData[]> {
  const merch = await prisma.merchandise.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' },
  });

  return merch.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    price: m.price,
    description: m.description,
    imageUrl: m.imageUrl,
    buyUrl: m.buyUrl || `https://wa.me/6281234567890?text=Halo%20Admin%20NTCI,%20saya%20mau%20pesan%20${encodeURIComponent(m.name)}`,
    isAvailable: m.isAvailable,
  }));
}

export async function getSponsors(): Promise<SponsorData[]> {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
  });

  return sponsors.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    discountDetail: s.discountDetail,
    logoUrl: s.logoUrl,
    websiteUrl: s.websiteUrl || '#',
  }));
}

export async function getEmergencyContacts(): Promise<EmergencyContactData[]> {
  const contacts = await prisma.emergencyContact.findMany({
    include: { chapter: true },
  });

  return contacts.map((c) => ({
    id: c.id,
    chapterName: c.chapter ? c.chapter.name : 'Pengurus Pusat',
    contactPerson: c.name,
    roleOrLocation: c.roleOrLocation,
    phone: c.phone,
  }));
}
