import React from 'react';
import MerchSection from '@/components/public/MerchSection';
import { getMerchandise } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Merchandise Store',
  description: 'Atribut resmi, jaket touring, dan merchandise NTCI.',
};

export default async function MerchPage() {
  const items = await getMerchandise();
  return (
    <div className="pt-16">
      <MerchSection items={items} />
    </div>
  );
}
