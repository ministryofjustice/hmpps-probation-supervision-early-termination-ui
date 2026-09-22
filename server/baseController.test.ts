import type { Request, Response } from 'express'
import baseController from './baseController'
import getApplicationInfo from './applicationInfo'
import config from './config'

jest.mock('./utils/azureAppInsights')
jest.mock('./config', () => ({
  appInsights: {
    connectionString: 'test-connection-string',
  },
}))

const defaultNameMock = getApplicationInfo as jest.Mock

describe('baseController', () => {
  let next: jest.Mock

  beforeEach(() => {
    next = jest.fn()
    defaultNameMock.mockReturnValue('test-app-name')
  })

  function createReqRes(url: string): { req: Request; res: Response } {
    const req = { url } as Request
    const res = { locals: {} } as unknown as Response
    return { req, res }
  }

  it('sets home to true for the root path', () => {
    const { req, res } = createReqRes('/')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toEqual(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toEqual('test-app-name')
    expect(res.locals.home).toEqual(true)
    expect(res.locals.cases).toEqual(false)
    expect(res.locals.search).toEqual(false)
    expect(next).toHaveBeenCalled()
  })

  it('sets cases to true for /case', () => {
    const { req, res } = createReqRes('/case')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toEqual(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toEqual('test-app-name')
    expect(res.locals.home).toEqual(false)
    expect(res.locals.cases).toEqual(true)
    expect(res.locals.search).toEqual(false)
    expect(next).toHaveBeenCalled()
  })

  it('sets search to true for /search', () => {
    const { req, res } = createReqRes('/search')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toEqual(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toEqual('test-app-name')
    expect(res.locals.home).toEqual(false)
    expect(res.locals.cases).toEqual(false)
    expect(res.locals.search).toEqual(true)
    expect(next).toHaveBeenCalled()
  })

  it('sets all flags to false for an unrelated path', () => {
    const { req, res } = createReqRes('/contacts/123')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toEqual(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toEqual('test-app-name')
    expect(res.locals.home).toEqual(false)
    expect(res.locals.cases).toEqual(false)
    expect(res.locals.search).toEqual(false)
    expect(next).toHaveBeenCalled()
  })
})
