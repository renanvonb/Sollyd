'use client'

import { useSidebar } from '@/hooks/use-sidebar-state'
import { cn } from '@/lib/utils'

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isOpen } = useSidebar()

    return (
        <main
            className={cn(
                "flex-1 transition-[margin] duration-300 ease-in-out flex flex-col h-screen overflow-y-hidden overflow-x-visible animate-in fade-in slide-in-from-bottom-4 duration-500",
                isOpen ? "ml-64" : "ml-0 md:ml-20"
            )}
        >
            {children}
        </main>
    )
}
