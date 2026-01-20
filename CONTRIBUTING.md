# 🤝 CONTRIBUINDO PARA O VAULT SMILO CENTER

Obrigado por considerar contribuir para o Vault Smilo Center! Este guia ajudará você a começar.

## 🎯 Como Posso Contribuir?

### 🐛 Reportar Bugs

Se encontrou um bug:

1. **Verifique** se já não foi reportado nas [Issues]
2. **Crie uma nova issue** com:
   - Título claro e descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Node.js, SO, navegador

### 💡 Sugerir Features

Tem uma ideia para melhorar o projeto?

1. **Abra uma issue** com tag `enhancement`
2. **Descreva** o problema que sua sugestão resolve
3. **Explique** como funcionaria
4. **Considere** alternativas

### 🔧 Pull Requests

1. **Fork** o repositório
2. **Crie** uma branch a partir da `main`:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. **Faça** suas alterações
4. **Teste** localmente
5. **Commit** com mensagens claras
6. **Push** para seu fork
7. **Abra** um Pull Request

## 📝 Padrões de Código

### JavaScript

- Use JavaScript moderno (ES6+)
- **NÃO** use TypeScript (projeto é JS puro)
- Use `const` e `let`, evite `var`
- Preferir arrow functions quando apropriado
- Use destructuring quando possível

### React

- Componentes funcionais com hooks
- Props destrutivadas
- Use `useState`, `useEffect` corretamente
- Evite prop drilling excessivo

### Node.js

- Async/await sobre callbacks
- Error handling adequado
- Validação com Zod
- Segurança em primeiro lugar

### Estilo

- **Indentação**: 2 espaços
- **Strings**: Aspas simples `'`
- **Semicolons**: Usar (com exceções do prettier)
- **Naming**:
  - Componentes: `PascalCase`
  - Variáveis: `camelCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Arquivos: `kebab-case.js` ou `PascalCase.jsx`

## 🧪 Testes

Embora este seja um MVP sem testes automatizados ainda, ao contribuir:

1. **Teste manualmente** suas alterações
2. **Verifique** que não quebra funcionalidades existentes
3. **Teste em diferentes navegadores** (Chrome, Firefox, Safari)
4. **Teste responsividade** (mobile, tablet, desktop)

## 📂 Estrutura de Commit

Use mensagens de commit semânticas:

```
Tipo: Descrição curta (máx 50 chars)

Descrição detalhada (opcional)
- Lista de mudanças
- Razões técnicas

Closes #123 (se aplicável)
```

**Tipos**:
- `Add:` Nova feature
- `Fix:` Correção de bug
- `Update:` Atualização de código/deps
- `Refactor:` Refatoração sem mudar comportamento
- `Docs:` Apenas documentação
- `Style:` Formatação, sem mudança lógica
- `Chore:` Tarefas de manutenção
- `Security:` Correções de segurança

**Exemplos**:
```
Add: Botão de exportar PDF no dashboard

Fix: Corrige erro ao salvar senha com caracteres especiais

Update: Atualiza Clerk para versão 5.0.50

Docs: Adiciona exemplo de deploy com Docker Swarm
```

## 🔐 Segurança

Se encontrar uma vulnerabilidade de segurança:

1. **NÃO** abra uma issue pública
2. **Envie** um email para [security@seudominio.com]
3. **Descreva** a vulnerabilidade em detalhes
4. **Aguarde** resposta antes de divulgar publicamente

## 🚀 Áreas que Precisam de Contribuição

### Alta Prioridade
- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] Melhorias de acessibilidade (a11y)
- [ ] Performance do dashboard
- [ ] Internacionalização (i18n)
- [ ] Dark mode

### Médio Prazo
- [ ] Integração com Open Finance
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações (email/push)
- [ ] Multi-moeda
- [ ] App mobile (React Native)

### Funcionalidades Desejadas
- [ ] Comparador de investimentos
- [ ] Metas financeiras
- [ ] Orçamento mensal
- [ ] Alertas de vencimento
- [ ] Análise preditiva (ML)

## 🎨 Design e UX

Se você é designer:

- Melhorias na UI/UX são bem-vindas
- Siga a paleta verde do "Tema Smilo"
- Mantenha acessibilidade em mente
- Mobile-first approach

## 📚 Documentação

Contribuições para docs são muito apreciadas:

- Corrigir typos
- Melhorar clareza
- Adicionar exemplos
- Traduzir para outros idiomas
- Criar tutoriais em vídeo

## 🤔 Dúvidas?

Não hesite em:

- Abrir uma issue com tag `question`
- Comentar em PRs existentes
- Entrar em contato via [discussões]

## 📜 Código de Conduta

### Nossa Promessa

Nos comprometemos a tornar a participação neste projeto uma experiência livre de assédio para todos, independentemente de:
- Idade, tamanho corporal, deficiência
- Etnia, identidade e expressão de gênero
- Nível de experiência, nacionalidade
- Aparência pessoal, raça, religião
- Identidade e orientação sexual

### Padrões

**Comportamento esperado**:
- Usar linguagem acolhedora e inclusiva
- Respeitar pontos de vista diferentes
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade
- Mostrar empatia

**Comportamento inaceitável**:
- Linguagem ou imagens sexualizadas
- Comentários insultuosos ou depreciativos
- Assédio público ou privado
- Publicar informações privadas de outros
- Conduta antiética ou não profissional

### Aplicação

Violações podem resultar em:
1. Aviso privado
2. Suspensão temporária
3. Banimento permanente

Reporte comportamento inaceitável para [moderadores@seudominio.com].

## ✅ Checklist de PR

Antes de submeter seu PR, certifique-se:

- [ ] Código segue os padrões do projeto
- [ ] Funcionalidade testada localmente
- [ ] Sem warnings no console
- [ ] Documentação atualizada (se aplicável)
- [ ] Commit messages são claros
- [ ] Branch está atualizada com `main`
- [ ] Sem conflitos de merge
- [ ] Screenshot incluído (para mudanças visuais)

## 🎉 Reconhecimento

Todos os contribuidores serão:
- Listados no README
- Creditados no CHANGELOG
- Muito apreciados! 💚

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por tornar o Vault Smilo Center melhor! 🚀**
