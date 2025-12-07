import { test as base, BrowserContext, Page } from '@playwright/test';
import { BasePage } from '../pages/basePage';
import { RegisterPage } from '../pages/registerPage';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
type Fixtures = {
  context: BrowserContext;
  page: Page;
  homePage : HomePage
  loginPage : LoginPage

};

export const test = base.extend<Fixtures>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
  homePage: async  ({page},use) =>{
    await use (new HomePage(page))
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect, Page } from '@playwright/test';
