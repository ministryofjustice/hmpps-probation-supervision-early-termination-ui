import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { HmppsUser } from '../interfaces/hmppsUser'

export default class MasApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Manage a Supervision API', config.apis.masApi, logger, authenticationClient)
  }

  async getUserDetails(username: string): Promise<HmppsUser | null> {
    return this.get<HmppsUser | null>(
      {
        path: `/user/${username}`,
        errorHandler: (_path, _method, error) => {
          if (error.responseStatus === 404) return null
          throw error
        },
      },
      asSystem(username),
    )
  }
}
