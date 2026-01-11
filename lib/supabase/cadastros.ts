// =====================================================
// SOLLYD - Types e Queries para Módulo de Cadastros
// =====================================================

import { createClient } from '@/lib/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface Wallet {
    id: string;
    user_id: string;
    name: string;
    logo_url?: string;
    created_at: string;
    updated_at: string;
}

export interface IncomeCategory {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ExpenseCategory {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Subcategory {
    id: string;
    user_id: string;
    name: string;
    expense_category_id?: string;
    category_id?: string; // Para compatibilidade com schema antigo
    created_at: string;
    updated_at: string;
    expense_categories?: ExpenseCategory; // Joined data
}

export interface Classification {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

// Pagadores (para Receitas) - com ícone
export interface Payer {
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon: string;
    created_at: string;
    updated_at: string;
}

// Favorecidos (para Despesas) - com ícone
export interface Payee {
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon: string;
    created_at: string;
    updated_at: string;
}

// =====================================================
// CRUD OPERATIONS - WALLETS
// =====================================================

export async function getWallets(): Promise<Wallet[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createWallet(wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Wallet> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('wallets')
        .insert({ ...wallet, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateWallet(id: string, wallet: Partial<Wallet>): Promise<Wallet> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('wallets')
        .update(wallet)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteWallet(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// CRUD OPERATIONS - INCOME CATEGORIES
// =====================================================

export async function getIncomeCategories(): Promise<IncomeCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('income_categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createIncomeCategory(category: Omit<IncomeCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<IncomeCategory> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('income_categories')
        .insert({ ...category, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateIncomeCategory(id: string, category: Partial<IncomeCategory>): Promise<IncomeCategory> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('income_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteIncomeCategory(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('income_categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// CRUD OPERATIONS - EXPENSE CATEGORIES
// =====================================================

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createExpenseCategory(category: Omit<ExpenseCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ExpenseCategory> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('expense_categories')
        .insert({ ...category, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateExpenseCategory(id: string, category: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('expense_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteExpenseCategory(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('expense_categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// CRUD OPERATIONS - SUBCATEGORIES
// =====================================================

export async function getSubcategories(): Promise<Subcategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('subcategories')
        .select(`
            *,
            expense_categories (
                id,
                name
            )
        `)
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createSubcategory(subcategory: Omit<Subcategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Subcategory> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('subcategories')
        .insert({ ...subcategory, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateSubcategory(id: string, subcategory: Partial<Subcategory>): Promise<Subcategory> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('subcategories')
        .update(subcategory)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteSubcategory(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// CRUD OPERATIONS - CLASSIFICATIONS
// =====================================================

export async function getClassifications(): Promise<Classification[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('classifications')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function createClassification(classification: Omit<Classification, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Classification> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('classifications')
        .insert({ ...classification, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateClassification(id: string, classification: Partial<Classification>): Promise<Classification> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('classifications')
        .update(classification)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteClassification(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('classifications')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================================================
// CRUD OPERATIONS - PAYEES (Favorecidos)
// =====================================================

export async function getPayees(): Promise<Payee[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payees')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Erro ao buscar favorecidos:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para visualizar favorecidos.');
        }
        throw error;
    }
    return data || [];
}

export async function createPayee(payee: Omit<Payee, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Payee> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payees')
        .insert({ ...payee, user_id: user.id })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar favorecido:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para criar favorecido.');
        }
        throw error;
    }
    return data;
}

export async function updatePayee(id: string, payee: Partial<Payee>): Promise<Payee> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payees')
        .update(payee)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar favorecido:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para atualizar este favorecido.');
        }
        throw error;
    }
    return data;
}

export async function deletePayee(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
        .from('payees')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir favorecido:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para excluir este favorecido.');
        }
        throw error;
    }
}

// =====================================================
// CRUD OPERATIONS - PAYERS (Pagadores - para Receitas)
// =====================================================

export async function getPayers(): Promise<Payer[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Erro ao buscar pagadores:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para visualizar pagadores.');
        }
        throw error;
    }
    return data || [];
}

export async function createPayer(payer: Omit<Payer, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Payer> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payers')
        .insert({ ...payer, user_id: user.id })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar pagador:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para criar pagador.');
        }
        throw error;
    }
    return data;
}

export async function updatePayer(id: string, payer: Partial<Payer>): Promise<Payer> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
        .from('payers')
        .update(payer)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar pagador:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para atualizar este pagador.');
        }
        throw error;
    }
    return data;
}

export async function deletePayer(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
        .from('payers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir pagador:', error);
        if (error.code === '42501' || error.code === '403') {
            throw new Error('Sem permissão para excluir este pagador.');
        }
        throw error;
    }
}
