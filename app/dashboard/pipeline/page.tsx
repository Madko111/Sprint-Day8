import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function PipelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: leads } = await supabase
    .from('pipeline_leads')
    .select('*')
    .order('created_at', { ascending: false })

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']

  const leadsByStage = stages.map(stage => ({
    stage,
    leads: (leads || []).filter(lead => lead.stage === stage)
  }))

  const stageColors = {
    New: 'border-cyan-500/50 bg-cyan-500/5',
    Contacted: 'border-purple-500/50 bg-purple-500/5',
    Qualified: 'border-yellow-500/50 bg-yellow-500/5',
    Proposal: 'border-orange-500/50 bg-orange-500/5',
    Won: 'border-emerald-500/50 bg-emerald-500/5',
    Lost: 'border-red-500/50 bg-red-500/5',
  }

  return (
    <div className="min-h-screen bg-gradient-animated relative">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Pipeline
          </h1>
          <p className="text-neutral-300 text-lg">Kanban view of your sales pipeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {leadsByStage.map(({ stage, leads }) => (
            <div key={stage} className={`rounded-xl border-2 ${stageColors[stage as keyof typeof stageColors]} p-4 min-h-[400px]`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">{stage}</h3>
                <span className="bg-neutral-800 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {leads.length}
                </span>
              </div>
              <div className="space-y-3">
                {leads.map(lead => (
                  <a
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="block bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 hover:bg-neutral-800/80 transition-all hover:shadow-lg cursor-pointer"
                  >
                    <div className="font-semibold text-white mb-1">{lead.name}</div>
                    <div className="text-sm text-neutral-400 mb-2">{lead.company}</div>
                    <div className="text-sm font-bold text-emerald-400">
                      ${lead.value.toLocaleString('en-US')}
                    </div>
                  </a>
                ))}
                {leads.length === 0 && (
                  <div className="text-center text-neutral-500 text-sm py-8">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
