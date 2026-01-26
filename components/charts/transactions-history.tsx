"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Maximize2, Inbox } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
}
    from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"

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
        color: "#22c55e", // Green 500
    },
    expense: {
        label: "Despesas",
        color: "#ef4444", // Red 500
    },
} satisfies ChartConfig

export function TransactionsHistoryChart({ data }: TransactionsHistoryChartProps) {
    const [hiddenKeys, setHiddenKeys] = React.useState<Record<string, boolean>>({})

    const hasData = React.useMemo(() => {
        return data && data.length > 0 && data.some(item => item.income > 0 || item.expense > 0)
    }, [data])

    const toggleKey = (key: string) => {
        setHiddenKeys(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const renderChart = (isExpanded = false) => {
        if (!hasData) {
            return (
                <div className="h-full w-full flex items-center justify-center">
                    <EmptyState
                        variant="default"
                        size="sm"
                        icon={Inbox}
                        title={<span className="font-inter text-base font-normal text-muted-foreground block text-center">Nenhuma informação a ser exibida<br />no período selecionado.</span>}
                        className="p-0 min-h-0 bg-transparent"
                    />
                </div>
            )
        }

        const idSuffix = isExpanded ? "expanded" : "main"
        return (
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                <AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`fillIncome-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id={`fillExpense-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        interval={0}
                        tick={{ fontSize: isExpanded ? 14 : 10 }}
                        tickFormatter={(value) => {
                            if (value.length <= 7) {
                                const [year, month] = value.split('-')
                                const date = new Date(parseInt(year), parseInt(month) - 1, 1)
                                const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
                                const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
                                return `${capitalizedMonth}/${year}`
                            }
                            const date = new Date(value + 'T00:00:00')
                            return date.toLocaleDateString('pt-BR', { day: '2-digit' })
                        }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={80}
                        tick={{ textAnchor: 'start', fontSize: isExpanded ? 14 : 11 }}
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
                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
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
                                    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
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
                                                    <div className={`ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
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
                    {!hiddenKeys.income && (
                        <Area
                            dataKey="income"
                            type="monotone"
                            fill={`url(#fillIncome-${idSuffix})`}
                            fillOpacity={0.4}
                            stroke="var(--color-income)"
                            strokeWidth={2.5}
                            stackId="1"
                        />
                    )}
                    {!hiddenKeys.expense && (
                        <Area
                            dataKey="expense"
                            type="monotone"
                            fill={`url(#fillExpense-${idSuffix})`}
                            fillOpacity={0.4}
                            stroke="var(--color-expense)"
                            strokeWidth={2.5}
                            stackId="2"
                        />
                    )}
                </AreaChart>
            </ChartContainer>
        )
    }

    const Legend = () => (
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
    )

    return (
        <Dialog>
            <Card className="h-full flex flex-col hover:shadow-md transition-all">
                <CardHeader className="border-b shrink-0 flex flex-row items-center justify-between px-6 py-4 space-y-0 group">
                    <div className="flex items-center gap-2">
                        {hasData ? (
                            <DialogTrigger asChild>
                                <CardTitle className="text-base font-semibold text-nowrap cursor-pointer">Balanço financeiro</CardTitle>
                            </DialogTrigger>
                        ) : (
                            <CardTitle className="text-base font-semibold text-nowrap">Balanço financeiro</CardTitle>
                        )}
                        {hasData && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Maximize2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Detalhes</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {hasData && <Legend />}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pt-6 min-h-0">
                    {renderChart()}
                </CardContent>
            </Card>
            <DialogContent className="max-w-[90vw] h-[80vh] flex flex-col">
                <DialogHeader className="flex-none border-b pb-4">
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle>Balanço financeiro</DialogTitle>
                        <Legend />
                    </div>
                </DialogHeader>
                <div className="flex-1 min-h-0 w-full pt-4">
                    {renderChart(true)}
                </div>
            </DialogContent>
        </Dialog>
    )
}
