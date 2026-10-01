'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { CustomButton } from '@/components/CustomButton';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Support</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Contact Campus Hub</h1>
        <p className="mt-4 leading-7 text-slate-300">
          Need help with an event, RSVP, society profile, or account? Contact the campus support team.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl border border-violet-500/20 bg-bg-card p-6">
          <h2 className="text-xl font-semibold text-white">Campus contacts</h2>
          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="text-slate-400">General support</p>
              <a href="mailto:support@campushub.edu" className="mt-1 block text-violet-200 hover:text-white">support@campushub.edu</a>
            </div>
            <div>
              <p className="text-slate-400">Society and event support</p>
              <a href="mailto:societies@campushub.edu" className="mt-1 block text-violet-200 hover:text-white">societies@campushub.edu</a>
            </div>
            <div>
              <p className="text-slate-400">Support hours</p>
              <p className="mt-1 text-white">Monday to Friday, 08:00 to 16:30</p>
            </div>
          </div>
          <Link href="/events" className="mt-8 inline-block text-sm text-violet-300 hover:text-white">Browse events</Link>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-bg-card p-6">
          <h2 className="text-xl font-semibold text-white">Send us a message</h2>
          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Thanks. Your message has been recorded for the support team.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm text-slate-300">
                  Name
                  <input required name="name" className="mt-2 w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500" />
                </label>
                <label className="text-sm text-slate-300">
                  Email
                  <input required type="email" name="email" className="mt-2 w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500" />
                </label>
              </div>
              <label className="block text-sm text-slate-300">
                Topic
                <select name="topic" className="mt-2 w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500">
                  <option>Event support</option>
                  <option>RSVP support</option>
                  <option>Society support</option>
                  <option>Account support</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Message
                <textarea required name="message" rows={5} className="mt-2 w-full rounded-xl border border-slate-700 bg-bg-panel px-4 py-3 text-white outline-none focus:border-violet-500" />
              </label>
              <CustomButton type="submit">Send message</CustomButton>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
