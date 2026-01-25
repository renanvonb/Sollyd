"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface HistoryData {
    date: string
    income: number
    expense: number
    [key: string]: any
}

interface TransactionsHistoryChartProps {
    data: HistoryData[]
}

const chartConfig = {
    income: {
        label: "Receitas",
        color: "#10b981", // Emerald 500
    },
    expense: {
        label: "Despesas",
        color: "#f43f5e", // Rose 500
    },
} satisfies ChartConfig

export function TransactionsHistoryChart({ data }: TransactionsHistoryChartProps) {
    const [hiddenKeys, setHiddenKeys] = React.useState<Record<string, boolean>>({})

    const toggleKey = (key: string) => {
        setHiddenKeys(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="border-b shrink-0 flex flex-row items-center justify-between px-6 py-4 space-y-0">
                <CardTitle className="text-base font-semibold text-nowrap">Balanço financeiro</CardTitle>
                <div className="flex items-center gap-6">
                    {/* Legenda Customizada e Interativa */}
                    <div className="flex items-center gap-4 select-none">
                        <button
                            onClick={() => toggleKey("income")}
                            className={cn(
                                "flex items-center gap-1.5 transition-opacity hover:opacity-80",
                                hiddenKeys.income && "opacity-40"
                            )}
                        >
                            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartConfig.income.color }} />
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {chartConfig.income.label}
                            </span>
                        </button>
                        <button
                            onClick={() => toggleKey("expense")}
                            className={cn(
                                "flex items-center gap-1.5 transition-opacity hover:opacity-80",
                                hiddenKeys.expense && "opacity-40"
                            )}
                        >
                            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: chartConfig.expense.color }} />
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {chartConfig.expense.label}
                            </span>
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6 min-h-0">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                    <BarChart accessibilityLayer data={data} margin={{ left: 0, right: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                if (value.length <= 7) {
                                    const [year, month] = value.split('-')
                                    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
                                    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
                                    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
                                    const shortYear = year.slice(-2)
                                    return `${capitalizedMonth}/${shortYear}`
                                }
                                const date = new Date(value + 'T00:00:00')
                                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            tick={{ textAnchor: 'start', fontSize: 11 }}
                            tickMargin={0}
                            dx={-75}
                            tickFormatter={(value) => {
                                const formatted = value.toLocaleString("pt-BR", {
                                    notation: "compact",
                                    maximumFractionDigits: 1
                                });
                                return `R$ ${formatted}`;
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={(props) => (
                                <ChartTooltipContent
                                    {...props}
                                    className="w-[200px]"
                                    labelFormatter={(value) => {
                                        if (value.length <= 7) {
                                            const [year, month] = value.split('-')
                                            const date = new Date(parseInt(year), parseInt(month) - 1, 1)
                                            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
                                            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
                                            return `${capitalizedMonth}/${year}`
                                        }
                                        const date = new Date(value + 'T00:00:00')
                                        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                    }}
                                    formatter={(value, name, item, index, payload) => {
                                        const data = payload as any
                                        const income = Number(data?.income || 0)
                                        const expense = Number(data?.expense || 0)
                                        const balance = income - expense

                                        return (
                                            <>
                                                <div
                                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{
                                                        backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color,
                                                    }}
                                                />
                                                <span className="text-muted-foreground">
                                                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                                </span>
                                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                    R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </div>
                                                {index === 1 && (
                                                    <div className="mt-1.5 flex basis-full items-center border-t border-dashed pt-1.5 text-xs font-medium text-foreground">
                                                        Saldo
                                                        <div className={`ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                                            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                        {!hiddenKeys.income && <Bar dataKey="income" fill="var(--color-income)" radius={4} />}
                        {!hiddenKeys.expense && <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
