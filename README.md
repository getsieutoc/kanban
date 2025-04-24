# Kanban System

A self-hosted kanban system designed for developers, startup founders, and small business owners who need a lightweight, easy-to-deploy task management solution.

## Features

- **Workspace Management**
  - Create and manage multiple workspaces
  - User permissions per workspace
  - Workspace settings and preferences

- **Board Management**
  - Create, edit, and delete boards
  - Board-level configurations
  - Organize boards within workspaces

- **Column Management**
  - Customizable columns
  - WIP (Work in Progress) limits
  - Column ordering

- **Task Card Management**
  - Create and edit task cards
  - Drag-and-drop functionality
  - Basic card fields (title, description, assignees, due date)
  - Card movement between columns

- **Real-time Updates**
  - Server-Sent Events for live updates
  - Collaborative features
  - Instant status changes

## Technology Stack

- **Frontend**
  - Next.js 14 (App Router)
  - React Server Components
  - TypeScript
  - shadcn/ui components
  - Tailwind CSS

- **Backend**
  - Next.js API Routes
  - PostgreSQL Database
  - Prisma ORM
  - NextAuth.js for authentication
  - Redis for caching (optional)

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL (included in Docker setup)
- pnpm package manager

## Installation

1. Clone the repository:

```bash
git clone git@github.com:getsieutoc/kanban.git
cd kanban
```

2. Copy the environment example file:

```bash
cp env.example .env
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development environment:

```bash
pnpm dev
```

This will:

- Start the PostgreSQL database using Docker
- Generate Prisma client
- Run the Next.js development server

## Development

### Project Structure

```
app/
├── (auth)/           # Authentication routes
├── api/             # API routes
├── boards/          # Board management
├── components/      # Shared components
├── lib/            # Utility functions
├── prisma/         # Database schema
└── public/         # Static assets
```

### Available Scripts

- `pnpm dev` - Start development environment
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript checks
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean and reinstall dependencies

### Database Management

- `pnpm prisma migrate dev` - Run database migrations
- `pnpm prisma generate` - Generate Prisma client
- `pnpm prisma studio` - Open Prisma Studio

## Deployment

### Self-hosting Requirements

- Node.js 20 or higher
- PostgreSQL database
- Redis (optional, for caching)
- Reverse proxy (e.g., Nginx) recommended

### Production Setup

1. Build the application:

```bash
pnpm build
```

2. Start the production server:

```bash
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Follow existing patterns and conventions

## Success Metrics

- Quick setup time (< 5 minutes)
- Intuitive user interface
- Reliable performance
- Minimal maintenance requirements

## License

[Add License Information]
