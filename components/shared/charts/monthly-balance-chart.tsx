"use client"

import * as React from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVisibility } from "@/hooks/use-visibility-state"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface MonthlyBalanceChartProps {
    data: Array<{ day: string; receitas: number; despesas: number }>
    className?: string
}

const chartConfig = {
    receitas: {
        label: "Receitas",
        color: "#10b981",
    },
    despesas: {
        label: "Despesas",
        color: "#ef4444",
    },
} satisfies ChartConfig

export function MonthlyBalanceChart({ data, className }: MonthlyBalanceChartProps) {
    const { isVisible } = useVisibility()

    const formatAxisValue = (value: number) => {
        if (!isVisible) return "••••"
        if (value === 0) return "R$0"
        return `R$${(value / 1000).toFixed(0)}k`
    }

    const formatValue = (value: number) => {
        if (!isVisible) return "R$ ••••"
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    return (
        <Card className={`rounded-lg border-border shadow-sm flex flex-col ${className || ''}`}>
            <CardHeader>
                <CardTitle className="text-muted-foreground font-semibold font-sans tracking-tight text-sm">
                    Balanço
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-inter">
                        Nenhum dado encontrado
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart
                            accessibilityLayer
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="fillReceitas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-receitas)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--color-receitas)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="fillDespesas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-despesas)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--color-despesas)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f4f4f5" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'Inter' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'Inter' }}
                                tickFormatter={formatAxisValue}
                                width={60}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent formatter={(value) => formatValue(Number(value))} />}
                            />
                            <Area
                                dataKey="despesas"
                                type="monotone"
                                fill="url(#fillDespesas)"
                                fillOpacity={0.4}
                                stroke="var(--color-despesas)"
                                stackId="2" // Separate stacks
                                strokeWidth={2}
                            />
                            <Area
                                dataKey="receitas"
                                type="monotone"
                                fill="url(#fillReceitas)"
                                fillOpacity={0.4}
                                stroke="var(--color-receitas)"
                                stackId="1" // Separate stacks
                                strokeWidth={2}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
