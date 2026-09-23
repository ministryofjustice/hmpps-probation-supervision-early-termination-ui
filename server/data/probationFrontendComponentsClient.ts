import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { AvailableComponent, ComponentsResponse } from '../@types/probationComponent'

export default class ProbationFrontendComponentsApiClient extends RestClient {
  constructor() {
    super('Probation Frontend Components API', config.apis.probationFrontendComponentsApi, logger)
  }

  getComponents<T extends AvailableComponent[]>(components: T, userToken: string): Promise<ComponentsResponse> {
    return this.get<ComponentsResponse>(
      {
        path: '/api/components',
        query: `component=${components.join('&component=')}`,
        headers: { 'x-user-token': userToken },
      },
      asUser(userToken),
    )
  }
}
