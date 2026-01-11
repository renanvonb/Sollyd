# 🚀 Guia de Implementação - Módulo de Cadastros Sollyd

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Passos de Implementação](#passos-de-implementação)
4. [Dependências Necessárias](#dependências-necessárias)
5. [Testes e Validação](#testes-e-validação)

---

## Pré-requisitos

Certifique-se de ter:
- ✅ Next.js 15+ configurado com App Router
- ✅ Supabase configurado e conectado
- ✅ Shadcn UI instalado e configurado
- ✅ Tailwind CSS configurado

---

## Estrutura de Arquivos

Crie a seguinte estrutura no seu projeto:

```
sollyd/
├── app/
│   └── cadastros/
│       └── page.tsx                          # Página principal com tabs
├── src/
│   ├── components/
│   │   ├── ui/                               # Componentes Shadcn (já existentes)
│   │   │   ├── tabs.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── table.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── use-toast.ts
│   │   └── cadastros/
│   │       ├── crud-base.tsx                 # Componente base reutilizável
│   │       ├── wallets-tab.tsx
│   │       ├── payees-tab.tsx
│   │       ├── income-categories-tab.tsx
│   │       ├── expense-categories-tab.tsx
│   │       ├── subcategories-tab.tsx
│   │       └── classifications-tab.tsx
│   └── lib/
│       └── supabase/
│           └── cadastros.ts                  # Types e queries
└── database/
    └── migrations/
        └── 001_cadastros_schema.sql          # Schema do banco
```

---

## Passos de Implementação

### Passo 1: Configurar o Banco de Dados

1. Acesse o **SQL Editor** do Supabase
2. Copie e execute o script `001_cadastros_schema.sql` (fornecido anteriormente)
3. Verifique se todas as tabelas foram criadas:
   - `wallets`
   - `income_categories`
   - `expense_categories`
   - `classifications`
   - Atualizações em `subcategories` e `transactions`

### Passo 2: Instalar Dependências Necessárias

```bash
# Se ainda não tiver, instale os componentes Shadcn necessários
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add table
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast

# Instale o Supabase Auth Helpers se ainda não tiver
npm install @supabase/auth-helpers-nextjs
```

### Passo 3: Criar os Arquivos

#### 3.1 - Types e Queries (`src/lib/supabase/cadastros.ts`)
Copie o conteúdo fornecido no artifact `sollyd-types-queries`

**Importante**: Ajuste a importação do cliente Supabase de acordo com sua configuração existente:

```typescript
// Exemplo de configuração comum
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const supabase = createClientComponentClient();
```

#### 3.2 - Componente Base (`src/components/cadastros/crud-base.tsx`)
Copie o conteúdo do artifact `sollyd-crud-base`

#### 3.3 - Componentes das Tabs
Crie os seguintes arquivos na pasta `src/components/cadastros/`:

- `wallets-tab.tsx` - do artifact `sollyd-wallets-tab`
- `payees-tab.tsx`
- `income-categories-tab.tsx`
- `expense-categories-tab.tsx`
- `subcategories-tab.tsx`
- `classifications-tab.tsx`

Todos estes estão no artifact `sollyd-all-tabs`

#### 3.4 - Página Principal (`app/cadastros/page.tsx`)
Copie o conteúdo do artifact `sollyd-cadastros-page`

### Passo 4: Configurar o Toaster (se ainda não estiver configurado)

Adicione o `<Toaster />` no seu layout principal:

```typescript
// app/layout.tsx
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### Passo 5: Ajustar Cores do Shadcn (se necessário)

Verifique se o verde primário `#00665C` está configurado no `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00665C',
          foreground: '#ffffff',
        },
      },
    },
  },
};
```

---

## Dependências Necessárias

### package.json (adicione se não tiver)

```json
{
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.294.0",
    "next": "^15.0.0",
    "react": "^18.2.0"
  }
}
```

---

## Testes e Validação

### Checklist de Testes

- [ ] **Banco de Dados**
  - [ ] Todas as tabelas foram criadas corretamente
  - [ ] RLS (Row Level Security) está ativo
  - [ ] Triggers de `updated_at` funcionam

- [ ] **Interface**
  - [ ] A página `/cadastros` carrega sem erros
  - [ ] Todas as 7 tabs aparecem corretamente
  - [ ] A cor verde `#00665C` é aplicada nas tabs ativas

