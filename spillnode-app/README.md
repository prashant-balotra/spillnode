# Spillnode

A full-stack blog platform for the **Spillnode** YouTube channel — Java, Spring Boot, Angular, Next.js, full-stack & cloud tutorials.

> Tech stack: **Angular 17** (standalone components, Tailwind CSS, Quill WYSIWYG) + **Spring Boot 3 / Java 17** (Spring Security, JPA, JWT, MySQL / H2).

---

## ✨ Features

- 🔐 **JWT-based auth** — sign up / sign in for viewers
- 👤 **Default seeded admin** (`admin@spillnode.com` / `Admin@123`)
- 📝 **Rich-text posts** — Quill WYSIWYG editor with headings, code blocks, quotes, lists, links, images, colors
- 🏷️ **Categories + Tags** — Java, Spring Boot, Angular, Next.js, Full Stack, Cloud (auto-seeded)
- 🔎 **Search & filter** posts by keyword and category
- 💬 **Comments** on posts (auth required)
- ❤️ **Likes / favorites** (toggle, auth required)
- ⭐ **Featured / Trending** posts on the homepage
- 📬 **Newsletter signup** (stored in DB; plug in any email service later)
- 🎥 **YouTube channel integration** — auto-pulls your latest videos via YouTube Data API
- 👑 **Admin dashboard** — create / edit / delete posts
- 🎬 **5 sample posts pre-seeded** so the homepage isn't empty on first run
- 📖 **About page**
- 🐳 **One-command Docker setup** — `docker compose up`

---

## 🚀 Quickest start: Docker (recommended)

Requires Docker Desktop / Docker Engine 20.10+.

```bash
cd spillnode-app
# Optional: copy and tweak environment variables
cp .env.example .env

docker compose up --build
```

Then visit:
- Frontend → **http://localhost**
- Backend API → **http://localhost:8080/api**
- MySQL → `localhost:3306` (user: `cruiser`, db: `spillnode`)

Stop: `docker compose down` &nbsp; · &nbsp; Wipe DB: `docker compose down -v`

The admin account `admin@spillnode.com` / `Admin@123` and **5 sample posts** are seeded automatically on first boot.

---

## 🧑‍💻 Manual local dev (without Docker)

### Prerequisites
- Java 17+ &nbsp;·&nbsp; Maven 3.9+ &nbsp;·&nbsp; Node.js 18+ &nbsp;·&nbsp; MySQL 8 (or use the H2 `dev` profile)

### Option A — with a local MySQL

1. Create a MySQL user/db (or let `createDatabaseIfNotExist=true` do it for you).
2. Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend → http://localhost:8080
3. Run the frontend:
   ```bash
   cd frontend
   yarn install     # or: npm install
   yarn start       # or: npm start
   ```
   Frontend → http://localhost:4200

### Option B — zero-setup H2 (in-memory)

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Data resets on restart. H2 console available at http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:spillnode`, user `sa`, blank password).

---

## 🔑 Default admin

```
Email:    admin@spillnode.com
Password: Admin@123
```

Sign in at `/login`, then visit `/admin` to create posts.

> Change `ADMIN_PASSWORD` in `.env` (Docker) or `application.properties` before going to production.

---

## 🎥 YouTube integration

Set these in `.env` or `application.properties` to power the "From the channel" homepage section:

```properties
app.youtube.channel-id=YOUR_CHANNEL_ID
app.youtube.api-key=YOUR_YOUTUBE_DATA_API_KEY
```

- **Channel ID**: from your channel URL (`youtube.com/channel/UCxxxx`) or via `commentpicker.com/youtube-channel-id.php`.
- **API key**: [Google Cloud Console](https://console.cloud.google.com/) → enable "YouTube Data API v3" → create an API key.

If unset, the section hides itself gracefully.

---

## 🗂 Project structure

```
spillnode-app/
├── docker-compose.yml             # MySQL + backend + frontend
├── .env.example
├── README.md
│
├── backend/                       # Spring Boot 3 + Java 17
│   ├── Dockerfile                 # Multi-stage Maven → JRE
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/spillnode/
│       │   ├── SpillnodeApplication.java
│       │   ├── config/         (SecurityConfig, DataSeeder)
│       │   ├── controller/     (Auth, Post, Category, Comment, Newsletter, YouTube, User)
│       │   ├── dto/            (request / response payloads)
│       │   ├── exception/      (GlobalExceptionHandler)
│       │   ├── model/          (User, Post, Category, Comment, NewsletterSubscriber, Role)
│       │   ├── repository/
│       │   ├── security/       (JwtService, JwtAuthFilter, UserDetailsServiceImpl)
│       │   └── service/        (Auth, Post, Category, Comment, Newsletter, YouTube)
│       └── resources/
│           ├── application.properties        # MySQL by default (env-driven)
│           └── application-dev.properties    # H2 in-memory profile
│
└── frontend/                      # Angular 17 + Tailwind + Quill
    ├── Dockerfile                 # Multi-stage Node → Nginx
    ├── nginx.conf                 # SPA fallback + /api proxy to backend
    ├── package.json, angular.json, tailwind.config.js
    └── src/
        ├── index.html, main.ts, styles.css
        ├── environments/
        └── app/
            ├── app.component.ts, app.routes.ts
            ├── components/   (navbar, footer, post-card)
            ├── guards/       (auth, admin)
            ├── interceptors/ (jwt)
            ├── models/
            ├── pages/        (home, login, signup, about, category,
            │                  post-detail, admin, admin/create-post)
            └── services/     (auth, post, category, comment, newsletter)
```

---

## 🔐 API reference

### Auth (public)
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`

### Posts
- `GET /api/posts?q=&category=&page=&size=` (public, paginated)
- `GET /api/posts/featured`, `GET /api/posts/trending`
- `GET /api/posts/slug/{slug}` (public, increments views)
- `POST /api/posts` &nbsp;/&nbsp; `PUT /api/posts/{id}` &nbsp;/&nbsp; `DELETE /api/posts/{id}` — **ADMIN only**
- `POST /api/posts/{id}/like` (auth)

### Categories
- `GET /api/categories`, `GET /api/categories/slug/{slug}` (public)
- `POST/PUT/DELETE` — **ADMIN only**

### Comments
- `GET /api/comments/post/{postId}` (public)
- `POST /api/comments/post/{postId}` (auth)
- `DELETE /api/comments/{id}` (owner or ADMIN)

### Newsletter
- `POST /api/newsletter/subscribe` `{ email }` (public)

### YouTube
- `GET /api/youtube/latest?max=6` (public)

### User
- `GET /api/users/me` (auth) — returns profile + liked post IDs

All authed requests use header: `Authorization: Bearer <jwt>`.

---

## 🛣 Roadmap ideas

- Image upload to S3 / Cloudflare R2 (so admin doesn't paste URLs)
- Email digests (SendGrid / Resend) for newsletter subscribers
- Bookmarks / read-later for logged-in users
- OAuth (Google / GitHub) login
- Sitemap & RSS feed for SEO
- Course-style "Learning Paths" (à la TakeYouForward)
- Cloud deployment guide: AWS ECS / GCP Cloud Run

---

Built with ❤️ for Spillnode viewers.
