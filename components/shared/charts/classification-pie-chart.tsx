"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVisibility } from "@/hooks/use-visibility-state"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface ClassificationPieChartProps {
    data: Array<{ classification: string; value: number; color: string }>
}

export function ClassificationPieChart({ data }: ClassificationPieChartProps) {
    const { isVisible } = useVisibility()

    const formatValue = (value: number) => {
        if (!isVisible) return "R$ ••••"
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {}
        data.forEach(item => {
            // Safe key handling using classification name
            // We use the classification name as the key
            config[item.classification] = {
                label: item.classification,
                color: item.color,
            }
        })
        return config
    }, [data])

    const chartData = React.useMemo(() => {
        return data.map(item => ({
            ...item,
            name: item.classification,
            fill: item.color // Use color from DB
        }))
    }, [data])

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="rounded-lg border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-muted-foreground font-semibold font-sans tracking-tight text-sm">
                    Classificações
                </CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground font-inter">
                        Nenhum dado encontrado
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={(props) => <ChartTooltipContent {...props} hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        {/* Custom Legend to match specific original design */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            {chartData.map((entry) => {
                                const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0
                                return (
                                    <div key={entry.classification} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full shrink-0"
                                                style={{ backgroundColor: entry.fill }}
                                            />
                                            <span className="text-muted-foreground font-inter text-xs truncate">{entry.name}</span>
                                        </div>
                                        <div className="text-foreground font-semibold font-inter ml-5">
                                            {formatValue(entry.value)}
                                        </div>
                                        <div className="text-muted-foreground text-xs font-inter ml-5">
                                            {percentage}%
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
