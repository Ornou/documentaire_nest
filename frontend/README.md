# DocManager Frontend

This is a Next.js frontend application for the DocManager document management system.

## Features

- 🔐 **GraphQL Authentication** - Login and registration using GraphQL mutations
- 📄 **Document Management** - Upload, view, search, and organize documents via GraphQL
- 🎨 **Modern UI** - Built with Tailwind CSS and responsive design
- 🔍 **Search & Filter** - Real-time document search functionality
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on http://localhost:3000 with GraphQL endpoint

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
│   │   ├── auth.ts                 # Authentication GraphQL calls
│   │   └── graphql.ts              # GraphQL client and all queries/mutations
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## GraphQL Integration

The frontend connects to your NestJS backend using **GraphQL only**:

### Authentication Mutations:

- `login(loginInput: LoginInput!)` - Returns `AuthPayload` with token and user
- `register(registerInput: RegisterInput!)` - Returns `AuthPayload` with token and user

### Document Operations:

- `findAllDocuments` - Query to get all documents
- `createDocument(createDocumentInput: CreateDocumentInput!)` - Create new document
- `updateDocument(id: Int!, updateDocumentInput: UpdateDocumentInput!)` - Update document
- `removeDocument(id: Int!)` - Delete document

## Environment Variables

Create a `.env.local` file:

```
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
- **Apollo Client** - GraphQL client for all API communication
- **Heroicons** - Icon library
- **js-cookie** - Cookie management for JWT tokens

## Authentication Flow

1. **Login/Register** → GraphQL mutation → Returns JWT token + user info
2. **Token Storage** → Stored in HTTP-only cookies (7 days expiry)
3. **API Calls** → Apollo Client automatically adds Bearer token to GraphQL requests
4. **Logout** → Clear cookies and Apollo cache

## Error Handling

The app handles GraphQL errors gracefully:

- Login/Registration errors display user-friendly messages
- Network errors are caught and displayed
- Invalid tokens automatically redirect to login
