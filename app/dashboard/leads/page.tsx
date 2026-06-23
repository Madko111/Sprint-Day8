import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import LeadsTable from '@/components/leads/LeadsTable'
import CreateLeadDialog from '@/components/leads/CreateLeadDialog'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: leads } = await supabase
    .from('pipeline_leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-animated relative">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Leads</h1>
            <p className="text-neutral-300 text-lg">Manage your sales pipeline</p>
          </div>
          <CreateLeadDialog />
        </div>
        
        {leads && leads.length > 0 ? (
          <LeadsTable leads={leads} />
        ) : (
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-12 text-center border border-neutral-800 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-3">No leads yet</h2>
            <p className="text-neutral-400 mb-8 text-lg">
              Create your first lead to start tracking opportunities
            </p>
            <CreateLeadDialog />
          </div>
        )}
      </main>
    </div>
  )
}
