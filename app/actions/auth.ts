'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const origin = (await import('next/headers')).headers().get('origin')

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/login?error=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function updateProfile(data: { full_name?: string; avatar_url?: string | null }) {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new Error('Usuário não autenticado')
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: data.full_name,
            avatar_url: data.avatar_url
        }
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
