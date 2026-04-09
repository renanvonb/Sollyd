# Sollyd — Visão Geral do Projeto

> **Versão:** 0.1.0  
> **Data de geração:** 2026-04-08  
> **Plataforma:** Next.js 14 + Supabase

---

## 1. Descrição Geral

**Sollyd** é uma plataforma SaaS de gestão financeira pessoal/empresarial. A proposta de valor é centralizar o controle de transações financeiras, carteiras, categorias, favorecidos e orçamentos em uma interface moderna e responsiva, com dados completamente isolados por usuário (multi-tenant via RLS no Supabase).

> _"Plataforma de gestão financeira, jurídica e de documentos com foco em eficiência."_

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 3 + tailwindcss-animate |
| Componentes UI | Radix UI (shadcn/ui pattern) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth + `@supabase/ssr` |
| Tabelas | TanStack React Table v8 |
| Gráficos | Recharts + Chart.js / react-chartjs-2 |
| Formulários | React Hook Form + Zod |
| Datas | date-fns v4 + react-day-picker v9 |
| Notificações | Sonner |
| Fontes | Inter + Plus Jakarta Sans (Google Fonts) |
| Package Manager | Bun (com `bun.lock`) |
| Ícones | Lucide React |
| Tema | next-themes (light/dark) |

---

## 3. Estrutura de Diretórios

