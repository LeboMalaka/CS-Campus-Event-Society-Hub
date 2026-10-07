'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-3xl border border-violet-500/20 bg-[#17171d] p-6 text-center shadow-glow sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Campus Hub</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Choose your sign-in</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">Use the student portal for RSVPs or the society portal to publish and manage events.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/login/student" className="rounded-2xl border border-violet-500/30 bg-bg-panel p-6 text-left transition hover:border-violet-400 hover:bg-violet-500/10">
            <p className="text-xl font-semibold text-white">Student</p>
            <p className="mt-2 text-sm text-slate-400">Discover events, RSVP, and track attendance.</p>
            <span className="mt-5 inline-flex primary-button">Student sign in</span>
          </Link>
          <Link href="/login/society" className="rounded-2xl border border-violet-500/30 bg-bg-panel p-6 text-left transition hover:border-violet-400 hover:bg-violet-500/10">
            <p className="text-xl font-semibold text-white">Society</p>
            <p className="mt-2 text-sm text-slate-400">Create events and monitor engagement.</p>
            <span className="mt-5 inline-flex primary-button">Society sign in</span>
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-400">Need an account? <Link href="/register" className="font-medium text-violet-300 hover:text-violet-200">Create one</Link></p>
      </div>
    </main>
  );
}
