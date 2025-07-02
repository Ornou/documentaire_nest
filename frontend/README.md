# DocManager Frontend

This is a Next.js frontend application for the DocManager document management system.

## Features

- 🔐 **Authentication** - Login and registration pages
- 📄 **Document Management** - Upload, view, search, and organize documents
- 🎨 **Modern UI** - Built with Tailwind CSS and responsive design
- 🔍 **Search & Filter** - Real-time document search functionality
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on http://localhost:3000

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login page
│   │   │   └── register/page.tsx   # Registration page
│   │   ├── dashboard/page.tsx      # Document dashboard
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page (redirects to login)
│   ├── services/
│   │   ├── auth.ts                 # Authentication API calls
│   │   └── graphql.ts              # GraphQL client and queries
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## API Integration

The frontend connects to your NestJS backend:

- **REST API** for authentication (`/auth/login`, `/auth/register`)
- **GraphQL** for document operations (queries and mutations)

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **Axios** - HTTP client for REST API
- **Heroicons** - Icon library
- **js-cookie** - Cookie management
