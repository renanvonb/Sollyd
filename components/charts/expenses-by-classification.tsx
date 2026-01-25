"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export interface ClassificationData {
    classification: string
    amount: number
    fill: string
}

interface ExpensesByClassificationChartProps {
    data: ClassificationData[]
}

const chartConfig = {
    amount: {
        label: "Valor",
    },
} satisfies ChartConfig

export function ExpensesByClassificationChart({ data }: ExpensesByClassificationChartProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-start border-b shrink-0 py-4">
                <CardTitle className="text-base font-semibold">Classificações</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 pb-0 min-h-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto h-full w-full aspect-auto [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
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
                                                {(item.payload as any).classification}
                                            </span>
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </div>
                                        </>
                                    )}
                                /> as any
                            }
                        />
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="classification"
                            labelLine={false}
                            label={({ payload, ...props }) => {
                                return (
                                    <text
                                        cx={props.cx}
                                        cy={props.cy}
                                        x={props.x}
                                        y={props.y}
                                        textAnchor={props.textAnchor}
                                        dominantBaseline={props.dominantBaseline}
                                        fill="hsla(var(--foreground))"
                                        fontSize={10}
                                        fontWeight={500}
                                    >
                                        {Number(payload.amount).toLocaleString("pt-BR", {
                                            notation: "compact",
                                        })}
                                    </text>
                                )
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* Legenda Customizada - Estilo Balanço Financeiro */}
            <CardFooter className="flex-col gap-2 p-6 pt-0">
                <div className="flex w-full flex-wrap items-center justify-center gap-4">
                    {data.map((item) => (
                        <div key={item.classification} className="flex items-center gap-1.5">
                            <div
                                className="h-3 w-3 rounded-sm"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                {item.classification}
                            </span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}
