import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
/**
 * AuthSkeleton: Mimics the 60/40 layout of Login/Signup screens
 */
export function AuthSkeleton({ mode = "login" }: { mode?: "login" | "signup" }) {
    const inputCount = mode === "signup" ? 4 : 2

    return (
        <div className="flex h-screen font-sans bg-background overflow-hidden">
            {/* Left Column: Form Area (60%) */}
            <div className="flex-1 md:w-[60%] md:flex-none flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-background relative">
                <div className="w-full flex flex-col items-center">
                    <div className="w-full max-w-[360px] flex flex-col items-center text-center">
                        <Skeleton className="h-12 w-12 rounded-xl mb-4 bg-muted" /> {/* Logo Box */}
                        <Skeleton className="h-8 w-32 mb-2 bg-muted" /> {/* Title */}
                        <Skeleton className="h-4 w-48 bg-muted" /> {/* Subtitle */}
                        <Separator className="mt-[24px] mb-[24px] w-full opacity-50" />
                    </div>

                    <div className="w-full max-w-[360px] space-y-6">
                        {Array.from({ length: inputCount }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20 bg-muted" /> {/* Label */}
                                <Skeleton className="h-11 w-full rounded-lg bg-muted/50" /> {/* Input */}
                            </div>
                        ))}

                        {/* Login Extra Row (Remember me + Forgot Password) */}
                        {mode === "login" && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded bg-muted" />
                                    <Skeleton className="h-3 w-24 bg-muted" />
                                </div>
                                <Skeleton className="h-3 w-28 bg-muted" />
                            </div>
                        )}

                        <Skeleton className="h-11 w-full rounded-lg mt-2 bg-muted/80" /> {/* Button */}

                        <div className="flex justify-center mt-4">
                            <Skeleton className="h-4 w-40 bg-muted" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Brand Area (40%) */}
            <div className="hidden md:flex md:flex-col md:w-[40%] relative m-4 rounded-[16px] overflow-hidden bg-neutral-950">
                {/* Brand Logo in top-left */}
                <div className="absolute top-8 left-8 z-20">
                    <Skeleton className="h-8 w-24 bg-neutral-800" />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-end px-8 pb-8 z-10 relative">
                    <div className="mb-12 space-y-4">
                        <Skeleton className="h-10 w-3/4 bg-neutral-800" />
                        <Skeleton className="h-10 w-2/3 bg-neutral-800" />
                        <Skeleton className="h-10 w-1/2 bg-neutral-800" />
                        <div className="pt-2">
                            <Skeleton className="h-5 w-full max-w-md bg-neutral-900" />
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div>
                        <Skeleton className="h-4 w-64 bg-neutral-900" />
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * TableSkeleton: Mimics the Transactions Data Table structure
 */
export function TransactionsTableSkeleton() {
    return (
        <div className="flex flex-col h-screen animate-pulse bg-background font-sans">
            <div className="max-w-[1440px] mx-auto px-8 w-full flex-1 flex flex-col pt-8 pb-8 gap-6 overflow-hidden">
                {/* Title Skeleton */}
                <div className="flex-none">
                    <Skeleton className="h-9 w-48 bg-neutral-800 rounded-xl mb-2" />
                    <Skeleton className="h-4 w-64 bg-neutral-800/50 rounded-lg" />
                </div>

                {/* Wrapper de Cards e Tabela */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                                <Skeleton className="h-4 w-24 mb-4 bg-neutral-800" />
                                <Skeleton className="h-8 w-32 bg-neutral-800" />
                            </div>
                        ))}
                    </div>

                    {/* Table Skeleton */}
                    <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
                        {/* Fake Header */}
                        <div className="h-14 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10 flex items-center px-6 gap-4">
                            <Skeleton className="h-4 w-48 bg-neutral-800" /> {/* Descrição */}
                            <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Contato */}
                            <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Categoria */}
                            <Skeleton className="h-4 w-24 bg-neutral-800" /> {/* Competencia */}
                            <Skeleton className="h-4 w-24 bg-neutral-800" /> {/* Data */}
                            <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Valor */}
                            <Skeleton className="h-4 w-24 ml-auto bg-neutral-800" /> {/* Status */}
                        </div>
                        {/* Fake Rows */}
                        <div className="flex-1 overflow-hidden divide-y divide-neutral-800">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-16 flex items-center px-6 gap-4">
                                    <Skeleton className="h-4 w-48 bg-neutral-800/50" />
                                    <Skeleton className="h-6 w-32 rounded-full bg-neutral-800/50" />
                                    <Skeleton className="h-6 w-32 rounded-full bg-neutral-800/50" />
                                    <Skeleton className="h-4 w-24 bg-neutral-800/50" />
                                    <Skeleton className="h-4 w-24 bg-neutral-800/50" />
                                    <Skeleton className="h-4 w-32 bg-neutral-800/50" />
                                    <Skeleton className="h-6 w-24 ml-auto rounded-full bg-neutral-800/50" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * SidebarSkeleton: Mimics navigation menu and user footer
 */
