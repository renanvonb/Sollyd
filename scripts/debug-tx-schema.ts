import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugSchema() {
    const { data: tx, error } = await supabase.from('transactions').select('*').limit(1)
    if (error) {
        console.error('Error:', error)
        return
    }
    console.log('Transaction columns:', Object.keys(tx[0] || {}))
}

debugSchema()
