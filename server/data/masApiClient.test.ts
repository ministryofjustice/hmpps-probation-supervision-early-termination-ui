import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import MasApiClient from './masApiClient'

describe('MasApiClient', () => {
  let masApiClient: MasApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    masApiClient = new MasApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getUserDetails', () => {
    it('returns user details when user exists', async () => {
      const user = {
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
      }
      nock(config.apis.masApi.url)
        .get('/user/test-user')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, user)

      const result = await masApiClient.getUserDetails('test-user')

      expect(result).toEqual(user)
    })

    it('returns null when a 404 is returned', async () => {
      nock(config.apis.masApi.url)
        .get('/user/test-user')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(404)

      const result = await masApiClient.getUserDetails('test-user')

      expect(result).toEqual(null)
    })
  })
})
