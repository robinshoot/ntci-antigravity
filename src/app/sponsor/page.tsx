import React from 'react';
import SponsorSection from '@/components/public/SponsorSection';
import { getSponsors } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsor & Perks',
  description: 'Daftar diskon dan promo partner khusus pemegang E-KTA NTCI.',
};

export default async function SponsorPage() {
  const sponsors = await getSponsors();
  return (
    <div className="pt-16">
      <SponsorSection sponsors={sponsors} />
    </div>
  );
}
