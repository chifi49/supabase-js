'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.SupabaseQueryBuilder = void 0
const postgrest_js_1 = require('../postgrest-js')
const SupabaseRealtimeClient_1 = require('./SupabaseRealtimeClient')
class SupabaseQueryBuilder extends postgrest_js_1.PostgrestQueryBuilder {
  constructor(url, { headers = {}, schema, realtime, table }) {
    super(url, { headers, schema })
    this._subscription = new SupabaseRealtimeClient_1.SupabaseRealtimeClient(
      realtime,
      schema,
      table
    )
    this._realtime = realtime
  }
  /**
   * Subscribe to realtime changes in your databse.
   * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
   * @param callback A callback that will handle the payload that is sent whenever your database changes.
   */
  on(event, callback) {
    if (!this._realtime.isConnected()) {
      this._realtime.connect()
    }
    return this._subscription.on(event, callback)
  }
}
exports.SupabaseQueryBuilder = SupabaseQueryBuilder
//# sourceMappingURL=SupabaseQueryBuilder.js.map
