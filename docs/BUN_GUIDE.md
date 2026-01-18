# 🚀 Guia de Comandos Bun - Projeto Sollyd

## 📦 Protocolo de Migração: BUN_MIGRATION_V1

### ✅ Status da Migração
- **Runtime**: Bun v1.3.6
- **Package Manager**: Bun (substituindo npm)
- **TypeScript Support**: @types/bun instalado
- **Security**: trustedDependencies configurado

---

## 🎯 Comandos Principais

### Desenvolvimento
```bash
bun run dev
# Inicia o servidor de desenvolvimento Next.js com Bun runtime
# Porta padrão: 3000 (ou 3001 se 3000 estiver em uso)
```

### Build de Produção
```bash
bun run build
# Cria build otimizado para produção
```

### Iniciar Produção
```bash
bun run start
# Inicia o servidor de produção
```

### Linting
```bash
bun run lint
# Executa ESLint no projeto
```

### Type Checking
```bash
bun run type-check
# Verifica tipos TypeScript sem emitir arquivos
```

---

## 🔧 Comandos de Manutenção

### Instalar Dependências
```bash
bun install
# Instala todas as dependências (muito mais rápido que npm)
```

### Adicionar Pacote
```bash
bun add <package-name>
# Adiciona dependência de produção

bun add -d <package-name>
# Adiciona dependência de desenvolvimento
```

### Remover Pacote
```bash
bun remove <package-name>
```

### Atualizar Dependências
```bash
bun update
# Atualiza todas as dependências

bun update <package-name>
# Atualiza pacote específico
```

### Limpar e Reinstalar
```bash
bun run clean
# Remove .next e node_modules

bun run reinstall
# Limpa e reinstala tudo do zero
```

---

## ⚡ Performance Gains

### Comparação de Velocidade (estimada)

| Operação | npm | Bun | Ganho |
|----------|-----|-----|-------|
| `install` | ~45s | ~8s | **5.6x mais rápido** |
| `dev` startup | ~3.5s | ~2.1s | **1.7x mais rápido** |
| `build` | ~60s | ~45s | **1.3x mais rápido** |

---

## 🔒 Segurança: trustedDependencies

O Bun bloqueia postinstall scripts por padrão. Os seguintes pacotes foram marcados como confiáveis:

```json
"trustedDependencies": [
  "@next/swc-win32-x64-msvc",  // Compilador Next.js para Windows
  "esbuild",                    // Bundler JavaScript
  "sharp"                       // Processamento de imagens
]
```

Se você adicionar pacotes que precisam executar scripts pós-instalação, adicione-os aqui.

---

## 🗄️ Conexão com Supabase

### Status: ✅ Compatível

O Bun é totalmente compatível com o Supabase client:
- `@supabase/supabase-js` funciona nativamente
- `@supabase/ssr` funciona com Next.js
- Conexões SQL via driver nativo do Bun (se necessário)

### Exemplo de Teste de Conexão
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Testa conexão
const { data, error } = await supabase.from('transactions').select('count')
console.log('Supabase conectado:', !error)
```

---

## 📝 Scripts Customizados no package.json

```json
{
  "scripts": {
    "dev": "bun --bun next dev",           // Dev com runtime Bun
    "build": "bun --bun next build",       // Build com runtime Bun
    "start": "bun --bun next start",       // Produção com runtime Bun
    "lint": "bun --bun next lint",         // Lint com Bun
    "type-check": "bun tsc --noEmit",      // Type checking
    "clean": "bun run rm -rf .next node_modules",
    "reinstall": "bun run clean && bun install"
  }
}
```

### Flag `--bun`
A flag `--bun` força o uso do runtime Bun em vez do Node.js, garantindo máxima performance.

---

## 🎓 Dicas de Uso Diário

### 1. **Sempre use `bun` em vez de `npm`**
```bash
# ❌ Evite
npm install
npm run dev

# ✅ Use
bun install
bun run dev
```

### 2. **Aproveite o cache do Bun**
O Bun mantém um cache global de pacotes, tornando instalações subsequentes instantâneas.

### 3. **Use `bunx` para executar pacotes**
```bash
# Equivalente ao npx
bunx create-next-app
bunx prisma generate
```

### 4. **Debugging**
```bash
bun --inspect run dev
# Habilita debugging com Chrome DevTools
```

### 5. **Verificar versão**
```bash
bun --version
# Deve mostrar: 1.3.6 ou superior
```

---

## 🐛 Troubleshooting

### Problema: "bun: command not found"
**Solução**: Reinicie o terminal ou adicione ao PATH:
```powershell
$env:Path += ";C:\Users\renan\.bun\bin"
```

### Problema: Erro em postinstall scripts
**Solução**: Adicione o pacote ao `trustedDependencies` no package.json

### Problema: Módulo não encontrado
**Solução**: Limpe e reinstale:
```bash
bun run reinstall
```

---

## 📊 Monitoramento de Performance

### Verificar tempo de instalação
```bash
bun install --verbose
```

### Verificar tamanho do bundle
```bash
bun run build
# Verifique o output na pasta .next
```

---

## 🔄 Rollback para npm (se necessário)

Se precisar voltar para npm:

1. Remova `bun.lockb`
2. Restaure scripts no package.json:
```json
"dev": "next dev",
"build": "next build",
```
3. Execute `npm install`

---

## 📚 Recursos Adicionais

- [Documentação Bun](https://bun.sh/docs)
- [Bun + Next.js](https://bun.sh/guides/ecosystem/nextjs)
- [Bun + TypeScript](https://bun.sh/docs/runtime/typescript)

---

**Última atualização**: 2026-01-18  
**Versão do Bun**: 1.3.6  
**Projeto**: Sollyd - Sistema de Gestão Financeira
