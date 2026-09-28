import Link from 'next/link';
import { CustomButton } from './CustomButton';
import { CategoryPill } from './CategoryPill';
import { CategoryVariant } from './CategoryPill';

type EventCardProps = {
  title: string;
  date: string;
  location: string;
  category: string;
  host: string;
  description: string;
  id?: string;
  href?: string;
};

const categoryToVariant = (category: string): CategoryVariant => {
  const lower = category.toLowerCase();
  if (lower.includes('academic')) return 'academic';
  if (lower.includes('social')) return 'social';
  if (lower.includes('career')) return 'career';
  if (lower.includes('sports')) return 'sports';
  if (lower.includes('volunteering')) return 'volunteering';
  return 'default';
};

export default function EventCard({
  title,
  date,
  location,
  category,
  host,
  description,
  id = '1',
  href,
}: EventCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-violet-500/20 bg-bg-card shadow-lg shadow-violet-950/30 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-glow">
      <div className="h-40 bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/40 to-transparent" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <CategoryPill
            label={category}
            variant={categoryToVariant(category)}
          />
          <span className="text-xs font-medium text-slate-400">{date}</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-brand-400 transition-colors">{title}</h3>
          <p className="mt-1 text-sm text-violet-200/80">Hosted by {host}</p>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-300">{description}</p>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-violet-500/10">
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <span className="opacity-70">📍</span> {location}
          </span>
          <div className="flex gap-2">
            <Link href={href || `/events/${id}`}>
              <CustomButton variant="secondary" size="sm">
                View
              </CustomButton>
            </Link>
            <CustomButton variant="primary" size="sm">
              RSVP
            </CustomButton>
          </div>
        </div>
      </div>
    </article>
  );
}
