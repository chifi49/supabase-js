import { PostgrestQueryBuilder } from '../postgrest-js'
import { SupabaseRealtimeClient } from './SupabaseRealtimeClient'
import { RealtimeClient } from '@supabase/realtime-js'
import { SupabaseEventTypes, SupabaseRealtimePayload } from './types'
export declare class SupabaseQueryBuilder<T> extends PostgrestQueryBuilder<T> {
  private _subscription
  private _realtime
  constructor(
    url: string,
    {
      headers,
      schema,
      realtime,
      table,
    }: {
      headers?: {
        [key: string]: string
      }
      schema: string
      realtime: RealtimeClient
      table: string
    }
  )
  /**
   * Subscribe to realtime changes in your databse.
   * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
   * @param callback A callback that will handle the payload that is sent whenever your database changes.
   */
  on(
    event: SupabaseEventTypes,
    callback: (payload: SupabaseRealtimePayload<T>) => void
  ): SupabaseRealtimeClient
}
//# sourceMappingURL=SupabaseQueryBuilder.d.ts.map
