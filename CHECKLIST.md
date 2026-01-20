# ✅ CHECKLIST COMPLETO - VAULT SMILO CENTER

Use este checklist para garantir que tudo está funcionando corretamente.

## 📦 Pré-Instalação

- [ ] Node.js 18+ instalado (`node -v`)
- [ ] PNPM instalado (`pnpm -v`)
- [ ] Docker Desktop instalado e rodando
- [ ] Git instalado (opcional)
- [ ] Editor de código (VS Code recomendado)

## 🔧 Instalação

- [ ] Repositório clonado/baixado
- [ ] `pnpm install` executado sem erros
- [ ] Docker Compose rodando (`docker compose up -d`)
- [ ] PostgreSQL acessível (`docker ps`)
- [ ] Prisma Client gerado (`pnpm db:generate`)
- [ ] Migrations executadas (`pnpm db:migrate`)

## 🔑 Configuração

### Clerk

- [ ] Conta criada em https://dashboard.clerk.com
- [ ] Aplicativo criado no Clerk
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` copiada
- [ ] `CLERK_PUBLISHABLE_KEY` copiada
- [ ] `CLERK_SECRET_KEY` copiada

### Arquivo .env

- [ ] `.env` criado a partir de `.env.example`
- [ ] Todas as chaves do Clerk preenchidas
- [ ] `ENCRYPTION_KEY_BASE64` gerada e preenchida
- [ ] `DATABASE_URL` configurada
- [ ] Outras variáveis verificadas

### Chave de Criptografia

- [ ] Chave de 32 bytes gerada
- [ ] Armazenada em `ENCRYPTION_KEY_BASE64`
- [ ] Backup da chave feito em local seguro
- [ ] **NUNCA** commitada no Git

## 🚀 Execução

### Desenvolvimento

- [ ] `pnpm dev` roda sem erros
- [ ] Backend inicia na porta 3001
- [ ] Frontend inicia na porta 5173
- [ ] Nenhum erro no terminal
- [ ] Hot reload funcionando

### Testes de Funcionalidade

#### Backend

- [ ] Health check responde: `curl http://localhost:3001/health`
- [ ] API rejeita requisições sem token
- [ ] Logs aparecem corretamente no terminal

#### Frontend

- [ ] Landing page carrega em `http://localhost:5173`
- [ ] Botões "Entrar" e "Começar Grátis" funcionam
- [ ] Formulários de login/cadastro aparecem

## 🔐 Autenticação

- [ ] Cadastro de novo usuário funciona
- [ ] Email de verificação recebido (Clerk)
- [ ] Login com credenciais funciona
- [ ] Redirecionamento para `/app` após login
- [ ] UserButton do Clerk aparece no Topbar
- [ ] Logout funciona
- [ ] Proteção de rotas funciona (redirect para login)

## 🎨 Interface

### Layout

- [ ] Sidebar aparece e está funcional
- [ ] Topbar mostra nome do usuário
- [ ] Navegação entre páginas funciona
- [ ] Layout responsivo (testar mobile)
- [ ] Tema verde "Smilo" aplicado

### Páginas

- [ ] Dashboard carrega sem erros
- [ ] Assinaturas - CRUD funciona
- [ ] Cofre - CRUD funciona
- [ ] Finanças - CRUD funciona
- [ ] Investimentos - CRUD funciona
- [ ] Importar - Upload funciona
- [ ] Configurações - Perfil aparece

## 💳 Assinaturas

- [ ] Criar assinatura funciona
- [ ] Senha é salva criptografada
- [ ] Lista mostra "••••••••" no lugar da senha
- [ ] Botão "olhinho" revela senha
- [ ] Editar assinatura funciona
- [ ] Excluir assinatura funciona
- [ ] Validação de campos funciona

## 🔒 Cofre de Contas

- [ ] Criar conta funciona
- [ ] Senha é criptografada
- [ ] Botão "olhinho" revela senha
- [ ] Editar conta funciona
- [ ] Excluir conta funciona
- [ ] Notas são salvas corretamente

## 💰 Finanças

### Categorias

- [ ] Criar categoria funciona
- [ ] Tipos (EXPENSE/INCOME) funcionam
- [ ] Editar categoria funciona
- [ ] Excluir categoria funciona

### Transações

- [ ] Criar receita funciona
- [ ] Criar despesa funciona
- [ ] Vincular categoria funciona
- [ ] Flag "fixa" funciona
- [ ] Editar transação funciona
- [ ] Excluir transação funciona
- [ ] Filtros por mês/ano funcionam

## 📊 Dashboard

- [ ] Cards de resumo aparecem
- [ ] Gráfico de pizza (categorias) renderiza
- [ ] Gráfico de barras (fixas/variáveis) renderiza
- [ ] Valores calculados corretamente
- [ ] Loading states funcionam
- [ ] Atualiza ao adicionar transações

## 📈 Investimentos

- [ ] Criar investimento funciona
- [ ] Tipos diferentes funcionam (CDI, Ações, etc.)
- [ ] Valor estimado é calculado
- [ ] Botão "Ver Projeção" funciona
- [ ] Gráfico de projeção renderiza
- [ ] Fórmula é exibida
- [ ] Editar investimento funciona
- [ ] Excluir investimento funciona