export function SidebarSkeleton() {
    return (
        <div className="h-full w-full flex flex-col p-4 space-y-6 bg-[#0a0a0a] border-r border-neutral-800">
            <Skeleton className="h-8 w-24 mb-4 bg-neutral-800" /> {/* Brand/Logo */}
            <div className="space-y-2 flex-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-2">
                        <Skeleton className="h-5 w-5 rounded-md bg-neutral-800" />
                        <Skeleton className="h-4 w-24 bg-neutral-800" />
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-neutral-800 flex items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-full bg-neutral-800" />
                <div className="space-y-1">
                    <Skeleton className="h-3 w-20 bg-neutral-800" />
                    <Skeleton className="h-3 w-16 bg-neutral-800" />
                </div>
            </div>
        </div>
    )
}

/**
 * TopbarSkeleton: Mimics high-level navigation and breadcrumbs
 */
export const TableSkeleton = TransactionsTableSkeleton

/**
 * TableContentSkeleton: Only the table part without search/header/cards
 */
export function TableContentSkeleton() {
    return (
        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative animate-pulse">
            {/* Fake Header */}
            <div className="h-14 bg-neutral-900 border-b border-neutral-800 flex items-center px-6 gap-4">
                <Skeleton className="h-4 w-48 bg-neutral-800" /> {/* Descrição */}
                <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Contato */}
                <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Categoria */}
                <Skeleton className="h-4 w-24 bg-neutral-800" /> {/* Competencia */}
                <Skeleton className="h-4 w-24 bg-neutral-800" /> {/* Data */}
                <Skeleton className="h-4 w-32 bg-neutral-800" /> {/* Valor */}
                <Skeleton className="h-4 w-24 ml-auto bg-neutral-800" /> {/* Status */}
            </div>
            {/* Fake Rows */}
            <div className="flex-1 overflow-hidden divide-y divide-neutral-800">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-16 flex items-center px-6 gap-4">
                        <Skeleton className="h-4 w-48 bg-neutral-800/50" />
                        <Skeleton className="h-6 w-32 rounded-full bg-neutral-800/50" />
                        <Skeleton className="h-6 w-32 rounded-full bg-neutral-800/50" />
                        <Skeleton className="h-4 w-24 bg-neutral-800/50" />
                        <Skeleton className="h-4 w-24 bg-neutral-800/50" />
                        <Skeleton className="h-4 w-32 bg-neutral-800/50" />
                        <Skeleton className="h-6 w-24 ml-auto rounded-full bg-neutral-800/50" />
                    </div>
                ))}
            </div>
        </div>
    )
}


/**
 * ModuleCardsSkeleton: Grid of card skeletons for modules like Cadastros
 */
export function ModuleCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[...Array(28)].map((_, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                            <Skeleton className="h-3 w-1/2 bg-neutral-800/50" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function TopbarSkeleton() {
    return (
        <div className="h-[72px] w-full border-b border-border flex items-center px-6 justify-between bg-card">
            <Skeleton className="h-4 w-32 bg-muted" /> {/* Breadcrumb */}
            <div className="flex items-center space-x-8">
                <Skeleton className="h-4 w-16 bg-muted" />
                <Skeleton className="h-4 w-20 bg-muted" />
                <Skeleton className="h-4 w-24 bg-muted" />
            </div>
            <div className="w-32" /> {/* Spacer */}
        </div>
    )
}
