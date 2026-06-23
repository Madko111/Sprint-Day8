export type Lead = {
  id: string
  user_id: string
  name: string
  company: string
  email: string | null
  phone: string | null
  stage: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost'
  owner: string
  source: string | null
  value: number
  notes: string | null
  last_contacted: string | null
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  lead_id: string
  user_id: string
  type: 'note' | 'email' | 'stage_change'
  content: string | null
  metadata: {
    from?: string
    to?: string
    subject?: string
  } | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
      }
      activities: {
        Row: Activity
        Insert: Omit<Activity, 'id' | 'created_at'>
        Update: Partial<Omit<Activity, 'id' | 'created_at'>>
      }
    }
  }
}
