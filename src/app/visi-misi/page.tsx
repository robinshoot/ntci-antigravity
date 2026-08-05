import React from 'react';
import VisiMisiSection from '@/components/public/VisiMisiSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visi & Misi',
  description: 'Visi, Misi, dan Kode Etik Berkendara Nmax Turbo Club Indonesia.',
};

export default function VisiMisiPage() {
  return (
    <div className="pt-16">
      <VisiMisiSection />
    </div>
  );
}
