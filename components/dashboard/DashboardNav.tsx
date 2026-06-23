'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

export default function DashboardNav({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">Pipeline CRM</h1>
            <div className="flex gap-6">
              <a href="/dashboard" className="text-base font-medium text-neutral-300 hover:text-white transition">
                Dashboard
              </a>
              <a href="/dashboard/leads" className="text-base font-medium text-neutral-300 hover:text-white transition">
                Leads
              </a>
              <a href="/dashboard/pipeline" className="text-base font-medium text-neutral-300 hover:text-white transition">
                Pipeline
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-base text-neutral-300">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
