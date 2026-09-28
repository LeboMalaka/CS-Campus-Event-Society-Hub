'use client';

import { useAuth } from '@/context/AuthContext';

export default function DashboardProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-xl font-semibold text-white">Please log in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-violet-500/20 bg-bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{user.displayName}</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-500/20 bg-bg-panel p-5">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 text-lg font-medium text-white">{user.email}</p>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-bg-panel p-5">
            <p className="text-sm text-slate-400">Account type</p>
            <p className="mt-2 text-lg font-medium text-white capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
