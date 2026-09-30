import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { HmppsUser } from '../interfaces/hmppsUser'

export default class MasApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Manage a Supervision API', config.apis.masApi, logger, authenticationClient)
  }

  async getUserDetails(username: string): Promise<MasUserDetails | null> {
    return this.get<MasUserDetails | null>(
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

export interface MasUserDetails {
  userId: number
  username: string
  firstName: string
  surname: string
  email?: string
  enabled: boolean
  roles: string[]
  staff?: {
    probationDeliveryUnits?: ProbationDeliveryUnit[]
  }
}

export interface ProbationDeliveryUnit {
  code: string
  description: string
}
