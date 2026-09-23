import { Request, Response, NextFunction } from 'express'
import config from './config'
import getApplicationInfo from './applicationInfo'

const baseController = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.locals.applicationInsightsConnectionString = config.appInsights.connectionString
    res.locals.applicationInsightsRoleName = getApplicationInfo().applicationName
    const url = req.path.split('/').filter(dir => dir)
    res.locals.home = url.length === 0
    res.locals.cases = url[0] === 'case'
    res.locals.search = url[0] === 'search'
    return next()
  }
}

export default baseController
