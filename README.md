# Vault Smilo Center

Sistema completo de gestao pessoal com foco em seguranca, financas e organizacao.

## Visao Geral

Monorepo PNPM com:
- Frontend: React 18 + Vite + TailwindCSS
- Backend: Node.js + Express
- Autenticacao: Clerk (JWT)
- Banco: PostgreSQL (Docker)
- ORM: Prisma
- Graficos: Recharts

Estrutura:
```
vault_smilo_center/
  apps/
    api/          # Backend Node/Express
    web/          # Frontend React/Vite
  packages/
    db/           # Prisma + PostgreSQL
  docker-compose.yml
  .env.example
  README.md
```

## Requisitos

- Node.js >= 18
- PNPM >= 8
- Docker e Docker Compose
- Conta no Clerk (https://clerk.com)

## Como Rodar (do zero)

1) Instale dependencias:
```bash
pnpm install
```
Se o PNPM bloquear scripts, rode:
```bash
pnpm approve-builds
```

2) Suba o banco:
```bash
docker compose up -d
```

3) Configure o .env:
```bash
cp .env.example .env
# preencha CLERK_* e ENCRYPTION_KEY_BASE64
```

4) Gere Prisma Client e rode migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

5) Rode em desenvolvimento:
```bash
pnpm dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

## Scripts Principais

```bash
pnpm dev                 # api + web em paralelo
pnpm dev:api             # apenas backend
pnpm dev:web             # apenas frontend

pnpm build               # build de tudo
pnpm build:web           # build do frontend
pnpm build:api           # build do backend

pnpm start               # start do backend (prod)

pnpm db:generate         # prisma generate
pnpm db:migrate          # prisma migrate dev
pnpm db:migrate:deploy   # prisma migrate deploy (prod)
```

## Variaveis de Ambiente

Obrigatorias:
- DATABASE_URL
- CLERK_SECRET_KEY
- ENCRYPTION_KEY_BASE64

Frontend:
- VITE_CLERK_PUBLISHABLE_KEY
- VITE_API_URL

Backend:
- CORS_ORIGIN (lista separada por virgula)
- PORT
- CLERK_JWT_KEY (opcional, para validacao local do JWT)

## Seguranca

- Criptografia AES-256-GCM (chave base64 com 32 bytes).
- Senhas so sao descriptografadas em endpoints protegidos e do dono do registro.
- JWT do Clerk validado em todas as rotas privadas.

## Producao (VPS)

Fluxo recomendado:
```bash
pnpm install
pnpm db:generate
pnpm db:migrate:deploy
pnpm --filter web build
```

- Frontend: servir `apps/web/dist` via Nginx.
- Backend: rodar `apps/api/src/server.js` via PM2.
- Use `VITE_API_URL=https://seudominio.com/api`.

Configs prontas:
- PM2: `ecosystem.config.js`
- Nginx: veja `DEPLOY.md`

## Observacoes de Performance

- API usa compressao via Nginx e logs controlados por ambiente.
- Importacao CSV limitada a 5MB.
- PM2 configurado para reinicio por memoria (`max_memory_restart`).

## Roadmap (MVP)

- App mobile
- Integracao Open Finance
- Relatorios PDF/Excel
- Notificacoes push/email

## Licenca

MIT
