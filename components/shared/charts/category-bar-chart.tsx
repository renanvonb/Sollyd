"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVisibility } from "@/hooks/use-visibility-state"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface CategoryBarChartProps {
    data: Array<{ name: string; value: number; color: string }>
    subcategoryData: Array<{ name: string; value: number }>
}

export function CategoryBarChart({ data, subcategoryData }: CategoryBarChartProps) {
    const { isVisible } = useVisibility()

    // Create a dynamic config for tooltips if needed, mainly for labels
    // For colors specific to bars, we pass them in the data payload
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            value: {
                label: "Valor",
            },
        }
        data.forEach(item => {
            // Safe key handling
            config[item.name] = {
                label: item.name,
                color: item.color,
            }
        })
        return config
    }, [data])

    const chartData = React.useMemo(() => {
        return data.map(item => ({
            ...item,
            fill: item.color // Use the color from the database
        }))
    }, [data])

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
        <Card className="rounded-lg border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-muted-foreground font-semibold font-sans tracking-tight text-sm">
                        Categorias
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground font-inter">
                        Nenhum dado encontrado
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                                interval={0}
                                style={{
                                    fontSize: '12px',
                                    fontFamily: 'Inter',
                                    fill: '#71717a'
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                                width={60}
                                style={{
                                    fontSize: '12px',
                                    fontFamily: 'Inter',
                                    fill: '#71717a'
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={(props) => <ChartTooltipContent {...props} formatter={(value) => formatValue(Number(value))} />}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
