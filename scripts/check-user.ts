import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkUser() {
    // Note: We can only check public data or meta_data if we have the session
    // Since we don't have service role key easily accessible via env (I checked earlier), 
    // we can try to find if there's a profile table or similar.

    const { data: categories } = await supabase.from('categories').select('user_id').limit(1)
    console.log('User ID from categories:', categories?.[0]?.user_id)
}

checkUser()
