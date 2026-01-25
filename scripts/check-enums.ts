import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkEnums() {
    const testTypes = ['revenue', 'income', 'expense', 'investment', 'Receita', 'Despesa']
    for (const t of testTypes) {
        console.log(`Testing type: ${t}`)
        const { error } = await supabase.from('transactions').insert({
            description: 'Test',
            amount: 0,
            type: t,
            user_id: '00000000-0000-0000-0000-000000000000',
            wallet_id: '00000000-0000-0000-0000-000000000000'
        })
        if (error) {
            console.log(`Error for ${t}:`, error.message)
        } else {
            console.log(`Success for ${t}!`)
        }
    }
}

checkEnums()
