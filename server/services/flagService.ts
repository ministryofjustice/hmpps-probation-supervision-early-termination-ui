import { FliptClient } from '@flipt-io/flipt-client-js'
import type { EvaluationRequest, EvaluationResponse } from '@flipt-io/flipt-client-js'
import config from '../config'
import { FeatureFlags } from '../data/model/featureFlags'
import logger from '../../logger'

export default class FlagService {
  private readonly namespace = 'probation-supervision-early-termination-ui'

  private fliptClientPromise?: Promise<FliptClient>

  private getFliptClient(): Promise<FliptClient> {
    if (!this.fliptClientPromise) {
      this.fliptClientPromise = FliptClient.init({
        namespace: this.namespace,
        url: config.flipt.url,
        authentication: { clientToken: config.flipt.token },
      })
    }

    return this.fliptClientPromise!
  }

  async getFlags(context: { email?: string }): Promise<FeatureFlags> {
    const fliptClient = await this.getFliptClient()

    try {
      await fliptClient.refresh()
    } catch (error) {
      logger.warn(`Failed to refresh Flipt flags: ${error}`)
    }

    const featureFlags = new FeatureFlags()
    const flagList = Object.keys(featureFlags)

    const requests: EvaluationRequest[] = flagList.map(flag => ({
      flagKey: flag,
      entityId: context.email?.toLowerCase() || 'anonymous',
      context: { ...(context.email ? { email: context.email.toLowerCase() } : {}) },
    }))

    const flags = fliptClient.evaluateBatch(requests)

    const responsesFor = (results: EvaluationResponse[], key: string) =>
      results.filter(response => response.booleanEvaluationResponse?.flagKey === key)

    flagList.forEach(flag => {
      const matching = responsesFor(flags.responses, flag)

      if (matching.length === 1) {
        featureFlags[flag] = Boolean(matching[0].booleanEvaluationResponse?.enabled)
      } else {
        logger.warn(`Expected exactly 1 response for flag ${flag}, got ${matching.length} — defaulting to false`)
        featureFlags[flag] = false
      }
    })

    return featureFlags
  }
}
