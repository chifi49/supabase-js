'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
const constants_1 = require('./lib/constants')
const SupabaseAuthClient_1 = require('./lib/SupabaseAuthClient')
const SupabaseQueryBuilder_1 = require('./lib/SupabaseQueryBuilder')
const storage_js_1 = require('@supabase/storage-js')
const postgrest_js_1 = require('./postgrest-js')
const realtime_js_1 = require('@supabase/realtime-js')
const DEFAULT_OPTIONS = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  localStorage: globalThis.localStorage,
  headers: constants_1.DEFAULT_HEADERS,
}
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
class SupabaseClient {
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
  constructor(supabaseUrl, supabaseKey, options) {
    this.supabaseUrl = supabaseUrl
    this.supabaseKey = supabaseKey
    if (!supabaseUrl) throw new Error('supabaseUrl is required.')
    if (!supabaseKey) throw new Error('supabaseKey is required.')
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options)
    this.restUrl = `${supabaseUrl}/rest/v1`
    this.realtimeUrl = `${supabaseUrl}/realtime/v1`.replace('http', 'ws')
    this.authUrl = `${supabaseUrl}/auth/v1`
    this.storageUrl = `${supabaseUrl}/storage/v1`
    this.schema = settings.schema
    this.auth = this._initSupabaseAuthClient(settings)
    this.realtime = this._initRealtimeClient(settings.realtime)
    // In the future we might allow the user to pass in a logger to receive these events.
    // this.realtime.onOpen(() => console.log('OPEN'))
    // this.realtime.onClose(() => console.log('CLOSED'))
    // this.realtime.onError((e: Error) => console.log('Socket error', e))
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new storage_js_1.SupabaseStorageClient(this.storageUrl, this._getAuthHeaders())
  }
  /**
   * Perform a table operation.
   *
   * @param table The table name to operate on.
   */
  from(table) {
    const url = `${this.restUrl}/${table}`
    return new SupabaseQueryBuilder_1.SupabaseQueryBuilder(url, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
      realtime: this.realtime,
      table,
    })
  }
  /**
   * Perform a stored procedure call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   */
  rpc(fn, params) {
    const rest = this._initPostgRESTClient()
    return rest.rpc(fn, params)
  }
  /**
   * Removes an active subscription and returns the number of open connections.
   *
   * @param subscription The subscription you want to remove.
   */
  removeSubscription(subscription) {
    return new Promise((resolve) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          yield this._closeSubscription(subscription)
          const openSubscriptions = this.getSubscriptions().length
          if (!openSubscriptions) {
            const { error } = yield this.realtime.disconnect()
            if (error) return resolve({ error })
          }
          return resolve({ error: null, data: { openSubscriptions } })
        } catch (error) {
          return resolve({ error })
        }
      })
    )
  }
  _closeSubscription(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!subscription.isClosed()) {
        yield this._closeChannel(subscription)
      }
    })
  }
  /**
   * Returns an array of all your subscriptions.
   */
  getSubscriptions() {
    return this.realtime.channels
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage }) {
    return new SupabaseAuthClient_1.SupabaseAuthClient({
      url: this.authUrl,
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: `${this.supabaseKey}`,
      },
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      localStorage,
    })
  }
  _initRealtimeClient(options) {
    return new realtime_js_1.RealtimeClient(
      this.realtimeUrl,
      Object.assign(Object.assign({}, options), {
        params: Object.assign(
          Object.assign({}, options === null || options === void 0 ? void 0 : options.params),
          { apikey: this.supabaseKey }
        ),
      })
    )
  }
  _initPostgRESTClient() {
    return new postgrest_js_1.PostgrestClient(this.restUrl, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
    })
  }
  _getAuthHeaders() {
    var _a, _b
    const headers = {}
    const authBearer =
      (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !==
        null && _b !== void 0
        ? _b
        : this.supabaseKey
    headers['apikey'] = this.supabaseKey
    headers['Authorization'] = `Bearer ${authBearer}`
    return headers
  }
  _closeChannel(subscription) {
    return new Promise((resolve, reject) => {
      subscription
        .unsubscribe()
        .receive('ok', () => {
          this.realtime.remove(subscription)
          return resolve(true)
        })
        .receive('error', (e) => reject(e))
    })
  }
}
exports.default = SupabaseClient
//# sourceMappingURL=SupabaseClient.js.map
