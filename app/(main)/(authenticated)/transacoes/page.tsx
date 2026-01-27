'use client'

import * as React from "react"
import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DateRange } from "react-day-picker"
import { getTransactions } from "@/app/actions/transactions-fetch"
import { TimeRange } from "@/types/time-range"
import { normalizeSearch } from "@/lib/utils"
import { TopBar } from "@/components/ui/top-bar"
import { TransactionsHeader } from "@/components/transactions/transactions-header"
import { TransactionsContent } from "@/components/transactions/transactions-content"
import { TransactionForm } from "@/components/transaction-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Transaction } from "@/types/transaction"
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns"

const periodTabs = [
    { id: 'dia', label: 'Dia' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
]

export default function TransactionsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // const [isPending, startTransition] = useTransition() // Not currently needed for this fetch pattern

    // State
    const [data, setData] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchValue, setSearchValue] = React.useState(searchParams.get('q') || "")
    const [statusFilter, setStatusFilter] = React.useState(searchParams.get('status') || "all")
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
    const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
    const [isNewSheetOpen, setIsNewSheetOpen] = React.useState(false)
    const [newTransactionType, setNewTransactionType] = React.useState<"revenue" | "expense" | "investment">("expense")

    // URL params
    const range = (searchParams.get('range') as TimeRange) || 'mes'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const searchQuery = searchParams.get('q')?.toLowerCase() || ""

    // Fetch data
    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true)
            const result = await getTransactions({
                range,
                startDate: from ? format(parseISO(from), 'yyyy-MM-01') : undefined,
                endDate: to || undefined,
            })
            setData(result)
        } catch (error) {
            console.error("Error fetching transactions:", error)
            toast.error("Erro de carregamento", {
                description: "Não foi possível carregar o histórico de transações."
            })
        } finally {
            setLoading(false)
        }
    }, [range, from, to])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    // Hanlders
    const handleRangeChange = (newRange: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('range', newRange)
        params.delete('from')
        params.delete('to')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleDateChange = (newDate: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newDate?.from) params.set('from', newDate.from.toISOString())
        else params.delete('from')
        if (newDate?.to) params.set('to', newDate.to.toISOString())
        else params.delete('to')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    // Search debounce
    React.useEffect(() => {
        const currentQ = searchParams.get('q') || ""
        if (searchValue === currentQ) return

        const timer = setTimeout(() => {
            const params = new URLSearchParams(window.location.search)
            if (searchValue) params.set('q', searchValue)
            else params.delete('q')
            router.push(`?${params.toString()}`, { scroll: false })
        }, 400)
        return () => clearTimeout(timer)
    }, [searchValue, router])

    const handleAddClick = (type: "revenue" | "expense" | "investment") => {
        setNewTransactionType(type)
        setIsNewSheetOpen(true)
    }

    const handleRowClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setIsEditSheetOpen(true)
    }


    const handleSuccess = () => {
        fetchData()
        setIsNewSheetOpen(false)
        setIsEditSheetOpen(false)
    }

    const filteredData = React.useMemo(() => {
        let filtered = data

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === statusFilter)
        }

        // Filter by search query
        if (searchQuery) {
            const normalizedQuery = normalizeSearch(searchQuery)
            filtered = filtered.filter(t => {
                const desc = normalizeSearch(t.description || "")
                const payee = normalizeSearch(t.payees?.name || "")
                const cat = normalizeSearch(t.categories?.name || "")
                const amount = normalizeSearch((t.amount || 0).toString())

                // Date formatting for search (DD/MM/YYYY)
                let dateStr = ""
                if (t.date && typeof t.date === 'string') {
                    const [year, month, day] = t.date.split('-')
                    if (year && month && day) {
                        dateStr = normalizeSearch(`${day}/${month}/${year}`)
                    }
                }

                return desc.includes(normalizedQuery) ||
                    payee.includes(normalizedQuery) ||
                    cat.includes(normalizedQuery) ||
                    amount.includes(normalizedQuery) ||
                    dateStr.includes(normalizedQuery)
            })
        }

        return filtered
    }, [data, searchQuery, statusFilter])

    const dateRange: DateRange | undefined = React.useMemo(() => {
        if (from && to) return { from: new Date(from), to: new Date(to) }
        return undefined
    }, [from, to])

    const referenceDate = React.useMemo(() => {
        if (from) return new Date(from);
        return new Date();
    }, [from]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Top Bar with Period Tabs */}
            <TopBar
                moduleName="Transações"
                tabs={periodTabs}
                activeTab={range}
                onTabChange={handleRangeChange}
                variant="simple"
            />

            {/* Main Content Wrapper */}
            <div className="max-w-[1440px] mx-auto px-8 w-full flex-1 flex flex-col pt-8 pb-8 gap-8 overflow-hidden">

                <TransactionsHeader
                    title="Transações"
                    description="Gerencie e acompanhe suas movimentações financeiras."
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    range={range}
                    date={dateRange}
                    onDateChange={handleDateChange}
                    onAddClick={handleAddClick}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                <TransactionsContent
                    data={filteredData}
                    isPending={loading}
                    searchQuery={searchQuery}
                    range={range}
                    onRowClick={handleRowClick}
                    onResetSearch={() => setSearchValue("")}
                    onAddClick={handleAddClick}
                />

                {/* Sheets and Dialogs */}
                <Dialog open={isNewSheetOpen} onOpenChange={setIsNewSheetOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle className="font-jakarta">
                                Nova transação
                            </DialogTitle>
                            <DialogDescription>
                                Preencha os dados da nova transação
                            </DialogDescription>
                        </DialogHeader>
                        <TransactionForm
                            open={isNewSheetOpen}
                            defaultType={newTransactionType}
                            initialDate={referenceDate}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsNewSheetOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditSheetOpen} onOpenChange={(open) => {
                    setIsEditSheetOpen(open)
                    if (!open) setSelectedTransaction(null)
                }}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle className="font-jakarta">Editar transação</DialogTitle>
                            <DialogDescription>
                                Atualize os dados da transação
                            </DialogDescription>
                        </DialogHeader>
                        <TransactionForm
                            key={selectedTransaction?.id}
                            open={isEditSheetOpen}
                            transaction={selectedTransaction}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsEditSheetOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

