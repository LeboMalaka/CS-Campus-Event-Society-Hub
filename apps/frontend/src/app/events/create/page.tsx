'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/CustomButton';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const defaultStart = () => {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d.toISOString().slice(0, 16);
};

const defaultEnd = () => {
  const d = new Date();
  d.setHours(d.getHours() + 26);
  return d.toISOString().slice(0, 16);
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    location: '',
    startTime: defaultStart(),
    endTime: defaultEnd(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreate = useMemo(() => !!user && user.role === 'society', [user]);

  if (!canCreate) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-xl font-semibold text-white">Access denied. Society accounts can create events.</p>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
      };

      if (!payload.title || !payload.description || !payload.location) {
        throw new Error('Please fill in the title, description, and location.');
      }

      await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-violet-500/20 bg-bg-card p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Society</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Create a new event</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Event title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-violet-500"
              placeholder="Campus Tech Meetup"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              placeholder="Describe the event, goals, and audience..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option>Workshop</option>
                <option>Social</option>
                <option>Career</option>
                <option>Academic</option>
                <option>Sports</option>
                <option>Volunteering</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                placeholder="Innovation Lab, Engineering Block"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Start time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">End time</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <CustomButton type="button" variant="secondary" onClick={() => router.push('/dashboard')}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" isLoading={isSubmitting}>
              Create event
            </CustomButton>
          </div>
        </form>
      </div>
    </main>
  );
}
