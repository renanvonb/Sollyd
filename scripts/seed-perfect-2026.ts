import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { format, addMonths, startOfMonth, setDate, addDays } from 'date-fns'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    console.log('🚀 Iniciando seeding de dados PERFEITOS para testedev@gmail.com...')

    const email = 'testedev@gmail.com'
    const password = 'Teste123'
    const fullName = 'José Carlos Aguiar'

    // 1. Garantir Usuário
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    let userId: string;

    if (signInError) {
        console.log(`👤 Usuário não encontrado ou erro no login. Tentando criar...`)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        })
        if (signUpError) {
            console.error('❌ Erro fatal ao garantir usuário:', signUpError.message)
            return
        }
        userId = signUpData.user?.id!
    } else {
        userId = signInData.user?.id!
    }

    console.log(`✅ Usuário ID: ${userId}`)

    // 2. Limpeza opcional para garantir integridade (Somente transações e cadastros do usuário)
    console.log('🧹 Limpando dados antigos para evitar duplicidade...')
    await supabase.from('transactions').delete().eq('user_id', userId)
    await supabase.from('subcategories').delete().in('category_id', (await supabase.from('categories').select('id').eq('user_id', userId)).data?.map(c => c.id) || [])
    await supabase.from('categories').delete().eq('user_id', userId)
    await supabase.from('payees').delete().eq('user_id', userId)
    await supabase.from('classifications').delete().eq('user_id', userId)
    await supabase.from('wallets').delete().eq('user_id', userId)

    // 3. Carteiras
    console.log('💳 Criando carteiras...')
    const { data: wallets } = await supabase.from('wallets').insert([
        { name: 'Nubank Principal', user_id: userId, color: 'purple', icon: 'credit-card' },
        { name: 'Dinheiro (Espécie)', user_id: userId, color: 'emerald', icon: 'banknote' }
    ]).select()
    const walletId = wallets![0].id

    // 4. Classificações
    console.log('🏷️ Criando classificações...')
    const { data: classes } = await supabase.from('classifications').insert([
        { name: 'Essencial', user_id: userId, color: 'red' },
        { name: 'Necessário', user_id: userId, color: 'amber' },
        { name: 'Lazer', user_id: userId, color: 'blue' },
        { name: 'Investimento', user_id: userId, color: 'emerald' }
    ]).select()
    const classMap = Object.fromEntries(classes!.map(c => [c.name, c.id]))

    // 5. Categorias e Subcategorias
    console.log('📁 Criando categorias...')
    const catSpecs = [
        { name: 'Moradia', type: 'Despesa', color: 'amber', subs: ['Aluguel', 'Condomínio', 'Energia', 'Internet'] },
        { name: 'Alimentação', type: 'Despesa', color: 'orange', subs: ['Mercado', 'Restaurante', 'Delivery'] },
        { name: 'Transporte', type: 'Despesa', color: 'blue', subs: ['Combustível', 'Uber/99', 'Manutenção'] },
        { name: 'Saúde', type: 'Despesa', color: 'rose', subs: ['Plano de Saúde', 'Farmácia', 'Consultas'] },
        { name: 'Receita Fixa', type: 'Receita', color: 'emerald', subs: ['Salário', 'Pró-labore'] },
        { name: 'Receita Variável', type: 'Receita', color: 'cyan', subs: ['Dividendos', 'Freelance', 'Vendas'] }
    ]

    const subMap: Record<string, string> = {}
    const catMap: Record<string, string> = {}

    for (const spec of catSpecs) {
        const { data: cat } = await supabase.from('categories').insert({
            name: spec.name,
            type: spec.type, // Receita / Despesa
            color: spec.color,
            user_id: userId,
            icon: 'folder'
        }).select().single()

        if (cat) {
            catMap[spec.name] = cat.id
            for (const subName of spec.subs) {
                const { data: sub } = await supabase.from('subcategories').insert({
                    name: subName,
                    category_id: cat.id,
                    user_id: userId
                }).select().single()
                if (sub) subMap[`${spec.name}>${subName}`] = sub.id
            }
        }
    }

    // 6. Contatos (Pagadores e Beneficiários)
    console.log('👤 Criando contatos...')
    const { data: contacts } = await supabase.from('payees').insert([
        { name: 'Sollyd Tech Solutions', user_id: userId, type: 'payer', color: 'emerald', icon: 'building' },
        { name: 'Imobiliária Central', user_id: userId, type: 'favored', color: 'amber', icon: 'home' },
        { name: 'Pão de Açúcar', user_id: userId, type: 'favored', color: 'emerald', icon: 'shopping-cart' },
        { name: 'Posto Shell', user_id: userId, type: 'favored', color: 'amber', icon: 'fuel' },
        { name: 'XP Investimentos', user_id: userId, type: 'both', color: 'blue', icon: 'trending-up' },
        { name: 'Ifood Delivery', user_id: userId, type: 'favored', color: 'red', icon: 'truck' },
        { name: 'Farmácia Raia', user_id: userId, type: 'favored', color: 'rose', icon: 'first-aid' }
    ]).select()
    const contactMap = Object.fromEntries(contacts!.map(c => [c.name, c.id]))

    // 7. Transações (Todo 2026)
    console.log('📅 Gerando transações densas para 2026...')

    const txs = []

    for (let m = 0; m < 12; m++) {
        const monthDate = addMonths(new Date(2026, 0, 1), m)
        const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
        const compStr = dateStr(startOfMonth(monthDate))

        // --- RECEITAS ---
        // Salário (Dia 01)
        txs.push({
            user_id: userId,
            description: 'Salário Mensal - Sollyd Tech',
            amount: 12500.00,
            type: 'revenue', // revenue / expense
            category_id: catMap['Receita Fixa'],
            subcategory_id: subMap['Receita Fixa>Salário'],
            payee_id: contactMap['Sollyd Tech Solutions'],
            wallet_id: walletId,
            date: dateStr(startOfMonth(monthDate)),
            competence: compStr,
            status: 'Realizado'
        })

        // Dividendos (Dia 15)
        txs.push({
            user_id: userId,
            description: 'Dividendos Mensais',
            amount: 450.00 + Math.random() * 200,
            type: 'revenue',
            category_id: catMap['Receita Variável'],
            subcategory_id: subMap['Receita Variável>Dividendos'],
            payee_id: contactMap['XP Investimentos'],
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 14)),
            competence: compStr,
            status: 'Realizado'
        })

        // --- DESPESAS FIXAS ---
        // Aluguel
        txs.push({
            user_id: userId,
            description: 'Aluguel do Apartamento',
            amount: 3200.00,
            type: 'expense',
            category_id: catMap['Moradia'],
            subcategory_id: subMap['Moradia>Aluguel'],
            classification_id: classMap['Essencial'],
            payee_id: contactMap['Imobiliária Central'],
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 4)),
            competence: compStr,
            status: 'Realizado'
        })

        // Energia
        txs.push({
            user_id: userId,
            description: 'Conta de Luz (Energia)',
            amount: 180.00 + Math.random() * 70,
            type: 'expense',
            category_id: catMap['Moradia'],
            subcategory_id: subMap['Moradia>Energia'],
            classification_id: classMap['Essencial'],
            payee_id: contactMap['Imobiliária Central'], // Pago como taxa ou direto
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 10)),
            competence: compStr,
            status: 'Realizado'
        })

        // Internet
        txs.push({
            user_id: userId,
            description: 'Mensalidade Internet',
            amount: 120.00,
            type: 'expense',
            category_id: catMap['Moradia'],
            subcategory_id: subMap['Moradia>Internet'],
            classification_id: classMap['Essencial'],
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 12)),
            competence: compStr,
            status: 'Realizado'
        })

        // --- DESPESAS VARIÁVEIS ---
        // Mercado (Semanal)
        for (let w = 0; w < 4; w++) {
            txs.push({
                user_id: userId,
                description: `Compras de Supermercado - Semana ${w + 1}`,
                amount: 400.00 + Math.random() * 300,
                type: 'expense',
                category_id: catMap['Alimentação'],
                subcategory_id: subMap['Alimentação>Mercado'],
                classification_id: classMap['Essencial'],
                payee_id: contactMap['Pão de Açúcar'],
                wallet_id: walletId,
                date: dateStr(addDays(startOfMonth(monthDate), 7 * w + 3)),
                competence: compStr,
                status: 'Realizado'
            })
        }

        // Combustível
        txs.push({
            user_id: userId,
            description: 'Combustível Mensal',
            amount: 300.00,
            type: 'expense',
            category_id: catMap['Transporte'],
            subcategory_id: subMap['Transporte>Combustível'],
            classification_id: classMap['Necessário'],
            payee_id: contactMap['Posto Shell'],
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 18)),
            competence: compStr,
            status: 'Realizado',
            payment_method: 'Débito'
        })

        // Lazer / Delivery (Aleatórios)
        txs.push({
            user_id: userId,
            description: 'Pedido de Jantar (Final de Semana)',
            amount: 80 + Math.random() * 120,
            type: 'expense',
            category_id: catMap['Alimentação'],
            subcategory_id: subMap['Alimentação>Delivery'],
            classification_id: classMap['Lazer'],
            payee_id: contactMap['Ifood Delivery'],
            wallet_id: walletId,
            date: dateStr(addDays(startOfMonth(monthDate), 20)),
            competence: compStr,
            status: 'Realizado',
            payment_method: 'Crédito'
        })
    }

    console.log(`📝 Inserindo ${txs.length} transações completas...`)

    // Split into chunks of 100 to avoid request size limits
    for (let i = 0; i < txs.length; i += 100) {
        const chunk = txs.slice(i, i + 100)
        const { error } = await supabase.from('transactions').insert(chunk)
        if (error) console.error(`❌ Erro no chunk ${i}:`, error.message)
    }

    console.log('✅ BASE DE DADOS COMPLETA E PERFEITA GERADA!')
    console.log('\n--- CREDENCIAIS ---')
    console.log(`Usuário: ${email}`)
    console.log('------------------')
}

seed().catch((err) => {
    console.error('❌ Erro inesperado no script:', err)
})