- [ ] **Funcionalidades CRUD**
  - [ ] **Criar**: Consegue adicionar novos itens em cada tab
  - [ ] **Ler**: A listagem carrega os itens do banco
  - [ ] **Atualizar**: Consegue editar itens existentes
  - [ ] **Deletar**: Consegue excluir itens com confirmação

- [ ] **Validações**
  - [ ] Campos obrigatórios exibem erro quando vazios
  - [ ] Labels ficam vermelhos em caso de erro
  - [ ] Mensagens de sucesso/erro aparecem corretamente

- [ ] **Subcategorias**
  - [ ] O select de categorias carrega as opções
  - [ ] A subcategoria mostra a categoria relacionada na listagem

- [ ] **Carteiras**
  - [ ] Avatar exibe o logotipo se fornecido
  - [ ] Avatar exibe inicial se não houver logotipo

---

## 🔧 Ajustes Finais

### Se você usar um cliente Supabase customizado

Ajuste as importações em todos os arquivos de tab:

```typescript
// Ao invés de:
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const supabase = createClientComponentClient();

// Use seu cliente:
import { supabase } from '@/lib/supabase-client'; // seu caminho
```

### Se você quiser adicionar mais campos

Edite o array `fields` no componente da tab específica:

```typescript
fields={[
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Digite o nome',
    required: true,
  },
  {
    name: 'description', // novo campo
    label: 'Descrição',
    type: 'text',
    placeholder: 'Descrição opcional',
    required: false,
  },
]}
```

### Se você quiser customizar a renderização da tabela

Use a prop `renderRow` no `CrudBase`:

```typescript
renderRow={(item) => (
  <>
    <TableCell>{item.name}</TableCell>
    <TableCell className="text-muted-foreground">
      {item.description}
    </TableCell>
  </>
)}
```

---

## 📱 Responsividade

O layout é totalmente responsivo:
- **Mobile**: Tabs em 2 colunas, ícones visíveis
- **Tablet**: Tabs em 3 colunas
- **Desktop**: Tabs em 6 colunas (uma linha)

---

## 🎨 Design System

Todos os componentes seguem:
- ✅ Padrões Shadcn UI
- ✅ Cores do Sollyd (#00665C)
- ✅ Estados de erro com label vermelho (#ef4444)
- ✅ Tipografia e espaçamentos consistentes

---

## 🚨 Possíveis Problemas e Soluções

### Erro: "Cannot find module '@/components/ui/...'"

**Solução**: Verifique se o alias `@` está configurado no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erro: "Table does not exist"

**Solução**: Execute o script SQL no Supabase novamente e verifique se todas as tabelas foram criadas.

### Erro de RLS: "Row Level Security policy violation"

**Solução**: Verifique se o usuário está autenticado e se as policies foram criadas corretamente no script SQL.

### Toast não aparece

**Solução**: Certifique-se de ter adicionado o `<Toaster />` no layout principal.

---

## 🎯 Próximos Passos Sugeridos

1. **Adicionar filtros e busca** nas listagens
2. **Implementar paginação** para listagens grandes
3. **Adicionar upload de imagens** para logotipos de carteiras
4. **Criar relatórios** usando os dados cadastrados
5. **Implementar importação/exportação** de dados

---

## 📞 Suporte

Se encontrar problemas durante a implementação, revise:
1. Logs do console do navegador
2. Logs do Supabase (na aba de Logs)
3. Configurações de RLS no Supabase
4. Conexão e autenticação do Supabase

---

**Desenvolvido seguindo os padrões do Sollyd**
- Framework: Next.js 15
- UI Library: Shadcn UI + Radix UI
- Backend: Supabase PostgreSQL
- Estilização: Tailwind CSS