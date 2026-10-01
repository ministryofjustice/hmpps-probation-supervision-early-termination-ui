import './server/utils/azureAppInsights'

import { flushTelemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import app, { appServices } from './server/index'
import logger from './logger'

const server = app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})

const shutdown = async () => {
  logger.info('Shutting down application')

  server.close(async () => {
    try {
      await appServices.flagService.close()
      await flushTelemetry()

      logger.info('Application shutdown complete')
      process.exit(0)
    } catch (error) {
      logger.error(error, 'Error during application shutdown')
      process.exit(1)
    }
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
