import { type Locator, type Page } from '@playwright/test'

export default class AbstractPage {
  readonly page: Page

  /** user name that appear in header */
  readonly usersName: Locator

  /** phase banner that appear in header */
  readonly phaseBanner: Locator

  /** link to sign out */
  readonly signoutLink: Locator

  /** link to manage user details */
  readonly manageUserDetails: Locator

  protected constructor(page: Page) {
    this.page = page
    this.phaseBanner = page.getByTestId('probation-common-environment-tag')
    this.usersName = page.getByTestId('probation-common-header-user-name')
    this.signoutLink = page.getByText('Sign out')
    this.manageUserDetails = page.getByText('Your account')
  }

  async signOut() {
    await this.usersName.click()
    await this.signoutLink.first().click()
  }

  async clickManageUserDetails() {
    await this.usersName.click()
    await this.manageUserDetails.first().click()
  }
}
