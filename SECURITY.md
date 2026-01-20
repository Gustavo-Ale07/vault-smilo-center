# SEGURANÇA - VAULT SMILO CENTER

## ⚠️ AVISOS CRÍTICOS DE SEGURANÇA

### 🔐 Proteção da Chave de Criptografia

A chave `ENCRYPTION_KEY_BASE64` é a peça mais crítica do sistema:

- **NUNCA** commite a chave no Git
- **NUNCA** compartilhe a chave publicamente
- **NUNCA** armazene em texto puro acessível
- **SEMPRE** faça backup seguro da chave
- **SEMPRE** use variáveis de ambiente

**⚠️ Se a chave for perdida, TODAS as senhas serão irrecuperáveis!**

### Gerar Nova Chave

```bash
# Gerar uma chave aleatória de 32 bytes
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Backup Seguro da Chave

```bash
# Opção 1: Armazenar em gerenciador de senhas (1Password, Bitwarden, etc.)
# Opção 2: Arquivo criptografado offline
# Opção 3: Vault (HashiCorp) ou AWS Secrets Manager (produção)
```

## 🔒 Criptografia de Senhas

### Algoritmo: AES-256-GCM

- **Modo**: GCM (Galois/Counter Mode) - autenticado
- **Tamanho da Chave**: 256 bits (32 bytes)
- **IV**: 128 bits (16 bytes) - gerado aleatoriamente para cada criptografia
- **Tag de Autenticação**: 128 bits (16 bytes)

### Formato Armazenado

```
iv:tag:encrypted (todos em base64)
```

Exemplo:
```
kR9xP2mL8vQ1nH4+A3w==:pT7yF6rK9oX2bN5+C1z==:aB3cD4eF5gH6iJ7kL8m==
```

### Como Funciona

1. **Criptografia** (quando salvar):
   - Gera IV aleatório de 16 bytes
   - Criptografa senha com AES-256-GCM
   - Gera tag de autenticação
   - Retorna `iv:tag:encrypted`

2. **Descriptografia** (quando visualizar):
   - Separa componentes (iv, tag, encrypted)
   - Valida tag de autenticação
   - Descriptografa com a chave
   - Retorna senha em texto claro

### Endpoints Seguros

- `GET /subscriptions/:id/password` - Requer autenticação JWT
- `GET /vault-accounts/:id/password` - Requer autenticação JWT

**⚠️ Senhas NUNCA são retornadas em listagens, apenas em endpoints dedicados!**

## 🛡️ Autenticação Clerk

### JWT Validation

Todas as rotas protegidas validam o JWT do Clerk:

```javascript
const sessionClaims = await clerkClient.verifyToken(token);
```

### Headers Requeridos

```
Authorization: Bearer <jwt_token>
```

### Middleware `requireAuth`

- Valida presença do token
- Verifica assinatura JWT
- Extrai `clerkId` do usuário
- Anexa ao `req.auth.userId`

## 🚨 Vulnerabilidades Conhecidas (MVP)

### Mitigadas

✅ SQL Injection - Prisma usa parametrized queries  
✅ XSS - React escapa conteúdo por padrão  
✅ CSRF - Token JWT stateless  
✅ Senhas em texto puro - Criptografia AES-256-GCM  

### Ainda Não Implementadas (Futuro)

⚠️ Rate limiting - Prevenir força bruta  
⚠️ Auditoria de acesso - Log de quem acessou senhas  
⚠️ 2FA adicional - Apenas Clerk por enquanto  
⚠️ Rotação de chaves - Sem suporte automático  
⚠️ Secrets rotation - Manual por enquanto  

## 🔧 Melhores Práticas

### Em Desenvolvimento

```bash
# .env local deve ter permissões restritas
chmod 600 .env

# Nunca commitar .env
git add .gitignore
```

### Em Produção

1. **Variáveis de Ambiente**
   ```bash
   # Usar apenas variáveis de ambiente do sistema
   # Nunca arquivos .env em produção
   export ENCRYPTION_KEY_BASE64="..."
   ```

2. **HTTPS Obrigatório**
   - Sempre usar SSL/TLS
   - Configurar HSTS
   - Usar Certbot/Let's Encrypt

3. **Firewall**
   ```bash
   # Expor apenas portas necessárias
   ufw allow 22/tcp   # SSH
   ufw allow 80/tcp   # HTTP (redireciona para HTTPS)
   ufw allow 443/tcp  # HTTPS
   ```

4. **Banco de Dados**
   ```bash
   # PostgreSQL não deve ser exposto externamente
   # Usar apenas localhost ou rede privada
   # Configurar senha forte
   ```

5. **Logs**
   ```bash
   # Nunca logar senhas ou tokens
   # Logs de acesso devem ser rotacionados
   # Monitorar tentativas de acesso não autorizado
   ```

## 📊 Checklist de Segurança para Deploy

- [ ] ENCRYPTION_KEY_BASE64 gerada e armazenada com segurança
- [ ] Backup da chave em local seguro offline
- [ ] Variáveis de ambiente configuradas (não usar .env)
- [ ] Clerk configurado com domínio correto
- [ ] CORS configurado apenas para domínio de produção
- [ ] HTTPS ativo com certificado válido
- [ ] Firewall configurado (UFW)
- [ ] PostgreSQL não exposto publicamente
- [ ] Senha do PostgreSQL forte
- [ ] Nginx configurado com headers de segurança
- [ ] PM2 configurado para restart automático
- [ ] Logs configurados e rotacionados
- [ ] Backup do banco agendado
- [ ] Monitoramento de recursos ativo

## 🔍 Testes de Segurança Recomendados

```bash
# Testar se .env está acessível (deve retornar 403/404)
curl https://seudominio.com/.env

# Testar se node_modules está bloqueado
curl https://seudominio.com/node_modules/

# Testar se API rejeita requisição sem token
curl https://seudominio.com/api/subscriptions

# Testar HTTPS redirect
curl -I http://seudominio.com
```

## 📞 Em Caso de Violação

1. **Rotacionar Imediatamente**:
   - Chave de criptografia
   - Senhas do banco
   - Secrets do Clerk

2. **Invalidar Sessões**:
   - Forçar logout de todos os usuários via Clerk

3. **Notificar Usuários**:
   - Avisar sobre possível comprometimento
   - Solicitar troca de senhas importantes

4. **Investigar**:
   - Revisar logs de acesso
   - Identificar ponto de entrada
   - Corrigir vulnerabilidade

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [Clerk Security](https://clerk.com/docs/security/overview)
- [Prisma Security](https://www.prisma.io/docs/guides/security)

---

**⚠️ LEMBRE-SE**: A segurança é um processo contínuo, não um estado final. Sempre revise e atualize suas práticas.
