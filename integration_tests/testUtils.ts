import { Page } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import hmppsAuth, { type UserToken } from './mockApis/hmppsAuth'
import { resetStubs } from './mockApis/wiremock'
import masApi from './mockApis/masApi'
import fliptApi from './mockApis/fliptApi'

export { resetStubs }

const DEFAULT_ROLES = ['ROLE_SOME_REQUIRED_ROLE']

export const attemptHmppsAuthLogin = async (page: Page) => {
  await page.goto('/')
  page.locator('h1', { hasText: 'Sign in' })
  const url = await hmppsAuth.getSignInUrl()
  return page.goto(url)
}

export const login = async (
  page: Page,
  {
    name,
    roles = DEFAULT_ROLES,
    active = true,
    authSource = 'nomis',
    flags = [],
  }: UserToken & { active?: boolean; flags?: Array<{ key: string; enabled?: boolean }> } = {},
) => {
  await Promise.all([
    hmppsAuth.favicon(),
    hmppsAuth.stubSignInPage(),
    hmppsAuth.stubSignOutPage(),
    hmppsAuth.token({ name, roles, authSource }),
    tokenVerification.stubVerifyToken(active),
    fliptApi.stubSnapshot(flags),
    masApi.stubGetUserDetails(),
  ])
  return attemptHmppsAuthLogin(page)
}
