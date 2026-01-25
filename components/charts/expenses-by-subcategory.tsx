"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from "recharts"

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

export interface SubcategoryData {
    subcategory: string
    amount: number
    fill: string
}

interface ExpensesBySubcategoryChartProps {
    data: SubcategoryData[]
}

const chartConfig = {
    amount: {
        label: "Valor",
    },
} satisfies ChartConfig

export function ExpensesBySubcategoryChart({ data }: ExpensesBySubcategoryChartProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="border-b shrink-0 py-4">
                <CardTitle className="text-base font-semibold">Subcategorias</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 min-h-0">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="subcategory"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
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
                            content={
                                <ChartTooltipContent
                                    className="w-[180px]"
                                    formatter={(value, name, item) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                style={{
                                                    backgroundColor: item.color || (item.payload as any).fill,
                                                }}
                                            />
                                            <span className="text-muted-foreground">
                                                {item.payload.subcategory || name}
                                            </span>
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </div>
                                        </>
                                    )}
                                /> as any
                            }
                        />
                        <Bar dataKey="amount" radius={4}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-medium"
                                fontSize={11}
                                formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', { notation: "compact" })}`}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
