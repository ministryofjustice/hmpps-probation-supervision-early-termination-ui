import httpMocks from 'node-mocks-http'
import evaluateFeatureFlags from './evaluateFeatureFlags'
import FlagService from '../services/flagService'
import logger from '../../logger'
import { FeatureFlags } from '../data/model/featureFlags'

const mockFlags = {
  enableEnforcementContacts: true,
}
vi.mock('../services/flagService')

describe('/middleware/evaluateFeatureFlags', () => {
  const req = httpMocks.createRequest()
  const res = {
    locals: {
      user: {
        username: 'user-1',
      },
    },
    redirect: vi.fn().mockReturnThis(),
  } as any

  afterEach(() => {
    vi.clearAllMocks()
  })
  const nextSpy = vi.fn()

  describe('Flags returned', () => {
    const getFlagsSpy = vi.spyOn(FlagService.prototype, 'getFlags')
    beforeEach(async () => {
      getFlagsSpy.mockResolvedValue(mockFlags)
      delete res.locals.flags
      const flagService = new FlagService()
      await evaluateFeatureFlags(flagService)(req, res, nextSpy)
    })
    it('should call FlagService.getFlags()', () => {
      expect(getFlagsSpy).toHaveBeenCalled()
    })
    it('should assign the flags to res.locals.flags', () => {
      expect(res.locals.flags).toEqual(mockFlags)
    })
    it('should call next()', () => {
      expect(nextSpy).toHaveBeenCalled()
    })
  })

  describe('No flags returned', () => {
    const loggerSpy = vi.spyOn(logger, 'info')
    beforeEach(async () => {
      vi.spyOn(FlagService.prototype, 'getFlags').mockImplementationOnce(() =>
        Promise.resolve(null as unknown as FeatureFlags),
      )

      const flagService = new FlagService()
      await evaluateFeatureFlags(flagService)(req, res, nextSpy)
    })
    it('should log info', () => {
      expect(loggerSpy).toHaveBeenCalledWith('No flags available')
    })
    it('should call next()', () => {
      expect(nextSpy).toHaveBeenCalled()
    })
  })

  describe('Response error', () => {
    const loggerSpy = vi.spyOn(logger, 'error')
    const mockError = new Error('Error message')
    beforeEach(async () => {
      vi.spyOn(FlagService.prototype, 'getFlags').mockImplementationOnce(() => Promise.reject(mockError))
      const flagService = new FlagService()
      await evaluateFeatureFlags(flagService)(req, res, nextSpy)
    })
    it('should log the error', () => {
      expect(loggerSpy).toHaveBeenCalledWith(mockError, `Failed to retrieve flipt feature flags`)
    })
    it('should call next()', () => {
      expect(nextSpy).toHaveBeenCalledWith()
    })
  })
})
