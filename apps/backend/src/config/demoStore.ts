import bcrypt from 'bcryptjs';
import { categorizeEvent } from './eventCategories.js';

export type DemoRole = 'student' | 'society';

export type DemoUser = {
  id: string;
  email: string;
  password_hash: string;
  role: DemoRole;
  display_name: string;
  created_at: string;
};

export type DemoEvent = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string | null;
  status: 'published' | 'cancelled';
  created_at: string;
};

export type DemoRsvp = {
  user_id: string;
  event_id: string;
  created_at: string;
};

const now = () => new Date().toISOString();

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-society-1',
    email: 'society@campus.edu',
    password_hash: bcrypt.hashSync('demo123', 10),
    role: 'society',
    display_name: 'Campus Tech Society',
    created_at: now(),
  },
  {
    id: 'demo-student-1',
    email: 'student@campus.edu',
    password_hash: bcrypt.hashSync('demo123', 10),
    role: 'student',
    display_name: 'Ava Johnson',
    created_at: now(),
  },
];

export const demoEvents: DemoEvent[] = [
  {
    id: 'demo-event-academic-1',
    creator_id: 'demo-society-1',
    title: 'Study Skills Workshop',
    description: 'Practical study planning and exam preparation for students.',
    category: 'Workshop',
    location: 'Library Learning Lab',
    start_time: '2026-10-08T15:00:00.000Z',
    end_time: '2026-10-08T17:00:00.000Z',
    status: 'published' as const,
    created_at: now(),
  },
  {
    id: 'demo-event-social-1',
    creator_id: 'demo-society-1',
    title: 'Campus Welcome Picnic',
    description: 'A relaxed social afternoon for students to meet and connect.',
    category: 'Social',
    location: 'Main Quad',
    start_time: '2026-10-10T12:00:00.000Z',
    end_time: '2026-10-10T16:00:00.000Z',
    status: 'published' as const,
    created_at: now(),
  },
  {
    id: 'demo-event-sports-1',
    creator_id: 'demo-society-1',
    title: 'Interfaculty Football Match',
    description: 'A friendly football tournament between campus faculties.',
    category: 'Sports',
    location: 'TUT Sports Ground',
    start_time: '2026-10-14T13:00:00.000Z',
    end_time: '2026-10-14T17:00:00.000Z',
    status: 'published' as const,
    created_at: now(),
  },
].map((event) => ({
  ...event,
  category: categorizeEvent(event.title, event.description, event.category),
}));

export const demoRsvps: DemoRsvp[] = [];

export function isDatabaseConnectionError(error: any): boolean {
  if (!error) return false;

  const message = String(error.message || '').toLowerCase();
  const code = String(error.code || '').toUpperCase();

  return code === 'ETIMEDOUT' || code === 'ENETUNREACH' || code === 'ECONNREFUSED' || code === 'ECONNRESET' || code === 'ENOTFOUND' || code === 'EAI_AGAIN' || code === 'ENOENT' ||
    message.includes('timeout') ||
    message.includes('connect') ||
    message.includes('network') ||
    message.includes('econn');
}

export function findDemoUserByEmail(email: string): DemoUser | undefined {
  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createDemoUser(data: { display_name: string; email: string; password_hash: string; role: DemoRole }) {
  const user: DemoUser = {
    id: `demo-user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    email: data.email,
    password_hash: data.password_hash,
    role: data.role,
    display_name: data.display_name,
    created_at: now(),
  };

  demoUsers.push(user);
  return user;
}

export function getDemoEventById(eventId: string) {
  const event = demoEvents.find((entry) => entry.id === eventId);
  if (!event) return null;

  return {
    ...event,
    society_name: getSocietyName(event.creator_id),
  };
}

export function listDemoEvents() {
  return demoEvents.map((event) => ({
    ...event,
    society_name: getSocietyName(event.creator_id),
  }));
}

export function createDemoEvent(data: {
  creator_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time?: string | null;
}) {
  const event: DemoEvent = {
    id: `demo-event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    creator_id: data.creator_id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    start_time: data.start_time,
    end_time: data.end_time || null,
    status: 'published',
    created_at: now(),
  };

  demoEvents.push(event);
  return {
    ...event,
    society_name: getSocietyName(event.creator_id),
  };
}

export function cancelDemoEvent(eventId: string) {
  const event = demoEvents.find((entry) => entry.id === eventId);
  if (!event) return null;

  event.status = 'cancelled';
  for (let i = demoRsvps.length - 1; i >= 0; i -= 1) {
    if (demoRsvps[i].event_id === eventId) demoRsvps.splice(i, 1);
  }

  return {
    ...event,
    society_name: getSocietyName(event.creator_id),
  };
}

export function updateDemoEvent(eventId: string, updates: Partial<DemoEvent>) {
  const index = demoEvents.findIndex((event) => event.id === eventId);
  if (index === -1) return null;

  demoEvents[index] = {
    ...demoEvents[index],
    ...updates,
  };

  return {
    ...demoEvents[index],
    society_name: getSocietyName(demoEvents[index].creator_id),
  };
}

export function deleteDemoEvent(eventId: string) {
  const index = demoEvents.findIndex((event) => event.id === eventId);
  if (index === -1) return false;

  demoEvents.splice(index, 1);
  for (let i = demoRsvps.length - 1; i >= 0; i -= 1) {
    if (demoRsvps[i].event_id === eventId) {
      demoRsvps.splice(i, 1);
    }
  }
  return true;
}

export function getSocietyName(userId: string) {
  const user = demoUsers.find((entry) => entry.id === userId);
  return user?.display_name || 'Campus Society';
}

export function hasDemoRsvp(userId: string, eventId: string) {
  return demoRsvps.some((rsvp) => rsvp.user_id === userId && rsvp.event_id === eventId);
}

export function createDemoRsvp(userId: string, eventId: string) {
  const existing = demoRsvps.find((rsvp) => rsvp.user_id === userId && rsvp.event_id === eventId);
  if (existing) {
    return existing;
  }

  const record: DemoRsvp = {
    user_id: userId,
    event_id: eventId,
    created_at: now(),
  };

  demoRsvps.push(record);
  return record;
}

export function removeDemoRsvp(userId: string, eventId: string) {
  const index = demoRsvps.findIndex((rsvp) => rsvp.user_id === userId && rsvp.event_id === eventId);
  if (index === -1) return false;

  demoRsvps.splice(index, 1);
  return true;
}

export function listDemoMyEvents(userId: string) {
  return demoRsvps
    .filter((rsvp) => rsvp.user_id === userId)
    .map((rsvp) => {
      const event = demoEvents.find((entry) => entry.id === rsvp.event_id);
      if (!event) return null;

      return {
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        location: event.location,
        category: event.category,
        created_at: rsvp.created_at,
      };
    })
    .filter(Boolean);
}

export function listDemoAttendees(eventId: string) {
  return demoRsvps
    .filter((rsvp) => rsvp.event_id === eventId)
    .map((rsvp) => {
      const user = demoUsers.find((entry) => entry.id === rsvp.user_id);
      if (!user) return null;

      return {
        display_name: user.display_name,
        email: user.email,
        created_at: rsvp.created_at,
      };
    })
    .filter(Boolean);
}
