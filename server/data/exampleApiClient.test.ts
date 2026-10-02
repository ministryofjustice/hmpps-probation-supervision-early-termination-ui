import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { Mock } from 'vitest'
import ExampleApiClient from './exampleApiClient'
import config from '../config'

describe('ExampleApiClient', () => {
  let exampleApiClient: ExampleApiClient
  let mockAuthenticationClient: Partial<AuthenticationClient>
  let getToken: Mock

  beforeEach(() => {
    getToken = vi.fn().mockResolvedValue('test-system-token')
    mockAuthenticationClient = {
      getToken,
    }

    exampleApiClient = new ExampleApiClient(mockAuthenticationClient as AuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    vi.resetAllMocks()
  })

  describe('getCurrentTime', () => {
    it('should make a GET request to /example/time using system token and return the response body', async () => {
      nock(config.apis.exampleApi.url)
        .get('/example/time')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, { time: '2025-01-01T12:00:00Z' })

      const response = await exampleApiClient.getCurrentTime()

      expect(response).toEqual({ time: '2025-01-01T12:00:00Z' })
      expect(getToken).toHaveBeenCalledTimes(1)
    })
  })
})
