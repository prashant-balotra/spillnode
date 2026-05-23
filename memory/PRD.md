# CodingCruiser — PRD

## Problem Statement
CodingCruiser is a blog platform for the user's YouTube channel (Java, Spring Boot, Angular, Next.js, full-stack, cloud). Users can sign up/sign in, browse posts by category, comment, like. A seeded admin can add/edit/delete posts. Inspired by TakeYouForward. Stack: **Angular 17 (frontend) + Spring Boot 3 / Java 17 (backend)**. Delivery: code only, no live preview.

## User Personas
- **Viewer (USER)** — reads tutorials, comments, likes posts, subscribes to newsletter.
- **Admin** — manages posts and categories. Single seeded admin to start.

## Core Requirements (static)
- JWT-based custom auth (sign in / sign up)
- Default seeded admin (admin@codingcruiser.com / Admin@123)
- Rich-text posts (title, content, thumbnail, category, YouTube video link)
- Categories: Java, Spring Boot, Angular, Next.js, Full Stack, Cloud
- About page
- Search & filter, comments + likes, newsletter, featured/trending, tags, YouTube auto-pull

## Implementation Status

### v1 (2026-02) — Initial delivery
**Backend (Spring Boot 3 + Java 17)**
- JWT auth (JJWT 0.12.6) with role-based access (USER / ADMIN)
- Entities: User, Post, Category, Comment, NewsletterSubscriber, Role
- Full CRUD APIs for Posts, Categories, Comments; like-toggle, view counter
- Search endpoint (title/excerpt + category filter)
- Featured & trending endpoints; /api/users/me with liked post IDs
- YouTube Data API v3 integration (graceful fallback when keys absent)
- Newsletter subscribe endpoint
- DataSeeder: admin + 6 categories + 5 sample posts
- MySQL primary (env-driven config), H2 in-memory `dev` profile
- BCrypt password hashing, CORS configured, GlobalExceptionHandler

**Frontend (Angular 17 standalone + Tailwind + Quill)**
- Pages: Home (hero + search + trending sidebar + featured + latest + YouTube feed), Login, Signup, About, Category, Post Detail (likes + comments + embedded YouTube), Admin dashboard, Admin Create/Edit Post (Quill WYSIWYG)
- Components: Navbar, Footer (with newsletter signup), PostCard
- Auth service with signals, JWT interceptor, Auth/Admin route guards
- Custom design system: yellow accent on warm ink palette, JetBrains Mono + Plus Jakarta Sans, grain backgrounds, fade-up animations, pill buttons
- data-testid on all interactive elements
- Verified clean production build

**DevOps**
- backend/Dockerfile (multi-stage Maven → JRE17, non-root user)
- frontend/Dockerfile (Node build → Nginx alpine)
- frontend/nginx.conf (SPA fallback + /api proxy)
- docker-compose.yml (MySQL 8.4 + backend + frontend, healthchecks, named volume)
- .env.example with all overrides

## Delivery
Zipped at `/app/codingcruiser-app.zip` (200 KB, 123 files).

## Backlog (P1)
- Image upload to S3/R2 (replace URL paste in admin)
- OAuth (Google/GitHub) social login
- Sitemap.xml + RSS feed for SEO
- Bookmarks / read-later for users
- Email digests for newsletter (SendGrid/Resend)

## Backlog (P2)
- Course-style structured "Learning Paths"
- AWS / GCP deployment guide
- Multi-author support
- Comment threading + moderation queue
