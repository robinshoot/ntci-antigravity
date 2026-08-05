import React from 'react';
import AdArtSection from '@/components/public/AdArtSection';
import { getDocuments } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dokumen AD-ART',
  description: 'Anggaran Dasar & Anggaran Rumah Tangga (AD-ART) NTCI.',
};

export default async function AdArtPage() {
  const documents = await getDocuments();
  return (
    <div className="pt-16">
      <AdArtSection documents={documents} />
    </div>
  );
}
