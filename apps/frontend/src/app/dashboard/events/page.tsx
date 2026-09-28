'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardEventsPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'society') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-xl font-semibold text-white">Access denied. This page is for society accounts only.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Society</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Event management</h1>
        </div>
        <Link href="/events/create" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500">
          + New event
        </Link>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-6 text-slate-300">
        <p className="text-sm text-slate-400">Your society events will appear here once created.</p>
        <div className="mt-4 rounded-xl border border-dashed border-violet-500/30 bg-bg-panel p-6 text-center">
          <p className="text-lg font-semibold text-white">No events yet</p>
          <p className="mt-2 text-sm text-slate-400">Create your first event to start engaging students.</p>
        </div>
      </div>
    </main>
  );
}
