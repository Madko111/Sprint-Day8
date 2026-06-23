import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import Link from 'next/link'
import { ArrowRight, TrendingUp, DollarSign, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: leads } = await supabase
    .from('pipeline_leads')
    .select('*')

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.stage === 'New').length || 0,
    contacted: leads?.filter(l => l.stage === 'Contacted').length || 0,
    qualified: leads?.filter(l => l.stage === 'Qualified').length || 0,
    proposal: leads?.filter(l => l.stage === 'Proposal').length || 0,
    won: leads?.filter(l => l.stage === 'Won').length || 0,
    totalValue: leads?.reduce((sum, l) => sum + l.value, 0) || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-animated relative">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-neutral-300 text-lg">Welcome back, {user.email}</p>
        </div>

        {stats.total === 0 ? (
          <div className="bg-neutral-900 rounded-lg p-12 text-center border border-neutral-800">
            <h2 className="text-xl font-semibold text-white mb-2">No leads yet</h2>
            <p className="text-neutral-400 mb-6">
              Get started by adding your first lead to track in the pipeline
            </p>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-neutral-50 text-neutral-900 shadow hover:bg-neutral-50/90 h-10 px-4 py-2"
            >
              Add Your First Lead
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-neutral-300">Total Leads</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">{stats.total}</div>
                <div className="text-xs text-neutral-400 mt-1">All pipeline leads</div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-neutral-300">Pipeline Value</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  ${stats.totalValue.toLocaleString('en-US')}
                </div>
                <div className="text-xs text-neutral-400 mt-1">Total deal value</div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-6 border border-lime-500/20 hover:border-lime-500/40 transition-all hover:shadow-lg hover:shadow-lime-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-neutral-300">Won Deals</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center shadow-lg shadow-lime-500/30">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-lime-400 to-green-500 bg-clip-text text-transparent">{stats.won}</div>
                <div className="text-xs text-neutral-400 mt-1">Closed successfully</div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:shadow-lg hover:shadow-pink-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-neutral-300">Active Deals</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {stats.new + stats.contacted + stats.qualified + stats.proposal}
                </div>
                <div className="text-xs text-neutral-400 mt-1">In progress</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-8 border border-neutral-800 hover:border-neutral-700 transition-all">
                <h2 className="text-xl font-semibold text-white mb-6">Pipeline Stages</h2>
                <div className="space-y-5">
                  {[
                    { label: 'New', count: stats.new, color: 'bg-gradient-to-r from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/50' },
                    { label: 'Contacted', count: stats.contacted, color: 'bg-gradient-to-r from-purple-500 to-pink-500', glow: 'shadow-purple-500/50' },
                    { label: 'Qualified', count: stats.qualified, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/50' },
                    { label: 'Proposal', count: stats.proposal, color: 'bg-gradient-to-r from-orange-500 to-red-500', glow: 'shadow-orange-500/50' },
                    { label: 'Won', count: stats.won, color: 'bg-gradient-to-r from-emerald-500 to-green-500', glow: 'shadow-emerald-500/50' },
                  ].map(({ label, count, color, glow }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">{label}</span>
                        <span className="text-sm font-bold text-white bg-neutral-800 px-3 py-1 rounded-full">{count}</span>
                      </div>
                      <div className="h-3 bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className={`h-full ${color} shadow-lg ${glow} transition-all duration-500`}
                          style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl p-8 border border-neutral-800 hover:border-neutral-700 transition-all">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <Link
                    href="/dashboard/leads"
                    className="group flex items-center justify-between p-5 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <span className="text-neutral-300 group-hover:text-cyan-400 transition-colors font-semibold">View All Leads</span>
                    <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/dashboard/pipeline"
                    className="group flex items-center justify-between p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <span className="text-neutral-300 group-hover:text-purple-400 transition-colors font-semibold">Pipeline View</span>
                    <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
