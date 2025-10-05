# Klatre Frontend

A React-based climbing and bouldering tracking application that allows users to manage groups, log climbing sessions, and track route attempts.

## Features

- **Group Management**: Create and manage climbing groups
- **Session Tracking**: Start and track active climbing sessions at different locations
- **Route Attempts**: Log and manage boulder/route attempts with detailed tracking
- **Place Management**: Track different climbing locations and venues
- **User Authentication**: Google OAuth integration for secure user authentication
- **Past Sessions**: View and review previous climbing sessions

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tool and dev server
- **Chakra UI** - Component library for consistent UI
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React OAuth Google** - Google authentication

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/arnasrum/KlatreFrontend 
cd KlatreFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with required API endpoints and configuration.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── components/      # Reusable React components
├── constants/       # Application constants and configuration
├── contexts/        # React context providers (GroupContext, SessionContext)
├── hooks/           # Custom React hooks
├── interfaces/      # TypeScript type definitions
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Group.tsx
│   ├── Groups.tsx
│   ├── Sessions.tsx
│   ├── Places.tsx
│   ├── Boulders.tsx
│   ├── Settings.tsx
│   └── ...
├── scripts/         # Utility scripts
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Key Components

### Contexts

- **GroupContext**: Manages current group state and persists to localStorage
- **SessionContext**: Tracks active climbing sessions
- **TokenContext**: Handles user authentication and session management

### Pages

- **Home**: Landing page
- **Groups**: View and manage climbing groups
- **Group**: Individual group view with sessions and members
- **Sessions**: Log and track climbing sessions
- **Places**: Manage climbing locations
- **Boulders**: View and track boulder routes
- **RouteSends**: Track successful route completions
