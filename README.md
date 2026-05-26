# ScriptFlow

A full-stack web application for creators to plan, write, and organize short-form content scripts for Instagram Reels, TikToks, and YouTube Shorts — with AI-powered tools and a visual strategy board.

## Live Demo

https://scriptflow-zeta.vercel.app

## Features

**Script Management**
- Create, edit, delete, and view scripts
- Structured script editor with four sections:
  - **Basics** — mission and caption
  - **Hook** — title hook, visual hook, verbal hook
  - **Storytelling Framework** — problem, promise, credibility, delivery, CTA
  - **Production Notes** — footage needed and audio
- Status tracking (draft, ready, posted)
- Search and filter scripts by status
- AI-powered grammar and flow correction using Gemini API

**Creator Analysis**
- Track and analyze what works for top creators in your niche
- Log creator reels with views, hooks, story arc, pacing, CTA, format, audio, and notes
- Search and filter by creator name, pacing, and audio type
- Select multiple creators and generate AI pattern summaries using Gemini API
- Edit and delete analysis entries

**Creator Vision Board**
- Interactive node-based canvas for mapping your content strategy
- Fixed structure: What (Your Ethos, Content Pillars), Who (Demographics, Psychographics), Uniqueness (Pain, Struggle, Experience, Passion)
- Click to edit node content
- Drag to reposition nodes freely
- Resize nodes from any corner
- Text formatting toolbar (font size, bold, alignment)
- Add child nodes to any node
- Auto-saves as you type

**General**
- User authentication with JWT (register, login, logout)
- Toast notifications for save, delete, and AI actions
- Responsive design

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router
- React Flow (@xyflow/react) for vision board
- Deployed on Vercel

**Backend**
- Node.js + Express
- Prisma ORM v7
- PostgreSQL (Railway)
- JWT Authentication
- bcryptjs for password hashing
- Google Gemini API for AI features
- Deployed on Railway

**DevOps**
- Docker (containerized backend)
- AWS ECR (container registry)
- AWS ECS Fargate (container deployment practice)
- GitHub Actions ready

## Project Structure

```
scriptflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── pages/
│   │       ├── LandingPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ScriptEditor.jsx
│   │       ├── AnalysisPage.jsx
│   │       └── VisionBoard.jsx
│   └── vite.config.js
└── server/
    ├── middleware/
    │   └── auth.js
    ├── prisma/
    │   ├── schema.prisma
    │   └── client.js
    ├── routes/
    │   ├── auth.js
    │   ├── scripts.js
    │   ├── analysis.js
    │   ├── vision.js
    │   └── gemini.js
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (or Railway account)
- Google Gemini API key

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
GEMINI_API_KEY=your_gemini_api_key
```

Run the database migration:

```bash
npx prisma migrate dev --name init
npx prisma generate
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

### Creator Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analysis | Get all analyses for logged in user |
| POST | /api/analysis | Create a new analysis |
| PUT | /api/analysis/:id | Update an analysis |
| DELETE | /api/analysis/:id | Delete an analysis |

### Vision Board

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vision | Get user's vision board |
| PUT | /api/vision | Save vision board data |

### Gemini AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/gemini/correct | Grammar and flow correction |
| POST | /api/gemini/summarize-analysis | Summarize selected creator analyses |

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

### Analysis

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| userId | Int | Foreign key to User |
| creatorName | String | Creator name |
| reelLink | String | Link to reel |
| views | Int | View count |
| hookTitle | String | Title hook |
| hookVisual | String | Visual hook |
| hookVerbal | String | Verbal hook |
| storyArc | String | Story arc |
| pacing | Enum | fast, medium, slow |
| cta | String | Call to action |
| format | String | Video format |
| duration | String | Video duration |
| audio | Enum | Audio type |
| audioCustom | String | Custom audio description |
| notes | String | Notes and takeaways |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

### VisionBoard

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| userId | Int | Unique foreign key to User |
| data | Json | Board node and edge data |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

## Roadmap

- [x] Gemini API grammar correction
- [x] Creator Analysis module
- [x] AI pattern summarization
- [x] Creator Vision Board
- [x] Docker containerization
- [x] AWS ECS deployment practice
- [ ] Tags and categories for scripts
- [ ] Duplicate script functionality
- [ ] Mobile app
- [ ] Multi-platform support (TikTok, YouTube Shorts)
- [ ] TypeScript migration

## License

MIT
