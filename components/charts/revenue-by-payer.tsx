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

export interface PayerData {
    payer: string
    amount: number
    fill: string
}

interface RevenueByPayerChartProps {
    data: PayerData[]
    title?: string
}

const chartConfig = {
    amount: {
        label: "Valor",
    },
} satisfies ChartConfig

export function RevenueByPayerChart({ data, title = "Maiores Pagadores" }: RevenueByPayerChartProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="border-b shrink-0 py-4">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 min-h-0">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 5,
                            left: 0,
                            right: 40,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            type="number"
                            hide
                        />
                        <YAxis
                            dataKey="payer"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={110}
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
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
                                                {item.payload.payer || name}
                                            </span>
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </div>
                                        </>
                                    )}
                                /> as any
                            }
                        />
                        <Bar dataKey="amount" radius={4} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <LabelList
                                dataKey="amount"
                                position="right"
                                offset={8}
                                className="fill-foreground font-medium"
                                fontSize={10}
                                formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', { notation: "compact" })}`}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
