"use client"

import * as React from "react"
import { useTransition } from "react"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { TransactionSummaryCards } from "@/components/transaction-summary-cards"
import { TimeRange } from "@/app/actions/transactions-fetch"
import { Eye, EyeOff, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker"
import { useVisibility } from "@/hooks/use-visibility-state"
import { CategoryBarChart } from "@/components/shared/charts/category-bar-chart"
import { ClassificationPieChart } from "@/components/shared/charts/classification-pie-chart"
import { MonthlyBalanceChart } from "@/components/shared/charts/monthly-balance-chart"
import { TopBar } from "@/components/ui/top-bar"

interface DashboardClientProps {
    initialData: any[]
    userName: string
    metrics?: {
        summary: {
            income: number
            expense: number
            balance: number
            investment: number
        }
        categoryData: Array<{
            name: string
            value: number
            color: string
        }>
    }
}

const periodTabs = [
    { id: 'dia', label: 'Dia' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
    { id: 'custom', label: 'Período' },
]

export default function DashboardClient({ initialData, userName, metrics }: DashboardClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const { isVisible, toggleVisibility } = useVisibility()

    const [searchValue, setSearchValue] = React.useState(searchParams.get('q') || "")

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (searchValue) params.set('q', searchValue)
            else params.delete('q')
            router.push(`?${params.toString()}`, { scroll: false })
        }, 300)
        return () => clearTimeout(timer)
    }, [searchValue, router, searchParams])

    const range = (searchParams.get('range') as TimeRange) || 'mes'
    const searchQuery = searchParams.get('q')?.toLowerCase() || ""

    const date: DateRange | undefined = React.useMemo(() => {
        const from = searchParams.get('from')
        const to = searchParams.get('to')
        if (from && to) {
            return { from: new Date(from), to: new Date(to) }
        }
        if (range === 'mes') {
            const now = new Date()
            return {
                from: startOfMonth(now),
                to: endOfMonth(now)
            }
        }
        return undefined
    }, [searchParams, range])

    const handleRangeChange = (newRange: TimeRange) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('range', newRange)
            params.delete('from')
            params.delete('to')
            router.push(`?${params.toString()}`, { scroll: false })
        })
    }

    const handleDateChange = (newDate: DateRange | undefined) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (newDate?.from) params.set('from', newDate.from.toISOString())
            else params.delete('from')
            if (newDate?.to) params.set('to', newDate.to.toISOString())
            else params.delete('to')
            router.push(`?${params.toString()}`, { scroll: false })
        })
    }

    const filteredData = React.useMemo(() => {
        if (!searchQuery) return initialData
        return initialData.filter(t => {
            const desc = (t.description || "").toLowerCase()
            const payee = (t.payees?.name || "").toLowerCase()
            const cat = (t.categories?.name || "").toLowerCase()
            return desc.includes(searchQuery) || payee.includes(searchQuery) || cat.includes(searchQuery)
        })
    }, [initialData, searchQuery])

    const totals = React.useMemo(() => {
        if (metrics?.summary) return metrics.summary

        return filteredData.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount as any) || 0
            if (curr.type === 'revenue') acc.income += amount
            else if (curr.type === 'expense') acc.expense += amount
            else if (curr.type === 'investment') acc.investment += amount
            acc.balance = acc.income - acc.expense - acc.investment
            return acc
        }, { income: 0, expense: 0, investment: 0, balance: 0 })
    }, [filteredData, metrics])

    // Category data (expenses only)
    const categoryData = React.useMemo(() => {
        // Aggregating directly from initialData to ensure strict consistency with table/cards
        const categories: Record<string, { value: number; color?: string }> = {}

        initialData.forEach(t => {
            const type = (t.type || '').toLowerCase()
            const isExpense = type === 'expense' || type === 'despesa'

            if (isExpense && t.status === 'Realizado') {
                const name = t.categories?.name || 'Outros'
                const color = t.categories?.color
                const amount = Number(t.amount) || 0

                if (!categories[name]) {
                    categories[name] = { value: 0, color }
                } else {
                    categories[name].value += amount
                }
            }
        })
        return Object.entries(categories)
            .map(([name, data]) => ({ name, value: data.value, color: data.color || '#71717a' }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10
    }, [initialData])

    // Subcategory data (expenses only)
    const subcategoryData = React.useMemo(() => {
        const subcategories: Record<string, number> = {}
        initialData.forEach(t => {
            const type = (t.type || '').toLowerCase()
            const isExpense = type === 'expense' || type === 'despesa'

            if (isExpense && t.status === 'Realizado') {
                const name = t.subcategories?.name || t.categories?.name || 'Outros'
                const amount = Number(t.amount) || 0
                subcategories[name] = (subcategories[name] || 0) + amount
            }
        })
        return Object.entries(subcategories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10
    }, [initialData])

    // Classification data (expenses only)
    const classificationData = React.useMemo(() => {
        const classifications: Record<string, { value: number; color?: string }> = {}

        initialData.forEach(t => {
            const type = (t.type || '').toLowerCase()
            const isExpense = type === 'expense' || type === 'despesa'

            if (isExpense && t.status === 'Realizado') {
                const classification = t.classifications?.name || 'Outros'
                const color = t.classifications?.color
                const amount = Number(t.amount) || 0

                if (!classifications[classification]) {
                    classifications[classification] = { value: 0, color }
                } else {
                    classifications[classification].value += amount
                }
            }
        })
        return Object.entries(classifications).map(([classification, data]) => ({
            classification,
            value: data.value,
            color: data.color || '#71717a'
        }))
    }, [initialData])

    // Monthly balance data (daily aggregation)
    const monthlyBalanceData = React.useMemo(() => {
        const dailyData: Record<string, { receitas: number; despesas: number }> = {}

        initialData.forEach(t => {
            if (!t.date) return
            const date = parseISO(t.date)
            const day = format(date, 'd', { locale: ptBR })

            if (!dailyData[day]) {
                dailyData[day] = { receitas: 0, despesas: 0 }
            }

            const amount = parseFloat(t.amount as any) || 0
            if (t.type === 'revenue') {
                dailyData[day].receitas += amount
            } else if (t.type === 'expense') {
                dailyData[day].despesas += amount
            }
        })

        // Convert to array and sort by day
        return Object.entries(dailyData)
            .map(([day, values]) => ({
                day,
                receitas: values.receitas,
                despesas: values.despesas
            }))
            .sort((a, b) => parseInt(a.day) - parseInt(b.day))
    }, [initialData])

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar
                moduleName="Dashboard"
                tabs={periodTabs}
                activeTab={range}
                onTabChange={handleRangeChange as any}
                variant="simple"
            />

            <div className="max-w-[1440px] mx-auto px-8 w-full flex-1 flex flex-col pt-8 pb-8 gap-8 overflow-y-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between flex-none">
                    <div className="ml-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-jakarta">
                            Olá, {userName.split(' ')[0]}!
                        </h1>
                    </div>

                    <div id="standard-filters" className="flex items-center gap-3 font-sans justify-end flex-wrap">
                        <AdaptiveDatePicker
                            mode={range}
                            value={date}
                            onChange={handleDateChange}
                            className="w-auto"
                        />

                        <div className="relative w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar"
                                className="pl-9 h-10 font-inter w-full"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>


                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex flex-col flex-1 min-h-0 gap-4">
                    {/* Row 1: Summary Cards */}
                    <TransactionSummaryCards totals={totals} isLoading={isPending} />

                    {/* Charts Portion */}
                    <div className="flex flex-col flex-1 min-h-0 gap-4">
                        {/* Row 2: Category Bar + Classification Pie */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <CategoryBarChart
                                data={categoryData}
                                subcategoryData={subcategoryData}
                            />
                            <ClassificationPieChart data={classificationData} />
                        </div>

                        {/* Row 3: Monthly Balance Line Chart */}
                        <MonthlyBalanceChart data={monthlyBalanceData} className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}
