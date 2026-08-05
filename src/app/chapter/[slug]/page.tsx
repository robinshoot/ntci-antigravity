import React from 'react';
import { getChapterBySlug, getMembersByChapter, getEventsByChapter } from '@/lib/db';
import ChapterDetailView from '@/components/public/ChapterDetailView';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ChapterDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ChapterDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);
  if (!chapter) return { title: 'Chapter Tidak Ditemukan' };
  return {
    title: `${chapter.name} | NTCI Indonesia`,
    description: `Halaman resmi ${chapter.name} (${chapter.region}) - Pengurus, Anggota, Event Tuan Rumah, dan Lokasi Sekre NTCI.`,
  };
}

export default async function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const { slug } = await params;
  const [chapter, members, events] = await Promise.all([
    getChapterBySlug(slug),
    getMembersByChapter(slug),
    getEventsByChapter(slug),
  ]);

  if (!chapter) {
    notFound();
  }

  return <ChapterDetailView chapter={chapter} members={members} events={events} />;
}
