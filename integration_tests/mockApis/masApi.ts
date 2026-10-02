import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/mas-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubGetUserDetails: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/mas-api/user/USER1',
      },
      response: {
        status: 200,
        jsonBody: {
          roles: ['OIBT0002'],
          userId: 1234,
          username: 'USER1',
          firstName: 'Test',
          surname: 'User',
          email: 'user@email.com',
          enabled: true,
          staff: {
            probationDeliveryUnits: [{ code: 'N03CTM', description: 'Test PDU' }],
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }),
}
