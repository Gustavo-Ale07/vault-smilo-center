# Guia Cirúrgico de Deploy - Vault Smilo Center
## Domínio: vaultfinanc.smilocenter.com.br

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de que você tem:
- [ ] Acesso SSH à sua VPS
- [ ] Domínio `vaultfinanc.smilocenter.com.br` apontando para o IP da sua VPS
- [ ] PostgreSQL configurado (pode ser na VPS ou externo)
- [ ] Conta no Clerk configurada
- [ ] Node.js 18+ e pnpm instalados na VPS

---

## 🚀 PASSO A PASSO CIRÚRGICO

### FASE 1: PREPARAÇÃO DA VPS

#### 1.1 Atualizar o sistema
```bash
# Conecte-se à sua VPS via SSH
ssh seu-usuario@ip-da-sua-vps

# Atualize todos os pacotes
sudo apt update && sudo apt upgrade -y
```

#### 1.2 Verificar instalações existentes
```bash
# Verificar Node.js (deve ser 18+)
node --version

# Verificar pnpm
pnpm --version

# Verificar PM2
pm2 --version

# Verificar Nginx
nginx -v

# Verificar Git
git --version

# Verificar PostgreSQL
psql --version
```

**Se algo não estiver instalado:**
```bash
# Instalar Node.js 18+ (se necessário)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente (se necessário)
sudo npm install -g pm2

# Instalar Nginx (se necessário)
sudo apt install -y nginx

# Instalar Git (se necessário)
sudo apt install -y git

# Instalar pnpm (se necessário)
npm install -g pnpm

# Instalar PostgreSQL (se necessário)
sudo apt install -y postgresql postgresql-contrib
```

#### 1.3 Configurar Firewall
```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP
sudo ufw allow 80/tcp

# Permitir HTTPS
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

---

### FASE 2: CLONAR E CONFIGURAR O PROJETO

#### 2.1 Criar diretório e clonar repositório
```bash
# Ir para /var/www
cd /var/www

# Clonar o repositório (substitua pela URL do seu repo)
sudo git clone https://github.com/seu-usuario/vault-smilo-center.git vault-smilo

# Definir permissões corretas
sudo chown -R $USER:$USER vault-smilo

# Entrar no diretório do projeto
cd vault-smilo
```

#### 2.2 Instalar dependências
```bash
# Instalar todas as dependências do monorepo
pnpm install
```

#### 2.3 Configurar variáveis de ambiente
```bash
# Verificar se existe .env.example
ls -la | grep .env

# Se existir, copiar para .env
cp .env.example .env

# Se não existir, criar .env manualmente
nano .env
```

**Conteúdo mínimo do .env:**
```env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/vault_smilo?schema=public"

# Clerk
CLERK_SECRET_KEY="sua_clerk_secret_key"
CLERK_JWT_KEY="sua_clerk_jwt_key"

# Encryption (gerar com: node generate-key.js)
ENCRYPTION_KEY_BASE64="sua_chave_base64"

# CORS
CORS_ORIGIN="https://vaultfinanc.smilocenter.com.br"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Gerar chave de criptografia:**
```bash
node generate-key.js
# Copie a chave gerada para ENCRYPTION_KEY_BASE64 no .env
```

**Definir permissões seguras do .env:**
```bash
chmod 600 .env
```

---

### FASE 3: CONFIGURAR BANCO DE DADOS

#### 3.1 Criar banco de dados PostgreSQL (se necessário)
```bash
# Acessar PostgreSQL
sudo -u postgres psql

# No prompt do PostgreSQL:
CREATE DATABASE vault_smilo;
CREATE USER vault_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE vault_smilo TO vault_user;
\q
```

#### 3.2 Executar migrações
```bash
# Ir para o diretório do banco
cd packages/db

# Gerar cliente Prisma
pnpm prisma generate

# Executar migrações
pnpm prisma migrate deploy

# Verificar se as tabelas foram criadas
pnpm prisma studio
# (Ctrl+C para sair)
```

