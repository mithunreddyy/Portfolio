# Mithun Reddy — Design-Minded Software Engineer

A premium, minimalist developer portfolio focused on high-end editorial aesthetics, smooth interactions, and a production-grade CMS infrastructure. Built with a focus on typography, motion, and technical depth.

![Portfolio Preview](public/preview-dark.png) 
*(Note: Ensure you have a preview image or remove this line)*

## 🏛️ Architecture & Philosophy

This portfolio is designed with an **Editorial-First** approach, treating code documentation and projects as high-fidelity case studies. It balances the precision of engineering with the fluidity of design.

- **Minimalist Aesthetic**: No borders, high-contrast typography, and significant whitespace for a clean reading experience.
- **Interactive Depth**: Uses `Framer Motion` to create a tactile UI with scattered project cards, 3D-like hover effects, and immersive modals.
- **Dynamic Infrastructure**: Powered by a dual-source strategy—Supabase for real-time content management and local constants for zero-latency fallbacks.

## 🚀 Technical Stack

### Core
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)

### Backend & CMS
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **CMS Logic**: Real-time synchronization for Blogs, Projects, and Experiences.
- **Weather API**: [Open-Meteo](https://open-meteo.com/) for dynamic location-based temperature data.

### Design System
- **Typography**: 
  - Sans: `Hanken Grotesk` (Editorial headings)
  - UI: `Inter` (Functional text)
  - Mono: `Geist Mono` / `JetBrains Mono` (Code & Metadata)
- **Iconography**: [Lucide React](https://lucide.dev/) (Thin stroke variants)

## ✨ Premium Features

### 1. Immersive Project Case Studies
The project section features a unique "Scattered Card" layout. Clicking a card triggers a high-fidelity modal that includes:
- **Terminal Visuals**: A mock `runtime.sh` interface showcasing build steps.
- **Infrastructure Cards**: Structured breakdown of core project architecture.
- **Dynamic Shadows**: Theme-aware "ambient glows" that adapt to Light and Dark modes.

### 2. Editorial Writing System
A custom-built blog engine that supports:
- **Rich Text Parsing**: Dynamic markdown-like parsing for bolding, bullet points, and high-impact quotes.
- **Reading Progress**: Integrated read-time calculation and date formatting.
- **Responsive Layouts**: Optimized for long-form reading on all screen sizes.

### 3. Verification & Live Status
- **Verified Badge**: A custom-animated verification seal next to the name.
- **Live Availability**: Pulsing status indicators for current availability.
- **Real-time Weather**: Integrated location-aware temperature and time tracking in the footer.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- Supabase Account (for CMS)

### Environment Variables
Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```text
src/
├── components/         # Premium UI Components
│   ├── BlogPostView/   # Editorial reading interface
│   ├── Projects/       # Scattered card & Modal logic
│   ├── CMS/            # Admin management interface
│   └── ...
├── hooks/              # Custom logic (usePortfolioData, useTheme)
├── lib/                # API Clients (Supabase, Weather)
├── constants.ts        # Content source of truth
└── index.css           # Global Design Tokens & Tailwind v4
```

---

Developed with ✻ by **Mithun Reddy**
