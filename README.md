# 🚀 Pipeline CRM

A modern, full-stack Customer Relationship Management (CRM) application built with Next.js 15, Supabase, and TypeScript. Features a vibrant, animated design with glass-morphism effects.

![Pipeline CRM](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 🔐 Authentication
- Sign up / Login with email & password
- Secure session management
- Protected routes

### 📊 Lead Management
- **Create** leads with detailed information
- **Read** all leads in a sortable table
- **Update** lead details with inline editing
- **Delete** leads with confirmation

### 📝 Activity Tracking
- Add notes to leads
- View activity timeline
- Timestamped history

### 📈 Dashboard
- **Statistics Cards:** Total Leads, Pipeline Value, Won Deals, Active Deals
- **Pipeline Stages:** Visual progress bars
- **Quick Actions:** Navigate to key sections

### 🎯 Pipeline Kanban View
- 6-stage board (New, Contacted, Qualified, Proposal, Won, Lost)
- Color-coded stages
- Click to view details

### 🎨 Modern Design
- **Animated Background:** Floating gradient spots (cyan, purple, pink)
- **Glass-morphism:** Transparent cards with backdrop blur
- **Gradient Effects:** Icons, progress bars, text
- **Inter Font:** Clean, modern sans-serif typography
- **Responsive:** Mobile, tablet, desktop layouts

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Icons:** lucide-react
- **Deployment:** Vercel

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/Madko111/Sprint-Day8.git
cd Sprint-Day8
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase database

Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor.

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

---

## 🎨 Design Highlights

- Animated gradient background (20s loop)
- Glass-morphism cards with backdrop blur
- Gradient icons with glow shadows
- Color-coded stage badges
- Smooth transitions and hover effects

---

## 🔐 Security

- Row Level Security (RLS) enabled
- User-scoped data access
- Protected routes with middleware
- Secure environment variables

---

## 📊 Sample Data

**3 Leads** with **$90,000** total pipeline value included for testing.

---

## 📝 License

MIT License

---

**Built with ❤️ during Sprint Day 8 - June 23, 2026**
