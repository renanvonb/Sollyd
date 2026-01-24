"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVisibility } from "@/hooks/use-visibility-state"

interface SummaryTotals {
    income: number
    expense: number
    investment: number
    balance: number
}

interface TransactionSummaryCardsProps {
    totals: SummaryTotals
    isLoading: boolean
}

export function TransactionSummaryCards({ totals, isLoading }: TransactionSummaryCardsProps) {
    const { isVisible } = useVisibility()

    const formatValue = (value: number) => {
        if (!isVisible) return "R$ ••••"

        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const getPercentage = (value: number) => {
        if (totals.income === 0) return 0
        // Use absolute values to avoid negative percentages if logic changes
        return Math.round((Math.abs(value) / totals.income) * 100)
    }

    const cards = [
        {
            label: "Receitas",
            value: totals.income,
            icon: ArrowUpRight,
            color: "text-muted-foreground",
            bgIcon: "bg-muted",
            hoverGradient: "from-accent/20",
            hasBadge: false,
        },
        {
            label: "Despesas",
            value: totals.expense,
            icon: ArrowDownRight,
            color: "text-muted-foreground",
            bgIcon: "bg-muted",
            hoverGradient: "from-accent/20",
            hasBadge: true,
        },
        {
            label: "Investimentos",
            value: totals.investment,
            icon: TrendingUp,
            color: "text-muted-foreground",
            bgIcon: "bg-muted",
            hoverGradient: "from-accent/20",
            hasBadge: true,
        },
        {
            label: "Saldo Total",
            value: totals.balance,
            icon: Wallet,
            color: "text-muted-foreground",
            bgIcon: "bg-muted",
            hoverGradient: "from-accent/20",
            hasBadge: true,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className={cn(
                        "group relative overflow-hidden border-border bg-card rounded-lg pl-6 pr-5 py-5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1",
                        isLoading && "pointer-events-none"
                    )}
                >

                    <div className="relative z-10 flex flex-col gap-4">
                        {/* Header: Label (Left) + Icon (Right) */}
                        <div className="flex items-start justify-between">
                            <span className="text-muted-foreground font-semibold font-sans tracking-tight text-sm mt-1">
                                {card.label}
                            </span>
                            <div className={cn("p-2 rounded-full transition-transform duration-300 group-hover:scale-110", "bg-muted")}>
                                <card.icon className={cn("h-5 w-5", "text-muted-foreground")} />
                            </div>
                        </div>

                        {/* Content: Value + Badge */}
                        <div className="flex items-end gap-3">
                            {isLoading ? (
                                <Skeleton className="h-8 w-32 bg-muted" />
                            ) : (
                                <div className="text-2xl font-bold tracking-tight font-sans text-foreground">
                                    {formatValue(card.value)}
                                </div>
                            )}

                            {/* Percentage Badge */}
                            {!isLoading && card.hasBadge && isVisible && (
                                <Badge
                                    variant="secondary"
                                    className="mb-1 pointer-events-none bg-muted text-muted-foreground hover:bg-muted/80"
                                >
                                    {getPercentage(card.value)}%
                                </Badge>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
