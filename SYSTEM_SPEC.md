# System Specification: CS-Campus-Event-Society-Hub

This document serves as the technical source of truth for the implementation of the CS-Campus-Event-Society-Hub. It translates the project contract into actionable engineering specifications for the frontend, backend, and database.

## 1. Feature Matrix (MVP Scope)

| Category | Feature | Description | User Role | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | Registration | Sign up with email/password and role selection (Student/Society) | All | Must-Have |
| **Auth** | Secure Login | JWT-based authentication with role-aware session | All | Must-Have |
| **Discovery** | Global Event Feed | Public list of all upcoming events | Public/All | Must-Have |
| **Discovery** | Search & Filter | Filter by Category (Workshop, Social, etc.) or Keyword search | Public/All | Must-Have |
| **Event** | Event Detail View | Full details: Date, Time, Location, Description, Host | Public/All | Must-Have |
| **Event** | RSVP System | Toggle RSVP status (Sign up / Cancel) | Student | Must-Have |
| **Society** | Event Creator | Form to publish new events (Title, Date, Location, etc.) | Society | Must-Have |
| **Society** | Event Management | Ability to edit or delete their own events | Society | Must-Have |
| **Society** | RSVP Monitor | View list of students who have RSVP'd to their events | Society | Must-Have |
| **Student** | My Events | Dashboard showing a list of events the student is attending | Student | Must-Have |
| **UI/UX** | Responsive Shell | Mobile-first layout using Tailwind CSS | All | Must-Have |
| **UX** | Auth Guards | Redirect unauthenticated users to login when RSVPing | Public | Should-Have |

---

## 2. Data Model (PostgreSQL / Neon)

### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique user identifier |
| `email` | VARCHAR | Unique, Not Null | User email address |
| `password_hash` | VARCHAR | Not Null | Bcrypt hashed password |
| `role` | ENUM | Not Null | 'student' or 'society' |
| `display_name` | VARCHAR | Not Null | User's public name |
| `created_at` | TIMESTAMP | Default now() | Account creation date |

### Table: `events`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique event identifier |
| `creator_id` | UUID | FK $\rightarrow$ `users.id` | The society user who created the event |
| `title` | VARCHAR | Not Null | Event name |
| `description` | TEXT | Not Null | Detailed event description |
| `category` | ENUM | Not Null | Workshop, Social, Career, Academic, Sports, Volunteering |
| `location` | VARCHAR | Not Null | Physical or digital location |
| `start_time` | TIMESTAMP | Not Null | Event start date and time |
| `end_time` | TIMESTAMP | | Optional event end time |
| `created_at` | TIMESTAMP | Default now() | Event creation date |

### Table: `rsvps`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | FK $\rightarrow$ `users.id`, PK | The student RSVPing |
| `event_id` | UUID | FK $\rightarrow$ `events.id`, PK | The event being attended |
| `created_at` | TIMESTAMP | Default now() | Timestamp of the RSVP |

---

## 3. API Route Map (Express.js)

### Authentication (`/api/auth`)
- `POST /register`: Public. Creates user. Payload: `{ email, password, role, displayName }`
- `POST /login`: Public. Validates credentials. Returns JWT. Payload: `{ email, password }`
- `GET /me`: Authenticated. Returns current user profile.

### Events (`/api/events`)
- `GET /`: Public. Returns list of events. Query: `?category=...&search=...`
- `GET /:id`: Public. Returns full event details.
- `POST /`: **Society**. Creates event. Payload: `{ title, description, category, location, startTime }`
- `PUT /:id`: **Society**. Updates event (Owner only).
- `DELETE /:id`: **Society**. Deletes event (Owner only).

### RSVPs (`/api/rsvps`)
- `POST /`: **Student**. Creates RSVP. Payload: `{ eventId }`
- `DELETE /:eventId`: **Student**. Cancels RSVP.
- `GET /my-events`: **Student**. Returns user's attending events.
- `GET /event/:eventId`: **Society**. Returns attendee list (Owner only).

---

## 4. Frontend Component Architecture (Next.js)

### Layout & Shell
- `Navbar`: Role-aware navigation.
- `Footer`: Site footer.
- `AuthGuard`: Protected route wrapper.

### Shared Components
- `EventCard`: Event summary card.
- `CategoryPill`: Color-coded category label.
- `CustomButton`: Reusable button variants.
- `InputField`: Validated input fields.

### Page-Specific Components
- **Browse Page**: `SearchBar`, `FilterBar`, `EventGrid`.
- **Event Detail Page**: `EventHeader`, `EventInfo`, `RSVPButton`.
- **Society Dashboard**: `CreateEventForm`, `ManagedEventsList`, `AttendanceList`.
- **Student Dashboard**: `MyUpcomingEvents`.

---

## 5. User Workflows

### Student Path
`Landing` $\rightarrow$ `Filter/Search` $\rightarrow$ `Event Details` $\rightarrow$ `(Auth Guard)` $\rightarrow$ `RSVP` $\rightarrow$ `My Events Dashboard`.

### Society Path
`Landing` $\rightarrow$ `Login` $\rightarrow$ `Society Dashboard` $\rightarrow$ `Create Event` $\rightarrow$ `Publish` $\rightarrow$ `View RSVPs`.
