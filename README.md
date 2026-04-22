# Onkar Shinde — AI/ML Engineer Portfolio

A production-grade personal portfolio website built with the **Neural Dark** design aesthetic — inspired by CERN control rooms, GPU monitoring dashboards, and research lab terminals.

![Portfolio Preview](public/preview.png)

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D Graphics | React Three Fiber + Three.js |
| Icons | Lucide React |
| Charts | Recharts |
| Chatbot | OpenAI Embeddings + Pinecone + Anthropic Claude |
| Language | TypeScript (strict) |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/route.ts          # RAG chatbot API (streaming SSE)
│   ├── projects/[slug]/page.tsx   # Dynamic project detail pages
│   ├── globals.css                # Neural Dark design system
│   ├── layout.tsx                 # Root layout with global components
│   └── page.tsx                   # Homepage (all sections)
├── components/
│   ├── HeroSection.tsx            # Full-viewport hero with 3D canvas
│   ├── NeuralCanvas.tsx           # React Three Fiber neural network
│   ├── AboutSection.tsx           # Model card + bio + tech ticker
│   ├── SkillsSection.tsx          # 3-col capability cards with progress bars
│   ├── ProjectsSection.tsx        # Masonry project grid with video modals
│   ├── GithubHeatmap.tsx          # Live contribution heatmap
│   ├── EvalDashboard.tsx          # Metrics + Recharts + eval table
│   ├── ContactSection.tsx         # Email CTA + social + resume download
│   ├── ChatBot.tsx                # Floating RAG chatbot panel
│   ├── CommandPalette.tsx         # ⌘K command palette
│   ├── CurrentlyBuilding.tsx      # Bottom-left status widget
│   ├── Navbar.tsx                 # Sticky navbar with RAG status
│   └── CustomCursor.tsx           # Trailing cyan crosshair cursor
├── data/
│   ├── projects.ts                # All project data (edit here!)
│   ├── knowledge-base.ts          # RAG chatbot knowledge chunks
│   └── site-config.ts             # Personal info, social links, bio
└── lib/
    └── utils.ts                   # cn() and helpers
scripts/
└── seed-pinecone.ts               # Knowledge base seeder script
```

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required for RAG chatbot
OPENAI_API_KEY=sk-...          # For text-embedding-3-small
PINECONE_API_KEY=...           # Pinecone serverless API key
PINECONE_INDEX=portfolio-kb    # Name of your Pinecone index
ANTHROPIC_API_KEY=sk-ant-...   # For claude-sonnet-4-20250514 streaming
```

> **Note:** The chatbot works without API keys — it falls back to a keyword-based response mode automatically.

### 3. Seed the Knowledge Base (optional, for RAG)

```bash
npx tsx scripts/seed-pinecone.ts
```

This will:
1. Embed all chunks in `src/data/knowledge-base.ts` using `text-embedding-3-small`
2. Create a Pinecone serverless index if it doesn't exist
3. Upsert all vectors with metadata

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🎨 Customization

### Personal Info

Edit `src/data/site-config.ts`:

```ts
export const siteConfig = {
  name: "Your Name",
  email: "you@example.com",
  github: "yourusername",
  // ...
};
```

### Projects

Edit `src/data/projects.ts` — add/remove entries from the `projects` array. Each project automatically gets:
- A card on the homepage
- A detail page at `/projects/[slug]`

### Knowledge Base (Chatbot)

Edit `src/data/knowledge-base.ts` to update what the chatbot knows, then re-run the seed script.

### Resume

Place your resume PDF at `public/resume.pdf`.

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 3D Neural Network | `React Three Fiber` particle graph with 80 nodes + edges |
| RAG Chatbot | Pinecone retrieval + Claude streaming via SSE |
| ⌘K Command Palette | Full search across projects, sections, links |
| GitHub Heatmap | Live data from contributions API (cyan-to-violet gradient) |
| Eval Dashboard | Recharts line chart + animated counters + eval table |
| Project Detail Pages | Full writeup with eval results, failure gallery, video embed |
| Custom Cursor | Trailing cyan crosshair ring |
| Currently Building widget | Fixed bottom-left status card |
| Animated page transitions | Framer Motion `AnimatePresence` |
| Mobile-responsive | 3D canvas replaced with gradient on mobile |

## 📊 RAG Chatbot Architecture

```
User message
    ↓
OpenAI text-embedding-3-small
    ↓
Pinecone top-5 similarity search
    ↓
Context injection into Claude system prompt
    ↓
Anthropic claude-sonnet-4-20250514 streaming
    ↓
SSE stream → ChatBot component
```

## 🛠️ Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npx tsx scripts/seed-pinecone.ts  # Seed Pinecone knowledge base
```

## 📝 License

MIT — feel free to fork and customize for your own portfolio.
