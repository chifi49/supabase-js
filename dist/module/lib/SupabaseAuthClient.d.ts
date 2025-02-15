import { GoTrueClient } from '@supabase/gotrue-js'
export declare class SupabaseAuthClient extends GoTrueClient {
  constructor(options: {
    url?: string
    headers?: {
      [key: string]: string
    }
    detectSessionInUrl?: boolean
    autoRefreshToken?: boolean
    persistSession?: boolean
    localStorage?: Storage
  })
}
//# sourceMappingURL=SupabaseAuthClient.d.ts.map
