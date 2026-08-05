import React from 'react';
import ChapterList from '@/components/public/ChapterList';
import { getChapters } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direktori Chapter',
  description: 'Daftar lokasi chapter, pengurus, dan jadwal kopdar NTCI se-Indonesia.',
};

export default async function ChapterPage() {
  const chapters = await getChapters();
  return (
    <div className="pt-16">
      <ChapterList chapters={chapters} />
    </div>
  );
}
