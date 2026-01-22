'use server'

import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns'

interface DashboardMetricsParams {
    competence: string // Format YYYY-MM-DD (usually 01)
}

export async function getDashboardMetrics({ competence }: DashboardMetricsParams) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { summary: { income: 0, expense: 0, balance: 0, investment: 0 }, categoryData: [] }
    }

    const date = parseISO(competence)
    const startDate = format(startOfMonth(date), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(date), 'yyyy-MM-dd')

    // 1. Fetch Summary Data (All transactions in competence)
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id)
        .gte('competence', startDate)
        .lte('competence', endDate)

    if (error) {
        console.error('[getDashboardMetrics] Error fetching summary:', error)
        return { summary: { income: 0, expense: 0, balance: 0, investment: 0 }, categoryData: [] }
    }

    const summary = transactions.reduce((acc, curr) => {
        const amount = Number(curr.amount) || 0
        const type = curr.type?.toLowerCase() || ''

        if (type === 'revenue' || type === 'receita') acc.income += amount
        else if (type === 'expense' || type === 'despesa') acc.expense += amount
        else if (type === 'investment' || type === 'investimento') acc.investment += amount

        acc.balance = acc.income - acc.expense - acc.investment
        return acc
    }, { income: 0, expense: 0, balance: 0, investment: 0 })


    // 2. Fetch Category Data
    // Requirement: "BUSCAR NA TABELA TRANSACTIONS... SEPARANDO PELA COLUNA CATEGORY ID, FILTRANDO PELO TYPE DE TRANSACTION 'DESPESA'"
    const { data: categoryTransactions, error: catError } = await supabase
        .from('transactions')
        .select(`
            amount,
            category_id,
            categories (
                id,
                name,
                color
            )
        `)
        .eq('user_id', user.id)
        .in('type', ['expense', 'despesa', 'Despesa', 'Expense']) // Check all possible variations
        .gte('competence', startDate)
        .lte('competence', endDate)

    if (catError) {
        console.error('[getDashboardMetrics] Error fetching categories:', catError)
        return { summary, categoryData: [] }
    }

    // Aggregate by category_id
    const categoryMap: Record<string, { value: number; color: string; name: string }> = {}

    categoryTransactions.forEach((t: any) => {
        const categoryId = t.category_id || 'unknown'
        const categoryName = t.categories?.name || 'Outros'
        const categoryColor = t.categories?.color || '#71717a'
        const amount = Number(t.amount) || 0

        if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = { value: 0, color: categoryColor, name: categoryName }
        } else {
            categoryMap[categoryId].value += amount
        }
    })

    const categoryData = Object.values(categoryMap)
        .map((data) => ({
            name: data.name,
            value: data.value,
            color: data.color
        }))
        .sort((a, b) => b.value - a.value)

    // 3. Fetch Classification Data
    const { data: classificationTransactions, error: classError } = await supabase
        .from('transactions')
        .select(`
            amount,
            classification_id,
            classifications (
                id,
                name,
                color
            )
        `)
        .eq('user_id', user.id)
        .in('type', ['expense', 'despesa', 'Despesa', 'Expense'])
        .gte('competence', startDate)
        .lte('competence', endDate)

    if (classError) {
        console.error('[getDashboardMetrics] Error fetching classifications:', classError)
    }

    const classificationMap: Record<string, { value: number; color: string; name: string }> = {}

        // Safe handling if classificationTransactions is null/undefined
        ; (classificationTransactions || []).forEach((t: any) => {
            const classificationId = t.classification_id || 'unknown'
            const classificationName = t.classifications?.name || 'Outros'
            const classificationColor = t.classifications?.color || '#71717a'
            const amount = Number(t.amount) || 0

            if (!classificationMap[classificationId]) {
                classificationMap[classificationId] = { value: 0, color: classificationColor, name: classificationName }
            } else {
                classificationMap[classificationId].value += amount
            }
        })

    const classificationData = Object.values(classificationMap)
        .map((data) => ({
            classification: data.name,
            value: data.value,
            color: data.color
        }))
        .sort((a, b) => b.value - a.value)

    return {
        summary,
        categoryData,
        classificationData
    }
}
