import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugConstraints() {
    const { data, error } = await supabase.rpc('get_constraints', { table_name: 'categories' })
    if (error) {
        // If RPC doesn't exist, we can try a raw query if we have a service role or just try to insert and see the error again
        console.log('RPC failed, trying simple select...')
        const { data: cat } = await supabase.from('categories').select('*').limit(5)
        console.log('Categories data sample:', cat)
    } else {
        console.log('Constraints:', data)
    }
}

debugConstraints()
