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

export type TimeRange = 'dia' | 'semana' | 'mes' | 'ano' | 'custom'

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

    const { data, error } = await supabase
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
        .gte('competence', format(start, 'yyyy-MM-dd'))
        .lte('competence', format(end, 'yyyy-MM-dd'))
        .order('competence', { ascending: false })
        .order('created_at', { ascending: false })

    console.log('[getTransactions] Result:', { count: data?.length || 0, error: error?.message })

    if (error) {
        console.error('[getTransactions] Query Error:', error.message)
        return []
    }

    return data as any[]
}
