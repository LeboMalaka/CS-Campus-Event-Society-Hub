'use client';

import Link from 'next/link';

const societies = [
  {
    name: 'Campus Tech Society',
    focus: 'AI, software, and innovation',
    events: 8,
    description: 'Build projects, host workshops, and help students explore modern technology.',
  },
  {
    name: 'Creative Arts Society',
    focus: 'Design, music, and performance',
    events: 5,
    description: 'Bring together student creators for showcases, open mic nights, and collaborative events.',
  },
  {
    name: 'Sports & Wellness Club',
    focus: 'Sport, fitness, and wellbeing',
    events: 6,
    description: 'Run active challenges, wellness initiatives, and community fitness opportunities.',
  },
];

export default function SocietiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Explore</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Society discovery</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {societies.map((society) => (
          <article key={society.name} className="rounded-2xl border border-violet-500/20 bg-bg-card p-5 shadow-glow">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white">
                {society.name.charAt(0)}
              </div>
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-200">
                {society.events} events
              </span>
            </div>

            <h2 className="text-xl font-semibold text-white">{society.name}</h2>
            <p className="mt-2 text-sm text-violet-200">{society.focus}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{society.description}</p>

            <Link href="/events" className="mt-5 inline-flex rounded-full border border-violet-500/40 bg-transparent px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/10">
              View events
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
