import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import LeadDetailView from '@/components/leads/LeadDetailView'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: lead } = await supabase
    .from('pipeline_leads')
    .select('*')
    .eq('id', id)
    .single()

  if (!lead) {
    notFound()
  }

  const { data: activities } = await supabase
    .from('pipeline_activities')
    .select('*')
    .eq('lead_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-animated relative">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <LeadDetailView lead={lead} activities={activities || []} />
      </main>
    </div>
  )
}
