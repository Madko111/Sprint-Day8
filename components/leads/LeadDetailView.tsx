'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Lead, Activity } from '@/types'
import ActivityTimeline from './ActivityTimeline'
import AddNoteDialog from './AddNoteDialog'
import DeleteLeadDialog from './DeleteLeadDialog'

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'] as const
const sources = ['LinkedIn', 'Referral', 'Website', 'Cold Email', 'Other'] as const

export default function LeadDetailView({ lead: initialLead, activities }: { lead: Lead; activities: Activity[] }) {
  const [lead, setLead] = useState(initialLead)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)

    const { error } = await supabase
      .from('pipeline_leads')
      .update({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        stage: lead.stage,
        source: lead.source,
        value: lead.value,
        notes: lead.notes,
      })
      .eq('id', lead.id)

    if (error) {
      console.error('Error updating lead:', error)
      setSaving(false)
      return
    }

    setEditing(false)
    setSaving(false)
    router.refresh()
  }

  const handleEmailClick = () => {
    const subject = `Re: ${lead.company} Partnership`
    const body = `Hi ${lead.name},\n\nFollowing up on our conversation.\n\nBest regards`
    window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/leads" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Lead Details</CardTitle>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                    <DeleteLeadDialog leadId={lead.id} leadName={lead.name} />
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-300">Name</Label>
                  {editing ? (
                    <Input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                  ) : (
                    <div className="text-white font-medium">{lead.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Company</Label>
                  {editing ? (
                    <Input value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
                  ) : (
                    <div className="text-white font-medium">{lead.company}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-300">Email</Label>
                  {editing ? (
                    <Input type="email" value={lead.email || ''} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                  ) : (
                    <div className="text-white font-medium">{lead.email || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Phone</Label>
                  {editing ? (
                    <Input value={lead.phone || ''} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                  ) : (
                    <div className="text-white font-medium">{lead.phone || '—'}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-300">Stage</Label>
                  {editing ? (
                    <Select value={lead.stage} onValueChange={(value) => setLead({ ...lead, stage: value as Lead['stage'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-white font-medium">{lead.stage}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Source</Label>
                  {editing ? (
                    <Select value={lead.source || ''} onValueChange={(value) => setLead({ ...lead, source: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-white font-medium">{lead.source || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-300">Deal Value</Label>
                  {editing ? (
                    <Input type="number" value={lead.value} onChange={(e) => setLead({ ...lead, value: parseInt(e.target.value) || 0 })} />
                  ) : (
                    <div className="text-white font-medium">
                      ${lead.value.toLocaleString('en-US')}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Notes</Label>
                {editing ? (
                  <Textarea value={lead.notes || ''} onChange={(e) => setLead({ ...lead, notes: e.target.value })} rows={4} />
                ) : (
                  <div className="text-white font-medium whitespace-pre-wrap">{lead.notes || 'No notes'}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
              <AddNoteDialog leadId={lead.id} />
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleEmailClick}
                disabled={!lead.email}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-2 border-pink-500/30 hover:border-pink-500/50 transition-all shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Lead Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-neutral-300 text-xs">Owner</div>
                <div className="text-white font-semibold">{lead.owner}</div>
              </div>
              <div>
                <div className="text-neutral-300 text-xs">Created</div>
                <div className="text-white">
                  {new Date(lead.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-neutral-300 text-xs">Last Updated</div>
                <div className="text-white font-semibold">
                  {new Date(lead.updated_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
