'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type LoginRole = 'student' | 'society_admin';

type RoleLoginFormProps = {
  role: LoginRole;
};

const roleDetails = {
  student: {
    label: 'Student',
    title: 'Student sign in',
    description: 'Browse campus events, RSVP, and track your attendance.',
    email: 'student@campus.edu',
  },
  society_admin: {
    label: 'Society Admin',
    title: 'Society admin sign in',
    description: 'Publish events, manage listings, and monitor participation.',
    email: 'authorized-admin@campus.edu',
  },
} satisfies Record<LoginRole, { label: string; title: string; description: string; email: string }>;

export default function RoleLoginForm({ role }: RoleLoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const details = roleDetails[role];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password, role);
      router.push(role === 'society_admin' ? '/dashboard' : '/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-3xl border border-violet-500/20 bg-[#17171d] shadow-glow lg:grid-cols-2">
        <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-100">Campus Hub</p>
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">{details.title}</h1>
          <p className="mt-4 max-w-md text-sm text-violet-100/90">{details.description}</p>
          <div className="mt-8 flex gap-3 text-sm">
            <Link href="/login/student" className={role === 'student' ? 'rounded-full bg-white px-4 py-2 font-semibold text-violet-700' : 'rounded-full border border-white/30 px-4 py-2 text-white'}>
              Student
            </Link>
            <Link href="/login/society" className={role === 'society_admin' ? 'rounded-full bg-white px-4 py-2 font-semibold text-violet-700' : 'rounded-full border border-white/30 px-4 py-2 text-white'}>
              Society Admin
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-email">Email</label>
              <input id="login-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email" autoComplete="off" spellCheck={false} className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="login-password">Password</label>
              <input id="login-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="new-password" className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none" />
            </div>

            <button type="submit" disabled={isSubmitting} className="primary-button w-full">
              {isSubmitting ? 'Signing in...' : `Sign in as ${details.label}`}
            </button>

            {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

            <p className="text-center text-xs text-slate-500">Restricted access for authorized society admin accounts.</p>
            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account? <Link href="/register" className="font-medium text-violet-300 hover:text-violet-200">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
