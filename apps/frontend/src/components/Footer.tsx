export default function Footer() {
  return (
    <footer className="border-t border-violet-500/20 bg-bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white text-xs shadow-glow">
                C
              </div>
              <p className="font-semibold text-white">Campus Hub</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The central digital hub for discovering campus events and connecting students with society activities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-slate-400 transition hover:text-violet-300">Browse Events</a></li>
              <li><a href="/events" className="text-sm text-slate-400 transition hover:text-violet-300">All Events</a></li>
              <li><a href="/societies" className="text-sm text-slate-400 transition hover:text-violet-300">Discover Societies</a></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              <li><a href="/login" className="text-sm text-slate-400 transition hover:text-violet-300">Login</a></li>
              <li><a href="/register" className="text-sm text-slate-400 transition hover:text-violet-300">Register</a></li>
              <li><a href="/my-events" className="text-sm text-slate-400 transition hover:text-violet-300">My Events</a></li>
            </ul>
          </div>

          {/* Legal/Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-sm text-slate-400 transition hover:text-violet-300">Contact Us</a></li>
              <li><a href="/privacy" className="text-sm text-slate-400 transition hover:text-violet-300">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-slate-400 transition hover:text-violet-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-violet-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Campus Event & Society Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-white transition">Instagram</a>
            <a href="#" className="text-slate-500 hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
