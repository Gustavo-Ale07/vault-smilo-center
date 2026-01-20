# 📂 ESTRUTURA DO PROJETO - VAULT SMILO CENTER

## 🏗️ Visão Geral

```
vault_smilo_center/
├── apps/                          # Aplicações do monorepo
│   ├── api/                       # Backend Node.js + Express
│   │   ├── src/
│   │   │   ├── middleware/        # Middlewares (auth, validation)
│   │   │   ├── routes/            # Rotas REST da API
│   │   │   ├── utils/             # Utilitários (crypto)
│   │   │   └── server.js          # Entry point do servidor
│   │   └── package.json
│   │
│   └── web/                       # Frontend React + Vite
│       ├── src/
│       │   ├── components/        # Componentes reutilizáveis
│       │   ├── pages/             # Páginas da aplicação
│       │   ├── services/          # Services (API client)
│       │   ├── App.jsx            # Configuração de rotas
│       │   ├── main.jsx           # Entry point
│       │   └── index.css          # Estilos globais + Tailwind
│       ├── index.html
│       ├── vite.config.js
│       ├── tailwind.config.js
│       └── package.json
│
├── packages/                      # Packages compartilhados
│   └── db/                        # Prisma + PostgreSQL
│       ├── prisma/
│       │   ├── schema.prisma      # Schema do banco
│       │   └── seed.js            # Seed de exemplo
│       ├── index.js               # Export do Prisma Client
│       └── package.json
│
├── docker-compose.yml             # PostgreSQL containerizado
├── ecosystem.config.js            # Configuração PM2 (produção)
├── nginx.conf                     # Configuração Nginx (exemplo)
├── pnpm-workspace.yaml            # Configuração do monorepo
├── package.json                   # Scripts raiz
├── .env.example                   # Template de variáveis
├── .gitignore
│
├── README.md                      # Documentação principal
├── QUICKSTART.md                  # Guia de início rápido
├── DEPLOY.md                      # Instruções de deploy VPS
├── SECURITY.md                    # Segurança e criptografia
├── LICENSE                        # Licença MIT
│
├── setup.sh                       # Script de setup (Linux/Mac)
├── setup.ps1                      # Script de setup (Windows)
├── generate-key.js                # Gera chave de criptografia
└── exemplo-extrato.csv            # Exemplo de CSV para importação
```

## 📦 Apps

### 🔧 apps/api (Backend)

**Stack**: Node.js, Express, Prisma, Clerk

**Estrutura**:
- `middleware/` - Autenticação JWT e validação Zod
- `routes/` - Endpoints REST organizados por domínio
- `utils/` - Criptografia AES-256-GCM
- `server.js` - Configuração do Express

**Rotas**:
- `/health` - Health check
- `/me` - Dados do usuário autenticado
- `/subscriptions` - CRUD de assinaturas
- `/vault-accounts` - CRUD do cofre de senhas
- `/categories` - CRUD de categorias
- `/transactions` - CRUD de transações + resumo
- `/investments` - CRUD de investimentos + projeções
- `/import/csv` - Upload e parse de CSV

**Porta**: 3001 (dev), configurável via `PORT`

### 🎨 apps/web (Frontend)

**Stack**: React 18, Vite, TailwindCSS, Recharts, Clerk

**Estrutura**:
- `components/` - UI components (Card, Table, Modal, etc.)
- `pages/` - Páginas da aplicação
- `services/` - API client com fetch + JWT
- `App.jsx` - Router e proteção de rotas
- `main.jsx` - ClerkProvider + render

**Páginas Públicas**:
- `/` - Landing page
- `/sign-in` - Login (Clerk)
- `/sign-up` - Cadastro (Clerk)

**Páginas Protegidas** (requer autenticação):
- `/app` - Dashboard com gráficos
- `/app/subscriptions` - Gestão de assinaturas
- `/app/vault` - Cofre de senhas
- `/app/finances` - Transações financeiras
- `/app/investments` - Investimentos
- `/app/import` - Importar CSV
- `/app/settings` - Configurações

**Porta**: 5173 (dev)

## 📚 Packages

### 💾 packages/db

**Stack**: Prisma, PostgreSQL

**Modelos**:
- `User` - Usuário (vinculado ao Clerk)
- `Subscription` - Assinaturas
- `VaultAccount` - Contas do cofre
- `Category` - Categorias de transações
- `Transaction` - Receitas e despesas
- `Investment` - Investimentos

**Scripts**:
- `pnpm db:generate` - Gera Prisma Client
- `pnpm db:migrate` - Executa migrations
- `pnpm db:push` - Push do schema (dev)
- `pnpm db:studio` - Abre Prisma Studio

## 🔐 Segurança

### Criptografia
- **Algoritmo**: AES-256-GCM
- **Arquivo**: `apps/api/src/utils/crypto.js`
- **Chave**: `ENCRYPTION_KEY_BASE64` (32 bytes em base64)

