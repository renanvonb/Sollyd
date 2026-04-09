# Sollyd — Prompt de Responsividade Mobile
> **Projeto:** Sollyd · Next.js 14 + Supabase  
> **Gerado em:** 2026-04-08  
> **Destino:** Antigravity (agente de código)

---

Preciso implementar responsividade completa para dispositivos móveis (foco em smartphones) no projeto Sollyd — uma aplicação Next.js 14 com App Router, Tailwind CSS, shadcn/ui (Radix UI) e sidebar customizada em `components/app-sidebar.tsx`.

O objetivo é que todas as funcionalidades críticas sejam plenamente utilizáveis em telas de 375px a 430px de largura (iPhone SE ao iPhone Pro Max), sem quebrar o layout desktop existente.

---

## 1. SIDEBAR — Comportamento Mobile

### Problema atual
A sidebar (`components/app-sidebar.tsx`) é colapsável entre modo expandido e modo ícones, mas em mobile deve ser completamente oculta e aberta como um Sheet (Radix UI / shadcn).

### O que fazer

**No hook `hooks/use-sidebar-state.tsx`:**
- Adicionar detecção de breakpoint mobile usando `useMediaQuery` ou `window.innerWidth < 768` com listener de resize.
- Exportar um estado `isMobile: boolean` além do estado atual de colapso.
- Em mobile, o estado de "collapsed" não deve ser aplicado — a sidebar deve simplesmente não existir no DOM fora do Sheet.

**No componente `components/app-sidebar.tsx`:**
- Ao detectar `isMobile === true`, renderizar `null` no lugar da sidebar fixa.
- Criar (ou adaptar) um componente `<MobileSidebarSheet>` que:
  - Use o componente `Sheet` do shadcn/ui (`components/ui/sheet.tsx`) com `side="left"`.
  - Contenha exatamente o mesmo menu de navegação, avatar e logo que a sidebar desktop.
  - Feche automaticamente ao clicar em qualquer item de navegação (usar `useRouter` + `useEffect` ou `SheetClose` envolto nos links).
  - Tenha `SheetTrigger` conectado ao botão de hambúrguer no header mobile.

**No layout `app/(main)/layout.tsx`:**
- Em mobile, renderizar o `<MobileSidebarSheet>` no topo, fora do fluxo da sidebar fixa.
- Garantir que o conteúdo principal ocupe `w-full` em mobile (sem margin-left da sidebar).

---

## 2. HEADER MOBILE — Barra Superior

**No componente `components/page-header.tsx` (ou `components/dashboard-header.tsx`):**
- Em mobile (`md:hidden` / `flex md:hidden`), exibir uma topbar com:
  - **Esquerda:** Botão hambúrguer (`Menu` do Lucide) que abre o `MobileSidebarSheet`.
  - **Centro:** Logo "Sollyd" (texto ou símbolo).
  - **Direita:** Botão de toggle de visibilidade de valores + avatar do usuário (abre ProfileSheet).
- Em desktop, manter o header atual sem alterações.
- A topbar mobile deve ter `position: sticky; top: 0; z-index: 50` com fundo do tema (`bg-background border-b`).

---

## 3. DASHBOARD — Cards e Gráficos Mobile

**Em `components/dashboard-client.tsx` e `components/transaction-summary-cards.tsx`:**

### Cards de resumo (Receitas, Despesas, Saldo)
- Atualmente provavelmente em grid de 3 colunas — ajustar para:
  - Mobile: `grid-cols-1` ou `grid-cols-2` (saldo em largura total na segunda linha se necessário).
  - Tablet (md): `grid-cols-3`.
- Reduzir padding interno dos cards em mobile (`p-4` ao invés de `p-6`).
- Garantir que os valores monetários não transbordem — usar `truncate` ou `text-sm` em mobile.

### Filtros de data e carteira
- Em `components/date-filter-picker.tsx`: em mobile, o DatePicker deve abrir em um Sheet ou Dialog em vez de Popover (Popover pode sair da tela).
- Filtros de carteira: exibir como horizontal scroll (`overflow-x-auto flex gap-2 flex-nowrap`) em mobile, evitando quebra de linha.

### Gráficos (`components/dashboard-graphs.tsx` e `components/charts/`)
- Definir `height` fixo menor em mobile (ex: `h-48` mobile, `h-72` desktop) usando classes responsivas.
- Para gráficos Recharts: usar `<ResponsiveContainer width="100%" height="100%">` — verificar se já está implementado; se não, envolver todos os gráficos nisso.
- Esconder legendas muito longas em mobile ou exibi-las abaixo do gráfico em coluna.
- Reduzir `fontSize` dos labels dos eixos em mobile via prop `tick={{ fontSize: 11 }}`.

---

## 4. TABELA DE TRANSAÇÕES — Adaptação Mobile

