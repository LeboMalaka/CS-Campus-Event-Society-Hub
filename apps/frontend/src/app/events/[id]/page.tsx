'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CustomButton } from '@/components/CustomButton';

type EventDetail = {
  id: string;
  creator_id: string | number;
  title: string;
  category: string;
  society_name?: string;
  description: string;
  start_time: string;
  end_time: string | null;
  location: string;
  status?: 'published' | 'cancelled';
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = typeof params?.id === 'string' ? params.id : '';

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [rsvpState, setRsvpState] = useState<'idle' | 'rsvped' | 'not-rsvped'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const eventData = await apiRequest<{ data: EventDetail }>(`/events/${eventId}`);
        setEvent(eventData.data);

        if (user && user.role === 'student') {
          const rsvpData = await apiRequest<{ data: any[] }>('/rsvps/my-events');
          const hasRsvp = rsvpData.data?.some((item) => item.id === eventId);
          setRsvpState(hasRsvp ? 'rsvped' : 'not-rsvped');
        } else {
          setRsvpState('not-rsvped');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, user]);

  const handleToggleRsvp = async () => {
    if (!user) {
      setMessage('Please log in to RSVP for this event.');
      return;
    }

    if (user.role !== 'student') {
      setMessage('Only student accounts can RSVP to events.');
      return;
    }

    setIsPending(true);
    setMessage('');

    try {
      if (rsvpState === 'rsvped') {
        await apiRequest(`/rsvps/${eventId}`, { method: 'DELETE' });
        setRsvpState('not-rsvped');
        setMessage('Your RSVP has been cancelled.');
      } else {
        await apiRequest('/rsvps', {
          method: 'POST',
          body: JSON.stringify({ eventId }),
        });
        setRsvpState('rsvped');
        setMessage('You are now RSVP’d for this event.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Unable to update RSVP state.');
    } finally {
      setIsPending(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!event || !window.confirm('Cancel this event? Students will no longer be able to find or RSVP to it.')) {
      return;
    }

    setIsCancelling(true);
    setMessage('');

    try {
      await apiRequest(`/events/${event.id}`, { method: 'DELETE' });
      router.push('/dashboard');
    } catch (error: any) {
      setMessage(error.message || 'Unable to cancel this event.');
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <p className="text-slate-400">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-2xl font-semibold text-white">Event not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="overflow-hidden rounded-3xl border border-violet-500/20 bg-bg-card shadow-glow">
        <div className="h-56 bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 sm:h-72 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/40 to-transparent" />
        </div>

        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1.5fr_0.8fr] lg:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200">
                {event.category}
              </span>
              <span className="text-sm text-slate-400">Hosted by {event.society_name || 'Campus Society'}</span>
            </div>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">{event.title}</h1>

            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-700 bg-bg-panel p-3">
                <p className="text-slate-400">Date</p>
                <p className="mt-1 font-medium text-white">
                  {new Date(event.start_time).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-bg-panel p-3">
                <p className="text-slate-400">Time</p>
                <p className="mt-1 font-medium text-white">
                  {new Date(event.start_time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-bg-panel p-3">
                <p className="text-slate-400">Location</p>
                <p className="mt-1 font-medium text-white">{event.location}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white">About this event</h2>
              <p className="mt-3 leading-7 text-slate-300">{event.description}</p>
            </div>
          </div>

          <aside className="rounded-2xl border border-violet-500/20 bg-bg-dark p-5">
            <p className="text-sm text-slate-400">Event Status</p>
            <p className={`mt-2 text-2xl font-bold ${event.status === 'cancelled' ? 'text-red-300' : 'text-white'}`}>
              {event.status === 'cancelled' ? 'Cancelled' : 'Active'}
            </p>

            {user ? (
              <div className="mt-6 space-y-3">
                <CustomButton
                  variant={rsvpState === 'rsvped' ? 'secondary' : 'primary'}
                  className="w-full"
                  onClick={handleToggleRsvp}
                  disabled={isPending}
                >
                  {isPending ? 'Updating...' : rsvpState === 'rsvped' ? 'Cancel RSVP' : 'RSVP Now'}
                </CustomButton>
                {message && (
                  <p className={`text-sm text-center ${message.includes('cancelled') || message.includes('RSVP’d') ? 'text-violet-200' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 text-sm text-violet-200 text-center">
                Log in to RSVP for this event.
              </div>
            )}

            {user?.role === 'society_admin' && String(user.id) === String(event.creator_id) ? (
              <CustomButton
                variant="secondary"
                className="mt-3 w-full border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200"
                onClick={handleCancelEvent}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel event'}
              </CustomButton>
            ) : null}

            <CustomButton variant="secondary" className="mt-3 w-full">
              Share event
            </CustomButton>
          </aside>
        </div>
      </article>
    </main>
  );
}
