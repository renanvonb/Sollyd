"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, PieChart } from "lucide-react"
import { useVisibility } from "@/hooks/use-visibility-state"
import { Transaction } from "@/types/transaction"

const typeIconMap = {
    revenue: { icon: ArrowUpCircle, color: "text-emerald-600" },
    expense: { icon: ArrowDownCircle, color: "text-rose-600" },

}

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "description",
        header: () => <div className="min-w-[200px]">Descrição</div>,
        cell: ({ row }) => {
            return (
                <span className="text-sm font-medium">{row.getValue("description")}</span>
            )
        },
    },
    {
        id: "contact",
        accessorFn: (row) => row.payees?.name || row.payers?.name,
        header: () => <div className="min-w-[150px]">Contato</div>,
        cell: ({ row }) => {
            const name = row.original.payees?.name || row.original.payers?.name
            return name ? (
                <Badge variant="secondary">{name}</Badge>
            ) : (
                <span className="text-sm text-muted-foreground">-</span>
            )
        },
    },
    {
        id: "category",
        accessorFn: (row) => row.categories?.name,
        header: () => <div className="min-w-[150px]">Categoria</div>,
        cell: ({ row }) => {
            const category = row.original.categories?.name
            return category ? (
                <Badge variant="secondary">{category}</Badge>
            ) : (
                <span className="text-sm text-muted-foreground">-</span>
            )
        },
    },
    {
        accessorKey: "competence",
        header: () => <div className="min-w-[100px]">Competência</div>,
        cell: ({ row }) => {
            const comp = row.original.competence as string | null
            if (!comp) return <span className="text-sm text-muted-foreground">-</span>
            const [year, month] = comp.split("-")
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            const monthIndex = parseInt(month) - 1
            return <div className="text-sm">{`${monthNames[monthIndex]}/${year}`}</div>
        },
    },
    {
        accessorKey: "date",
        header: () => <div className="min-w-[100px]">Data</div>,
        cell: ({ row }) => {
            const date = row.getValue("date") as string | null
            if (!date) return <span className="text-sm text-muted-foreground">-</span>
            const [year, month, day] = date.split("-")
            return <div className="text-sm">{`${day}/${month}/${year}`}</div>
        },
    },
    {
        accessorKey: "amount",
        header: "Valor",
        cell: function AmountCell({ row }) {
            const { isVisible } = useVisibility()
            const amount = parseFloat(row.getValue("amount"))
            const type = row.original.type

            const formatted = isVisible
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount)
                : "R$ ••••"

            const colorClass = type === "revenue"
                ? "text-emerald-600"
                : "text-rose-600"

            return (
                <div className={`text-sm font-semibold min-w-[120px] ${colorClass}`}>
                    {formatted}
                </div>
            )
        },
    },
    {
        id: "status",
        header: () => <div className="w-[80px]">Status</div>,
        cell: ({ row }) => {
            const statusValue = row.original.status || "Pendente"
            const dateStr = row.original.date

            // Logic to refine status based on date if it's currently "Pendente"
            let refinedStatus: "Pendente" | "Realizado" | "Agendado" | "Atrasado" = statusValue as any

            if (statusValue === "Pendente" && dateStr) {
                const today = new Date().toISOString().split('T')[0]
                if (dateStr > today) {
                    refinedStatus = "Agendado"
                } else if (dateStr < today) {
                    refinedStatus = "Atrasado"
                }
            } else if (statusValue === "Realizado") {
                refinedStatus = "Realizado"
            }

            const styles = {
                Realizado: "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/20",
                Agendado: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-500 hover:bg-blue-500/20",
                Atrasado: "border-transparent bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-500/20",
                Pendente: "border-transparent bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/20",
            }

            return (
                <div className="w-[80px]">
                    <Badge variant="outline" className={styles[refinedStatus]}>
                        {refinedStatus}
                    </Badge>
                </div>
            )
        },
    },
]
