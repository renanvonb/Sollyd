
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCompetence() {
    console.log('Checking transactions for NULL competence...')

    const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .is('competence', null)

    if (error) {
        console.error('Error checking:', error)
        return
    }

    console.log(`Found ${count} transactions with NULL competence.`)

    if (count && count > 0) {
        console.log('Fixing NULL competence by copying from date or created_at...')

        // Fetch them to fix
        const { data: nullTransactions } = await supabase
            .from('transactions')
            .select('id, date, created_at')
            .is('competence', null)
            .limit(1000)

        if (!nullTransactions) return

        let fixed = 0
        for (const tx of nullTransactions) {
            const newCompetence = tx.date || tx.created_at
            if (newCompetence) {
                const { error: updateError } = await supabase
                    .from('transactions')
                    .update({ competence: newCompetence })
                    .eq('id', tx.id)

                if (!updateError) fixed++
            }
        }
        console.log(`Fixed ${fixed} transactions.`)
    } else {
        console.log('All transactions have competence set.')
    }
}

checkCompetence()
