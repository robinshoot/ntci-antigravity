import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import {
  getAllMembersAdmin,
  getChapters,
  getEvents,
  getArticles,
  getDocuments,
  getMerchandise,
  getSponsors,
  getEmergencyContacts,
} from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel CMS Admin',
  description: 'Halaman Pengelola Website dan Keanggotaan Nmax Turbo Club Indonesia.',
};

export const revalidate = 0; // Always fresh for admin portal

export default async function AdminPage() {
  const [members, chapters, events, articles, documents, merch, sponsors, emergency] =
    await Promise.all([
      getAllMembersAdmin(),
      getChapters(),
      getEvents(),
      getArticles(),
      getDocuments(),
      getMerchandise(),
      getSponsors(),
      getEmergencyContacts(),
    ]);

  return (
    <AdminDashboard
      initialMembers={members}
      initialChapters={chapters}
      initialEvents={events}
      initialArticles={articles}
      initialDocuments={documents}
      initialMerch={merch}
      initialSponsors={sponsors}
      initialEmergency={emergency}
    />
  );
}
