export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-violet-500/20 bg-[#17171d] p-4">
      <div className="h-36 rounded-xl bg-slate-700/80" />
      <div className="h-4 w-20 rounded bg-slate-700/80" />
      <div className="h-5 w-3/5 rounded bg-slate-700/80" />
      <div className="h-4 w-full rounded bg-slate-700/80" />
      <div className="h-4 w-5/6 rounded bg-slate-700/80" />
    </div>
  );
}

export function EmptyState({
  title = 'No upcoming events found in this category',
  description = 'Try another filter or browse the full campus schedule.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-[#17171d] p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-2xl text-violet-300">
        ✦
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      <button className="primary-button mt-5">Browse all events</button>
    </div>
  );
}

export function ValidationError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {message}
    </div>
  );
}
