# Mithun Reddy

A minimalist, high-fidelity developer portfolio designed with an editorial aesthetic. This project balances engineering precision with design fluidity, featuring a production-grade infrastructure and immersive interactive experiences.

## Core Technology

*   **Runtime**: React 19 + Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Motion**: Framer Motion
*   **Database**: Supabase (PostgreSQL)

## Key Features

*   **Case Studies**: Immersive project details with integrated terminal visuals and infrastructure analysis.
*   **Dynamic CMS**: Real-time content synchronization via Supabase with local fallback resiliency.
*   **Editorial Writing**: A custom-built writing engine optimized for long-form reading and rich-text parsing.
*   **Interactive Design**: Responsive "scattered card" architecture and dynamic cursor interactions.
*   **Ambient Theming**: Precision Light/Dark mode support with theme-aware shadow logic.
*   **Live Context**: Real-time weather and location tracking via Open-Meteo API.

## Development

### Prerequisites

*   Node.js 18+
*   Supabase instance

### Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Installation

```bash
npm install
npm run dev
```

### Deployment

The project is configured for seamless deployment on Vercel or Netlify. Ensure environment variables are mirrored in your deployment settings.

---

Designed and Developed by **Mithun Reddy**
