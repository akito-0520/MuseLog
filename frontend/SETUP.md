# Frontend Development Environment

This frontend environment is set up with the following tools:

## Formatter & Linter

### Prettier (Formatter)

- Configuration file: `.prettierrc`
- Ignore file: `.prettierignore`
- Scripts:
  - `npm run format` - Format all files
  - `npm run format:check` - Check if files are formatted

### ESLint (Linter)

- Configuration file: `eslint.config.mjs`
- Integrated with Prettier to avoid conflicts
- Scripts:
  - `npm run lint` - Lint all files
  - `npm run lint:fix` - Lint and fix all files

## UI Framework

### shadcn/ui

- Configuration file: `components.json`
- Utility function: `lib/utils.ts`
- CSS variables: `app/globals.css`
- Components directory: `components/ui/`
- Add new components using: `npx shadcn@latest add [component-name]`

## State Management

### Jotai

- Example store: `stores/example.ts`
- Lightweight atomic state management
- Usage example in `stores/example.ts`

## Directory Structure

```
frontend/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
├── stores/          # Jotai state management stores
├── hooks/           # Custom React hooks
└── public/          # Static assets
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Format code:

   ```bash
   npm run format
   ```

4. Lint code:

   ```bash
   npm run lint
   ```

5. Add shadcn/ui component:
   ```bash
   npx shadcn@latest add button
   ```
