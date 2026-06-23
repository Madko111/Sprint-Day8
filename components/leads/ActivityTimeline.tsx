'use client'

import type { Activity } from '@/types'
import { MessageSquare, Mail, ArrowRight } from 'lucide-react'

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'stage_change':
        return <ArrowRight className="w-4 h-4" />
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        No activity yet. Add a note or send an email to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
            {getIcon(activity.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white">
                {activity.type === 'note' && 'Note added'}
                {activity.type === 'email' && 'Email sent'}
                {activity.type === 'stage_change' && 'Stage changed'}
              </span>
              <span className="text-xs text-neutral-400">
                {formatDate(activity.created_at)}
              </span>
            </div>
            {activity.type === 'stage_change' && activity.metadata ? (
              <div className="text-sm text-neutral-300">
                {activity.metadata.from} → {activity.metadata.to}
              </div>
            ) : (
              <div className="text-sm text-neutral-300 whitespace-pre-wrap">
                {activity.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
