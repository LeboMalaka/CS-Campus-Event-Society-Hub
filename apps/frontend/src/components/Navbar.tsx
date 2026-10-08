'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CustomButton } from './CustomButton';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigation = () => {
    const baseLinks = [{ label: 'Browse', href: '/' }];

    if (!user) {
      return baseLinks;
    }

    if (user.role === 'society_admin') {
      return [
        ...baseLinks,
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Manage Events', href: '/dashboard/events' },
        { label: 'My Profile', href: '/dashboard/profile' },
      ];
    }

    // Student Role
    return [
      ...baseLinks,
      { label: 'My Events', href: '/my-events' },
      { label: 'Society Discovery', href: '/societies' },
    ];
  };

  const navigation = getNavigation();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-violet-500/20 bg-bg-dark/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white shadow-glow">
            C
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-semibold text-white">Campus Hub</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-violet-300">Society Network</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-all duration-200 relative py-1 ${
                isActive(item.href)
                ? 'text-brand-400 font-medium'
                : 'text-slate-300 hover:text-violet-300'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 shadow-glow" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:inline-flex">
                {user.role === 'society_admin' ? 'Society Admin' : 'Student'}
              </span>
              <Link href={user.role === 'society_admin' ? '/dashboard' : '/my-events'}>
                <CustomButton variant="primary" size="sm">
                  Profile
                </CustomButton>
              </Link>
              <CustomButton
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                Logout
              </CustomButton>
            </>
          ) : (
            <>
              <Link href="/login/student">
                <CustomButton variant="secondary" size="sm">Student login</CustomButton>
              </Link>
              <Link href="/login/society">
                <CustomButton variant="primary" size="sm">Society login</CustomButton>
              </Link>
              <Link href="/register">
                <CustomButton variant="secondary" size="sm">Sign up</CustomButton>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-bg-panel text-white border border-violet-500/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-dark border-b border-violet-500/20 p-4 shadow-xl animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base py-2 border-b border-violet-500/10 transition-colors ${
                  isActive(item.href) ? 'text-brand-400' : 'text-slate-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <CustomButton variant="secondary" size="md" onClick={logout}>
                  Logout
                </CustomButton>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login/student" className="w-full">
                    <CustomButton variant="secondary" size="md" className="w-full">Student login</CustomButton>
                  </Link>
                  <Link href="/login/society" className="w-full">
                    <CustomButton variant="primary" size="md" className="w-full">Society login</CustomButton>
                  </Link>
                  <Link href="/register" className="w-full">
                    <CustomButton variant="secondary" size="md" className="w-full">Sign up</CustomButton>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
