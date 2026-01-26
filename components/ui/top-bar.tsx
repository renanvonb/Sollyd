'use client';

import { PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Sun, Bell, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useSidebar } from '@/hooks/use-sidebar-state';
import { useVisibility } from '@/hooks/use-visibility-state';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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
    const { isVisible, toggleVisibility } = useVisibility();
    const { setTheme, theme } = useTheme()

    // Encontra o nome da tab ativa
    const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || moduleName;
    const displayName = showActiveTabName ? activeTabLabel : moduleName;

    return (
        <TooltipProvider delayDuration={300}>
            <header className="sticky top-0 z-30 w-[calc(100%+16px)] -ml-4 pl-4 border-b border-border bg-card dark:bg-[#0a0a0a] h-[72px] flex-none font-sans transition-colors duration-200">
                <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between w-full">

                    {/* Left: Sidebar Toggle + Module/Tab Name */}
                    <div className="flex items-center gap-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggle}
                                    className="text-muted-foreground hover:text-foreground transition-all flex-none"
                                >
                                    {isOpen ? (
                                        <PanelLeftClose className="h-5 w-5" />
                                    ) : (
                                        <PanelLeftOpen className="h-5 w-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isOpen ? "Recolher" : "Expandir"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <span className="text-sm font-medium text-foreground font-inter">
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
                                                'relative h-[72px] flex items-center px-1 text-sm font-medium transition-colors border-b-2 font-inter',
                                                variant === 'simple' && 'px-3',
                                                isActive
                                                    ? 'text-primary border-primary'
                                                    : 'text-muted-foreground border-transparent hover:text-primary/70'
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-foreground"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isVisible ? "Ocultar valores" : "Mostrar valores"}</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-foreground"
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    >
                                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Alternar tema</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Alternar tema</p>
                                </TooltipContent>
                            </Tooltip>


                        </div>
                    )}
                </div>
            </header>
        </TooltipProvider>
    );
}
