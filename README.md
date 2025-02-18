# Teebay

## Initial Setup

1. Install pnpm and docker
2. copy .env.example to .env on each workspaces
3. Run `pnpm install`
4. Run `docker compose up -d` at root directory to initialize the database
5. Run `pnpm db:migrate` to migrate the database
6. Run `pnpm dev` to start the server
7. Visit `http://localhost:3000` to see the app
