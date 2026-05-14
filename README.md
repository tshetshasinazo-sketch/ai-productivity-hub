# AI-Productivity-Assistant

An AI-powered workplace productivity platform that automates everyday professional tasks — writing emails, summarizing meetings, planning work, researching topics, and answering workplace questions — through a single, unified SaaS-style dashboard.

Built for the **AI Skill Accelerator Programme** project to demonstrate practical AI implementation, prompt engineering, real-world problem solving, responsible AI usage, and modern UI/UX design.

---

## 🚀 Project Overview

**AI Workplace Productivity Assistant** is one integrated web application that brings five AI-powered tools together under one roof. Instead of jumping between ChatGPT tabs, copy-pasting prompts, and rewriting outputs, professionals can use a single dashboard with purpose-built tools for the most common workplace tasks.

The app uses the **Lovable AI Gateway** (Google Gemini models) for all AI generation — no API keys required from the user — and runs on a modern **TanStack Start + React 19 + Tailwind CSS v4** stack.

---

## ✨ Features

The app includes **five integrated AI tools**, accessible from a collapsible sidebar:

1. **📧 Smart Email Generator**
   Generate professional emails from a short brief. Choose tone (formal, friendly, persuasive, apologetic, concise) and audience. Output is fully editable.

2. **📝 Meeting Notes Summarizer**
   Paste raw meeting notes or a transcript and get a structured summary: key decisions, action items (with owners), risks, and follow-ups.

3. **✅ AI Task Planner**
   Turn a list of goals into a prioritized daily or weekly plan with time estimates, dependencies, and focus blocks.

4. **🔎 AI Research Assistant**
   Get a structured briefing on any topic: overview, key points, considerations, and suggested next steps — formatted for quick reading.

5. **💬 AI Chatbot Interface**
   Multi-turn workplace assistant for quick questions, brainstorming, and follow-ups, with conversation memory within the session.

### UI / UX

- Modern **SaaS-style dashboard** with a clean, professional aesthetic
- **Collapsible sidebar navigation** between tools
- Fully **responsive** (mobile, tablet, desktop)
- **Editable AI outputs** — every generated response can be tweaked before use
- **Markdown rendering** for structured outputs
- **Responsible AI disclaimer** shown across the app

---

## 🛠️ Tools & Technologies Used

| Layer | Tool |
|---|---|
| AI Models | **Lovable AI Gateway** — `google/gemini-3-flash-preview` (and Gemini 2.5 family) |
| Framework | **TanStack Start v1** (React 19, file-based routing, server functions) |
| Build Tool | **Vite 7** |
| Styling | **Tailwind CSS v4** with semantic design tokens (oklch) |
| UI Components | **shadcn/ui** + Radix primitives |
| Backend | **Lovable Cloud** (managed Supabase — auth, database, storage available) |
| Server Logic | **TanStack `createServerFn`** RPCs |
| Language | TypeScript (strict mode) |
| Hosting | Lovable (Cloudflare Workers edge runtime) |

### Prompt Engineering

Each tool uses a **dedicated, structured system prompt** in `src/lib/ai.functions.ts`, tuned for its task:
- Role + task framing
- Explicit output format (Markdown, sections, bullet lists)
- Tone / audience parameters where relevant
- Guardrails for professional, factual, and safe output

---

## 📦 Setup Instructions

### Run on Lovable (recommended)

The project is already live and running on Lovable — no setup required. Just open the preview and click any tool in the sidebar.

- **Preview:** https://id-preview--cef5b94d-4a33-4b90-8579-3feff90164f5.lovable.app
- **Published:** https://sinazotshetsha.lovable.app

### Run locally

**Requirements:** [Bun](https://bun.sh) (or Node 20+) and Git.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-productivity-assistant

# 2. Install dependencies
bun install

# 3. Environment variables
# The .env file is auto-managed by Lovable Cloud and contains:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_PUBLISHABLE_KEY
#   VITE_SUPABASE_PROJECT_ID
# AI calls go through the Lovable AI Gateway — no extra API keys needed.

# 4. Start the dev server
bun run dev

# 5. Open
# http://localhost:5173
```

### Project structure

```
src/
├── routes/                  # File-based routes (TanStack Start)
│   ├── __root.tsx          # Global layout + sidebar shell
│   ├── index.tsx           # Dashboard / home
│   ├── email.tsx           # Smart Email Generator
│   ├── summarizer.tsx      # Meeting Notes Summarizer
│   ├── planner.tsx         # AI Task Planner
│   ├── research.tsx        # AI Research Assistant
│   └── chat.tsx            # AI Chatbot
├── lib/
│   ├── ai-gateway.ts       # Lovable AI Gateway client
│   └── ai.functions.ts     # Server functions (one per tool, with prompts)
├── components/
│   ├── app-sidebar.tsx     # Collapsible sidebar nav
│   ├── tool-shell.tsx      # Shared layout for tool pages
│   ├── markdown.tsx        # Markdown renderer for AI outputs
│   └── ui/                 # shadcn/ui components
└── styles.css              # Design tokens (Tailwind v4 + oklch)
```

---

## 🛡️ Responsible AI

This app follows responsible AI principles:

- **Disclaimer surfaced in-app** — users are reminded that AI output may be inaccurate and should be reviewed before use.
- **Human-in-the-loop** — every output is editable; nothing is sent or actioned automatically.
- **No sensitive data storage** — inputs are sent only to the AI provider for generation; the app does not log or persist prompts by default.
- **Transparent model usage** — outputs come from Google Gemini models via the Lovable AI Gateway.
- **Professional-use prompts** — system prompts steer the model toward factual, neutral, workplace-appropriate output.

Users should always verify factual claims, double-check action items, and avoid pasting confidential or regulated data.

---

## 👥 Team

- **Sinazo Tshetsha** — Design, development, and prompt engineering

*(Update this section with additional team members if applicable.)*

---

## 📅 Submission

AI Skill Accelerator Programme — Project Submission
Built with [Lovable](https://lovable.dev).
