# 📐 Componente TopBar - Guia de Uso

## 📋 Visão Geral

O componente `TopBar` é um componente reutilizável que padroniza o cabeçalho superior de todas as páginas do sistema Sollyd.

## 🎯 Características

- ✅ **Ícone de Menu** + Nome do módulo (esquerda)
- ✅ **Tabs centralizadas** (centro)
- ✅ **Ícones de ação** (direita)
- ✅ **Variantes**: `default` e `simple`
- ✅ **Customizável**: Permite conteúdo customizado

## 📦 Localização

```
components/ui/top-bar.tsx
```

## 🔧 Props

```typescript
interface TopBarProps {
    /** Nome do módulo (ex: "Financeiro", "Cadastros") */
    moduleName: string;
    
    /** Tabs para navegação */
    tabs?: Tab[];
    
    /** Tab ativa atual */
    activeTab?: string;
    
    /** Callback quando uma tab é clicada */
    onTabChange?: (tabId: string) => void;
    
    /** Variante do top bar */
    variant?: 'default' | 'simple';
    
    /** Conteúdo customizado no centro (substitui tabs) */
    centerContent?: ReactNode;
    
    /** Conteúdo customizado na direita (substitui ícones padrão) */
    rightContent?: ReactNode;
}
```

## 💡 Exemplos de Uso

### 1. Uso Básico (Cadastros)

```typescript
import { TopBar } from '@/components/ui/top-bar';

const tabs = [
    { id: 'carteiras', label: 'Carteiras' },
    { id: 'categorias', label: 'Categorias' },
];

export default function CadastrosPage() {
    const [activeTab, setActiveTab] = useState('carteiras');

    return (
        <div>
            <TopBar
                moduleName="Cadastros"
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="simple"
            />
            {/* Conteúdo da página */}
        </div>
    );
}
```

### 2. Uso com Conteúdo Customizado

```typescript
<TopBar
    moduleName="Financeiro"
    centerContent={
        <div className="flex gap-2">
            <Button>Dashboard</Button>
            <Button>Relatórios</Button>
        </div>
    }
/>
```

### 3. Uso com Ícones Customizados

```typescript
<TopBar
    moduleName="Configurações"
    rightContent={
        <div className="flex gap-2">
            <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
            </Button>
        </div>
    }
/>
```

### 4. Sem Tabs (Apenas Header)

```typescript
<TopBar
    moduleName="Dashboard"
/>
```

## 🎨 Variantes

### `default`
- Tabs com padding padrão (`px-4`)
- Ideal para módulos principais

### `simple`
- Tabs com padding reduzido (`px-3`)
- Ideal para muitas tabs (ex: Cadastros)

## 📐 Estrutura Visual

```
┌─────────────────────────────────────────────────────────┐
│ [Menu] Módulo        [Tab1] [Tab2] [Tab3]      [🔍][☀][🔔] │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Migração de Páginas Existentes

### Antes (Código Duplicado)

```typescript
<div className="bg-white border-b border-zinc-200">
    <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
                <Menu className="h-5 w-5 text-zinc-400" />
                <span>Financeiro</span>
            </div>
            {/* Tabs... */}
        </div>
    </div>
</div>
```

### Depois (Usando TopBar)

```typescript
<TopBar
    moduleName="Financeiro"
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={setActiveTab}
/>
```

## 📝 Checklist de Implementação

Ao adicionar TopBar em um novo módulo:

- [ ] Importar o componente: `import { TopBar } from '@/components/ui/top-bar'`
- [ ] Definir as tabs (se houver)
- [ ] Criar estado para tab ativa
- [ ] Adicionar TopBar no topo da página
- [ ] Escolher variante apropriada
- [ ] Remover código duplicado do top bar antigo

## 🎯 Módulos que Devem Usar TopBar

- ✅ **Cadastros** - Implementado com `variant="simple"`
- ⏳ **Financeiro/Transações** - Pendente
- ⏳ **Financeiro/Dashboard** - Pendente
- ⏳ **Investimentos** - Pendente
- ⏳ **Outros módulos futuros**

## 🔍 Detalhes Técnicos

### Altura
- Altura fixa: `h-14` (56px)
- Alinhamento vertical: `items-center`

### Responsividade
- Container: `max-w-[1440px] mx-auto px-8`
- Tabs centralizadas: `absolute left-1/2 -translate-x-1/2`

### Cores
- Background: `bg-white`
- Border: `border-b border-zinc-200`
- Tab ativa: `text-zinc-950` + borda inferior
- Tab inativa: `text-zinc-500` com hover `text-zinc-900`

### Fontes
- Tabs: `font-inter text-sm font-medium`
- Nome do módulo: `text-sm font-medium text-zinc-600`

## 🚨 Importante

- **Não modifique** o componente TopBar diretamente para casos específicos
- Use as props `centerContent` e `rightContent` para customizações
- Mantenha a consistência visual entre módulos
- A linha da tab ativa deve sempre estar na **borda inferior** do top bar

---

**Desenvolvido para o Sistema Sollyd** 🚀
