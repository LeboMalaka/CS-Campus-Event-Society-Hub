'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'society'>('student');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await register(fullName, email, password, role);
      const roleLabel = role === 'society' ? 'Society' : 'Student';
      setMessage(`${fullName || 'New user'} registered as ${roleLabel}. Redirecting...`);
      router.push(role === 'society' ? '/dashboard' : '/my-events');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create account.');
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-3xl border border-violet-500/20 bg-[#17171d] shadow-glow lg:grid-cols-2">
        <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-100">Join us</p>
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Create your account</h1>
          <p className="mt-4 max-w-md text-sm text-violet-100/90">
            Sign up as a Student to RSVP or as a Society to publish campus events.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Carter"
                className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@campus.edu"
                className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'society')}
                className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white focus:border-violet-400 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="society">Society</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-violet-500/20 bg-[#111218] px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
              />
            </div>

            <button type="submit" className="primary-button w-full">
              Create account
            </button>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-violet-300 hover:text-violet-200">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
