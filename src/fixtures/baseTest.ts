import { test as base, BrowserContext, Page } from '@playwright/test';
import { BasePage } from '../pages/basePage';
import { RegisterPage } from '../pages/registerPage';
type Fixtures = {
  context: BrowserContext;
  page: Page;

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
});

export { expect, Page } from '@playwright/test';
