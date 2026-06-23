'use client'

import Link from 'next/link'
import type { Lead } from '@/types'

const stageColors = {
  New: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20',
  Contacted: 'bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-purple-500/20',
  Qualified: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-yellow-500/20',
  Proposal: 'bg-orange-500/10 text-orange-400 border-orange-500/50 shadow-orange-500/20',
  Won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20',
  Lost: 'bg-red-500/10 text-red-400 border-red-500/50 shadow-red-500/20',
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/dashboard/leads/${lead.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-300">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full border shadow-lg ${stageColors[lead.stage]}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white">{formatCurrency(lead.value)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-400">{lead.source}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-400">{formatDate(lead.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
