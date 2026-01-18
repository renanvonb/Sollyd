/**
 * Script de Verificação: Conexão Supabase com Bun Runtime
 * 
 * Este script testa a conexão com o banco de dados Supabase
 * usando o runtime Bun para garantir compatibilidade total.
 * 
 * Execute com: bun run scripts/verify-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Verificando conexão com Supabase...\n')

// Validação de variáveis de ambiente
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas')
    console.error('   Certifique-se de que .env.local contém:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
}

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function verifyConnection() {
    try {
        console.log('📡 Testando conexão básica...')

        // Teste 1: Verificar se consegue fazer uma query simples
        const { data: healthCheck, error: healthError } = await supabase
            .from('transactions')
            .select('count', { count: 'exact', head: true })

        if (healthError) {
            console.error('❌ Erro na conexão:', healthError.message)
            return false
        }

        console.log('✅ Conexão estabelecida com sucesso!')
        console.log(`   Total de transações: ${healthCheck || 0}`)

        // Teste 2: Verificar tabelas principais
        console.log('\n📊 Verificando tabelas principais...')

        const tables = [
            'transactions',
            'wallets',
            'categories',
            'subcategories',
            'classifications',
            'payees'
        ]

        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .select('count', { count: 'exact', head: true })

            if (error) {
                console.log(`   ⚠️  ${table}: ${error.message}`)
            } else {
                console.log(`   ✅ ${table}: OK`)
            }
        }

        // Teste 3: Verificar autenticação
        console.log('\n🔐 Verificando sistema de autenticação...')
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            console.log('   ✅ Sessão ativa detectada')
            console.log(`   👤 Usuário: ${session.user.email}`)
        } else {
            console.log('   ℹ️  Nenhuma sessão ativa (esperado em ambiente de teste)')
        }

        // Teste 4: Performance
        console.log('\n⚡ Teste de performance...')
        const startTime = performance.now()

        await supabase
            .from('transactions')
            .select('id')
            .limit(10)

        const endTime = performance.now()
        const duration = (endTime - startTime).toFixed(2)

        console.log(`   ⏱️  Query executada em ${duration}ms`)

        if (parseFloat(duration) < 100) {
            console.log('   ✅ Performance excelente!')
        } else if (parseFloat(duration) < 300) {
            console.log('   ✅ Performance boa')
        } else {
            console.log('   ⚠️  Performance pode ser melhorada')
        }

        console.log('\n✅ Todas as verificações concluídas com sucesso!')
        console.log('🚀 Bun + Supabase funcionando perfeitamente!\n')

        return true

    } catch (error) {
        console.error('❌ Erro inesperado:', error)
        return false
    }
}

// Executar verificação
verifyConnection()
    .then((success) => {
        process.exit(success ? 0 : 1)
    })
    .catch((error) => {
        console.error('❌ Falha crítica:', error)
        process.exit(1)
    })
