# The Council — AI Debate Chamber

Four AIs debate your question across three rounds, then synthesize a consensus verdict.

**Stack:** React (Vite) → Vercel · Express → Railway · Supabase

---

## Local Development

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/council-app.git
cd council-app

# 2. Backend
cd backend
cp .env.example .env
# Fill in your keys in .env
npm install
npm run dev   # runs on http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3001
npm install
npm run dev   # runs on http://localhost:5173
```

---

## Supabase Setup

1. Create a new project at **supabase.com**
2. Go to **SQL Editor** → paste contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

---

## Railway Deployment (Backend)

1. Push repo to GitHub
2. Go to **railway.app** → New Project → Deploy from GitHub repo
3. Select your repo — Railway auto-detects `railway.toml`
4. Add environment variables under **Variables**:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=AIza...
   TOGETHER_API_KEY=...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   FRONTEND_URL=https://your-app.vercel.app
   PORT=3001
   ```
5. Deploy — Railway gives you a public URL like `https://council-backend.up.railway.app`

---

## Vercel Deployment (Frontend)

1. Go to **vercel.com** → New Project → Import GitHub repo
2. Vercel detects `vercel.json` automatically
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```
4. Deploy — you get a URL like `https://council-app.vercel.app`
5. Go back to Railway and update `FRONTEND_URL` to your Vercel URL

---

## API Keys Needed

| Service | Get it at |
|---------|-----------|
| Anthropic (Claude) | console.anthropic.com → API Keys |
| OpenAI (GPT-4o) | platform.openai.com/api-keys |
| Google Gemini | aistudio.google.com/apikey |
| Together AI (Llama) | api.together.ai → Settings → API Keys |

---

## Future Ideas

- User auth via Supabase Auth
- Share debate links publicly
- Vote on which AI gave the best answer
- Category tags for debates
- Email digest of weekly top debates
