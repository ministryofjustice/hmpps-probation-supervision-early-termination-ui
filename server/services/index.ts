import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import ExampleService from './exampleService'
import logger from '../../logger'
import config from '../config'
import ProbationComponentsService from './ProbationComponentsService'

export const services = () => {
  const { applicationInfo, exampleApiClient, probationFrontendComponentsApiClient,} = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    probationComponentsService: new ProbationComponentsService(probationFrontendComponentsApiClient),
    exampleService: new ExampleService(exampleApiClient),
  }
}

export type Services = ReturnType<typeof services>
