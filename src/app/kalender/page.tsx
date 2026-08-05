import React from 'react';
import EventCalendar from '@/components/public/EventCalendar';
import { getEvents } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kalender Kegiatan',
  description: 'Jadwal Agenda Touring, Kopdar, dan Event NTCI.',
};

export default async function KalenderPage() {
  const events = await getEvents();
  return (
    <div className="pt-16">
      <EventCalendar events={events} />
    </div>
  );
}
