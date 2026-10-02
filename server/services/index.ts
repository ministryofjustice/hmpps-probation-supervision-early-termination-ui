import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import ExampleService from './exampleService'
import logger from '../../logger'
import config from '../config'
import ProbationComponentsService from './ProbationComponentsService'
import FlagService from './flagService'

export const services = () => {
  const { applicationInfo, exampleApiClient, probationFrontendComponentsApiClient, masApiClient } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,
    probationComponentsService: new ProbationComponentsService(probationFrontendComponentsApiClient),
    flagService: new FlagService(),
    masApiClient,
    exampleService: new ExampleService(exampleApiClient),
  }
}

export type Services = ReturnType<typeof services>
