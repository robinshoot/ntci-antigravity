import React from 'react';
import EmergencySosSection from '@/components/public/EmergencySosSection';
import { getEmergencyContacts } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SOS Emergency Storing',
  description: 'Kontak Bantuan Darurat Storing & Towing Touring NTCI.',
};

export default async function SosPage() {
  const contacts = await getEmergencyContacts();
  return (
    <div className="pt-16">
      <EmergencySosSection contacts={contacts} />
    </div>
  );
}
