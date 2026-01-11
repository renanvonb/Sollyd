'use client';

import { PanelLeftClose, PanelLeftOpen, Eye, Sun, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useSidebar } from '@/hooks/use-sidebar-state';
import { Button } from '@/components/ui/button';

interface Tab {
    id: string;
    label: string;
}

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
    /** Se true, mostra o nome da tab ativa ao invés do módulo */
    showActiveTabName?: boolean;
}

export function TopBar({
    moduleName,
    tabs = [],
    activeTab,
    onTabChange,
    variant = 'default',
    centerContent,
    rightContent,
    showActiveTabName = false,
}: TopBarProps) {
    const { isOpen, toggle } = useSidebar();

    // Encontra o nome da tab ativa
    const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || moduleName;
    const displayName = showActiveTabName ? activeTabLabel : moduleName;

    return (
        <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md h-16 flex-none font-sans">
            <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between w-full">

                {/* Left: Sidebar Toggle + Module/Tab Name */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggle}
                        className="text-zinc-400 hover:text-zinc-950 transition-all flex-none"
                        title={isOpen ? "Recolher Sidebar" : "Expandir Sidebar"}
                    >
                        {isOpen ? (
                            <PanelLeftClose className="h-5 w-5" />
                        ) : (
                            <PanelLeftOpen className="h-5 w-5" />
                        )}
                    </Button>

                    <span className="text-sm font-medium text-zinc-950 font-inter">
                        {displayName}
                    </span>
                </div>

                {/* Center: Tabs or Custom Content */}
                <div className="flex items-center justify-center">
                    {centerContent ? (
                        centerContent
                    ) : tabs.length > 0 ? (
                        <nav className="flex items-center gap-6 h-full">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => onTabChange?.(tab.id)}
                                        className={cn(
                                            'relative h-16 flex items-center px-1 text-sm font-medium transition-colors border-b-2 font-inter',
                                            variant === 'simple' && 'px-3',
                                            isActive
                                                ? 'text-zinc-950 border-zinc-950'
                                                : 'text-zinc-500 border-transparent hover:text-zinc-950'
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    ) : null}
                </div>

                {/* Right: Icons or Custom Content */}
                {rightContent ? (
                    rightContent
                ) : (
                    <div className="flex items-center gap-3 justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Visibilidade"
                            className="text-zinc-400 hover:text-zinc-950 rounded-full"
                        >
                            <Eye className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Alternar Tema"
                            className="text-zinc-400 hover:text-zinc-950 rounded-full"
                        >
                            <Sun className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Notificações"
                            className="text-zinc-400 hover:text-zinc-950 rounded-full"
                        >
                            <Bell className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
