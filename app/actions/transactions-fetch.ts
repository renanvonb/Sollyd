'use server'

import { createClient } from '@/lib/supabase/server'
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    format,
    parseISO
} from 'date-fns'

import { TimeRange } from '@/types/time-range'


interface GetTransactionsParams {
    range: TimeRange
    startDate?: string
    endDate?: string
}

export async function getTransactions({ range, startDate, endDate }: GetTransactionsParams) {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.warn('[getTransactions] Unauthorized access attempt')
        return []
    }

    const userId = user.id
    let start: Date
    let end: Date
    const referenceDate = startDate ? parseISO(startDate) : new Date()

    // Lógica de intervalos
    if (startDate && endDate) {
        // Use custom date range if both are provided
        start = startOfDay(parseISO(startDate))
        end = endOfDay(parseISO(endDate))
    } else if (range === 'dia') {
        start = startOfDay(referenceDate)
        end = endOfDay(referenceDate)
    } else if (range === 'semana') {
        start = startOfWeek(referenceDate, { weekStartsOn: 0 })
        end = endOfWeek(referenceDate, { weekStartsOn: 0 })
    } else if (range === 'mes') {
        start = startOfMonth(referenceDate)
        end = endOfMonth(referenceDate)
    } else if (range === 'ano') {
        start = startOfYear(referenceDate)
        end = endOfYear(referenceDate)
    } else {
        start = startOfMonth(referenceDate)
        end = endOfMonth(referenceDate)
    }

    console.log('[getTransactions] Params:', { range, startDate, endDate })
    console.log('[getTransactions] Date Range:', {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    })

    // Timeout promise
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 15000)
    )

    try {
        const startStr = format(start, 'yyyy-MM-dd')
        const endStr = format(end, 'yyyy-MM-dd')

        // Executar a query de forma mais robusta
        const query = supabase
            .from('transactions')
            .select(`
                *,
                payees(id, name),
                classifications(id, name, color),
                categories(id, name, color),
                subcategories(id, name),
                wallets(id, name, color)
            `)
            .eq('user_id', userId)
            // Filtro simplificado e mais performático (busca tanto em competência quanto em data)
            .gte('competence', startStr)
            .lte('competence', endStr)
            .order('competence', { ascending: false })
            .order('created_at', { ascending: false });

        const { data, error } = await Promise.race([
            query,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 30000))
        ]) as any

        if (error) {
            console.error('[getTransactions] Query Error:', error.message)
            return []
        }

        return data || []
    } catch (error) {
        console.error('[getTransactions] Unexpected error or timeout:', error)
        return []
    }
}