```
sollyd/
├── app/
│   ├── (auth)/               # Rotas públicas de autenticação
│   ├── (main)/               # Layout principal com sidebar
│   │   ├── (authenticated)/  # Rotas protegidas
│   │   │   ├── admin/
│   │   │   ├── cadastros/    # Página unificada de cadastros
│   │   │   ├── dashboard/    # Painel principal
│   │   │   ├── financeiro/   # Módulo financeiro (resumo, transações, investimentos)
│   │   │   ├── investimentos/
│   │   │   ├── orcamentos/
│   │   │   └── transacoes/   # Tabela de transações avançada
│   │   └── layout.tsx        # Root layout (ThemeProvider, Toaster)
│   ├── actions/              # Server Actions
│   │   ├── auth.ts
│   │   ├── contacts.ts
│   │   ├── dashboard-metrics.ts
│   │   ├── transaction-data.ts
│   │   ├── transactions-fetch.ts
│   │   └── transactions.ts
│   └── globals.css
│
├── components/
│   ├── app-sidebar.tsx           # Sidebar colapsável (dark theme)
│   ├── dashboard-client.tsx      # Dashboard principal (client component)
│   ├── dashboard-graphs.tsx      # Gráficos do dashboard
│   ├── dashboard-header.tsx
│   ├── date-filter-picker.tsx
│   ├── finance-header.tsx
│   ├── page-header.tsx
│   ├── page-shell.tsx
│   ├── profile-sheet.tsx         # Sheet de perfil do usuário
│   ├── transaction-details-dialog.tsx
│   ├── transaction-filters.tsx
│   ├── transaction-form.tsx      # Formulário completo de transação
│   ├── transaction-summary-cards.tsx
│   ├── transaction-table.tsx
│   ├── transactions-client.tsx   # Lista de transações (client)
│   ├── cadastros/                # Componentes de cadastro
│   ├── charts/                   # Componentes de gráficos
│   ├── shared/
│   └── ui/                       # Componentes base (shadcn/ui)
│
├── database/
│   └── migrations/               # 13+ migrações SQL sequenciais
│
├── hooks/
│   ├── use-header.tsx
│   ├── use-sidebar-state.tsx
│   ├── use-visibility-state.tsx
│   └── usePayees.ts
│
├── lib/
│   ├── auth-utils.ts
│   ├── supabase/                 # Clients (server, client, middleware)
│   ├── supabase.ts
│   └── utils.ts
│
├── shared/
│   └── transaction-filters.tsx
│
├── types/
│   ├── entities.ts               # Tipos das entidades de cadastro
│   ├── transaction.ts            # Tipos de transações e relacionamentos
│   └── time-range.ts
│
├── scripts/
│   ├── wipe-data.ts
│   └── verify-supabase.ts
│
├── middleware.ts                 # Proteção de rotas via Supabase SSR
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Rotas da Aplicação

### Públicas `(auth)`
| Rota | Descrição |
|---|---|
| `/login` | Tela de login |
| `/signup` | Cadastro de usuário |

### Protegidas `(main)/(authenticated)`
| Rota | Descrição | Status |
|---|---|---|
| `/dashboard` | Painel com resumo financeiro e gráficos | ✅ Ativo |
| `/transacoes` | Tabela avançada de transações com filtros | ✅ Ativo |
| `/financeiro/resumo` | Resumo financeiro detalhado | ✅ Ativo |
| `/financeiro/transacoes` | Transações dentro do módulo financeiro | ✅ Ativo |
| `/financeiro/investimentos` | Subseção de investimentos | ✅ Ativo |
| `/cadastros` | CRUD de Carteiras, Favorecidos, Categorias, Classificações | ✅ Ativo |
| `/investimentos` | Módulo de investimentos | 🚧 Em desenvolvimento |
| `/orcamentos` | Módulo de orçamentos | 🚧 Em desenvolvimento |
| `/admin` | Painel administrativo | 🚧 Em desenvolvimento |

---

## 5. Modelo de Dados (Banco de Dados)

### Entidades Principais

#### `wallets` — Carteiras
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `user_id` | UUID FK | Referência ao `auth.users` |
| `name` | TEXT | Nome da carteira |
| `color` | TEXT | Cor associada |
| `logo` | TEXT | URL ou identificador do logo |
| `balance` | NUMERIC | Saldo atual |
| `is_active` | BOOLEAN | Se a carteira está ativa |
| `is_principal` | BOOLEAN | Se é a carteira principal |
| `created_at` / `updated_at` | TIMESTAMPTZ | Timestamps automáticos |

#### `transactions` — Transações
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | Isolamento por usuário |
| `description` | TEXT | Descrição da transação |
| `amount` | NUMERIC | Valor |
| `type` | ENUM | `revenue` \| `expense` \| `Receita` \| `Despesa` |
| `payee_id` | UUID FK → `payees` | Favorecido/Pagador |
| `category_id` | UUID FK → `categories` | Categoria |
| `subcategory_id` | UUID FK → `subcategories` | Subcategoria |
| `classification_id` | UUID FK → `classifications` | Classificação |
| `wallet_id` | UUID FK → `wallets` | Carteira |
| `payment_method` | ENUM | Boleto / Crédito / Débito / Pix / Dinheiro |
| `date` | DATE | Data de realização |
| `competence` | DATE | Mês de competência |
| `status` | TEXT | `Realizado` \| `Pendente` |
| `observation` | TEXT | Observações livres |

#### `payees` — Favorecidos
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `name` | TEXT | Nome |
| `type` | TEXT | `Receita` \| `Despesa` |
| `color` | TEXT | Cor |
| `icon` | TEXT | Ícone |
| `classification_id` | UUID FK | Classificação associada |

#### `categories` — Categorias
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `name` | TEXT | Nome |
| `type` | ENUM | `Receita` \| `Despesa` |
| `icon` | TEXT | Ícone |
| `color` | TEXT | Cor |

#### `subcategories` — Subcategorias
- Vinculadas a uma `category_id`
- Campos: `id`, `user_id`, `category_id`, `name`, `description`

#### `classifications` — Classificações
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `name` | TEXT | Ex: Essencial, Necessário, Supérfluo |
| `description` | TEXT | |
| `color` | TEXT | |
| `icon` | TEXT | |

### Migrações SQL (em ordem)
| Arquivo | Descrição |
|---|---|
| `001_cadastros_schema.sql` | Schema inicial: wallets, categorias, classificações, payees |
| `002_update_payees_table.sql` | Atualização da tabela payees |
| `003_create_payees_complete.sql` | Recriação completa de payees |
| `004_payers_and_payees.sql` | Payers e payees separados |
| `005_add_icon_to_payees.sql` | Campo ícone em payees |
| `006_ensure_payees_schema.sql` | Garantia de schema payees |
| `007_categories_subcategories.sql` | Categorias e subcategorias unificadas |
| `008_ensure_wallets.sql` | Garantia schema de wallets |
| `009_wallets_fields.sql` | Campos adicionais em wallets |
| `010_cleanup_db.sql` | Limpeza e consolidação do banco |
| `011_payees_type.sql` | Campo type em payees |
| `012_create_classifications.sql` | Tabela de classificações |
| `013_make_category_fields_optional.sql` | Campos de categoria opcionais |

---

## 6. Segurança — Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado via políticas Supabase:

```sql
-- Padrão aplicado em todas as tabelas
USING (auth.uid() = user_id)      -- SELECT, UPDATE, DELETE
WITH CHECK (auth.uid() = user_id)  -- INSERT
```

O middleware Next.js (`middleware.ts`) gerencia sessões via `@supabase/ssr`, protegendo todas as rotas não estáticas automaticamente.

---

## 7. Server Actions

Localizados em `app/actions/`:

| Arquivo | Actions |
|---|---|
| `transactions.ts` | `saveTransaction`, `updateTransaction`, `deleteTransaction`, `markAsPaid`, `markAsPending` |
| `transactions-fetch.ts` | Queries de busca de transações com join de relações |
| `dashboard-metrics.ts` | Cálculo de métricas do dashboard (receitas, despesas, saldo) |
| `transaction-data.ts` | Dados auxiliares para o formulário |
| `contacts.ts` | CRUD de contatos/favorecidos |
| `auth.ts` | `signOut`, `updateProfile` |

### Validação com Zod (`transactions.ts`)

```typescript
const transactionSchema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().gt(0),
  type: z.enum(["revenue", "expense", "Receita", "Despesa"]),
  payee_id: z.string().uuid().optional().nullable(),
  payment_method: z.enum(["Boleto", "Crédito", "Débito", "Pix", "Dinheiro"]).optional().nullable(),
  classification_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  subcategory_id: z.string().uuid().optional().nullable(),
  date: z.union([z.string(), z.date()]).optional().nullable(),
  competence: z.union([z.string(), z.date()]).optional().nullable(),
  status: z.enum(['Realizado', 'Pendente']).optional().nullable(),
  wallet_id: z.string().uuid().optional().nullable(),
})
```

---

## 8. Componentes Principais

### `AppSidebar`
- Sidebar colapsável (modo expandido ↔ ícones)
- Tema escuro: fundo `#0a0a0a`, borda `#262626`
- Avatar do usuário com dropdown (Perfil / Sair)
- Logo Sollyd com símbolo filtrado em amarelo-ouro
- Responsivo: oculto em mobile com botão de trigger

