#!/bin/bash

# ========================================
# VAULT SMILO CENTER - Setup Script
# ========================================

set -e

echo "🚀 Iniciando setup do Vault Smilo Center..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para mensagens
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi
log_success "Node.js $(node -v) instalado"

# Verificar PNPM
echo "Verificando PNPM..."
if ! command -v pnpm &> /dev/null; then
    log_warning "PNPM não encontrado. Instalando..."
    npm install -g pnpm
fi
log_success "PNPM $(pnpm -v) instalado"

# Verificar Docker
echo "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker não encontrado. Instale Docker primeiro."
    exit 1
fi
log_success "Docker instalado"

# Verificar se Docker está rodando
if ! docker ps &> /dev/null; then
    log_error "Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi
log_success "Docker está rodando"

echo ""
echo "📦 Instalando dependências..."
pnpm install
log_success "Dependências instaladas"

echo ""
echo "🐘 Configurando PostgreSQL..."
if docker ps | grep -q "vault_smilo_db"; then
    log_warning "PostgreSQL já está rodando"
else
    docker compose up -d
    log_success "PostgreSQL iniciado"
    sleep 3
fi

echo ""
echo "🗄️  Configurando Prisma..."
pnpm db:generate
log_success "Prisma Client gerado"

echo ""
echo "🔄 Executando migrations..."
pnpm db:migrate
log_success "Migrations executadas"

echo ""
echo "🔐 Gerando chave de criptografia..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# Verificar se .env existe
if [ -f .env ]; then
    log_warning ".env já existe. Não sobrescrevendo."
else
    echo "Criando arquivo .env..."
    cp .env.example .env
    
    # Adicionar chave de criptografia
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|ENCRYPTION_KEY_BASE64=.*|ENCRYPTION_KEY_BASE64=$ENCRYPTION_KEY|" .env
    else
        # Linux
        sed -i "s|ENCRYPTION_KEY_BASE64=.*|ENCRYPTION_KEY_BASE64=$ENCRYPTION_KEY|" .env
    fi
    
    log_success "Arquivo .env criado com chave de criptografia"
    echo ""
    log_warning "IMPORTANTE: Configure as chaves do Clerk no arquivo .env"
    echo "   1. Acesse: https://dashboard.clerk.com"
    echo "   2. Crie um novo aplicativo"
    echo "   3. Copie as chaves e adicione no .env:"
    echo "      - VITE_CLERK_PUBLISHABLE_KEY"
    echo "      - CLERK_PUBLISHABLE_KEY"
    echo "      - CLERK_SECRET_KEY"
fi

echo ""
echo "======================================"
log_success "Setup concluído!"
echo "======================================"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure as chaves do Clerk no arquivo .env"
echo "2. Execute: pnpm dev"
echo "3. Acesse: http://localhost:5173"
echo ""
echo "📚 Documentação:"
echo "   - README.md - Documentação completa"
echo "   - QUICKSTART.md - Guia rápido"
echo "   - SECURITY.md - Segurança"
echo ""
echo "🆘 Precisa de ajuda? Consulte QUICKSTART.md"
echo ""
