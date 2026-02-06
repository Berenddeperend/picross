# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start Vite dev server (with `--host` for network access)
- `npm run build` — Type-check with `vue-tsc --noEmit` then build with Vite
- `npm run preview` — Preview production build
- `npm run publish` — Deploy to GitHub Pages via gh-pages (run `npx vite build` first)

No test framework is configured. No linter or formatter is configured.

## Environment Setup

- Node 16 (see `.nvmrc`)
- Local dev requires a separate backend API on port 7200 and Socket.io server on port 7100 (see `.env`)
- Production deploys to `berendswennenhuis.nl/nonogram/` with base path `/nonogram/`

## Architecture

**Vue 3 + TypeScript + Vite** collaborative nonogram (picross) puzzle game with real-time multiplayer via Socket.io.

### Key Directories

- `src/layout/` — Page-level route components (Game, MainMenu, Create, AllPuzzles, Admin)
- `src/components/` — Reusable UI components (TheGrid is the core puzzle grid renderer)
- `src/hooks/` — Composition API hooks that hold the main business logic
- `src/services/` — HTTP client (Axios) and canvas rendering utilities
- `src/scss/` — Global styles with SCSS variables

### State Management

Uses a **custom composable store** (`src/store.ts`) instead of Pinia (Pinia is a dependency but unused). The store holds global state like puzzle list, viewport dimensions, and canvas references.

### Composition Hooks (the core logic)

- **`useGrid`** — Grid state, clue computation (hits), cell updates, auto-X (marks cells when a line is complete), win detection (`levelIsCleared`)
- **`useSocket`** — Socket.io connection wrapper; websocket-only transport, auto-disconnect on unmount
- **`useUserStates`** — Multiplayer player tracking, cursor sync, singleplayer vs multiplayer mode
- **`useControls`** — Keyboard input (arrows for movement, space to fill, F/X to mark)
- **`useClickDrag`** — Mouse drag interactions for bulk cell selection

### Cell States in the Grid

Grids are `string[][]`. Cell values: `"d"` = filled, `"x"` = marked empty, `" "` = unknown.

### Routing

Vue Router with hash history. Routes defined inline in `src/main.ts`. Singleplayer uses `/play/singleplayer/:puzzleId`, multiplayer uses `/play`.

### Path Alias

`@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Multiplayer

Socket.io broadcasts cell updates and cursor positions between players. Vote-based mechanics (VoteNext, VoteClear, VoteNextSize) let players collaboratively decide on puzzle progression.
