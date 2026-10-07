import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-violet-500/20 bg-bg-card p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Legal</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: 1 October 2026</p>

        <div className="mt-8 space-y-7 leading-7 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Information we collect</h2>
            <p className="mt-2">Campus Hub collects the account details you provide, including your name, email address, password, and account role. We also store events created by societies and RSVP records created by students.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">How we use information</h2>
            <p className="mt-2">We use this information to authenticate users, publish and manage campus events, process RSVPs, show society event participation, and provide support.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Sharing and visibility</h2>
            <p className="mt-2">Published event details are visible to platform users. Society organisers can see the names and email addresses of students who RSVP to their events. We do not sell personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Security and retention</h2>
            <p className="mt-2">Passwords are stored using secure hashing, and authenticated requests use protected sessions. We retain account and event information while it is needed to operate the platform or meet legitimate operational requirements.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p className="mt-2">You can cancel RSVPs, request account assistance, or ask questions about your information through our <Link href="/contact" className="text-violet-300 hover:text-white">contact page</Link>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Policy updates</h2>
            <p className="mt-2">We may update this policy as Campus Hub develops. The latest version will always be published on this page.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
