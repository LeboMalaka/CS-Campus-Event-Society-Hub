# CS-Campus-Event-Society-Hub

## Project Contract and Delivery Roadmap

## 1. Project Overview

This project is designed to solve a real campus problem: student events and society activities are often spread across WhatsApp groups, flyers, posters, and informal communication channels. As a result, students miss opportunities to attend meaningful events, and societies struggle to reach the right audience consistently.

The objective of CS-Campus-Event-Society-Hub is to create a single digital hub where:

- students can discover campus events,
- societies can publish and manage event listings,
- users can register/log in securely,
- students can RSVP to events,
- event data can be managed through a structured full-stack platform.

## 2. Problem Statement

The current event-sharing model is fragmented and inefficient. Students do not have a central source of truth for campus activities, and societies lack a reliable platform to publish events and measure engagement.

The platform must reduce friction in event discovery, improve student participation, and provide societies with a smarter way to reach their audience.

## 3. Product Goal

Build a campus event platform that connects students and societies through a digital experience that is:

- easy to use,
- visually modern,
- role-aware,
- data-driven,
- scalable enough for future campus use cases.

## 4. Core Users

### 4.1 Student
- Browses upcoming events
- Searches by keyword/category
- Views event details
- RSVPs for relevant events
- Tracks personal event attendance

### 4.2 Society / Club / Organiser
- Creates and publishes events
- Manages event listings and details
- Views engagement summaries
- Monitors RSVPs and participation

### 4.3 Platform Admin (future scope)
- Oversees published events
- Manages user roles and moderation
- Handles abuse reporting and platform governance

## 5. Product Scope

### Included in this project
- landing page and event discovery experience
- category and keyword search filters
- role-based authentication
- event detail page with RSVP interaction
- society dashboard for publishing and managing events
- student dashboard for their upcoming RSVPs
- Express API for authentication and event data
- PostgreSQL database integration with Neon

### Future scope
- event approval workflows
- real-time notifications
- admin moderation tools
- mobile-first experience
- analytics dashboard
- email and push notifications
- advanced recommendations

## 6. Functional Requirements

### 6.1 Authentication and Access Control
- users can register with a role: Student or Society
- users can log in securely
- JWT-based session handling is required
- role-based access rules differentiate Student vs Society actions

### 6.2 Event Discovery
- public event feed with search and filtering
- categories such as Workshop, Social, Career, Academic, Sports, Volunteering
- event cards with key metadata: title, date, location, category, host, description

### 6.3 Event Detail Page
- users can view a single event in detail
- event info includes title, description, date, time, location, host, attendance status
- students can RSVP or cancel RSVP
- non-authenticated users are prompted to log in before RSVP

### 6.4 Society Features
- authenticated society users can create events
- society users can manage event publication status
- dashboard shows basic engagement metrics

### 6.5 Student Features
- student users can view their upcoming RSVP events
- student users can cancel RSVPs

### 6.6 Backend API
- auth endpoints for register/login
- events endpoints for list/create/detail
- RSVP endpoints for create/cancel/my-events
- protected routes enforce role-specific access rights

## 7. Non-Functional Requirements

- responsive UI across desktop and mobile screens
- accessible interaction design
- secure handling of passwords and JWT secrets
- application should support local development and deployment-ready configuration
- backend must handle errors gracefully with meaningful API responses
- data should be persisted in PostgreSQL via Neon

## 8. Technical Architecture

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Express.js
- TypeScript
- JWT authentication
- role-based middleware

### Database
- PostgreSQL (Neon)
- tables for users, events, and rsvps

### Communication Flow
- Frontend calls backend REST endpoints
- Backend validates roles and JWTs
- Database persists user and event data
- Frontend reads API responses and updates UI state

## 9. Project Phases and Sprints

## Phase 1: Problem Framing and Discovery

### Sprint 1 – Problem validation and product definition
Goal:
- confirm the core problem and target users
- define MVP scope and main value proposition

Deliverables:
- problem statement
- user personas
- high-level feature list
- initial technical architecture direction

Definition of done:
- clear understanding of student and society pain points
- project scope aligned to a usable MVP

---

## Phase 2: UX Design and System Specification

