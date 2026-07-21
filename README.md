# CeritaKosmos - Platform Cerita Digital AI-First

Platform cerita digital modern seperti Wattpad/Webtoon tapi minimalis-elegan, dengan konten 100% AI-generated (judul, sinopsis, bab, cover).

## ✨ Fitur Utama

- 🎨 **AI-Generated Content** - Cerita lengkap dari judul hingga cover image
- 📖 **Reader Experience** - Efek flip halaman, bookmark, progress, mode gelap/terang/sepia
- 🌌 **5 Genre** - Kosmos, Alam, Romance, Horor, Konspirasi
- 🎭 **Admin Generator** - Buat cerita custom dengan form intuitif
- 📱 **Mobile-First** - Responsive, PWA-ready
- ⚡ **Performance** - Next.js 14, Framer Motion, lazy loading

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS + Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **AI**: Anthropic Claude (text) + OpenAI DALL-E 3 (images)
- **Deployment**: Vercel + Railway/Render

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key
- OpenAI API key

### Installation

```bash
# Clone repo
git clone https://github.com/Irgirival/story.git
cd story

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Run development
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/story_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin panel
│   ├── genre/[genre]/     # Genre listing
│   ├── story/[slug]/      # Story detail
│   └── reader/[slug]/[chapter]/  # Reader page
├── components/
│   ├── ui/                # Base UI components (Radix-based)
│   ├── story/             # Story components (Card, Grid, Detail)
│   └── reader/            # Reader component
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Utility functions
│   └── genre-config.ts    # Genre configurations
└── types/                 # TypeScript types
```

## 🎯 Key Features Detail

### Reader Experience
- Page-flip animation dengan Framer Motion
- 3 reading modes: Dark, Light, Sepia
- Font size & line height adjustment
- Auto-save progress (localStorage + DB)
- Swipe navigation (mobile)
- Keyboard shortcuts (desktop)
- Ambient particles per genre
- TTS support (experimental)

### Admin Generator
- Genre, tone, length, POV selection
- Real-time story generation via Claude
- Cover image generation via DALL-E 3
- Preview & edit before publish
- Chapter-by-chapter review

### Genre System
Each genre has unique:
- Accent color
- Background gradient
- Ambient particles
- Cover style preferences

## 📝 API Routes

- `POST /api/admin/generate-story` - Generate story via Claude
- `POST /api/admin/generate-cover` - Generate cover via DALL-E
- `POST /api/admin/publish-story` - Save to database

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Railway/Render (Database + Backend)
- Connect PostgreSQL
- Set environment variables
- Deploy API routes

## 📄 License

MIT License - feel free to use for your own projects.

## 🤝 Contributing

PRs welcome! Please read contributing guidelines first.

---

Built with ❤️ and AI for story lovers everywhere.