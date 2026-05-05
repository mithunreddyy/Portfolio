# Mithun Reddy | Portfolio

A modern, dynamic, and responsive portfolio website built with a focus on high-end aesthetics, smooth interactions, and performance.

## 🚀 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Database/Backend**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel / Netlify (Production Ready)

## ✨ Key Features

- **Dynamic Hero Section**: Clean, typography-focused introduction with a verified status badge.
- **Scattered Project Cards**: Interactive "scattered" card layout on desktop that transitions to a clean list view on mobile/tablet.
- **Interactive Dock**: A premium, slim navigation dock with smooth hover tooltips and section tracking.
- **Bento-style Sections**: Modern grid layouts for experience and technical toolkit.
- **Content Management**: Integrated with Firebase for dynamic blog post updates.
- **Theming**: Seamless Dark and Light mode support with local persistence.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop views.
- **SEO Optimized**: Meta tags, structured data (JSON-LD), and semantic HTML for search visibility.

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mithun_portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components`: UI components (Dock, Hero, Projects, Experience, Blog, etc.)
- `src/constants.ts`: Central source of truth for portfolio content.
- `src/lib/firebase.ts`: Firebase configuration and utilities.
- `src/index.css`: Global styles and Tailwind configuration.
- `public/`: Static assets and images.

---
Designed and Developed by **Mithun Reddy**
