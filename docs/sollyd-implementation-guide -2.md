# 🚀 Guia de Implementação - Módulo de Cadastros Sollyd (Versão 2.0)

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Passos de Implementação](#passos-de-implementação)
4. [Componentes Shadcn Necessários](#componentes-shadcn-necessários)
5. [Testes e Validação](#testes-e-validação)

---

## Visão Geral

Esta implementação segue **exatamente o padrão visual da tela de Transações** do Sollyd:
- ✅ **Top App Bar** com tabs centralizadas
- ✅ **Page Header** com título, descrição e botão de ação
- ✅ **Page Content** com cards em grid responsivo
- ✅ **Sub-tabs** dentro de Categorias (Receita/Despesa)
- ✅ Design limpo e moderno seguindo o Shadcn UI

---

## Estrutura de Arquivos

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
│   │   │   ├── select.tsx                    # ⚠️ NOVO - necessário para Subcategorias
│   │   │   ├── avatar.tsx
│   │   │   └── use-toast.ts
│   │   └── cadastros/
│   │       ├── wallets-content.tsx           # Conteúdo de Carteiras
│   │       ├── payees-content.tsx            # Conteúdo de Pagadores/Favorecidos
│   │       ├── categories-content.tsx        # Conteúdo de Categorias (com sub-tabs)
│   │       ├── subcategories-content.tsx     # Conteúdo de Subcategorias
│   │       └── classifications-content.tsx   # Conteúdo de Classificações
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
2. Execute o script `sollyd-database-schema` (fornecido anteriormente)
3. Verifique se todas as tabelas foram criadas:
   - `wallets`
   - `income_categories`
   - `expense_categories`
   - `classifications`
   - Atualizações em `subcategories` e `transactions`

### Passo 2: Instalar Componentes Shadcn Necessários

```bash
# Componentes básicos
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast

# ⚠️ NOVO - Necessário para Subcategorias
npx shadcn-ui@latest add select

# Instale o Supabase Auth Helpers se ainda não tiver
npm install @supabase/auth-helpers-nextjs
```

### Passo 3: Criar os Arquivos

#### 3.1 - Types e Queries
**Arquivo:** `src/lib/supabase/cadastros.ts`
- Copie do artifact `sollyd-types-queries`
- Ajuste o import do cliente Supabase conforme sua configuração

#### 3.2 - Página Principal
**Arquivo:** `app/cadastros/page.tsx`
- Copie do artifact `sollyd-cadastros-page`
- Esta página gerencia as tabs e renderiza os componentes de conteúdo

#### 3.3 - Componentes de Conteúdo

Crie os seguintes arquivos em `src/components/cadastros/`:

1. **wallets-content.tsx**
   - Copie do artifact `sollyd-wallets-content`
   - Gerencia carteiras com avatar/logo

2. **categories-content.tsx**
   - Copie do artifact `sollyd-categories-content`
   - Inclui sub-tabs para Receita/Despesa
   - Ícones coloridos (verde para receita, laranja para despesa)

3. **payees-content.tsx**
   - Copie do artifact `sollyd-simple-contents`
   - Gerencia pagadores e favorecidos

4. **subcategories-content.tsx**
   - Copie do artifact `sollyd-remaining-contents`
   - Inclui select de categorias de despesa
   - ⚠️ Requer componente `select` do Shadcn

5. **classifications-content.tsx**
   - Copie do artifact `sollyd-remaining-contents`
   - Gerencia classificações (Essencial, Necessário, Supérfluo)

### Passo 4: Configurar o Toaster

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

### Passo 5: Ajustar Cliente Supabase

Certifique-se de que o cliente Supabase está configurado corretamente. Se você usar um cliente customizado, ajuste nos componentes:

```typescript
// Ao invés de:
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const supabase = createClientComponentClient();

// Use seu cliente:
import { supabase } from '@/lib/supabase-client'; // seu caminho
```

---

## Componentes Shadcn Necessários

### Lista de Verificação

- [ ] `card` - Para os cards de cadastros
- [ ] `dialog` - Para modais de criar/editar
- [ ] `alert-dialog` - Para confirmação de exclusão
- [ ] `button` - Botões de ação
- [ ] `input` - Campos de formulário
- [ ] `label` - Labels dos formulários
- [ ] `select` - **NOVO** - Dropdown para subcategorias
- [ ] `avatar` - Avatar das carteiras
- [ ] `toast` - Notificações de sucesso/erro

### Como instalar todos de uma vez:

```bash
npx shadcn-ui@latest add card dialog alert-dialog button input label select avatar toast
```

---

## Testes e Validação

### Checklist Visual

- [ ] **Top App Bar**
  - [ ] Tabs aparecem centralizadas
  - [ ] Tab ativa tem cor verde (#00665C)
  - [ ] Tabs inativas ficam cinzas
  - [ ] Transição suave ao mudar de tab

- [ ] **Page Header**
  - [ ] Título e descrição mudam conforme a tab
  - [ ] Botão "Adicionar" aparece no canto direito
  - [ ] Layout responsivo

- [ ] **Page Content**
  - [ ] Cards em grid (1 coluna mobile, 2 tablet, 3 desktop)
  - [ ] Ícones coloridos por tipo:
    - Carteiras: azul
    - Pagadores/Favorecidos: roxo
    - Receitas: verde
    - Despesas: laranja
    - Subcategorias: rosa
    - Classificações: índigo
  - [ ] Empty state mostra mensagem apropriada

### Checklist de Funcionalidades

- [ ] **CRUD Completo**
  - [ ] Criar novo item (modal abre corretamente)
  - [ ] Editar item existente (campos preenchidos)
  - [ ] Excluir item (confirmação aparece)
  - [ ] Listar itens (carrega do banco)

- [ ] **Validações**
  - [ ] Campos obrigatórios validam
  - [ ] Label fica vermelho em erro
  - [ ] Mensagem de erro aparece abaixo do campo
  - [ ] Toast mostra sucesso/erro

- [ ] **Categorias (Tab Especial)**
  - [ ] Sub-tabs de Receita/Despesa funcionam
  - [ ] Cor muda conforme o tipo
  - [ ] Cadastro cria na tabela correta

- [ ] **Subcategorias**
  - [ ] Select de categorias carrega opções
  - [ ] Mostra nome da categoria no card
  - [ ] Valida categoria obrigatória

- [ ] **Carteiras**
  - [ ] Avatar mostra logo se fornecida
  - [ ] Avatar mostra inicial se sem logo
  - [ ] URL do logo é opcional

---

## 🎨 Características de Design

### Paleta de Cores por Tipo

| Tipo | Cor de Fundo | Cor do Ícone | Hex |
|------|--------------|--------------|-----|
| Carteiras | `bg-blue-100` | `text-blue-600` | - |
| Pagadores/Favorecidos | `bg-purple-100` | `text-purple-600` | - |
| Receitas | `bg-emerald-100` | `text-emerald-600` | `#10b981` |
| Despesas | `bg-orange-100` | `text-orange-600` | `#f97316` |
| Subcategorias | `bg-pink-100` | `text-pink-600` | - |
| Classificações | `bg-indigo-100` | `text-indigo-600` | - |
| Primária (Sollyd) | - | - | `#00665C` |

### Estados Visuais

- **Hover em Cards**: `hover:shadow-md transition-shadow`
- **Tab Ativa**: `bg-[#00665C] text-white shadow-sm`
- **Tab Inativa**: `text-muted-foreground hover:bg-muted`
- **Botões Primários**: `bg-[#00665C] hover:bg-[#00665C]/90`
- **Erro em Campos**: `border-destructive` no input + `text-destructive` no label

---

## 🔧 Customizações Comuns

### Adicionar um novo campo

```typescript
// No componente *-content.tsx
const [formData, setFormData] = useState({
  name: '',
  description: '', // novo campo
});

// No JSX do Dialog
<div className="grid gap-2">
  <Label htmlFor="description">Descrição</Label>
  <Input
    id="description"
    placeholder="Descrição opcional"
    value={formData.description}
    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
  />
</div>
```

### Mudar cor de um tipo específico

```typescript
// No card do componente
<div className="rounded-full bg-yellow-100 p-2.5">
  <IconName className="h-5 w-5 text-yellow-600" />
</div>
```

### Adicionar filtro/busca

```typescript
const [searchTerm, setSearchTerm] = useState('');

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// No JSX antes do grid
<Input
  placeholder="Buscar..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="mb-4 max-w-sm"
/>
```

---

## 🚨 Problemas Comuns e Soluções

### Erro: "Cannot find module '@/components/ui/select'"

**Solução**: Instale o componente select do Shadcn:
```bash
npx shadcn-ui@latest add select
```

### Cards não aparecem em grid

**Solução**: Verifique se a classe está correta:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Tabs não mudam o conteúdo

**Solução**: Verifique se o `activeTab` está sendo atualizado:
```typescript
<button onClick={() => setActiveTab('carteiras')}>
```

### Toast não aparece

**Solução**: Certifique-se de ter adicionado o `<Toaster />` no layout.

### Cor verde não aparece nas tabs

**Solução**: Verifique se o Tailwind está compilando a cor customizada:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#00665C',
    },
  },
}
```

---

## 📱 Responsividade

| Breakpoint | Colunas | Tabs |
|------------|---------|------|
| Mobile (< 768px) | 1 coluna | Scrollable |
| Tablet (768-1024px) | 2 colunas | Wrapped |
| Desktop (> 1024px) | 3 colunas | Single line |

---

## 🎯 Próximos Passos

1. **Adicionar paginação** nas listagens
2. **Implementar busca** em tempo real
3. **Adicionar filtros** por tipo/categoria
4. **Upload de imagens** para logotipos
5. **Exportar/importar** dados em CSV
6. **Histórico de alterações** (audit log)

---

## ✅ Conclusão

Esta implementação oferece:
- ✅ Interface moderna e limpa seguindo Sollyd
- ✅ CRUD completo em todas as entidades
- ✅ Validações robustas
- ✅ UX polida (loading, erros, confirmações)
- ✅ Código limpo e manutenível
- ✅ Totalmente responsivo
- ✅ Integração com Supabase
- ✅ Segurança com RLS

**Desenvolvido seguindo os padrões do Sollyd** 🚀