**Em `components/transaction-table.tsx` e `components/transactions-client.tsx`:**

A tabela de 10+ colunas é inutilizável em mobile com scroll horizontal. Implementar visualização adaptada:

### Estratégia: Card List em mobile, Table em desktop
- Usar `hidden md:block` na `<table>` existente.
- Criar um componente `<TransactionMobileList>` visível apenas em mobile (`block md:hidden`):
  - Cada transação renderizada como um card com:
    - **Linha 1:** Descrição (bold, truncada) + Valor (colorido: verde para Receita, vermelho para Despesa).
    - **Linha 2:** Badge de Tipo + Badge de Status + Data formatada (`dd/MM/yyyy`).
    - **Linha 3 (opcional):** Favorecido + Categoria (badges menores).
  - **Ações:** Botão `...` (MoreHorizontal) que abre um `DropdownMenu` com as ações: Editar, Marcar como Pago, Marcar como Pendente, Excluir.
  - Separador entre cards (`Separator` do shadcn/ui).

### Filtros mobile (`components/transaction-filters.tsx`)
- Colapsar todos os filtros atrás de um botão "Filtros" com ícone `SlidersHorizontal` que abre um Sheet lateral ou um Accordion.
- Campo de busca (search) deve ficar sempre visível em mobile, abaixo da topbar.
- Botão "Nova Transação" deve estar sempre visível — posicioná-lo como botão flutuante (FAB) em mobile:

```
position: fixed; bottom: 24px; right: 24px; z-index: 40;
```

Usar classe Tailwind: `fixed bottom-6 right-6 z-40 rounded-full shadow-lg`.

---

## 5. FORMULÁRIO DE TRANSAÇÃO — Mobile

**Em `components/transaction-form.tsx`:**

O formulário é aberto provavelmente em um Dialog. Em mobile:
- O `Dialog` deve ter `max-h-[90vh] overflow-y-auto` para ser scrollável.
- Ou alternativamente, em mobile usar um `Sheet` com `side="bottom"` em vez de Dialog central (bottom sheet é mais natural no mobile).
- Implementar detecção: se `isMobile`, renderizar `<Sheet side="bottom">`, senão `<Dialog>`.
- Dentro do formulário:
  - Campos em `grid-cols-1` em mobile (atualmente podem estar em 2 colunas).
  - Selects de categoria/subcategoria/favorecido: garantir altura mínima de `44px` (touch target).
  - DatePicker de data e competência: usar Sheet ou Dialog em mobile.
  - Botões de submit com `w-full` em mobile.

---

## 6. CADASTROS — Página Mobile

**Em `app/(main)/(authenticated)/cadastros/` e `components/cadastros/`:**

- Tabs de navegação entre Carteiras / Favorecidos / Categorias / Classificações:
  - Em mobile, se as tabs não couberem horizontalmente, usar scroll horizontal (`overflow-x-auto`) ou transformar em select/dropdown.
- Listas/tabelas de cada entidade: aplicar o mesmo padrão de card list usado nas transações.
- Botão "Novo" de cada seção: FAB fixo no canto inferior direito em mobile.
- Dialogs de criação/edição: mesma lógica de Sheet bottom em mobile.

---

## 7. AJUSTES GLOBAIS DE LAYOUT

**Em `app/(main)/layout.tsx` ou no layout raiz:**

O wrapper principal deve seguir a estrutura abaixo:

```tsx
<div className="flex h-screen overflow-hidden">
  {/* Sidebar — renderiza null em mobile */}
  <AppSidebar />

  <main className="flex-1 overflow-y-auto w-full">
    {/* Topbar visível apenas em mobile */}
    <MobileTopbar className="flex md:hidden" />

    {children}
  </main>
</div>
```

- Garantir `overflow-y-auto` no `<main>` para scroll do conteúdo sem scroll no body.
- Padding do conteúdo: `px-4 md:px-6 lg:px-8` — evitar padding excessivo em mobile.

**Em `components/page-shell.tsx`:**
- Ajustar o `max-w` e padding para mobile: `px-4 py-4 md:px-6 md:py-6`.

---

## 8. TOUCH E ACESSIBILIDADE

- Todos os botões interativos devem ter mínimo de `44x44px` de área de toque. Usar `min-h-[44px] min-w-[44px]` onde necessário.
- Inputs e Selects: `h-11` (44px) em mobile para facilitar toque.
- Remover `hover:` states que não fazem sentido em touch — usar apenas via `@media (hover: hover)` se possível com Tailwind `[@media(hover:hover)]:hover:`.
- Garantir que `focus-visible` esteja visível para acessibilidade com teclado virtual.

---

## 9. BREAKPOINTS DE REFERÊNCIA

Usar os breakpoints padrão Tailwind já configurados no projeto:

