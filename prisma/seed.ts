import { PrismaClient, Role, EventCategory, ArticleCategory, DocumentCategory } from '@prisma/client';
import {
  INITIAL_CHAPTERS,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_ARTICLES,
  INITIAL_DOCUMENTS,
  INITIAL_MERCHANDISE,
  INITIAL_SPONSORS,
  INITIAL_EMERGENCY,
} from '../src/lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NTCI Database to Vercel Postgres...');

  // 1. Seed Chapters
  const chapterMap = new Map<string, string>();
  for (const ch of INITIAL_CHAPTERS) {
    const created = await prisma.chapter.upsert({
      where: { slug: ch.slug },
      update: {
        name: ch.name,
        region: ch.region,
        city: ch.city,
        leaderName: ch.leaderName,
        contactPhone: ch.contactPhone,
        kopdarLocation: ch.kopdarLocation,
        kopdarSchedule: ch.kopdarSchedule,
        status: ch.status === 'EMBRYO' ? 'EMBRYO' : 'DECLARED',
      },
      create: {
        name: ch.name,
        slug: ch.slug,
        region: ch.region,
        city: ch.city,
        leaderName: ch.leaderName,
        contactPhone: ch.contactPhone,
        kopdarLocation: ch.kopdarLocation,
        kopdarSchedule: ch.kopdarSchedule,
        status: ch.status === 'EMBRYO' ? 'EMBRYO' : 'DECLARED',
      },
    });
    chapterMap.set(ch.slug, created.id);
  }
  console.log('✔ Chapters seeded.');

  // 2. Seed Members (Users)
  let adminUserId = '';
  for (const m of INITIAL_MEMBERS) {
    const chId = chapterMap.get(m.chapterSlug);
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {
        fullName: m.fullName,
        nra: m.nra,
        phone: m.phone,
        role: m.role as Role,
        isVerified: m.isVerified,
        motorYear: m.motorYear,
        motorPlate: m.motorPlate,
        motorColor: m.motorColor,
        motorMods: m.motorMods,
        avatarUrl: m.avatarUrl,
        chapterId: chId,
      },
      create: {
        email: m.email,
        password: '$2a$12$eC9J7s8xYw0rR6xW5q8Z0O6G0u7eX7t9Y9u8i7o6p5a4s3d2f1g',
        fullName: m.fullName,
        nra: m.nra,
        phone: m.phone,
        role: m.role as Role,
        isVerified: m.isVerified,
        motorYear: m.motorYear,
        motorPlate: m.motorPlate,
        motorColor: m.motorColor,
        motorMods: m.motorMods,
        avatarUrl: m.avatarUrl,
        chapterId: chId,
      },
    });

    if (m.role === 'SUPER_ADMIN' || !adminUserId) {
      adminUserId = user.id;
    }
  }
  console.log('✔ Members (Users) seeded.');

  // 3. Seed Events
  for (const ev of INITIAL_EVENTS) {
    const chId = ev.chapterSlug ? chapterMap.get(ev.chapterSlug) : undefined;
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {
        title: ev.title,
        description: ev.description,
        category: ev.category as EventCategory,
        location: ev.location,
        meetingPoint: ev.meetingPoint,
        startDate: new Date(ev.startDate),
        bannerUrl: ev.bannerUrl,
        chapterId: chId,
        authorId: adminUserId,
      },
      create: {
        title: ev.title,
        slug: ev.slug,
        description: ev.description,
        category: ev.category as EventCategory,
        location: ev.location,
        meetingPoint: ev.meetingPoint,
        startDate: new Date(ev.startDate),
        bannerUrl: ev.bannerUrl,
        chapterId: chId,
        authorId: adminUserId,
      },
    });
  }
  console.log('✔ Events seeded.');

  // 4. Seed Articles
  for (const art of INITIAL_ARTICLES) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        excerpt: art.excerpt,
        content: art.content,
        category: art.category as ArticleCategory,
        coverImage: art.coverImage,
        authorId: adminUserId,
      },
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        category: art.category as ArticleCategory,
        coverImage: art.coverImage,
        authorId: adminUserId,
      },
    });
  }
  console.log('✔ Articles seeded.');

  // 5. Seed Documents
  for (const doc of INITIAL_DOCUMENTS) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({
        data: {
          title: doc.title,
          category: doc.category as DocumentCategory,
          description: doc.description,
          fileUrl: doc.fileUrl,
        },
      });
    }
  }
  console.log('✔ Documents seeded.');

  // 6. Seed Merchandise
  for (const item of INITIAL_MERCHANDISE) {
    const existing = await prisma.merchandise.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.merchandise.create({
        data: {
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          buyUrl: item.buyUrl,
          isAvailable: item.isAvailable,
        },
      });
    }
  }
  console.log('✔ Merchandise seeded.');

  // 7. Seed Sponsors
  for (const sp of INITIAL_SPONSORS) {
    const existing = await prisma.sponsor.findFirst({ where: { name: sp.name } });
    if (!existing) {
      await prisma.sponsor.create({
        data: {
          name: sp.name,
          category: sp.category,
          discountDetail: sp.discountDetail,
          logoUrl: sp.logoUrl,
          websiteUrl: sp.websiteUrl,
        },
      });
    }
  }
  console.log('✔ Sponsors seeded.');

  // 8. Seed Emergency Contacts
  for (const em of INITIAL_EMERGENCY) {
    const existing = await prisma.emergencyContact.findFirst({ where: { name: em.contactPerson } });
    if (!existing) {
      await prisma.emergencyContact.create({
        data: {
          name: em.contactPerson,
          phone: em.phone,
          roleOrLocation: em.roleOrLocation,
        },
      });
    }
  }
  console.log('✔ Emergency Contacts seeded.');

  console.log('🎉 NTCI Vercel Postgres Database Full Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

