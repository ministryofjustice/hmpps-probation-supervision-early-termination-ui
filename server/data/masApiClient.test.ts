import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { Mock } from 'vitest'
import config from '../config'
import MasApiClient from './masApiClient'

describe('MasApiClient', () => {
  let masApiClient: MasApiClient
  let mockAuthenticationClient: Partial<AuthenticationClient>
  let getToken: Mock

  beforeEach(() => {
    getToken = vi.fn().mockResolvedValue('test-system-token')
    mockAuthenticationClient = {
      getToken,
    }

    masApiClient = new MasApiClient(mockAuthenticationClient as AuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    vi.resetAllMocks()
  })

  describe('getUserDetails', () => {
    it('returns user details when user exists', async () => {
      const user = {
        userId: 1234,
        username: 'user1',
        firstName: 'Test',
        surname: 'User',
        email: 'user@email.com',
        enabled: true,
        roles: ['OIBT0002'],
        staff: {
          probationDeliveryUnits: [
            {
              code: 'N03CTM',
              description: 'Test PDU',
            },
          ],
        },
      }

      nock(config.apis.masApi.url)
        .get('/user/user1')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, user)

      const result = await masApiClient.getUserDetails('user1')

      expect(result).toEqual(user)
      expect(getToken).toHaveBeenCalled()
    })

    it('returns null when a 404 is returned', async () => {
      nock(config.apis.masApi.url)
        .get('/user/user1')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(404)

      const result = await masApiClient.getUserDetails('user1')

      expect(result).toBeNull()
    })

    it('throws when the API returns an error other than 404', async () => {
      const error = new Error('Internal server error')
      Object.assign(error, { responseStatus: 500 })

      vi.spyOn(masApiClient, 'get').mockImplementation(async options => {
        options.errorHandler?.('/user/user1', 'GET', error)
        return null
      })

      await expect(masApiClient.getUserDetails('user1')).rejects.toThrow('Internal server error')
    })

    it('uses the supplied username in the request path', async () => {
      const user = {
        userId: 1234,
        username: 'user1',
        firstName: 'Tom',
        surname: 'Cruse',
        enabled: true,
        roles: [],
      }

      nock(config.apis.masApi.url)
        .get('/user/user1')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, user)

      const result = await masApiClient.getUserDetails('user1')

      expect(result).toEqual(user)
    })
  })
})
