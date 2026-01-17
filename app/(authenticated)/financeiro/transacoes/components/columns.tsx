"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"
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
            const type = row.original.type as keyof typeof typeIconMap
            const { icon: Icon, color } = typeIconMap[type]

            return (
                <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-medium">{row.getValue("description")}</span>
                </div>
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
                <Badge variant="secondary" className="text-sm font-normal">{name}</Badge>
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
                <Badge variant="secondary" className="text-sm font-normal">{category}</Badge>
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
            return <div className="text-sm">{`${month}/${year}`}</div>
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
        header: () => <div className="w-[120px]">Status</div>,
        cell: ({ row }) => {
            // Prioritize persisted status, then fallback to payment_date check
            const statusStr = row.original.status
            const isPaid = !!row.original.date

            let status: "Pendente" | "Realizado" | "Agendado" | "Atrasado" = "Pendente"

            if (statusStr === 'Realizado' || statusStr === 'paid' || isPaid) {
                status = "Realizado"
            } else if (statusStr === 'Pendente' || statusStr === 'pending') {
                status = "Pendente"
            } else if (statusStr === 'Agendado') {
                status = "Agendado"
            } else if (statusStr === 'Atrasado') {
                status = "Atrasado"
            }

            return (
                <div className="w-[120px]">
                    <StatusIndicator status={status} />
                </div>
            )
        },
    },
]
