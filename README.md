# INV.MyceliumLink

Multi-tenant inventory management system for companies involved in fiber works, ICT, CCTV, servers, laptops/PC, manpower, and cabling/construction services.

## Tech Stack

- **Frontend (Web)**: Next.js 15 (App Router)
- **Frontend (Mobile)**: Expo (React Native)
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Monorepo**: Turborepo
- **Styling**: Tailwind CSS + shadcn/ui
- **Design**: MyceliumLink dark theme with network animation

## Project Structure

```
inv/
├── apps/
│   ├── web/          # Next.js 15 dashboard
│   └── mobile/       # Expo scanner app
├── packages/
│   ├── ui/           # Shared shadcn/ui components
│   ├── styles/       # MyceliumLink theme & animations
│   ├── db/           # Supabase client & types
│   └── utils/        # Shared utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Expo CLI (for mobile development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd inv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run database migrations**
   - Open Supabase SQL Editor
   - Run migrations from `packages/db/src/migrations/` in order:
     - `001_initial_schema.sql`
     - `002_rls_policies.sql`
     - `003_triggers.sql`

5. **Start development servers**
   ```bash
   npm run dev
   ```
   - Web app: http://localhost:3000
   - Mobile app: Use Expo Go to scan QR code

## Development

### Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps and packages
- `npm run lint` - Lint all packages
- `npm run test` - Run tests

### Package Scripts

Each package and app has its own scripts. See individual `package.json` files for details.

## Deployment

### Web App (Vercel)

1. Connect repository to Vercel
2. Set environment variables
3. Build command: `turbo build --filter=web`
4. Deploy automatically on push to `main`

### Mobile App (Expo EAS)

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform ios/android`

## License

Private - MyceliumLink

