# ScriptFlow

A full-stack web application for managing short-form content scripts for Instagram Reels, TikToks, and YouTube Shorts. ScriptFlow helps creators plan, write, and organize their video scripts in one structured workspace.

## Live Demo

https://scriptflow-zeta.vercel.app

## Features

- User authentication with JWT (register, login, logout)
- Create, edit, delete, and view scripts
- Structured script editor with four sections:
  - **Basics** — mission and caption
  - **Hook** — title hook, visual hook, verbal hook
  - **Storytelling Framework** — problem, promise, credibility, delivery, CTA
  - **Production Notes** — footage needed and audio
- Status tracking (draft, ready, posted)
- Search and filter scripts by status
- Toast notifications for save and delete actions
- Responsive design

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router
- Deployed on Vercel

**Backend**
- Node.js + Express
- Prisma ORM v7
- PostgreSQL (Railway)
- JWT Authentication
- bcryptjs for password hashing
- Deployed on Railway

## Project Structure

```
scriptflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── vite.config.js
└── server/
    ├── middleware/
    ├── prisma/
    ├── routes/
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (or Railway account)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/KimShota/scriptflow.git
cd scriptflow
```

**2. Set up the backend**

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```
PORT=8080
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

Run the database migration:

```bash
npx prisma migrate dev --name init
```

Start the server:

```bash
npm run dev
```

**3. Set up the frontend**

```bash
cd client
npm install
```

Create a `.env` file in the client folder:

```
VITE_API_URL=http://localhost:8080
```

Start the client:

```bash
npm run dev
```

**4. Open the app**

Go to `http://localhost:5173` in your browser.

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |

### Scripts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/scripts | Get all scripts for logged in user |
| POST | /api/scripts | Create a new script |
| GET | /api/scripts/:id | Get a single script |
| PUT | /api/scripts/:id | Update a script |
| DELETE | /api/scripts/:id | Delete a script |

## Database Schema

### User

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| email | String | Unique email |
| password | String | Hashed password |
| createdAt | DateTime | Timestamp |

### Script

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| userId | Int | Foreign key to User |
| title | String | Script title |
| mission | String | Core purpose |
| status | Enum | draft, ready, posted |
| hookTitle | String | Title hook |
| hookVisual | String | Visual hook |
| hookVerbal | String | Verbal hook |
| storyProblem | String | Problem |
| storyPromise | String | Promise |
| storyCredibility | String | Credibility |
| storyDelivery | String | Delivery |
| storyCta | String | Call to action |
| footageNeeded | String | Production notes |
| audio | String | Audio notes |
| caption | String | Social media caption |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

## Roadmap

- [ ] Gemini API grammar correction
- [ ] Tags and categories
- [ ] Duplicate script
- [ ] Mobile app
- [ ] Multi-platform support (TikTok, YouTube Shorts)

## License

MIT