import * as React from "react"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "@/components/dashboard-client"
import { getTransactions, TimeRange } from "@/app/actions/transactions-fetch"
import { getDashboardMetrics } from "@/app/actions/dashboard-metrics"
import { DashboardSkeleton } from "@/components/ui/skeletons"

interface DashboardPageProps {
    searchParams: {
        range?: string
        from?: string
        to?: string
        q?: string
    }
}

async function DashboardContent({ searchParams }: DashboardPageProps) {
    const range = (searchParams.range as TimeRange) || 'mes'
    const from = searchParams.from
    const to = searchParams.to

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'

    // Determine competence for metrics (default to current month start if not provided or if range is 'dia' etc - treating 'from' as anchor)
    // If range is 'mes', 'from' usually holds the start date.
    const competenceDate = from ? from : new Date().toISOString()

    // Fetch specifically requested metrics (Server-Side Aggregation)
    const metrics = await getDashboardMetrics({ competence: competenceDate })

    // Keep fetching initialData for other components (like table list if it exists, or other charts)
    const initialData = await getTransactions({
        range,
        startDate: from,
        endDate: to,
    })

    return <DashboardClient initialData={initialData} userName={userName} metrics={metrics} />
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent searchParams={searchParams} />
        </Suspense>
    )
}
