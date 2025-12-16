import { describe, it, expect } from 'vitest'
import { buildSuccess, buildError } from '../lib/responseHandler'

describe('responseHandler', () => {
  it('builds success envelope with data and meta', () => {
    const data = { id: 1 }
    const meta = { page: 1 }
    const res = buildSuccess(data, 'OK', meta)

    expect(res.success).toBe(true)
    expect(res.message).toBe('OK')
    expect(res.data).toEqual(data)
    expect(res.meta).toEqual(meta)
    expect(typeof res.timestamp).toBe('string')
  })

  it('builds error envelope with code and details', () => {
    const res = buildError('Failed', 'E_TEST', { info: 'details' })

    expect(res.success).toBe(false)
    expect(res.message).toBe('Failed')
    expect(res.error).toHaveProperty('code', 'E_TEST')
    expect(res.error).toHaveProperty('details')
    expect(typeof res.timestamp).toBe('string')
  })
})
