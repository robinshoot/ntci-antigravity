import React from 'react';
import { getMemberByNra } from '@/lib/db';
import MemberProfileDetail from '@/components/public/MemberProfileDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface MemberPageProps {
  params: Promise<{ nra: string }>;
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  const { nra } = await params;
  const member = await getMemberByNra(nra);
  if (!member) return { title: 'Anggota Tidak Ditemukan' };
  return {
    title: `Profil ${member.fullName} (${member.nra})`,
    description: `Profil resmi rider NTCI ${member.fullName} dari ${member.chapterName}.`,
  };
}

export default async function MemberDetailPage({ params }: MemberPageProps) {
  const { nra } = await params;
  const member = await getMemberByNra(nra);

  if (!member) {
    notFound();
  }

  return <MemberProfileDetail member={member} />;
}