### `transaction-form.tsx` (~45KB)
- Formulário completo de criação/edição de transações
- Usa React Hook Form + Zod
- Selects dinâmicos para categoria, subcategoria, favorecido, carteira, classificação

### Tabela de Transações (`/transacoes`)
Colunas disponíveis com filtros e ordenação:

| Coluna | Tipo |
|---|---|
| Descrição | Texto com highlight de busca + tooltip truncado |
| Tipo | Badge: Receita (verde) / Despesa (vermelho) |
| Favorecido | Badge secundário |
| Categoria | Badge secundário |
| Classificação | Badge secundário |
| Método | Badge — Filtro: Boleto, Crédito, Débito, Pix, Dinheiro |
| Competência | `Jan/2025` formatado |
| Data | `dd/MM/yyyy` + ordenação |
| Valor | Formatado em BRL, colorido por tipo, ocultável (privacidade) |
| Status | Badge semântico: Realizado / Pendente / Agendado / Atrasado |
| Ações | Editar / Marcar como pago / Marcar como pendente / Excluir |

### `DashboardClient`
- Cards de resumo financeiro (Receitas, Despesas, Saldo)
- Filtros por período e por carteira
- Gráficos de barras e linhas
- Toggle de visibilidade de valores (privacidade)

---

## 9. Hooks Customizados

| Hook | Responsabilidade |
|---|---|
| `use-sidebar-state.tsx` | Estado colapsado/expandido da sidebar |
| `use-visibility-state.tsx` | Toggle global de visibilidade de valores monetários |
| `use-header.tsx` | Estado/contexto do cabeçalho de página |
| `usePayees.ts` | Fetch client-side de favorecidos |

---

## 10. Scripts Utilitários

| Script | Descrição |
|---|---|
| `scripts/wipe-data.ts` | Limpa dados de teste do banco |
| `scripts/verify-supabase.ts` | Verifica conexão e configurações do Supabase |

**Comandos disponíveis (`package.json`):**

```bash
bun run dev              # Servidor de desenvolvimento (next dev)
bun run build            # Build de produção
bun run start            # Iniciar produção
bun run lint             # ESLint
bun run type-check       # Verificação de tipos TypeScript
bun run verify-supabase  # Verifica setup do Supabase
```

---

## 11. Configuração de Ambiente

Variáveis necessárias em `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 12. Design System

- **Tipografia:** Inter (corpo) + Plus Jakarta Sans (headings/logo)
- **Tema:** Light por padrão, suporte a dark mode via `next-themes`
- **Sidebar:** Dark fixo independente do tema global
- **Cor de destaque:** `#E0FE56` (amarelo-lime) — usado no avatar fallback e elementos de marca
- **Component library:** Baseado em shadcn/ui com Radix UI primitives

---

## 13. Estado do Projeto

| Módulo | Status |
|---|---|
| Autenticação | ✅ Completo |
| Cadastros (Carteiras, Favorecidos, Categorias, Subcategorias, Classificações) | ✅ Completo |
| Transações (CRUD, filtros, status) | ✅ Completo |
| Dashboard (métricas, gráficos) | ✅ Funcional |
| Módulo Financeiro (resumo) | ✅ Funcional |
| Perfil de usuário | ✅ Completo (ProfileSheet) |
| Isolamento de dados por usuário (RLS) | ✅ Completo |
| Investimentos | 🚧 Em desenvolvimento |
| Orçamentos | 🚧 Em desenvolvimento |
| Admin | 🚧 Em desenvolvimento |

---

*Gerado automaticamente em 2026-04-08 com base na análise do código-fonte do projeto.*
