export const eventCategories = ['Workshop', 'Social', 'Academic', 'Career', 'Sports', 'Volunteering'] as const;

export type EventCategory = typeof eventCategories[number];

export function categorizeEvent(title: string, description: string, requestedCategory?: string): EventCategory {
  const text = `${title} ${description}`.toLowerCase();

  if (/football|soccer|sport|match|tournament|athletics|fitness/.test(text)) return 'Sports';
  if (/birthday|party|social|welcome|concert|celebration|picnic/.test(text)) return 'Social';
  if (/graduation|exam|lecture|study|academic|seminar|research/.test(text)) return 'Academic';
  if (/career|interview|recruit|employment|cv|resume/.test(text)) return 'Career';
  if (/volunteer|community service|outreach|charity/.test(text)) return 'Volunteering';
  if (/workshop|training|hackathon|bootcamp|hands-on/.test(text)) return 'Workshop';

  const normalized = eventCategories.find((category) => category.toLowerCase() === requestedCategory?.trim().toLowerCase());
  return normalized || 'Social';
}