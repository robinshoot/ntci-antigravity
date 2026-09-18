import { prisma } from './prisma';
import {
  INITIAL_CHAPTERS,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_ARTICLES,
  INITIAL_DOCUMENTS,
  INITIAL_MERCHANDISE,
  INITIAL_SPONSORS,
  INITIAL_EMERGENCY,
  ChapterData,
  ChapterOfficer,
  MemberData,
  EventData,
  ArticleData,
  DocumentData,
  MerchandiseData,
  SponsorData,
  EmergencyContactData,
} from './mockData';

// Fetch all chapters directly from Vercel Postgres Database with fallback
export async function getChapters(): Promise<ChapterData[]> {
  try {
    const chapters = await prisma.chapter.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (!chapters || chapters.length === 0) {
      return INITIAL_CHAPTERS;
    }

    return chapters.map((c) => {
      const mockCh = INITIAL_CHAPTERS.find(
        (m) => m.slug.toLowerCase() === c.slug.toLowerCase() || m.id === c.id || m.name.toLowerCase() === c.name.toLowerCase()
      );

      const fallbackOfficers: ChapterOfficer[] = [
        {
          role: 'Ketua Chapter',
          name: c.leaderName,
          nra: `NTCI-${c.slug.toUpperCase().slice(0, 3)}-001`,
          phone: c.contactPhone,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      ];

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
        officers: mockCh?.officers || fallbackOfficers,
      };
    });
  } catch (error) {
    console.warn('[DB] Fallback getChapters to INITIAL_CHAPTERS:', error);
    return INITIAL_CHAPTERS;
  }
}

export async function getChapterBySlug(slug: string): Promise<ChapterData | undefined> {
  const mockCh = INITIAL_CHAPTERS.find(
    (m) => m.slug.toLowerCase() === slug.toLowerCase() || m.id === slug
  );

  try {
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

    if (!c) return mockCh;

    const fallbackOfficers: ChapterOfficer[] = [
      {
        role: 'Ketua Chapter',
        name: c.leaderName,
        nra: `NTCI-${c.slug.toUpperCase().slice(0, 3)}-001`,
        phone: c.contactPhone,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
    ];

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
      officers: mockCh?.officers || fallbackOfficers,
    };
  } catch (error) {
    console.warn(`[DB] Fallback getChapterBySlug(${slug}) to mock:`, error);
    return mockCh;
  }
}

export async function getMembersByChapter(chapterSlug: string): Promise<MemberData[]> {
  try {
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

    if (!members || members.length === 0) {
      return INITIAL_MEMBERS.filter((m) => m.chapterSlug.toLowerCase() === chapterSlug.toLowerCase());
    }

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
  } catch (error) {
    console.warn(`[DB] Fallback getMembersByChapter(${chapterSlug}):`, error);
    return INITIAL_MEMBERS.filter((m) => m.chapterSlug.toLowerCase() === chapterSlug.toLowerCase());
  }
}

export async function getMemberByNra(nra: string): Promise<MemberData | undefined> {
  const fallback = INITIAL_MEMBERS.find((m) => m.nra.toLowerCase() === nra.toLowerCase() || m.id === nra);
  try {
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

    if (!m) return fallback;

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
  } catch (error) {
    console.warn(`[DB] Fallback getMemberByNra(${nra}):`, error);
    return fallback;
  }
}

export async function getMembers(): Promise<MemberData[]> {
  try {
    const members = await prisma.user.findMany({
      where: { isVerified: true },
      include: { chapter: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!members || members.length === 0) {
      return INITIAL_MEMBERS;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getMembers to INITIAL_MEMBERS:', error);
    return INITIAL_MEMBERS;
  }
}

export async function getAllMembersAdmin(): Promise<MemberData[]> {
  try {
    const members = await prisma.user.findMany({
      include: { chapter: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!members || members.length === 0) {
      return INITIAL_MEMBERS;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getAllMembersAdmin:', error);
    return INITIAL_MEMBERS;
  }
}

export async function getEvents(): Promise<EventData[]> {
  try {
    const events = await prisma.event.findMany({
      include: {
        chapter: true,
        _count: { select: { rsvps: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    if (!events || events.length === 0) {
      return INITIAL_EVENTS;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getEvents to INITIAL_EVENTS:', error);
    return INITIAL_EVENTS;
  }
}

export async function getEventsByChapter(chapterSlug: string): Promise<EventData[]> {
  try {
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

    if (!events || events.length === 0) {
      return INITIAL_EVENTS.filter((e) => e.chapterSlug?.toLowerCase() === chapterSlug.toLowerCase());
    }

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
  } catch (error) {
    console.warn(`[DB] Fallback getEventsByChapter(${chapterSlug}):`, error);
    return INITIAL_EVENTS.filter((e) => e.chapterSlug?.toLowerCase() === chapterSlug.toLowerCase());
  }
}

export async function getArticles(): Promise<ArticleData[]> {
  try {
    const articles = await prisma.article.findMany({
      include: { author: true },
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!articles || articles.length === 0) {
      return INITIAL_ARTICLES;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getArticles to INITIAL_ARTICLES:', error);
    return INITIAL_ARTICLES;
  }
}

export async function getDocuments(): Promise<DocumentData[]> {
  try {
    const docs = await prisma.document.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!docs || docs.length === 0) {
      return INITIAL_DOCUMENTS;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getDocuments to INITIAL_DOCUMENTS:', error);
    return INITIAL_DOCUMENTS;
  }
}

export async function getMerchandise(): Promise<MerchandiseData[]> {
  try {
    const merch = await prisma.merchandise.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!merch || merch.length === 0) {
      return INITIAL_MERCHANDISE;
    }

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
  } catch (error) {
    console.warn('[DB] Fallback getMerchandise to INITIAL_MERCHANDISE:', error);
    return INITIAL_MERCHANDISE;
  }
}

export async function getSponsors(): Promise<SponsorData[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
    });

    if (!sponsors || sponsors.length === 0) {
      return INITIAL_SPONSORS;
    }

    return sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      discountDetail: s.discountDetail,
      logoUrl: s.logoUrl,
      websiteUrl: s.websiteUrl || '#',
    }));
  } catch (error) {
    console.warn('[DB] Fallback getSponsors to INITIAL_SPONSORS:', error);
    return INITIAL_SPONSORS;
  }
}

export async function getEmergencyContacts(): Promise<EmergencyContactData[]> {
  try {
    const contacts = await prisma.emergencyContact.findMany({
      include: { chapter: true },
    });

    if (!contacts || contacts.length === 0) {
      return INITIAL_EMERGENCY;
    }

    return contacts.map((c) => ({
      id: c.id,
      chapterName: c.chapter ? c.chapter.name : 'Pengurus Pusat',
      contactPerson: c.name,
      roleOrLocation: c.roleOrLocation,
      phone: c.phone,
    }));
  } catch (error) {
    console.warn('[DB] Fallback getEmergencyContacts to INITIAL_EMERGENCY:', error);
    return INITIAL_EMERGENCY;
  }
}
