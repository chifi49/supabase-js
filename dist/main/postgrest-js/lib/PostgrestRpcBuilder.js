'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const types_1 = require('./types')
const PostgrestFilterBuilder_1 = __importDefault(require('./PostgrestFilterBuilder'))
class PostgrestRpcBuilder extends types_1.PostgrestBuilder {
  constructor(url, { headers = {}, schema } = {}) {
    super({})
    this.url = new URL(url)
    this.headers = Object.assign({}, headers)
    this.schema = schema
  }
  /**
   * Perform a stored procedure call.
   */
  rpc(params, { count = null } = {}) {
    this.method = 'POST'
    this.body = params
    if (count) {
      if (this.headers['Prefer'] !== undefined) this.headers['Prefer'] += `,count=${count}`
      else this.headers['Prefer'] = `count=${count}`
    }
    return new PostgrestFilterBuilder_1.default(this)
  }
}
exports.default = PostgrestRpcBuilder
//# sourceMappingURL=PostgrestRpcBuilder.js.map
