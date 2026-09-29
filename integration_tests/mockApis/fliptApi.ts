import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const buildBooleanFlag = (key: string, enabled = true) => ({
  key,
  name: key,
  description: '',
  enabled,
  type: 'BOOLEAN_FLAG_TYPE',
  createdAt: '2026-03-26T12:00:00.000000Z',
  updatedAt: '2026-03-26T12:00:00.000000Z',
  rules: [],
  rollouts: [],
})

export default {
  stubSnapshot: (flags: Array<{ key: string; enabled?: boolean }> = []): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/flipt/internal/v1/evaluation/snapshot/namespace/.+',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          namespace: { key: 'probation-supervision-early-termination-ui', name: 'probation-supervision-early-termination-ui' },
          flags: flags.map(flag => buildBooleanFlag(flag.key, flag.enabled)),
        },
      },
    }),
}
