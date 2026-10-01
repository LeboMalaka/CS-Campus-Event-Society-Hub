'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

type EventItem = {
  id: string;
  title: string;
  category: string;
  society_name?: string;
};

type SocietySummary = {
  name: string;
  events: EventItem[];
};

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<SocietySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSocieties = async () => {
      try {
        const response = await apiRequest<{ data: EventItem[] }>('/events');
        const grouped = new Map<string, EventItem[]>();

        for (const event of response.data ?? []) {
          const name = event.society_name?.trim();
          if (!name) continue;
          grouped.set(name, [...(grouped.get(name) ?? []), event]);
        }

        setSocieties(Array.from(grouped.entries()).map(([name, events]) => ({ name, events })));
      } catch (_error) {
        setSocieties([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSocieties();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Explore</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Society discovery</h1>
      </div>

      {isLoading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-bg-card p-8 text-slate-400">
          Loading societies...
        </div>
      ) : societies.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-bg-card p-8 text-center">
          <p className="text-xl font-semibold text-white">No societies with events yet</p>
          <p className="mt-2 text-sm text-slate-400">Societies will appear here after they publish an event.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {societies.map((society) => (
          <article key={society.name} className="rounded-2xl border border-violet-500/20 bg-bg-card p-5 shadow-glow">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white">
                {society.name.charAt(0)}
              </div>
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-200">
                {society.events.length} {society.events.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-white">{society.name}</h2>
            <p className="mt-2 text-sm text-violet-200">{society.events.map((event) => event.category).filter((category, index, categories) => categories.indexOf(category) === index).join(', ')}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{society.events.slice(0, 3).map((event) => event.title).join(' • ')}</p>

            <Link href={`/events?search=${encodeURIComponent(society.name)}`} className="mt-5 inline-flex rounded-full border border-violet-500/40 bg-transparent px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/10">
              View events
            </Link>
          </article>
        ))}
        </div>
      )}
    </main>
  );
}
