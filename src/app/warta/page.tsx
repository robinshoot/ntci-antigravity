import React from 'react';
import WartaSection from '@/components/public/WartaSection';
import { getArticles } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warta & Tips Teknis',
  description: 'Artikel berita touring dan panduan teknis Yamaha Nmax Turbo.',
};

export default async function WartaPage() {
  const articles = await getArticles();
  return (
    <div className="pt-16">
      <WartaSection articles={articles} />
    </div>
  );
}
