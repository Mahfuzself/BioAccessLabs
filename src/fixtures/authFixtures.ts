import { test as base, Page } from './baseTest';
import { LoginPage } from '../pages/loginPage';
import fs from 'fs';
import path from 'path';

const storageFile = path.resolve(__dirname, '../../test-results/storageState.json');

export const authTest = base.extend({
  page: async ({ page }, use) => {
    // যদি storageState file থাকে → load context
    if (fs.existsSync(storageFile)) {
      await page.context().addCookies(JSON.parse(fs.readFileSync(storageFile, 'utf-8')));
      await use(page);
    } else {
      // অন্যথায় login করে storageState save করা
      const login = new LoginPage(page);
    //   await login.login('testuser', 'password123');

      // Storage save করা
      await page.context().storageState({ path: storageFile });

      await use(page);
    }
  },
});

