# 🚀 GUIA DE INÍCIO RÁPIDO - VAULT SMILO CENTER

## ⏱️ Em 5 Minutos

### 1️⃣ Instalar Dependências (1 min)

```bash
# Certifique-se de ter Node.js 18+ e PNPM instalados
pnpm install
```

### 2️⃣ Configurar Banco de Dados (1 min)

```bash
# Inicia PostgreSQL via Docker
docker compose up -d

# Gera Prisma Client e roda migrations
pnpm db:generate
pnpm db:migrate
```

### 3️⃣ Configurar Clerk (2 min)

1. Acesse: https://dashboard.clerk.com
2. Clique em "Add application"
3. Dê um nome (ex: "Vault Smilo Dev")
4. Copie as 3 chaves que aparecem:
   - `Publishable key` (começa com `pk_test_...`)
   - `Secret key` (começa com `sk_test_...`)

### 4️⃣ Criar arquivo .env (1 min)

```bash
# Copie o exemplo
cp .env.example .env

# Edite o .env
```

Cole no `.env`:

```env
# Banco (já está certo se usou docker-compose)
DATABASE_URL="postgresql://vaultuser:vaultpass@localhost:5432/vault_smilo_db?schema=public"

# Clerk - COLE SUAS CHAVES AQUI
VITE_CLERK_PUBLISHABLE_KEY=pk_test_COLE_AQUI
CLERK_PUBLISHABLE_KEY=pk_test_COLE_AQUI
CLERK_SECRET_KEY=sk_test_COLE_AQUI

# Gere a chave de criptografia
ENCRYPTION_KEY_BASE64=COLE_AQUI

# Backend
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3001
```

**Gerar chave de criptografia:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5️⃣ Rodar o Projeto

```bash
# Roda backend + frontend em paralelo
pnpm dev
```

🎉 **Pronto!** Acesse: http://localhost:5173

## 📋 Checklist Pré-Execução

- [ ] Node.js 18+ instalado (`node -v`)
- [ ] PNPM instalado (`pnpm -v`)
- [ ] Docker instalado e rodando (`docker ps`)
- [ ] Conta no Clerk criada
- [ ] Arquivo `.env` configurado com as 3 chaves do Clerk
- [ ] Chave de criptografia gerada e adicionada ao `.env`
- [ ] Docker Compose rodando (`docker compose ps`)
- [ ] Migrations executadas (`pnpm db:migrate`)

## 🐛 Problemas Comuns

### Erro: "Missing Clerk Publishable Key"

**Solução**: Verifique se `VITE_CLERK_PUBLISHABLE_KEY` está no `.env`

### Erro: "Cannot connect to database"

**Solução**: 
```bash
# Verifique se o PostgreSQL está rodando
docker compose ps

# Se não estiver, inicie
docker compose up -d
```

### Erro: "Port 3001 already in use"

**Solução**: Mate o processo ou mude a porta no `.env`:
```bash
# Matar processo (Linux/Mac)
lsof -ti:3001 | xargs kill

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erro: "ENCRYPTION_KEY_BASE64 não configurada"

**Solução**: Gere a chave e adicione ao `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Frontend carrega mas API não responde

**Solução**: Verifique se o backend está rodando:
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok",...}
```

## 📱 Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "Começar Grátis"
3. Crie uma conta com email
4. Verifique o email (Clerk enviará um código)
5. Faça login
6. Você será redirecionado para `/app` (Dashboard)

## 🎯 Próximos Passos

1. **Explore o Dashboard**: Veja os gráficos e resumos
2. **Adicione uma Assinatura**: Teste a criptografia de senhas
3. **Cadastre Categorias**: Crie categorias de despesas
4. **Adicione Transações**: Registre receitas e despesas
5. **Simule Investimentos**: Veja projeções de rendimento
6. **Importe CSV**: Teste o upload de extratos

## 🔧 Comandos Úteis

```bash
# Ver logs do backend
cd apps/api
pnpm dev

# Ver logs do frontend
cd apps/web
pnpm dev

# Abrir Prisma Studio (GUI do banco)
pnpm db:studio

# Rebuild do Prisma Client
pnpm db:generate

# Nova migration
pnpm db:migrate

# Limpar node_modules e reinstalar
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

## 🌐 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555 (após `pnpm db:studio`)

## 📚 Documentação Completa

- [README.md](README.md) - Documentação principal
- [DEPLOY.md](DEPLOY.md) - Deploy em VPS
- [SECURITY.md](SECURITY.md) - Segurança e criptografia

## 💡 Dicas

- Use `pnpm dev` na raiz para rodar tudo de uma vez
- Ctrl+C para parar os servidores
- Use Prisma Studio para visualizar dados no banco
- Faça backup da chave de criptografia!

## 🆘 Ajuda

Se encontrar problemas:
1. Verifique o checklist acima
2. Consulte "Problemas Comuns"
3. Revise as variáveis do `.env`
4. Verifique os logs no terminal

---

**Bom desenvolvimento! 🚀**
