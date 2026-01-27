import * as React from "react"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getTransactions } from "@/app/actions/transactions-fetch"
import { TimeRange } from "@/types/time-range"
import { getDashboardMetrics } from "@/app/actions/dashboard-metrics"
import { DashboardSkeleton } from "@/components/ui/skeletons"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardGraphs } from "@/components/dashboard-graphs"

interface DashboardPageProps {
    searchParams: {
        range?: string
        from?: string
        to?: string
        q?: string
        year?: string
        status?: string
    }
}

async function DashboardContent({ searchParams }: DashboardPageProps) {
    const range = (searchParams.range as TimeRange) || 'mes'
    const from = searchParams.from
    const to = searchParams.to
    const status = searchParams.status // Default to undefined (server fetches all), Client handles view default.
    const competenceDate = from ? from : new Date().toISOString()

    // Data fetching (Server Side)
    const [metrics, initialData] = await Promise.all([
        getDashboardMetrics({
            range,
            startDate: from,
            endDate: to,
            competence: competenceDate,
            status
        }),
        getTransactions({
            range,
            startDate: from,
            endDate: to,
            status
        })
    ])

    return <DashboardGraphs initialData={initialData} metrics={metrics} />
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <DashboardHeader userName={userName} />
            <Suspense key={JSON.stringify(searchParams)} fallback={<DashboardSkeleton />}>
                <DashboardContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
