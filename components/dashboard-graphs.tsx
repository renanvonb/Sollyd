"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { format, startOfMonth, endOfMonth, parseISO, eachDayOfInterval, eachMonthOfInterval, startOfYear, endOfYear, getYear } from "date-fns"
import { ptBR } from "date-fns/locale"

import { TransactionSummaryCards } from "@/components/transaction-summary-cards"
import { TimeRange } from "@/types/time-range"

import { getColorHex } from "@/components/cadastros/color-picker"
import { Transaction } from "@/types/transaction"
import { ExpensesByCategoryChart } from "@/components/charts/expenses-by-category"
import { ExpensesBySubcategoryChart } from "@/components/charts/expenses-by-subcategory"
import { ExpensesByClassificationChart } from "@/components/charts/expenses-by-classification"
import { TransactionsHistoryChart } from "@/components/charts/transactions-history"
import { ExpensesByPayeeChart } from "@/components/charts/expenses-by-payee"
import { RevenueByPayerChart } from "@/components/charts/revenue-by-payer"

interface DashboardGraphsProps {
    initialData: Transaction[]
    metrics?: any
}

export function DashboardGraphs({ initialData }: DashboardGraphsProps) {
    const searchParams = useSearchParams()

    const range = (searchParams.get('range') as TimeRange) || 'mes'
    const searchQuery = searchParams.get('q')?.toLowerCase() || ""
    const statusFilter = searchParams.get('status') || "Realizado"
    const currentYear = new Date().getFullYear()
    const selectedYear = parseInt(searchParams.get('year') || currentYear.toString())

    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null)
    const [selectedClassification, setSelectedClassification] = React.useState<string | null>(null)
    const [selectedPayee, setSelectedPayee] = React.useState<string | null>(null)
    const [selectedPayer, setSelectedPayer] = React.useState<string | null>(null)

    const date: { from: Date; to: Date } | undefined = React.useMemo(() => {
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
        if (range === 'ano') {
            const yearDate = new Date(selectedYear, 0, 1)
            return {
                from: startOfYear(yearDate),
                to: endOfYear(yearDate)
            }
        }
        return undefined
    }, [searchParams, range, selectedYear])

    const periodLabel = React.useMemo(() => {
        if (!date?.from || !date?.to) return ""

        if (range === 'mes') {
            const month = format(date.from, "MMMM", { locale: ptBR })
            const year = format(date.from, "yyyy", { locale: ptBR })
            return `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`
        }

        if (range === 'ano') {
            return format(date.from, "yyyy", { locale: ptBR })
        }

        if (range === 'dia') {
            return format(date.from, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        }

        return `${format(date.from, "dd MMM", { locale: ptBR })} - ${format(date.to, "dd MMM", { locale: ptBR })}`
    }, [date, range])

    const filteredData = React.useMemo(() => {
        let data = initialData

        // 1. Filter by Search
        if (searchQuery) {
            data = data.filter(t => {
                const desc = (t.description || "").toLowerCase()
                const payee = (t.payees?.name || "").toLowerCase()
                const cat = (t.categories?.name || "").toLowerCase()
                return desc.includes(searchQuery) || payee.includes(searchQuery) || cat.includes(searchQuery)
            })
        }

        // 2. Filter by Status
        if (statusFilter && statusFilter !== 'all') {
            data = data.filter(t => t.status === statusFilter)
        }

        return data
    }, [initialData, searchQuery, statusFilter])

    const totals = React.useMemo(() => {
        const dataInRange = date?.from && date?.to ? filteredData.filter(t => {
            const refDate = t.competence || t.date;
            if (!refDate) return false;
            const tDate = parseISO(refDate);
            return tDate >= date.from! && tDate <= date.to!;
        }) : filteredData;

        // Apply all filters for totals calculation to reflect current view
        const fullyFiltered = dataInRange.filter(t => {
            if (selectedCategory && (t.categories?.name || "Sem Categoria") !== selectedCategory) return false;
            if (selectedSubcategory && (t.subcategories?.name || "Sem Subcategoria") !== selectedSubcategory) return false;
            if (selectedClassification && (t.classifications?.name || "Sem Classificação") !== selectedClassification) return false;
            if (selectedPayee && (t.payees?.name || "Sem Beneficiário") !== selectedPayee) return false;
            if (selectedPayer && (t.payees?.name || t.payers?.name || "Sem Pagador") !== selectedPayer) return false;
            return true;
        });

        return fullyFiltered.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount as any) || 0
            if (curr.type === 'revenue') acc.income += amount
            else if (curr.type === 'expense') acc.expense += amount
            else if (curr.type === 'investment') acc.investment += amount
            acc.balance = acc.income - acc.expense - acc.investment
            return acc
        }, { income: 0, expense: 0, investment: 0, balance: 0 })
    }, [filteredData, date, selectedCategory, selectedSubcategory, selectedClassification, selectedPayee, selectedPayer])

    const chartsData = React.useMemo(() => {
        const baseData = date?.from && date?.to ? filteredData.filter(t => {
            const refDate = t.competence || t.date;
            if (!refDate) return false;
            // Use string comparison (YYYY-MM-DD) to avoid timezone issues
            const refDateStr = refDate.substring(0, 10);
            const fromStr = format(date.from!, 'yyyy-MM-dd');
            const toStr = format(date.to!, 'yyyy-MM-dd');
            return refDateStr >= fromStr && refDateStr <= toStr;
        }) : filteredData;

        // Helper to apply filters EXCEPT specific keys
        const getFilteredData = (exclude?: 'category' | 'subcategory' | 'classification' | 'payee' | 'payer') => {
            return baseData.filter(t => {
                if (exclude !== 'category' && selectedCategory && (t.categories?.name || "Sem Categoria") !== selectedCategory) return false;
                if (exclude !== 'subcategory' && selectedSubcategory && (t.subcategories?.name || "Sem Subcategoria") !== selectedSubcategory) return false;
                if (exclude !== 'classification' && selectedClassification && (t.classifications?.name || "Sem Classificação") !== selectedClassification) return false;
                if (exclude !== 'payee' && selectedPayee && (t.payees?.name || "Sem Beneficiário") !== selectedPayee) return false;
                if (exclude !== 'payer' && selectedPayer && (t.payees?.name || t.payers?.name || "Sem Pagador") !== selectedPayer) return false;
                return true;
            });
        };

        const dataForCategory = getFilteredData('category').filter(t => t.type === 'expense');
        const dataForSubcategory = getFilteredData('subcategory').filter(t => t.type === 'expense');
        const dataForClassification = getFilteredData('classification').filter(t => t.type === 'expense');
        const dataForPayee = getFilteredData('payee').filter(t => t.type === 'expense');
        const dataForPayer = getFilteredData('payer').filter(t => t.type === 'revenue');

        // History uses ALL filters
        const dataForHistory = getFilteredData();

        // 1. By Category (Input: dataForCategory)
        const byCategoryMap = new Map<string, { amount: number, color: string }>();
        dataForCategory.forEach(t => {
            const name = t.categories?.name || "Sem Categoria";
            const color = getColorHex(t.categories?.color || "zinc");
            const current = byCategoryMap.get(name) || { amount: 0, color };
            current.amount += parseFloat(t.amount as any);
            byCategoryMap.set(name, current);
        });
        const byCategory = Array.from(byCategoryMap.entries()).map(([name, val]) => ({
            category: name,
            amount: val.amount,
            fill: val.color
        })).sort((a, b) => b.amount - a.amount);

        // 2. By Subcategory (Input: dataForSubcategory)
        const bySubMap = new Map<string, { amount: number, color: string }>();
        dataForSubcategory.forEach(t => {
            if (t.subcategories?.name) {
                const name = t.subcategories.name;
                const rawColor = t.subcategories.color || t.categories?.color || "zinc";
                const color = getColorHex(rawColor);
                const current = bySubMap.get(name) || { amount: 0, color };
                current.amount += parseFloat(t.amount as any);
                bySubMap.set(name, current);
            }
        });
        const bySubcategory = Array.from(bySubMap.entries()).map(([name, val]) => ({
            subcategory: name,
            amount: val.amount,
            fill: val.color
        })).sort((a, b) => b.amount - a.amount).slice(0, 10);

        // 3. By Classification (Input: dataForClassification)
        const byClassMap = new Map<string, { amount: number, color: string }>();
        dataForClassification.forEach(t => {
            if (t.classifications) {
                const name = t.classifications.name;
                const color = getColorHex(t.classifications.color || "zinc");
                const current = byClassMap.get(name) || { amount: 0, color };
                current.amount += parseFloat(t.amount as any);
                byClassMap.set(name, current);
            }
        });
        const byClassification = Array.from(byClassMap.entries()).map(([name, val]) => ({
            classification: name,
            amount: val.amount,
            fill: val.color
        })).sort((a, b) => b.amount - a.amount);

        // 4. History (Input: dataForHistory)
        const isMonthlyRange = range === 'mes';
        let historyStart = startOfYear(new Date(selectedYear, 0, 1));
        let historyEnd = endOfYear(new Date(selectedYear, 0, 1));

        if (isMonthlyRange && date?.from && date?.to) {
            historyStart = date.from;
            historyEnd = date.to;
        }

        const historyMap = new Map<string, { income: number, expense: number }>();
        const historyFromStr = format(historyStart, 'yyyy-MM-dd');
        const historyEndStr = format(historyEnd, 'yyyy-MM-dd');

        dataForHistory.forEach(t => {
            const refDate = t.competence || t.date;
            if (!refDate) return;
            // Use string key directly
            const refDateStr = refDate.substring(0, 10);

            // Allow if within range (string comparison)
            if (refDateStr >= historyFromStr && refDateStr <= historyEndStr) {
                const dateKey = isMonthlyRange ? refDateStr : refDateStr.substring(0, 7); // YYYY-MM
                const current = historyMap.get(dateKey) || { income: 0, expense: 0 };
                const amount = parseFloat(t.amount as any);
                if (t.type === 'revenue') current.income += amount;
                if (t.type === 'expense') current.expense += amount;
                historyMap.set(dateKey, current);
            }
        });

        const intervals = isMonthlyRange
            ? eachDayOfInterval({ start: historyStart, end: historyEnd })
            : eachMonthOfInterval({ start: historyStart, end: historyEnd });

        const history = intervals.map(interval => {
            const dateKey = isMonthlyRange ? format(interval, 'yyyy-MM-dd') : format(interval, 'yyyy-MM');
            const data = historyMap.get(dateKey) || { income: 0, expense: 0 };
            return { date: dateKey, ...data };
        });

        // 5. By Payee (Input: dataForPayee)
        const byPayeeMap = new Map<string, { amount: number, color: string }>();
        dataForPayee.forEach(t => {
            const name = t.payees?.name || "Sem Beneficiário";
            const color = getColorHex('red');
            const current = byPayeeMap.get(name) || { amount: 0, color };
            current.amount += parseFloat(t.amount as any);
            byPayeeMap.set(name, current);
        });
        const byPayee = Array.from(byPayeeMap.entries()).map(([name, val]) => ({
            payee: name,
            amount: val.amount,
            fill: val.color
        })).sort((a, b) => b.amount - a.amount).slice(0, 5);

        // 6. By Payer (Input: dataForPayer)
        const byPayerMap = new Map<string, { amount: number, color: string }>();
        // Note: dataForPayer is already filtered by type='revenue' above
        dataForPayer.forEach(t => {
            const name = t.payees?.name || t.payers?.name || "Sem Pagador";
            const color = getColorHex('green');
            const current = byPayerMap.get(name) || { amount: 0, color };
            current.amount += parseFloat(t.amount as any);
            byPayerMap.set(name, current);
        });
        const byPayer = Array.from(byPayerMap.entries()).map(([name, val]) => ({
            payer: name,
            amount: val.amount,
            fill: val.color
        })).sort((a, b) => b.amount - a.amount).slice(0, 5);

        return { byCategory, bySubcategory, byClassification, history, byPayee, byPayer };
    }, [filteredData, date, range, selectedYear, selectedCategory, selectedSubcategory, selectedClassification, selectedPayee, selectedPayer]);

    return (
        <div className="max-w-[1440px] mx-auto px-8 w-full flex-1 flex flex-col pt-8 pb-8 gap-8 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 gap-4">
                {/* Row 1: Summary Cards (Fixed Height) */}
                <div className="shrink-0">
                    <TransactionSummaryCards totals={totals} />
                </div>

                {/* Charts Area (Fills remaining space) */}
                <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1 pb-4 scrollbar-hide">
                    {/* Row 1 (Top Charts) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 min-h-[400px]">
                        <div className="md:col-span-3 h-full">
                            <TransactionsHistoryChart
                                data={chartsData.history}
                            />
                        </div>
                        <div className="md:col-span-1 h-full">
                            <ExpensesByClassificationChart
                                data={chartsData.byClassification}
                                periodLabel={periodLabel}
                                onClassificationClick={setSelectedClassification}
                                selectedClassification={selectedClassification}
                            />
                        </div>
                    </div>

                    {/* Row 2 (Middle Charts) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 min-h-[400px]">
                        <div className="h-full">
                            <ExpensesByCategoryChart
                                data={chartsData.byCategory}
                                periodLabel={periodLabel}
                                onCategoryClick={setSelectedCategory}
                                selectedCategory={selectedCategory}
                            />
                        </div>
                        <div className="h-full">
                            <ExpensesBySubcategoryChart
                                data={chartsData.bySubcategory}
                                periodLabel={periodLabel}
                                onSubcategoryClick={setSelectedSubcategory}
                                selectedSubcategory={selectedSubcategory}
                            />
                        </div>
                    </div>

                    {/* Row 3 (Bottom Charts - Contact analysis) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 min-h-[400px]">
                        <div className="h-full">
                            <ExpensesByPayeeChart
                                data={chartsData.byPayee}
                                periodLabel={periodLabel}
                                onPayeeClick={setSelectedPayee}
                                selectedPayee={selectedPayee}
                            />
                        </div>
                        <div className="h-full">
                            <ExpensesByPayerChartNameHack
                                data={chartsData.byPayer}
                                periodLabel={periodLabel}
                                onPayerClick={setSelectedPayer}
                                selectedPayer={selectedPayer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function ExpensesByPayerChartNameHack(props: any) {
    return <RevenueByPayerChart {...props} />
}
