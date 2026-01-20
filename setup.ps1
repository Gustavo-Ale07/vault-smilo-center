# ====================================
# VAULT SMILO CENTER - Setup Script
# PowerShell version for Windows
# ====================================

Write-Host "🚀 Iniciando setup do Vault Smilo Center..." -ForegroundColor Cyan
Write-Host ""

function Log-Success {
    param($message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Log-Warning {
    param($message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Log-Error {
    param($message)
    Write-Host "❌ $message" -ForegroundColor Red
}

# Verificar Node.js
Write-Host "Verificando Node.js..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Log-Error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
}

$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Log-Error "Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
}
Log-Success "Node.js $(node -v) instalado"

# Verificar PNPM
Write-Host "Verificando PNPM..."
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Log-Warning "PNPM não encontrado. Instalando..."
    npm install -g pnpm
}
Log-Success "PNPM $(pnpm -v) instalado"

# Verificar Docker
Write-Host "Verificando Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Log-Error "Docker não encontrado. Instale Docker Desktop primeiro."
    exit 1
}
Log-Success "Docker instalado"

# Verificar se Docker está rodando
try {
    docker ps | Out-Null
    Log-Success "Docker está rodando"
} catch {
    Log-Error "Docker não está rodando. Inicie o Docker Desktop e tente novamente."
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependências..."
pnpm install
Log-Success "Dependências instaladas"

Write-Host ""
Write-Host "🐘 Configurando PostgreSQL..."
$dbRunning = docker ps | Select-String "vault_smilo_db"
if ($dbRunning) {
    Log-Warning "PostgreSQL já está rodando"
} else {
    docker compose up -d
    Log-Success "PostgreSQL iniciado"
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "🗄️  Configurando Prisma..."
pnpm db:generate
Log-Success "Prisma Client gerado"

Write-Host ""
Write-Host "🔄 Executando migrations..."
pnpm db:migrate
Log-Success "Migrations executadas"

Write-Host ""
Write-Host "🔐 Gerando chave de criptografia..."
$encryptionKey = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Verificar se .env existe
if (Test-Path .env) {
    Log-Warning ".env já existe. Não sobrescrevendo."
} else {
    Write-Host "Criando arquivo .env..."
    Copy-Item .env.example .env
    
    # Adicionar chave de criptografia
    (Get-Content .env) -replace 'ENCRYPTION_KEY_BASE64=.*', "ENCRYPTION_KEY_BASE64=$encryptionKey" | Set-Content .env
    
    Log-Success "Arquivo .env criado com chave de criptografia"
    Write-Host ""
    Log-Warning "IMPORTANTE: Configure as chaves do Clerk no arquivo .env"
    Write-Host "   1. Acesse: https://dashboard.clerk.com"
    Write-Host "   2. Crie um novo aplicativo"
    Write-Host "   3. Copie as chaves e adicione no .env:"
    Write-Host "      - VITE_CLERK_PUBLISHABLE_KEY"
    Write-Host "      - CLERK_PUBLISHABLE_KEY"
    Write-Host "      - CLERK_SECRET_KEY"
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Log-Success "Setup concluído!"
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:"
Write-Host ""
Write-Host "1. Configure as chaves do Clerk no arquivo .env"
Write-Host "2. Execute: pnpm dev"
Write-Host "3. Acesse: http://localhost:5173"
Write-Host ""
Write-Host "📚 Documentação:"
Write-Host "   - README.md - Documentação completa"
Write-Host "   - QUICKSTART.md - Guia rápido"
Write-Host "   - SECURITY.md - Segurança"
Write-Host ""
Write-Host "🆘 Precisa de ajuda? Consulte QUICKSTART.md"
Write-Host ""