### Sprint 2 – User journeys and wireframes
Goal:
- map the landing, login, register, event listing, detail, and dashboard flows

Deliverables:
- wireframes
- user flows
- information architecture
- UI style direction

### Sprint 3 – Design specification and product contract
Goal:
- finalize structure, styling, and interaction rules

Deliverables:
- design specification
- component breakdown
- role-driven interaction plan
- technical and product documentation

Definition of done:
- all key screens defined
- product contract documented clearly for engineering

---

## Phase 3: Frontend Foundation and Interactive UI

### Sprint 4 – Core frontend scaffolding
Goal:
- set up Next.js app structure and design system

Deliverables:
- landing page
- event card components
- filters/search UI
- layout and styling system

### Sprint 5 – Authentication and role-aware UI
Goal:
- implement login/register screens and dynamic navigation state

Deliverables:
- login form
- register form
- auth context and protected UI behavior
- role-aware navbar and dashboard routing

Definition of done:
- frontend is interactive and behaves consistently with the product flow

---

## Phase 4: Backend and Data Layer

### Sprint 6 – API foundation
Goal:
- set up Express backend and database configuration

Deliverables:
- Express server bootstrapping
- PostgreSQL connection config
- environment variables and JWT setup
- database schema for users/events/rsvps

### Sprint 7 – Auth and event logic
Goal:
- implement secure register/login and event operations

Deliverables:
- register endpoint
- login endpoint
- JWT issuance and verification
- event creation and retrieval endpoints
- role-based access middleware

Definition of done:
- backend supports real users, events, and protected access patterns

---

## Phase 5: Full-Stack Integration and Live Interaction

### Sprint 8 – Connect frontend to API
Goal:
- wire the frontend to the backend for real login/register and event operations

Deliverables:
- API client layer
- auth state persistence
- real form submission with backend responses
- event detail page connected to live data flow

### Sprint 9 – RSVP and dashboard behavior
Goal:
- add real RSVP toggling and student/society interaction flow

Deliverables:
- RSVP create/cancel logic
- student event list dashboard
- society dashboard summary
- role-aware frontend behavior

Definition of done:
- end-to-end user journeys work across frontend and backend

---

## Phase 6: Deployment, Hardening, and Launch Readiness

### Sprint 10 – Quality assurance and polish
Goal:
- validate the product for correctness and usability

Deliverables:
- bug fixing
- accessibility checks
- edge-case validation
- API and UI regression testing

### Sprint 11 – Launch preparation
Goal:
- prepare the project for real-world use

Deliverables:
- environment setup documentation
- deployment config
- final feature checklist
- release notes and product summary

Definition of done:
- project is stable, documented, and ready for demo or deployment

## 10. Milestones

- Milestone 1: Problem, vision, and MVP scope defined
- Milestone 2: UI/UX spec approved
- Milestone 3: Frontend interactive prototype complete
- Milestone 4: Backend and database live
- Milestone 5: Full-stack auth, events, and RSVP working
- Milestone 6: Product launch-ready and documented

## 11. Definition of Done

A feature is considered complete when:

- code is implemented in the project workspace,
- UI behavior matches the intended design,
- backend API is working with real data,
- role-based rules are enforced correctly,
- the feature is verified manually or through API validation,
- documentation reflects the final flow and responsibilities.

## 12. Risks and Constraints

- data model mismatch between local assumptions and actual database schema
- stale port/process conflicts during local development
- environment variables must be set correctly for frontend and backend
- authentication needs careful handling of JWT secret and role validation
- real-world usage may require additional moderator and analytics tooling later

## 13. Project Status Summary

The project is currently in the implementation and integration stage. The platform has already progressed from concept design into a working full-stack foundation that includes:

- event discovery UI,
- role-based auth screens,
- database-connected backend,
- JWT protected API routes,
- RSVP interaction flow,
- front-end and backend integration for live registration/login.

## 14. Project Owner / Current Responsibility

This project is being developed as a campus platform MVP for student-society engagement. It is intended to be extended beyond MVP into a broader engagement and event management system.

## 15. Final Contract Statement

This document acts as the working contract for the project. It defines the mission, the product constraints, the phases, and the sprint roadmap. Every implementation step should align with this document and be judged against the product requirements and acceptance criteria above.
