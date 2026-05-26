# Finova - Cognitive Financial Assistant
A smart, AI-powered personal finance web application for managing hybrid transactions and predictive budgeting — built for college students and young professionals.

## Features
- 🔐 Secure authentication with role-based access
- 💳 Hybrid transaction management (manual + digital)
- 🤖 AI-based receipt scanning and data extraction
- 📊 Interactive dashboard with expense breakdown charts
- 📈 Predictive budgeting based on spending patterns
- 🔁 Recurring transaction management (EMIs, subscriptions, salary)
- 💡 AI-generated savings recommendations
- 📅 Monthly financial summary reports on email

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| Auth | Clerk |
| AI | Google Gemini API |
| Email | Resend |
| Security | Arcjet |

## 📁 Folder Structure
Finova/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── actions/          # Server actions
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── prisma/           # Database schema
├── emails/           # Email templates
└── public/           # Static assets

## 🔗 Jira Board
- Jira Board: https://finova28.atlassian.net/jira/software/projects/FIN/boards/35?atlOrigin=eyJpIjoiMDlkMWFkYTg1NGFiNDNiOGI1NjM3OWFjYzIzNThjMDUiLCJwIjoiaiJ9  

## ⚙️ Getting Started
1. Clone the repository
```bash
git clone https://github.com/dhruvil-shah28/Finova.git
cd Finova
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
GEMINI_API_KEY=
RESEND_API_KEY=
ARCJET_KEY=
```

4. Run the development server
```bash
npm run dev
```
---
> Developed as part of Academic Project — Vishwakarma Institute of Technology, 2025-26
