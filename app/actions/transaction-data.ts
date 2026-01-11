'use server'

import { createClient } from '@/lib/supabase/server'
import { PaymentMethod, Category, Subcategory, Payee, Payer } from '@/types/transaction'
import { unstable_noStore as noStore } from 'next/cache'

export async function getPaymentMethods() {
    noStore()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name')

    if (error) {
        console.error('[getPaymentMethods] Error:', error)
        return []
    }

    return (data || []) as PaymentMethod[]
}

export async function getPayers() {
    noStore()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('payers')
        .select('*')
        .order('name')

    if (error) {
        console.error('[getPayers] Error:', error)
        return []
    }

    return (data || []) as Payer[]
}

export async function getPayees() {
    noStore()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('payees')
        .select('*')
        .order('name')

    if (error) {
        console.error('[getPayees] Error:', error)
        return []
    }

    return (data || []) as Payee[]
}

export async function getCategories() {
    noStore()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (error) {
        console.error('[getCategories] Error:', error)
        return []
    }

    return (data || []) as Category[]
}

export async function getSubcategories(categoryId: string) {
    noStore()
    if (!categoryId) return []

    const supabase = createClient()
    const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .order('name')

    if (error) {
        console.error('[getSubcategories] Error:', error)
        return []
    }

    return (data || []) as Subcategory[]
}
