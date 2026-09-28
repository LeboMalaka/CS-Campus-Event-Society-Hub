'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CustomButton } from '@/components/CustomButton';
import Link from 'next/link';

interface SocietyEvent {
  id: string;
  title: string;
  start_time: string;
  location: string;
  category: string;
}

interface Attendee {
  display_name: string;
  email: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SocietyEvent[]>([]);
  const [stats, setStats] = useState({ published: 0, rsvps: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocietyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Note: In a real scenario, we might have a specific /api/events/my-society
        // For now, we fetch all and filter by user.id on frontend, or rely on backend
        const response = await apiRequest<{ data: any[] }>('/events');
        const myEvents = response.data?.filter((e) => e.creator_id === user?.id) || [];
        setEvents(myEvents);

        // Calculate basic stats
        let totalRsvps = 0;
        // In a production app, we'd have a summary endpoint.
        // Here we can't easily fetch all rsvps for all events without many calls.
        // We will show a simplified version.
        setStats({
          published: myEvents.length,
          rsvps: 0, // Would require a summary endpoint
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSocietyData();
    }
  }, [user]);

  if (!user || user.role !== 'society') {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-xl font-semibold text-white">Access denied. This area is for Society Admins only.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Society dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Manage your events</h1>
        </div>
        <Link href="/events/create">
          <CustomButton variant="primary">+ New event</CustomButton>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
            <p className="text-sm text-slate-400">Loading your dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-white">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-5">
              <p className="text-sm text-slate-400">Published Events</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.published}</p>
            </div>
            <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-5">
              <p className="text-sm text-slate-400">Total RSVPs</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.rsvps}</p>
            </div>
            <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-5">
              <p className="text-sm text-slate-400">Active Status</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">Live</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Your Events</h2>
            {events.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-bg-card p-8 text-center">
                <p className="text-lg font-semibold text-white">No events created yet</p>
                <p className="mt-2 text-sm text-slate-400">Start by creating your first event to engage students!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-slate-400">
                        {new Date(event.start_time).toLocaleDateString('en-GB')} • {event.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CustomButton variant="secondary" size="sm" onClick={() => window.location.href = `/events/${event.id}`}>
                        View Details
                      </CustomButton>
                      <CustomButton variant="ghost" size="sm">
                        Manage
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
