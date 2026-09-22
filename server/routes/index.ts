import { Router } from 'express'

import type { Services } from '../services'
import auditSearchRequest from '../middleware/auditSearchRequest'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  SEARCH_OFFENDERS = 'SEARCH_OFFENDERS',
}

export default function routes(services: Services): Router {
  const { auditService, exampleService } = services
  const router = Router()

  router.get('/', async (req, res, _next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

   const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    return res.render('pages/index', { currentTime })
  })

  // Example of an audited route.
  router.post(
    '/perform-search',
    auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS }),
    async (_req, res, _next) => {
      return res.redirect('/')
    },
  )

  return router
}
