import { SupabaseClientOptions } from './lib/types'
import { SupabaseAuthClient } from './lib/SupabaseAuthClient'
import { SupabaseQueryBuilder } from './lib/SupabaseQueryBuilder'
import { SupabaseStorageClient } from '@supabase/storage-js'
import { RealtimeClient, RealtimeSubscription } from '@supabase/realtime-js'
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
export default class SupabaseClient {
  protected supabaseUrl: string
  protected supabaseKey: string
  /**
   * Supabase Auth allows you to create and manage user sessions for access to data that is secured by access policies.
   */
  auth: SupabaseAuthClient
  protected schema: string
  protected restUrl: string
  protected realtimeUrl: string
  protected authUrl: string
  protected storageUrl: string
  protected realtime: RealtimeClient
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.headers Any additional headers to send with each network request.
   * @param options.realtime Options passed along to realtime-js constructor.
   */
  constructor(supabaseUrl: string, supabaseKey: string, options?: SupabaseClientOptions)
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage(): SupabaseStorageClient
  /**
   * Perform a table operation.
   *
   * @param table The table name to operate on.
   */
  from<T = any>(table: string): SupabaseQueryBuilder<T>
  /**
   * Perform a stored procedure call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   */
  rpc<T = any>(fn: string, params?: object): import('./postgrest-js').PostgrestFilterBuilder<T>
  /**
   * Removes an active subscription and returns the number of open connections.
   *
   * @param subscription The subscription you want to remove.
   */
  removeSubscription(subscription: RealtimeSubscription): Promise<unknown>
  private _closeSubscription
  /**
   * Returns an array of all your subscriptions.
   */
  getSubscriptions(): RealtimeSubscription[]
  private _initSupabaseAuthClient
  private _initRealtimeClient
  private _initPostgRESTClient
  private _getAuthHeaders
  private _closeChannel
}
//# sourceMappingURL=SupabaseClient.d.ts.map
