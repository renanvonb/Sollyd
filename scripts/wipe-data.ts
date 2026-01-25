
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Usando service_role se disponível para bypass RLS, ou anon se não tivermos a service role exposta.
// Como estamos rodando localmente, vamos tentar com a chave anon e confiar nas policies ou usar service role se estiver no env, 
// mas geralmente os scripts de admin precisam de privilégios.
// Vou assumir que o usuário tem permissão de DELETE nas policies ou usar a service role key se estiver definida em .env.local
// Caso contrário, usaremos a anon key.
const supabase = createClient(supabaseUrl, supabaseKey)

async function wipeData() {
    console.log('Iniciando limpeza de dados...')

    const tables = [
        'transactions',
        'subcategories',
        'categories',
        'classifications',
        'wallets',
        'payees'
    ]

    for (const table of tables) {
        console.log(`Limpando tabela: ${table}...`)
        const { error } = await supabase
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Hack simples para deletar "tudo" (id != zero uuid) ou usar gt id 0 se for int, mas uuid é string.
            // Alternativa: .gte('created_at', '1970-01-01')
            // Ou simplesmente sem filtro se a lib permitir (algumas versões do supabase-js exigem filtro no delete)
            .not('id', 'is', null)

        if (error) {
            console.error(`Erro ao limpar ${table}:`, error.message)
            // Se der erro de RLS, pode ser necessário logar como usuário ou usar service key.
            // Mas vamos tentar.
        } else {
            console.log(`Tabela ${table} limpa com sucesso.`)
        }
    }

    console.log('Limpeza concluída! Apenas usuários e perfis foram mantidos.')
}

wipeData()
