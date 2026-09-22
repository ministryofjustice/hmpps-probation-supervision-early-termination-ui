import type { Request, Response } from 'express'
import baseController from './baseController'
import config from './config'

jest.mock('./config', () => ({
  appInsights: {
    connectionString: 'test-connection-string',
  },
}))

jest.mock('./applicationInfo', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    applicationName: 'test-app-name',
    buildNumber: '123',
    gitRef: 'abcdef1234567',
    gitShortHash: 'abcdef1',
    productId: 'test-product',
    branchName: 'test-branch',
  })),
}))

describe('baseController', () => {
  let next: jest.Mock

  beforeEach(() => {
    next = jest.fn()
  })

  function createReqRes(url: string): { req: Request; res: Response } {
    const req = { url } as Request
    const res = { locals: {} } as unknown as Response
    return { req, res }
  }

  it('sets home to true for the root path', () => {
    const { req, res } = createReqRes('/')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toBe(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toBe('test-app-name')
    expect(res.locals.home).toBe(true)
    expect(res.locals.cases).toBe(false)
    expect(res.locals.search).toBe(false)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('sets cases to true for /case', () => {
    const { req, res } = createReqRes('/case')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toBe(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toBe('test-app-name')
    expect(res.locals.home).toBe(false)
    expect(res.locals.cases).toBe(true)
    expect(res.locals.search).toBe(false)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('sets search to true for /search', () => {
    const { req, res } = createReqRes('/search')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toBe(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toBe('test-app-name')
    expect(res.locals.home).toBe(false)
    expect(res.locals.cases).toBe(false)
    expect(res.locals.search).toBe(true)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('sets all flags to false for an unrelated path', () => {
    const { req, res } = createReqRes('/contacts/123')

    baseController()(req, res, next)

    expect(res.locals.applicationInsightsConnectionString).toBe(config.appInsights.connectionString)
    expect(res.locals.applicationInsightsRoleName).toBe('test-app-name')
    expect(res.locals.home).toBe(false)
    expect(res.locals.cases).toBe(false)
    expect(res.locals.search).toBe(false)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
