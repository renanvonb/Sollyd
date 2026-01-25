
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndClean() {
    console.log('Verificando Classifications...')

    // Check base table
    const { data: list, error } = await supabase
        .from('classifications')
        .select('*')

    if (error) {
        console.error('Erro ao ler classifications:', error)
    } else {
        console.log(`Classifications encontradas: ${list.length}`)
        if (list.length > 0) {
            console.log('Dados encontrados:', list.map(c => c.name).join(', '))
            console.log('Tentando limpar novamente...')

            // Tenta deletar um por um para ver se algum falha
            for (const item of list) {
                const { error: delError } = await supabase
                    .from('classifications')
                    .delete()
                    .eq('id', item.id)

                if (delError) {
                    console.error(`Falha ao deletar ${item.name}: ${delError.message}`)
                } else {
                    console.log(`Deletado: ${item.name}`)
                }
            }
        } else {
            console.log('Tabela classifications está vazia.')
        }
    }

    // Check if 'classifications_with_counts' is a table we can delete from
    console.log("Verificando 'classifications_with_counts'...")
    const { data: viewList, error: viewError } = await supabase
        .from('classifications_with_counts')
        .select('*')

    if (viewError) {
        // Se for view, pode dar erro ao tentar deletar, mas o select deve funcionar.
        // Se a tabela base está vazia, a view deve estar vazia.
        console.log("Erro/Info view:", viewError.message)
    } else {
        console.log(`Registros na View/Tabela: ${viewList.length}`)
        if (viewList.length > 0) {
            console.log('A view ainda tem dados! Isso significa que a tabela base NÃO foi limpa totalmente ou a view lê de outro lugar.')
            console.log('Dados na view:', viewList.map((c: any) => c.name).join(', '))
        } else {
            console.log('View está vazia.')
        }
    }
}

checkAndClean()
