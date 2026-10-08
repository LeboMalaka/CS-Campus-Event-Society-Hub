'use client';

import { useEffect, useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import EventCard from '@/components/EventCard';
import { CustomButton } from '@/components/CustomButton';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string | null;
  society_name: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoryQuery = selectedCategory === 'All' ? '' : `&category=${selectedCategory.toLowerCase()}`;
        const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';

        const response = await apiRequest<{ data: Event[] }>(
          `/events?${categoryQuery}${searchQuery}`
        );

        setEvents(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [search, selectedCategory]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-bg-card to-slate-900 p-6 shadow-glow sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Discover events</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Campus life, all in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          Explore upcoming workshops, socials, and society-led activities designed for students.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search events or societies"
            className="w-full rounded-xl border border-violet-500/20 bg-bg-panel px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none transition-colors"
          />
          <CustomButton variant="primary" className="w-full sm:w-auto">
            Search
          </CustomButton>
          {user?.role === 'society_admin' ? (
            <Link href="/events/create" className="secondary-button inline-flex items-center justify-center">
              Create event
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mb-6">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </section>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
            <p className="text-sm text-slate-400 animate-pulse">Fetching latest events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-xl font-semibold text-white">Oops! Something went wrong</p>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <CustomButton variant="secondary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </CustomButton>
        </div>
      ) : events.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-bg-card p-8 text-center">
          <p className="text-xl font-semibold text-white">No upcoming events found</p>
          <p className="mt-2 text-sm text-slate-400">Try a different keyword or category.</p>
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              category={event.category}
              location={event.location}
              date={new Date(event.start_time).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
              host={event.society_name}
            />
          ))}
        </section>
      )}
    </main>
  );
}
