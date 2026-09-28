'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CustomButton } from '@/components/CustomButton';

interface MyEvent {
  id: string;
  title: string;
  start_time: string;
  location: string;
  category: string;
}

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiRequest<{ data: MyEvent[] }>('/rsvps/my-events');
        setEvents(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch your events');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const handleCancelRsvp = async (eventId: string) => {
    try {
      await apiRequest(`/rsvps/${eventId}`, { method: 'DELETE' });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err: any) {
      alert(err.message || 'Unable to cancel RSVP');
    }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-xl font-semibold text-white">Please log in to view your events.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">My events</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Upcoming RSVPs</h1>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
            <p className="text-sm text-slate-400">Loading your events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-white">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-bg-card p-8 text-center">
          <p className="text-xl font-semibold text-white">No upcoming events</p>
          <p className="mt-2 text-sm text-slate-400">Explore events and RSVP to start your campus journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(event.start_time).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })} • {event.location}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Confirmed
                </span>
                <CustomButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCancelRsvp(event.id)}
                >
                  Cancel
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
