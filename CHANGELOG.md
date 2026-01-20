# 📝 CHANGELOG - VAULT SMILO CENTER

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-01-20

### 🎉 Lançamento Inicial (MVP)

#### ✨ Adicionado

**Infraestrutura**
- Monorepo PNPM com workspaces
- Docker Compose para PostgreSQL
- Scripts de setup automatizado (Bash e PowerShell)
- Configuração PM2 para produção
- Nginx config para deploy VPS

**Backend (Node.js + Express)**
- Autenticação JWT via Clerk
- Middleware de validação com Zod
- Criptografia AES-256-GCM para senhas
- Rotas REST completas:
  - `/health` - Health check
  - `/me` - Gestão de usuário
  - `/subscriptions` - CRUD de assinaturas
  - `/vault-accounts` - CRUD do cofre
  - `/categories` - CRUD de categorias
  - `/transactions` - CRUD + resumo financeiro
  - `/investments` - CRUD + projeções
  - `/import/csv` - Importação de extratos

**Frontend (React + Vite)**
- Landing page com seções de benefícios e limitações
- Autenticação integrada com Clerk
- Layout responsivo com Sidebar e Topbar
- Dashboard com gráficos (Recharts):
  - Resumo financeiro do mês
  - Gastos por categoria (pizza)
  - Despesas fixas vs variáveis (barras)
  - Patrimônio estimado
- Páginas completas:
  - Assinaturas com botão "olhinho"
  - Cofre de senhas criptografadas
  - Finanças com filtros
  - Investimentos com projeção de 12 meses
  - Importação CSV
  - Configurações
- Tema Smilo (verde) com TailwindCSS

**Banco de Dados (PostgreSQL + Prisma)**
- Schema completo com 6 modelos:
  - User (integrado com Clerk)
  - Subscription
  - VaultAccount
  - Category
  - Transaction
  - Investment
- Migrations configuradas
- Seed de exemplo

**Documentação**
- README.md completo
- QUICKSTART.md (guia de 5 minutos)
- DEPLOY.md (instruções VPS)
- SECURITY.md (segurança e criptografia)
- STRUCTURE.md (arquitetura do projeto)
- CONTRIBUTING.md (guia de contribuição)
- CHANGELOG.md (este arquivo)

**Recursos de Segurança**
- Senhas nunca em texto puro
- Criptografia AES-256-GCM
- Validação JWT em rotas protegidas
- CORS configurável
- Headers de segurança (Helmet)
- Endpoints dedicados para descriptografia

**Developer Experience**
- Hot reload (Vite + Nodemon)
- Scripts npm organizados
- ESLint e formatação
- Exemplo de CSV para testes
- Script de geração de chave

#### 📊 Funcionalidades Principais

1. **Controle de Assinaturas**
   - Cadastro com senha criptografada
   - Recorrência configurável
   - Cálculo de próxima data
   - Visualização segura de senha

2. **Cofre de Contas**
   - Armazenamento criptografado
   - Notas adicionais
   - Busca e filtros
   - Botão "olhinho" para revelar

3. **Gestão Financeira**
   - Receitas e despesas
   - Categorização customizável
   - Flag de despesa/receita fixa
   - Filtros por mês/ano
   - Dashboard visual

4. **Investimentos**
   - Simulação com juros compostos
   - Projeção de 12 meses
   - Múltiplos tipos (CDI, Ações, etc.)
   - Taxa em basis points
   - Aporte mensal

5. **Importação CSV**
   - Upload de extratos
   - Parse automático
   - Criação de categorias
   - Relatório de erros

#### 🎨 Design

- Paleta verde "Smilo"
- Interface limpa e moderna
- Totalmente responsivo
- Ícones Lucide React
- Loading states
- Error handling

#### ⚙️ Configuração

- Variáveis de ambiente documentadas
- Docker Compose one-command
- Setup automatizado
- Migrations automáticas
- Suporte a desenvolvimento e produção

#### 🚀 Deploy

- Otimizado para VPS com recursos limitados
- Build estático do frontend
- Backend com PM2
- Nginx como reverse proxy
- SSL/HTTPS configurado
- Firewall recommendations

#### 📝 Limitações Conhecidas (MVP)

- Sem app mobile nativo
- Importação CSV básica
- Sem integração bancária (Open Finance)
- Apenas BRL
- Gráficos básicos
- Sem testes automatizados
- Sem CI/CD

#### 🔒 Segurança

- AES-256-GCM para senhas
- JWT do Clerk
- Validação Zod
- Helmet configurado
- CORS restrito
- Documentação de segurança

---

## [Unreleased]

### 🔮 Planejado para Versões Futuras

#### v1.1.0 (Q2 2026)
- [ ] Testes automatizados (Jest + RTL)
- [ ] Dark mode
- [ ] Exportação de relatórios (PDF)
- [ ] Notificações de vencimento
- [ ] Multi-moeda

#### v1.2.0 (Q3 2026)
- [ ] App mobile (React Native)
- [ ] Integração Open Finance
- [ ] Metas financeiras
- [ ] Orçamento mensal
- [ ] 2FA adicional

#### v2.0.0 (Q4 2026)
- [ ] Multi-tenant
- [ ] API pública
- [ ] Webhooks
- [ ] Análise preditiva (ML)
- [ ] Marketplace de integrações

---

## Tipos de Mudanças

- `Added` - Novas funcionalidades
- `Changed` - Mudanças em funcionalidades existentes
- `Deprecated` - Recursos que serão removidos
- `Removed` - Recursos removidos
- `Fixed` - Correções de bugs
- `Security` - Correções de segurança

---

**Nota**: Versões seguem [Semantic Versioning](https://semver.org/):
- MAJOR: Mudanças incompatíveis
- MINOR: Novas funcionalidades compatíveis
- PATCH: Correções de bugs

[1.0.0]: https://github.com/seu-usuario/vault-smilo-center/releases/tag/v1.0.0
[Unreleased]: https://github.com/seu-usuario/vault-smilo-center/compare/v1.0.0...HEAD