## 📥 Importação CSV

- [ ] Upload de arquivo funciona
- [ ] CSV de exemplo funciona (`exemplo-extrato.csv`)
- [ ] Parse correto das linhas
- [ ] Categorias são criadas automaticamente
- [ ] Transações são inseridas
- [ ] Relatório de erros funciona
- [ ] Formato inválido é rejeitado

## 🔍 Validação e Erros

- [ ] Campos obrigatórios validados
- [ ] Mensagens de erro claras
- [ ] Validação de email funciona
- [ ] Validação de números funciona
- [ ] Datas inválidas são rejeitadas
- [ ] Erros de API aparecem no frontend

## 🛡️ Segurança

### Criptografia

- [ ] Senhas NUNCA aparecem em texto puro nas APIs
- [ ] Endpoint `/password` requer autenticação
- [ ] Descriptografia funciona corretamente
- [ ] Chave não está exposta no código

### Autenticação

- [ ] Rotas protegidas exigem JWT
- [ ] Token inválido é rejeitado
- [ ] Token expirado é rejeitado
- [ ] CORS bloqueia origens não autorizadas

### Banco de Dados

- [ ] PostgreSQL não está exposto publicamente
- [ ] Senhas do DB são fortes
- [ ] Prisma usa prepared statements
- [ ] Nenhuma query SQL direta (risco de injection)

## 🌐 Deploy (Produção)

### Build

- [ ] `pnpm build:web` funciona sem erros
- [ ] Output em `apps/web/dist` está correto
- [ ] Assets são otimizados
- [ ] Tamanho do bundle é razoável

### VPS Setup

- [ ] Node.js instalado no servidor
- [ ] PNPM instalado
- [ ] Docker instalado
- [ ] PM2 instalado
- [ ] Nginx instalado

### Configuração

- [ ] .env de produção configurado
- [ ] Variáveis sensíveis não estão commitadas
- [ ] HTTPS configurado (Certbot)
- [ ] Nginx configurado como reverse proxy
- [ ] Firewall (UFW) configurado

### Execução

- [ ] PostgreSQL rodando via Docker
- [ ] Backend rodando com PM2
- [ ] Frontend servido pelo Nginx
- [ ] API acessível via `/api`
- [ ] Frontend acessível via domínio
- [ ] SSL funciona (HTTPS)

### Monitoramento

- [ ] Logs do Nginx acessíveis
- [ ] Logs do PM2 acessíveis
- [ ] Backend reinicia automaticamente
- [ ] Alertas configurados (opcional)

## 📚 Documentação

- [ ] README.md lido e compreendido
- [ ] QUICKSTART.md seguido
- [ ] SECURITY.md revisado
- [ ] DEPLOY.md consultado (se deploy)
- [ ] Comentários no código são claros

## 🧪 Testes Manuais

### Fluxo Completo

1. [ ] Cadastro de usuário
2. [ ] Login
3. [ ] Criar categoria "Alimentação"
4. [ ] Adicionar transação de despesa
5. [ ] Ver dashboard atualizado
6. [ ] Criar assinatura Netflix
7. [ ] Revelar senha da assinatura
8. [ ] Adicionar conta do Gmail no cofre
9. [ ] Criar investimento em CDI
10. [ ] Ver projeção do investimento
11. [ ] Importar CSV de exemplo
12. [ ] Verificar transações importadas
13. [ ] Filtrar por mês
14. [ ] Logout
15. [ ] Login novamente

### Responsividade

- [ ] Mobile (320px - 640px)
- [ ] Tablet (641px - 1024px)
- [ ] Desktop (1025px+)
- [ ] Sidebar responsiva
- [ ] Tabelas responsivas
- [ ] Modais responsivos

### Navegadores

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 🎯 Performance

- [ ] Página inicial carrega < 2s
- [ ] Dashboard carrega < 3s
- [ ] Sem memory leaks
- [ ] Sem warnings no console
- [ ] Imagens otimizadas
- [ ] Bundle size razoável

## ✅ Finalização

- [ ] Todos os itens acima verificados
- [ ] Projeto pronto para uso
- [ ] Backup da chave de criptografia feito
- [ ] Documentação revisada
- [ ] README atualizado com informações específicas

---

## 🆘 Se Algo Falhou

1. Consulte a seção de "Problemas Comuns" em [QUICKSTART.md](QUICKSTART.md)
2. Verifique logs do terminal
3. Confirme que todas as variáveis de ambiente estão corretas
4. Reinicie os serviços
5. Consulte [STRUCTURE.md](STRUCTURE.md) para entender a arquitetura

## 🎉 Tudo Funcionando?

**Parabéns! 🚀** O Vault Smilo Center está pronto para uso.

Lembre-se:
- Faça backup regular do banco de dados
- Nunca perca a chave de criptografia
- Mantenha as dependências atualizadas
- Monitore logs em produção
- Siga as práticas de segurança

**Bom uso! 💚**