---

### FASE 4: BUILD DO FRONTEND

#### 4.1 Compilar o frontend React
```bash
# Voltar para a raiz do projeto
cd /var/www/vault-smilo

# Build do frontend
pnpm build:web

# Verificar se o build foi criado
ls -la apps/web/dist
```

---

### FASE 5: CONFIGURAR NGINX

#### 5.1 Criar configuração do Nginx
```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/vault-smilo
```

**Conteúdo do arquivo:**
```nginx
# HTTP - Redirecionar para HTTPS
server {
    listen 80;
    server_name vaultfinanc.smilocenter.com.br;
    
    # Redirecionar todo tráfego HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS - Configuração principal
server {
    listen 443 ssl http2;
    server_name vaultfinanc.smilocenter.com.br;

    # Certificados SSL (serão gerados pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/vaultfinanc.smilocenter.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vaultfinanc.smilocenter.com.br/privkey.pem;

    # Configurações SSL seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/vault-smilo-access.log;
    error_log /var/log/nginx/vault-smilo-error.log;

    # Frontend estático (React build)
    root /var/www/vault-smilo/apps/web/dist;
    index index.html;

    # Servir arquivos estáticos do frontend
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy para API backend
    location /api {
        rewrite ^/api/(.*) /$1 break;
        
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Security headers for API
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Bloquear acesso a arquivos sensíveis
    location ~ /\. {
        deny all;
    }

    location ~ ^/(\.env|\.git|node_modules) {
        deny all;
    }

    # Limite de upload (para CSV)
    client_max_body_size 10M;
}
```

#### 5.2 Ativar configuração do Nginx
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/vault-smilo /etc/nginx/sites-enabled/

# Remover configuração padrão (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Se não houver erros, recarregar Nginx
sudo systemctl reload nginx

# Verificar status do Nginx
sudo systemctl status nginx
```

---

### FASE 6: CONFIGURAR PM2

#### 6.1 Iniciar aplicação com PM2
```bash
# Voltar para a raiz do projeto
cd /var/www/vault-smilo

# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação com PM2
pm2 start ecosystem.config.js --env production

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Execute o comando que aparecer na saída
```

#### 6.2 Verificar status da aplicação
```bash
# Verificar status
pm2 status

# Verificar logs
pm2 logs vault-smilo-api

# Verificar logs em tempo real
pm2 logs vault-smilo-api --lines 100
```

---

### FASE 7: CONFIGURAR SSL COM CERTBOT

#### 7.1 Instalar Certbot
```bash
# Instalar Certbot e plugin do Nginx
sudo apt install -y certbot python3-certbot-nginx
```

#### 7.2 Obter certificado SSL
```bash
# Obter certificado SSL (Certbot vai configurar o Nginx automaticamente)
sudo certbot --nginx -d vaultfinanc.smilocenter.com.br

# Durante o processo:
# 1. Digite seu email para renovação
# 2. Aceite os termos de serviço
# 3. Escolha se quer compartilhar email (opcional)
# 4. Escolha a opção 2 (Redirect) para redirecionar HTTP para HTTPS
```

#### 7.3 Verificar certificado
```bash
# Verificar status do certificado
sudo certbot certificates

# Testar renovação automática
sudo certbot renew --dry-run
```

**Nota:** O Certbot configura automaticamente a renovação do certificado via cron.

---

### FASE 8: TESTES FINAIS

#### 8.1 Testar aplicação
```bash
# Testar se a API está respondendo
curl http://localhost:3001/health

# Testar se o Nginx está servindo o frontend
curl -I https://vaultfinanc.smilocenter.com.br

# Testar se a API está acessível via Nginx
curl https://vaultfinanc.smilocenter.com.br/api/health
```

#### 8.2 Verificar logs
```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/vault-smilo-access.log
sudo tail -f /var/log/nginx/vault-smilo-error.log

# Logs da aplicação
pm2 logs vault-smilo-api