### Autenticação
- **Provider**: Clerk
- **Middleware**: `apps/api/src/middleware/auth.js`
- **Validação**: JWT em todas as rotas protegidas

### Validação
- **Biblioteca**: Zod
- **Middleware**: `apps/api/src/middleware/validation.js`

## 🚀 Scripts

### Raiz (package.json)
```bash
pnpm dev         # Roda api + web em paralelo
pnpm dev:api     # Apenas backend
pnpm dev:web     # Apenas frontend
pnpm build       # Build de tudo
pnpm db:*        # Atalhos para Prisma
```

### Backend (apps/api)
```bash
pnpm dev         # Nodemon (auto-reload)
pnpm start       # Node direto (produção)
```

### Frontend (apps/web)
```bash
pnpm dev         # Vite dev server
pnpm build       # Build para produção
pnpm preview     # Preview do build
```

## 🌐 Ambiente de Desenvolvimento

### Variáveis (.env)
- `DATABASE_URL` - Conexão PostgreSQL
- `CLERK_*` - Chaves Clerk (3x)
- `ENCRYPTION_KEY_BASE64` - Chave de criptografia
- `PORT` - Porta do backend
- `CORS_ORIGIN` - Origem permitida
- `VITE_API_URL` - URL da API (frontend)

### Serviços Locais
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Prisma Studio**: http://localhost:5555

## 📊 Fluxo de Dados

```
┌─────────────┐      JWT       ┌─────────────┐     Prisma     ┌──────────────┐
│   Frontend  │ ────────────> │   Backend   │ ─────────────> │  PostgreSQL  │
│  (React)    │ <────────────  │  (Express)  │ <─────────────  │   (Docker)   │
└─────────────┘      JSON      └─────────────┘      Data      └──────────────┘
       │                              │
       │                              │
       v                              v
  Clerk Auth                   AES-256-GCM
  (JWT Token)                  (Encryption)
```

## 🎨 Tema

**Paleta Smilo** (Verde):
- `primary-50` a `primary-950` - Tons de verde
- Fundo: Branco
- Texto: Cinza escuro
- Acentos: Verde primário

**TailwindCSS**:
- Classes customizadas em `apps/web/src/index.css`
- Configuração em `apps/web/tailwind.config.js`

## 🧪 Desenvolvimento

### Hot Reload
- Frontend: Vite (HMR automático)
- Backend: Nodemon (reinicia ao salvar)

### Debugging
```bash
# Ver logs do backend
cd apps/api
pnpm dev

# Ver logs do frontend
cd apps/web
pnpm dev

# Inspecionar banco
pnpm db:studio
```

## 📦 Deploy (Produção)

### Build
```bash
# Frontend
cd apps/web
pnpm build
# Output: dist/

# Backend (apenas copia, não há build)
# Usar src/server.js direto
```

### Execução
- **Frontend**: Nginx servindo `apps/web/dist`
- **Backend**: PM2 rodando `apps/api/src/server.js`
- **Banco**: Docker Compose (PostgreSQL)

Ver [DEPLOY.md](DEPLOY.md) para detalhes completos.

## 🔄 Dependências

### Backend
- express - Framework web
- @clerk/clerk-sdk-node - Autenticação
- cors - CORS
- helmet - Segurança
- zod - Validação
- prisma - ORM
- express-fileupload - Upload CSV

### Frontend
- react - UI library
- react-router-dom - Routing
- @clerk/clerk-react - Autenticação
- recharts - Gráficos
- lucide-react - Ícones
- tailwindcss - Estilos

## 📝 Convenções

### Arquivos
- `.jsx` - Componentes React
- `.js` - JavaScript padrão
- `.css` - Estilos (Tailwind)
- `.prisma` - Schema do banco

### Nomenclatura
- **Componentes**: PascalCase (`Card.jsx`)
- **Pages**: PascalCase (`DashboardPage.jsx`)
- **Utils**: camelCase (`crypto.js`)
- **Routes**: kebab-case (`vault-accounts.js`)

### Commits (Sugestão)
- `Add:` Nova feature
- `Fix:` Correção de bug
- `Update:` Atualização
- `Refactor:` Refatoração
- `Docs:` Documentação

## 🆘 Troubleshooting

### Porta em uso
```bash
# Matar processo na porta 3001
lsof -ti:3001 | xargs kill  # Mac/Linux
netstat -ano | findstr :3001  # Windows
```

### Prisma Client desatualizado
```bash
pnpm db:generate
```

### Node modules corrompidos
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Docker não inicia
```bash
docker compose down
docker compose up -d
```

---

Para mais informações, consulte:
- [README.md](README.md) - Documentação completa
- [QUICKSTART.md](QUICKSTART.md) - Início rápido
- [DEPLOY.md](DEPLOY.md) - Deploy em VPS
- [SECURITY.md](SECURITY.md) - Segurança
