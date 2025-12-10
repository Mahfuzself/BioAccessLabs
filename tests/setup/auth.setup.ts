import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';
import { envConfig } from '../../src/config/environment.config';
import { logger } from '../../src/utils/logger';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  logger.info('🔐 Setting up authentication');
  
  const loginPage = new LoginPage(page);
  const credentials = envConfig.getCredentials('user');
  
  await loginPage.navigateToLoginPage();
  await loginPage.loginWithCredentials(credentials.email, credentials.password);
  
  // Wait for successful login
  await page.waitForURL(url => !url.includes('Login'), { timeout: 10000 });
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
  
  logger.info('✓ Authentication state saved');
});