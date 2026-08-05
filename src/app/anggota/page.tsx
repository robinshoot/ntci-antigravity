import React from 'react';
import MemberDirectory from '@/components/public/MemberDirectory';
import { getMembers } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direktori Anggota',
  description: 'Daftar anggota resmi NTCI terverifikasi dan E-KTA Digital.',
};

export default async function AnggotaPage() {
  const members = await getMembers();
  return (
    <div className="pt-16">
      <MemberDirectory members={members} />
    </div>
  );
}
