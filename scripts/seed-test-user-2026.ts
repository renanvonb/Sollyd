import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { format, addMonths, startOfMonth, setDate, addDays } from 'date-fns'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    console.log('🚀 Iniciando criação de usuário e mock de dados para 2026...')

    const email = 'testedev@gmail.com'
    const password = 'Teste123'
    const fullName = 'José Carlos Aguiar'

    // 1. Criar o usuário
    console.log(`👤 Tentando criar usuário: ${email}`)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })

    if (signUpError) {
        if (signUpError.message.includes('already registered')) {
            console.log('ℹ️ Usuário já cadastrado. Continuando com o login...')
        } else {
            console.error('❌ Erro ao criar usuário:', signUpError.message)
            return
        }
    }

    // Fazer login para garantir que temos a sessão e o ID correto
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (signInError) {
        console.error('❌ Erro ao entrar com o usuário:', signInError.message)
        return
    }

    const userId = signInData.user?.id
    if (!userId) {
        console.error('❌ Erro: ID do usuário não encontrado.')
        return
    }

    console.log(`✅ Usuário autenticado! ID: ${userId}`)

    // 2. Criar Carteiras
    console.log('💳 Criando carteiras...')
    const { data: walletData, error: walletError } = await supabase.from('wallets').insert([
        { name: 'Carteira Principal', user_id: userId, is_principal: true, color: 'blue', icon: 'wallet' },
        { name: 'Banco Sollyd', user_id: userId, is_principal: false, color: 'emerald', icon: 'building-2' }
    ]).select()

    if (walletError) console.warn('⚠️ Erro ao criar carteiras (pode já existir):', walletError.message)
    const walletId = walletData?.[0]?.id || (await supabase.from('wallets').select('id').eq('user_id', userId).limit(1).single()).data?.id

    // 3. Criar Classificações
    console.log('🏷️ Criando classificações...')
    const { data: classData, error: classError } = await supabase.from('classifications').insert([
        { name: 'Essencial', color: 'red', user_id: userId },
        { name: 'Investimento', color: 'blue', user_id: userId },
        { name: 'Estilo de Vida', color: 'purple', user_id: userId }
    ]).select()

    const essentialId = classData?.find(c => c.name === 'Essencial')?.id
    const investmentId = classData?.find(c => c.name === 'Investimento')?.id
    const lifestyleId = classData?.find(c => c.name === 'Estilo de Vida')?.id

    // 4. Criar Categorias e Subcategorias
    console.log('📁 Criando categorias...')
    const categories = [
        { name: 'Moradia', type: 'Despesa', color: 'amber' },
        { name: 'Alimentação', type: 'Despesa', color: 'orange' },
        { name: 'Transporte', type: 'Despesa', color: 'blue' },
        { name: 'Salário', type: 'Receita', color: 'emerald' },
        { name: 'Freelance', type: 'Receita', color: 'cyan' }
    ]

    const seededCategories = []
    for (const cat of categories) {
        const { data, error } = await supabase.from('categories').insert({ ...cat, user_id: userId }).select().single()
        if (data) seededCategories.push(data)
    }

    const moradiaId = seededCategories.find(c => c.name === 'Moradia')?.id
    const alimentacaoId = seededCategories.find(c => c.name === 'Alimentação')?.id
    const salarioId = seededCategories.find(c => c.name === 'Salário')?.id

    // 5. Pagadores e Favorecidos
    console.log('👤 Criando pagadores e favorecidos...')
    await supabase.from('payees').insert([
        { name: 'Supermercado ABC', user_id: userId, color: 'orange', type: 'favored' },
        { name: 'Imobiliária House', user_id: userId, color: 'amber', type: 'favored' },
        { name: 'Empresa Tech', user_id: userId, color: 'emerald', type: 'payer' }
    ])

    const { data: payees } = await supabase.from('payees').select('*').eq('user_id', userId)
    const marketId = payees?.find(p => p.name === 'Supermercado ABC')?.id
    const rentId = payees?.find(p => p.name === 'Imobiliária House')?.id
    const companyId = payees?.find(p => p.name === 'Empresa Tech')?.id

    // 6. Gerar Transações para todos os meses de 2026
    console.log('📅 Gerando transações para 2026...')
    const transactions = []

    for (let month = 0; month < 12; month++) {
        const monthDate = addMonths(new Date(2026, 0, 1), month)
        const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')

        // Receita: Salário
        transactions.push({
            user_id: userId,
            description: 'Salário Mensal',
            amount: 8500.00,
            type: 'revenue',
            category_id: salarioId,
            payee_id: companyId,
            wallet_id: walletId,
            date: dateStr(startOfMonth(monthDate)),
            competence: dateStr(startOfMonth(monthDate)),
            status: 'Realizado'
        })

        // Despesa: Aluguel
        transactions.push({
            user_id: userId,
            description: 'Aluguel ' + format(monthDate, 'MMMM/yyyy'),
            amount: 2500.00,
            type: 'expense',
            category_id: moradiaId,
            classification_id: essentialId,
            payee_id: rentId,
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 4)),
            competence: dateStr(startOfMonth(monthDate)),
            status: 'Realizado'
        })

        // Despesas: Mercado (várias)
        for (let i = 1; i <= 4; i++) {
            transactions.push({
                user_id: userId,
                description: `Compras Mercado - Semana ${i}`,
                amount: 300 + Math.random() * 200,
                type: 'expense',
                category_id: alimentacaoId,
                classification_id: essentialId,
                payee_id: marketId,
                wallet_id: walletId,
                date: dateStr(addDays(startOfMonth(monthDate), i * 7 - 2)),
                competence: dateStr(startOfMonth(monthDate)),
                status: 'Realizado'
            })
        }

        // Algo extras aleatórios
        transactions.push({
            user_id: userId,
            description: 'Lazer com a família',
            amount: 200 + Math.random() * 500,
            type: 'expense',
            classification_id: lifestyleId,
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 15)),
            competence: dateStr(startOfMonth(monthDate)),
            status: 'Realizado'
        })
    }

    console.log(`📝 Inserindo ${transactions.length} transações...`)
    const { error: insertError } = await supabase.from('transactions').insert(transactions)

    if (insertError) {
        console.error('❌ Erro ao inserir transações:', insertError.message)
    } else {
        console.log('✅ Mock de dados concluído com sucesso!')
        console.log('\n--- CREDENCIAIS DE ACESSO ---')
        console.log(`Email: ${email}`)
        console.log(`Senha: ${password}`)
        console.log('----------------------------')
    }
}

seed().catch(console.error)
