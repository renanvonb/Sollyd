"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useVisibility } from "@/hooks/use-visibility-state"
import { Transaction } from "@/types/transaction"
import { cn } from "@/lib/utils"
import { HighlightText } from "@/components/ui/highlight-text"

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "description",
        header: () => <div className="min-w-[200px]">Descrição</div>,
        cell: ({ row, table }) => {
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            return (
                <div className="flex items-center gap-2 max-w-[300px]">
                    <span className="text-sm font-medium truncate">
                        <HighlightText
                            text={row.getValue("description")}
                            highlight={searchQuery}
                        />
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "type",
        header: () => <div className="min-w-[100px]">Tipo</div>,
        cell: ({ row, table }) => {
            const typeValue = row.getValue("type") as string
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            const config = {
                revenue: {
                    label: "Receita",
                    className: "bg-green-50 text-green-700 hover:bg-green-50/80 dark:bg-green-900/30 dark:text-green-400"
                },
                expense: {
                    label: "Despesa",
                    className: "bg-red-50 text-red-700 hover:bg-red-50/80 dark:bg-red-900/30 dark:text-red-400"
                },
                investment: {
                    label: "Investimento",
                    className: "bg-blue-50 text-blue-700 hover:bg-blue-50/80 dark:bg-blue-900/30 dark:text-blue-400"
                }
            }[typeValue] || {
                label: typeValue,
                className: "bg-zinc-50 text-zinc-700 hover:bg-zinc-50/80 dark:bg-zinc-900/30 dark:text-zinc-400"
            }

            return (
                <Badge className={cn("font-medium border-none shadow-none", config.className)}>
                    <HighlightText text={config.label} highlight={searchQuery} />
                </Badge>
            )
        }
    },
    {
        id: "payee",
        accessorFn: (row) => row.payees?.name,
        header: () => <div className="min-w-[150px]">Favorecido</div>,
        cell: ({ row, table }) => {
            const payee = row.original.payees?.name
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            return payee ? (
                <Badge variant="secondary" className="text-xs font-normal whitespace-nowrap shadow-none">
                    <HighlightText text={payee} highlight={searchQuery} />
                </Badge>
            ) : (
                <span className="text-sm text-muted-foreground">-</span>
            )
        },
    },
    {
        id: "category",
        accessorFn: (row) => row.categories?.name,
        header: () => <div className="min-w-[150px]">Categoria</div>,
        cell: ({ row, table }) => {
            const category = row.original.categories?.name
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            return category ? (
                <Badge variant="secondary" className="text-xs font-normal whitespace-nowrap shadow-none">
                    <HighlightText text={category} highlight={searchQuery} />
                </Badge>
            ) : (
                <span className="text-sm text-muted-foreground">-</span>
            )
        },
    },
    {
        accessorKey: "competence",
        header: () => <div className="min-w-[100px]">Competência</div>,
        cell: ({ row, table }) => {
            const comp = row.original.competence as string | null
            if (!comp) return <span className="text-sm text-muted-foreground">-</span>
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            const [year, month] = comp.split("-")
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            const monthIndex = parseInt(month) - 1
            const formatted = `${monthNames[monthIndex]}/${year}`
            return <div className="text-sm tabular-nums text-muted-foreground">
                <HighlightText text={formatted} highlight={searchQuery} />
            </div>
        },
    },
    {
        accessorKey: "date",
        header: () => <div className="min-w-[100px]">Data</div>,
        cell: ({ row, table }) => {
            const date = row.getValue("date") as string | null
            if (!date) return <span className="text-sm text-muted-foreground">-</span>
            const searchQuery = (table.options.meta as any)?.searchQuery || ""
            const [year, month, day] = date.split("-")
            const formatted = `${day}/${month}/${year}`
            return <div className="text-sm tabular-nums text-muted-foreground">
                <HighlightText text={formatted} highlight={searchQuery} />
            </div>
        },
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-left min-w-[140px]">Valor</div>,
        cell: ({ row, table }) => {
            const { isVisible } = useVisibility()
            const amount = parseFloat(row.getValue("amount"))
            const type = row.original.type
            const searchQuery = (table.options.meta as any)?.searchQuery || ""

            const formatted = isVisible
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount)
                : "R$ ••••"

            const colorClass = type === "revenue"
                ? "text-green-600"
                : type === "expense"
                    ? "text-red-600"
                    : "text-blue-600"

            return (
                <div className={`text-sm font-semibold text-left tabular-nums ${colorClass}`}>
                    <HighlightText text={formatted} highlight={searchQuery} />
                </div>
            )
        },
    },
    {
        id: "status",
        header: () => <div className="w-[72px]">Status</div>,
        cell: ({ row, table }) => {
            const statusValue = row.original.status || "Pendente"
            const dateStr = row.original.date
            const searchQuery = (table.options.meta as any)?.searchQuery || ""

            let refinedStatus: "Pendente" | "Realizado" | "Agendado" | "Atrasado" = statusValue as any

            if (statusValue === "Pendente" && dateStr) {
                const today = new Date().toISOString().split('T')[0]
                if (dateStr > today) {
                    refinedStatus = "Agendado"
                } else if (dateStr < today) {
                    refinedStatus = "Atrasado"
                }
            }

            const config = {
                Realizado: {
                    className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50/80 dark:bg-emerald-900/30 dark:text-emerald-400"
                },
                Agendado: {
                    className: "bg-blue-50 text-blue-700 hover:bg-blue-50/80 dark:bg-blue-900/30 dark:text-blue-400"
                },
                Atrasado: {
                    className: "bg-rose-50 text-rose-700 hover:bg-rose-50/80 dark:bg-rose-900/30 dark:text-rose-400"
                },
                Pendente: {
                    className: "bg-amber-50 text-amber-700 hover:bg-amber-50/80 dark:bg-amber-900/30 dark:text-amber-400"
                }
            }[refinedStatus] || {
                className: "bg-zinc-50 text-zinc-700 hover:bg-zinc-50/80 dark:bg-zinc-900/30 dark:text-zinc-400"
            }

            return (
                <div className="w-[72px]">
                    <Badge className={cn("font-medium border-none shadow-none", config.className)}>
                        <HighlightText text={refinedStatus} highlight={searchQuery} />
                    </Badge>
                </div>
            )
        },
    },
]