| Breakpoint | Largura | Uso |
|---|---|---|
| _(default)_ | 0px+ | Mobile first — smartphones |
| `sm` | 640px+ | Smartphones grandes / landscape |
| `md` | 768px+ | **Principal divisor mobile/desktop** |
| `lg` | 1024px+ | Tablets landscape / laptops |
| `xl` | 1280px+ | Desktops |

Toda lógica mobile deve usar `< md` (abaixo de 768px) como referência.

---

## 10. ORDEM DE IMPLEMENTAÇÃO SUGERIDA

Seguir esta sequência para evitar dependências quebradas:

1. `hooks/use-sidebar-state.tsx` — adicionar `isMobile`.
2. `components/app-sidebar.tsx` — lógica de Sheet mobile + `MobileSidebarSheet`.
3. `app/(main)/layout.tsx` — topbar mobile + estrutura flex correta.
4. `components/transaction-summary-cards.tsx` — grid responsivo dos cards.
5. `components/dashboard-graphs.tsx` — altura e responsividade dos gráficos.
6. `components/transaction-table.tsx` + `<TransactionMobileList>` — card list mobile.
7. `components/transaction-filters.tsx` — colapso de filtros + FAB.
8. `components/transaction-form.tsx` — Sheet bottom em mobile.
9. `components/cadastros/` — cards + FAB + Sheet bottom.
10. `components/page-shell.tsx` e paddings globais.

---

## RESTRIÇÕES IMPORTANTES

- ❌ Não alterar nenhuma lógica de Server Actions, queries Supabase ou validações Zod.
- ❌ Não alterar o schema do banco de dados.
- ❌ Não instalar novas dependências — usar apenas o que já está no projeto: shadcn/ui Sheet, Dialog, DropdownMenu, Radix UI primitives, Lucide icons, Tailwind CSS.
- ✅ Manter 100% da funcionalidade desktop existente — as alterações são aditivas com classes responsivas Tailwind.
- ✅ Preservar o design system: cores `#0a0a0a`, `#262626`, `#E0FE56`, tipografia Inter + Plus Jakarta Sans.
- ✅ Todos os componentes novos devem seguir o padrão shadcn/ui existente no projeto.

---

## ⚠️ REGRA CRÍTICA — PRESERVAÇÃO TOTAL DO LAYOUT DESKTOP

**Nenhuma alteração realizada para mobile deve impactar, modificar ou degradar a experiência visual e funcional na versão desktop (viewport ≥ 768px).**

### Princípios obrigatórios

1. **Mobile-first aditivo, nunca destrutivo.** Todo ajuste deve ser implementado usando classes Tailwind sem prefixo (que aplicam ao mobile) contrabalançadas obrigatoriamente por classes com prefixo `md:` que restauram o comportamento desktop original. Exemplo correto:
   ```html
   <!-- ✅ Correto: mobile em coluna, desktop em linha (sem quebrar desktop) -->
   <div class="flex-col md:flex-row">

   <!-- ❌ Errado: alterou o comportamento sem preservar o desktop -->
   <div class="flex-col">
   ```

2. **Componentes exclusivos de mobile devem usar `md:hidden`.** Qualquer elemento criado especificamente para mobile (topbar, FAB, card list de transações, filtro colapsado) deve ter a classe `md:hidden` para garantir que nunca apareça em desktop.

3. **Componentes exclusivos de desktop devem usar `hidden md:block` (ou `md:flex`, `md:grid`).** A tabela de transações, a sidebar fixa e quaisquer elementos que já existam apenas para desktop devem ser ocultados em mobile via `hidden` e reexibidos com o prefixo `md:`.

4. **Não modificar classes CSS existentes sem adicionar o prefixo `md:` correspondente.** Se uma classe atual de um componente for alterada para corrigir o mobile, a versão desktop deve ser explicitamente preservada na mesma linha. Nunca remover ou substituir uma classe sem garantir que o desktop continue funcionando.

5. **Novos componentes mobile são paralelos, não substitutos.** A estratégia correta é criar um componente alternativo para mobile e exibi-lo condicionalmente, mantendo o componente desktop original intacto. Exemplo:
   ```tsx
   {/* Tabela original — intacta, visível apenas em desktop */}
   <div className="hidden md:block">
     <TransactionTable ... />
   </div>

   {/* Card list — novo, visível apenas em mobile */}
   <div className="block md:hidden">
     <TransactionMobileList ... />
   </div>
   ```

6. **Proibido alterar estrutura JSX de componentes que funcionam corretamente em desktop** sem aprovação explícita. Refatorações estruturais que afetem o layout geral (ex: mudar `flex` para `grid` em um wrapper compartilhado) devem ser avaliadas com extremo cuidado e sempre testadas em ambos os viewports.

7. **Após cada alteração, validar visualmente em desktop (≥ 1280px) e mobile (375px).** Nenhuma implementação está concluída sem essa verificação dupla.
