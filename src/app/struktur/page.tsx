import React from 'react';
import StrukturOrganisasi from '@/components/public/StrukturOrganisasi';
import { getChapters } from '@/lib/db';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Struktur Organisasi',
  description: 'Jajaran Pengurus Pusat dan Regional Nmax Turbo Club Indonesia.',
};

export default async function StrukturPage() {
  const chapters = await getChapters();

  return (
    <div className="pt-16">
      <StrukturOrganisasi chapters={chapters} />
    </div>
  );
}