# (Ctrl+C para sair)
```

#### 8.3 Verificar processos
```bash
# Verificar PM2
pm2 status

# Verificar Nginx
sudo systemctl status nginx

# Verificar PostgreSQL
sudo systemctl status postgresql
```

---

## 🔧 MANUTENÇÃO

### Atualizar aplicação
```bash
cd /var/www/vault-smilo

# Pull das alterações
git pull origin main

# Instalar novas dependências
pnpm install

# Build do frontend
pnpm build:web

# Executar migrações do banco
cd packages/db
pnpm prisma migrate deploy
cd ../..

# Reiniciar PM2
pm2 restart vault-smilo-api

# Recarregar Nginx
sudo systemctl reload nginx
```

### Verificar logs
```bash
# Logs da aplicação
pm2 logs vault-smilo-api

# Logs do Nginx
sudo tail -f /var/log/nginx/vault-smilo-access.log
sudo tail -f /var/log/nginx/vault-smilo-error.log
```

### Reiniciar serviços
```bash
# Reiniciar aplicação
pm2 restart vault-smilo-api

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Renovar certificado SSL manualmente
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs vault-smilo-api --lines 100

# Verificar se a porta 3001 está em uso
sudo netstat -tlnp | grep 3001

# Verificar variáveis de ambiente
cat .env
```

### Erro 502 Bad Gateway
```bash
# Verificar se PM2 está rodando
pm2 status

# Verificar se a API está respondendo
curl http://localhost:3001/health

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/vault-smilo-error.log
```

### Erro de conexão com banco de dados
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -U vault_user -d vault_smilo -h localhost

# Verificar DATABASE_URL no .env
cat .env | grep DATABASE_URL
```

### Certificado SSL expirado
```bash
# Renovar manualmente
sudo certbot renew --force-renewal

# Recarregar Nginx
sudo systemctl reload nginx
```

### Permissões de arquivos
```bash
# Corrigir permissões do projeto
sudo chown -R $USER:$USER /var/www/vault-smilo
sudo chmod -R 755 /var/www/vault-smilo
chmod 600 /var/www/vault-smilo/.env
```

---

## 📊 MONITORAMENTO

### Monitorar recursos
```bash
# Uso de CPU e memória
htop

# Uso de disco
df -h

# Uso de memória
free -h

# Processos rodando
ps aux
```

### Monitorar PM2
```bash
# Status
pm2 status

# Monitoramento em tempo real
pm2 monit

# Logs
pm2 logs
```

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy completo, verifique:

- [ ] Frontend carrega em https://vaultfinanc.smilocenter.com.br
- [ ] API responde em https://vaultfinanc.smilocenter.com.br/api/health
- [ ] Certificado SSL é válido
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] Autenticação com Clerk funciona
- [ ] Operações de banco de dados funcionam
- [ ] Upload de CSV funciona
- [ ] Rate limiting está ativo
- [ ] Logs estão sendo escritos
- [ ] PM2 está rodando e estável
- [ ] Nginx está servindo arquivos estáticos corretamente
- [ ] CORS está configurado corretamente
- [ ] Variáveis de ambiente estão corretas
- [ ] Firewall está configurado
- [ ] Backup do banco de dados está configurado

---

## 📝 NOTAS IMPORTANTES

1. **Nunca** commit o arquivo `.env` no Git
2. Mantenha backups regulares do banco de dados
3. Monitore os logs regularmente
4. Atualize dependências periodicamente: `pnpm update`
5. Mantenha o sistema atualizado: `sudo apt update && sudo apt upgrade`
6. Documente qualquer alteração personalizada
7. Teste o procedimento de rollback periodicamente

---

## 🆘 SUPORTE

Se encontrar problemas:
1. Verifique os logs primeiro
2. Consulte a seção de solução de problemas
3. Verifique a documentação do projeto
4. Entre em contato com a equipe de suporte

---

**Deploy concluído com sucesso! 🎉**
