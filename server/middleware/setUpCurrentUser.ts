import { jwtDecode } from 'jwt-decode'
import express from 'express'
import { UUID } from 'crypto'
import { convertToTitleCase } from '../utils/utils'
import logger from '../../logger'
import MasApiClient from '../data/masApiClient'

export default function setUpCurrentUser(masClient: MasApiClient) {
  const router = express.Router()

  router.use(async (_req, res, next) => {
    try {
      const {
        name,
        user_id: userId,
        user_uuid: userUuid,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        user_uuid?: UUID
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        userUuid,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      try {
        const user = await masClient.getUserDetails(res.locals.user.username)
        res.locals.user.email = user?.email
      } catch (error) {
        logger.warn(error, `Failed to retrieve user details for: ${res.locals.user.username}`)
      }

      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = userId !== undefined ? parseInt(userId, 10) : undefined
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  })

  return router
}
