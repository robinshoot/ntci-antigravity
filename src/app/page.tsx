import React from 'react';
import HeroSection from '@/components/public/HeroSection';
import VisiMisiSection from '@/components/public/VisiMisiSection';
import ChapterList from '@/components/public/ChapterList';
import MemberDirectory from '@/components/public/MemberDirectory';
import EventCalendar from '@/components/public/EventCalendar';
import AdArtSection from '@/components/public/AdArtSection';
import WartaSection from '@/components/public/WartaSection';
import MerchSection from '@/components/public/MerchSection';
import SponsorSection from '@/components/public/SponsorSection';
import EmergencySosSection from '@/components/public/EmergencySosSection';
import {
  getChapters,
  getMembers,
  getEvents,
  getArticles,
  getDocuments,
  getMerchandise,
  getSponsors,
  getEmergencyContacts,
} from '@/lib/db';

export const revalidate = 60; // SSR / ISR caching for maximum performance

export default async function HomePage() {
  const [chapters, members, events, articles, documents, merch, sponsors, emergency] =
    await Promise.all([
      getChapters(),
      getMembers(),
      getEvents(),
      getArticles(),
      getDocuments(),
      getMerchandise(),
      getSponsors(),
      getEmergencyContacts(),
    ]);

  return (
    <div className="space-y-0">
      <HeroSection
        memberCount={members.length}
        chapterCount={chapters.length}
        eventCount={events.length}
        demoMember={members[0]}
      />
      <VisiMisiSection />
      <ChapterList chapters={chapters} />
      <EventCalendar events={events} />
      <MemberDirectory members={members} />
      <AdArtSection documents={documents} />
      <EmergencySosSection contacts={emergency} />
      <WartaSection articles={articles} />
      <MerchSection items={merch} />
      <SponsorSection sponsors={sponsors} />
    </div>
  );
}
