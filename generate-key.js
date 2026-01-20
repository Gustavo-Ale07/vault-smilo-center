#!/usr/bin/env node

/**
 * Script para gerar chave de criptografia AES-256-GCM
 * 
 * Uso:
 *   node generate-key.js
 * 
 * A chave gerada deve ser armazenada em ENCRYPTION_KEY_BASE64 no .env
 */

const crypto = require('crypto');

console.log('\n🔐 Gerando chave de criptografia AES-256-GCM...\n');

// Gera 32 bytes aleatórios (256 bits)
const key = crypto.randomBytes(32);

// Converte para base64
const keyBase64 = key.toString('base64');

console.log('✅ Chave gerada com sucesso!\n');
console.log('📋 Copie a linha abaixo para o seu arquivo .env:\n');
console.log(`ENCRYPTION_KEY_BASE64=${keyBase64}`);
console.log('\n⚠️  IMPORTANTE:');
console.log('   - Nunca compartilhe esta chave');
console.log('   - Faça backup em local seguro');
console.log('   - Se perder a chave, as senhas não poderão ser recuperadas');
console.log('\n');

// Informações técnicas
console.log('📊 Informações técnicas:');
console.log(`   - Tamanho: 32 bytes (${key.length * 8} bits)`);
console.log(`   - Formato: Base64`);
console.log(`   - Algoritmo: AES-256-GCM`);
console.log('\n');
