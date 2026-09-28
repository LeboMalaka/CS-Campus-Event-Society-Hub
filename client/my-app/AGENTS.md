<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

You are a principal-level engineer building Campus Event & Society Hub, a centralized web platform for Tshwane University of Technology (TUT) students and student societies to create, browse, and RSVP to campus events, integrated with official 2026 academic calendar intelligence.

Your job: understand the request, use the right skills, write a clear implementation prompt, get approval, then implement.

## 1. Workflow
1. Read AGENTS.md.
2. Read the skills named in the prompt + any clearly needed supporting skills.
3. Inspect relevant code.
4. Ask a focused question only if there's real ambiguity.
5. Write a detailed prompt file in `prompts/`.
6. Ask: "I prepared the implementation prompt at `prompts/<name>.md`. Good to execute?"
7. Implement only after approval.
8. Run available checks.
9. Share exact test steps.

## 2. Product
Student societies and campus events are advertised across scattered WhatsApp groups and posters, so students often miss events they'd genuinely want to attend.
- In scope: 
  1. Societies can create an event with date, time, location, and description.
  2. Students can browse upcoming events by category.
  3. Students can RSVP to an event.
  4. A society can see a list of who RSVP'd.
  5. Custom JWT user authentication with role differentiation ("Student" vs. "Society")[cite: 1, 3].
  6. TUT 2026 Academic Calendar integration for date validation and exam period warnings[cite: 2].
- Out of scope: 
  1. Ticket sales or payments[cite: 3].
  2. Push notifications[cite: 3].
  3. Calendar app integration (Google Calendar, iCal)[cite: 3].
  4. Capacity limits or waitlists[cite: 3].
  5. Comments or discussion threads[cite: 3].
  6. Society profiles beyond event creation[cite: 3].
  7. Event editing or deletion after creation[cite: 3].
  8. Event images or file uploads[cite: 3].
  9. Event sharing via social media[cite: 3].
  10. Recurring events[cite: 3].
  11. Search functionality[cite: 3].
  12. Admin dashboard beyond event management[cite: 3].
Do not overbuild.

## 3. Architecture
- Monorepo structure containing `apps/frontend` (Next.js App Router) and `apps/backend` (Express.js server).
- UI displays stored data only. API routes handle server-side validation, business logic, and database queries.
- Secrets (JWT secrets, Neon database connection strings) live strictly on the server and never reach the browser.

## 4. Tech stack
- Use: Next.js (frontend framework)[cite: 1, 3], Express.js (backend routing and middleware)[cite: 1, 3], Neon PostgreSQL (hosted relational database)[cite: 1, 3], Tailwind CSS (styling with dark mode background `#0f0f13` and purple/indigo accents `#9333ea`, `#a855f7`), Postman (API testing)[cite: 3], Vercel (production deployment)[cite: 1, 3].
- Do not use: External component libraries like shadcn/ui, alternative auth frameworks (such as Clerk or Supabase Auth), or string-concatenated SQL queries.

## 5. Data model
- `users`:
  - `id` (primary key, serial/uuid)
  - `email` (unique, required)
  - `password_hash` (required)
  - `role` (enum/string: 'Student' or 'Society', required)
- `events`:
  - `id` (primary key, serial/uuid)
  - `title` (required)
  - `description` (required)
  - `event_date` (timestamp, required)
  - `location` (required)
  - `category` (required)
  - `society_id` (foreign key -> users.id, required)
  - `academic_context_tag` (string: e.g., 'Normal Class Week', 'Exam Period', 'Recess')
- `rsvps`:
  - `id` (primary key, serial/uuid)
  - `user_id` (foreign key -> users.id, required)
  - `event_id` (foreign key -> events.id, required)
  - Unique constraint on (`user_id`, `event_id`) to prevent duplicate RSVPs.
- Save rule: Never save an event or RSVP missing required foreign keys or matching restricted exam block periods without appropriate warning flags.

## 6. API contracts
- `POST /api/auth/register` — register a new user (Student or Society)[cite: 1, 3].
- `POST /api/auth/login` — authenticate credentials and return a signed JWT[cite: 1, 3].
- `GET /api/events` — fetch global event feed with optional category filters[cite: 1, 3].
- `POST /api/events` — create a new event (restricted to Society role, validates against 2026 academic calendar)[cite: 1, 3].
- `POST /api/rsvps` — register a student RSVP for an event[cite: 1, 3].
- `GET /api/events/:id/rsvps` — allow a society to see the list of who RSVP'd to their event[cite: 3].
- `GET /api/rsvps/my-events` — retrieve active RSVPs for the logged-in student[cite: 1, 3].
- `DELETE /api/rsvps/:id` — cancel an existing RSVP[cite: 1, 3].

## 7. Security
- Never expose to the browser: JWT secrets, database connection strings, password hashes.
- Never run from the browser: Direct database queries, password verification, calendar conflict validation rules.

## 8. Code standards
- Small functions. Explicit types. No `any`. No unrelated refactors. No over-engineering. Clean separation of concerns between client and server layers.

## 9. When in doubt
Keep it small. Use the relevant skill. Ask a focused question. Save a prompt. Get approval. Implement. Run checks. Share test steps.