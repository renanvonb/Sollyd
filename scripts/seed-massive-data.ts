import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { format, addMonths, startOfMonth, endOfMonth, addDays, subDays } from 'date-fns'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedMassiveData() {
    console.log('🚀 Iniciando Mock Massivo de Dados (150 tx/mês)...')

    const email = 'testedev@gmail.com'
    const password = 'Teste123'

    // 1. Login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (signInError) {
        console.error('❌ Erro ao entrar:', signInError.message)
        return
    }

    const userId = signInData.user?.id
    if (!userId) return

    console.log(`✅ Usuário autenticado: ${userId}`)

    // 2. Limpar transações existentes para evitar duplicidade ou inconsistência
    console.log('🧹 Limpando transações antigas...')
    await supabase.from('transactions').delete().eq('user_id', userId)

    // 3. Estrutura de Categorias e Subcategorias
    const categoriesStructure = [
        {
            name: 'Alimentação', type: 'Despesa', color: 'orange', icon: 'utensils',
            subs: ['Supermercado', 'Restaurantes', 'Ifood/Delivery', 'Cafeteria']
        },
        {
            name: 'Transporte', type: 'Despesa', color: 'blue', icon: 'car',
            subs: ['Combustível', 'Uber/99', 'Manutenção', 'Estacionamento']
        },
        {
            name: 'Lazer', type: 'Despesa', color: 'purple', icon: 'clapperboard',
            subs: ['Cinema', 'Viagens', 'Shows', 'Hobbies']
        },
        {
            name: 'Saúde', type: 'Despesa', color: 'red', icon: 'heart-pulse',
            subs: ['Farmácia', 'Consultas', 'Exames', 'Academia']
        },
        {
            name: 'Educação', type: 'Despesa', color: 'indigo', icon: 'graduation-cap',
            subs: ['Cursos', 'Livros', 'Mensalidade', 'Materiais']
        },
        {
            name: 'Receitas Fixas', type: 'Receita', color: 'emerald', icon: 'banknote',
            subs: ['Salário', 'Bônus', 'Dividendos']
        },
        {
            name: 'Extra', type: 'Receita', color: 'cyan', icon: 'plus-circle',
            subs: ['Freelance', 'Venda de itens', 'Reembolsos']
        }
    ]

    console.log('📂 Criando estrutura de categorias...')
    const catMap = new Map()
    const subMap = new Map()

    for (const cat of categoriesStructure) {
        const { data: catData } = await supabase.from('categories')
            .upsert({ name: cat.name, type: cat.type, color: cat.color, user_id: userId }, { onConflict: 'name,user_id' })
            .select().single()

        if (catData) {
            catMap.set(cat.name, catData.id)
            for (const subName of cat.subs) {
                const { data: subData } = await supabase.from('subcategories')
                    .upsert({ name: subName, category_id: catData.id, user_id: userId }, { onConflict: 'name,category_id,user_id' })
                    .select().single()
                if (subData) {
                    const existingSubs = subMap.get(cat.name) || []
                    subMap.set(cat.name, [...existingSubs, subData.id])
                }
            }
        }
    }

    // 4. Carteira e Classificações
    const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', userId).limit(1).single()
    const { data: classData } = await supabase.from('classifications').select('id, name').eq('user_id', userId)

    const walletId = wallet?.id
    const essentialId = classData?.find(c => c.name === 'Essencial')?.id
    const lifestyleId = classData?.find(c => c.name === 'Estilo de Vida')?.id

    // 5. Favorecidos Aleatórios
    const payees = ['Posto Ipiranga', 'Mercado Central', 'Farmácia Preço Popular', 'Starbucks', 'Uber Technologies', 'McDonalds', 'Amazon BR', 'Netflix']
    const payeeIds = []
    for (const p of payees) {
        const { data } = await supabase.from('payees').upsert({ name: p, user_id: userId, type: 'favored' }, { onConflict: 'name,user_id' }).select().single()
        if (data) payeeIds.push(data.id)
    }

    // 6. Geração Massiva (150 tx por mês)
    console.log('📅 Gerando 1800 transações para 2026...')
    const allTransactions = []

    for (let month = 0; month < 12; month++) {
        const monthDate = addMonths(new Date(2026, 0, 1), month)
        const daysInMonth = 28 // Simplificando para garantir range

        // Transações Fixas
        allTransactions.push({
            user_id: userId,
            description: 'Salário Principal',
            amount: 12000,
            type: 'revenue',
            category_id: catMap.get('Receitas Fixas'),
            subcategory_id: subMap.get('Receitas Fixas')?.[0],
            wallet_id: walletId,
            date: format(startOfMonth(monthDate), 'yyyy-MM-dd'),
            status: 'Realizado'
        })

        // 149 transações aleatórias por mês
        for (let i = 0; i < 149; i++) {
            const isRevenue = Math.random() > 0.85 // 15% chances de ser receita extra
            const catName = isRevenue ? 'Extra' : categoriesStructure[Math.floor(Math.random() * 5)].name // Só as 5 primeiras são despesas

            const randomDay = Math.floor(Math.random() * daysInMonth) + 1
            const txDate = addDays(startOfMonth(monthDate), randomDay)

            allTransactions.push({
                user_id: userId,
                description: isRevenue ? `Freelance Projeto ${i}` : `Compra ${payees[Math.floor(Math.random() * payees.length)]}`,
                amount: isRevenue ? (500 + Math.random() * 2000) : (10 + Math.random() * 400),
                type: isRevenue ? 'revenue' : 'expense',
                category_id: catMap.get(catName),
                subcategory_id: subMap.get(catName)?.[Math.floor(Math.random() * subMap.get(catName).length)],
                classification_id: isRevenue ? null : (Math.random() > 0.5 ? essentialId : lifestyleId),
                payee_id: isRevenue ? null : payeeIds[Math.floor(Math.random() * payeeIds.length)],
                wallet_id: walletId,
                date: format(txDate, 'yyyy-MM-dd'),
                status: 'Realizado'
            })
        }
    }

    // Inserir em chunks de 500 para evitar timeout/limite de payload
    console.log('📦 Inserindo dados no banco...')
    for (let i = 0; i < allTransactions.length; i += 500) {
        const chunk = allTransactions.slice(i, i + 500)
        const { error } = await supabase.from('transactions').insert(chunk)
        if (error) {
            console.error('❌ Erro no chunk:', error.message)
        } else {
            console.log(`✅ Inseridas ${i + chunk.length}/${allTransactions.length} transações`)
        }
    }

    console.log('✨ Mock massivo concluído com sucesso!')
}

seedMassiveData().catch(console.error)
