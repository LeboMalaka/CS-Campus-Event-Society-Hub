'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CategoryFilter from '@/components/CategoryFilter';
import EventCard from '@/components/EventCard';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type EventItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time?: string | null;
  society_name?: string;
};

export default function EventsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const query = new URLSearchParams();
        if (selectedCategory !== 'All') query.set('category', selectedCategory);
        if (search.trim()) query.set('search', search.trim());

        const response = await apiRequest<{ data: EventItem[] }>(
          `/events${query.toString() ? `?${query.toString()}` : ''}`
        );
        setEvents(response.data ?? []);
      } catch (_error) {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [search, selectedCategory]);

  const filteredEvents = useMemo(() => events, [events]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Browse</p>
          <h1 className="mt-2 text-3xl font-bold text-white">All events</h1>
        </div>
        {user?.role === 'society' ? (
          <Link href="/events/create" className="primary-button inline-flex items-center justify-center">
            Create event
          </Link>
        ) : null}
      </div>

      <div className="mb-8">
        <label htmlFor="event-search" className="sr-only">Search events</label>
        <input
          id="event-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by event title or keyword"
          className="mb-4 w-full rounded-xl border border-slate-700 bg-bg-card px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
        />
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {isLoading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-[#17171d] p-8 text-center text-slate-400">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-[#17171d] p-8 text-center">
          <p className="text-xl font-semibold text-white">No events in this category</p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={new Date(event.start_time).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              location={event.location}
              category={event.category}
              host={event.society_name || 'Campus Society'}
              description={event.description}
              href={`/events/${event.id}`}
            />
          ))}
        </section>
      )}
    </main>
  );
}
