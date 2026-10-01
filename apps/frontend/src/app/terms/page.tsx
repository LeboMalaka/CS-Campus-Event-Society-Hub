import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Legal</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: 1 October 2026</p>

        <div className="mt-8 space-y-7 leading-7 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Using Campus Hub</h2>
            <p className="mt-2">Campus Hub helps students discover campus activities and helps societies publish events. By using the platform, you agree to provide accurate account information and to use the service responsibly.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Accounts</h2>
            <p className="mt-2">Keep your login details private and use only the account assigned to you. You are responsible for activity performed through your account and should contact support if you suspect unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Events and content</h2>
            <p className="mt-2">Societies must publish truthful, lawful, and suitable event information. Do not publish misleading, discriminatory, unsafe, or unrelated content. Societies are responsible for the accuracy of their event details and for updating or cancelling events when circumstances change.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">RSVPs and cancellations</h2>
            <p className="mt-2">An RSVP indicates an intention to attend and is not a guarantee of entry. Students may cancel their own RSVPs. Society owners may cancel their own events, after which the event is removed from public discovery and existing RSVPs are cleared.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
            <p className="mt-2">Do not abuse the platform, attempt unauthorized access, submit harmful code, impersonate another person, or use event information to harass or endanger others. Access may be restricted when these terms are violated.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Service availability</h2>
            <p className="mt-2">We aim to keep Campus Hub available and accurate, but event information and access may change because of maintenance, technical issues, or campus decisions. Always confirm important event details with the hosting society.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-2">Questions about these terms can be sent through our <Link href="/contact" className="text-violet-300 hover:text-white">contact page</Link>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
