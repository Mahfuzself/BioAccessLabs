
import { test as base, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { RegisterPage } from '../pages/registerPage';
import { TestDataManager, UserTestData } from '../utils/testDataManager';
import { logger, logTest } from '../utils/logger';
import { envConfig } from '../config/environment.config';
import { CartPage } from '@pages/cartPage';
import { ProductPage } from '@pages/productPage';
import path from 'path';
import fs from 'fs';

// Define custom fixtures types
type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  cartPage : CartPage;
  productPage : ProductPage

  testData: {
    randomUser: UserTestData;
    validUser: any;
    invalidUsers: any[];
  };
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
};

// Storage state path
const authFile = path.join(process.cwd(), '.auth', 'user.json');

// Ensure .auth directory exists
const ensureAuthDirectory = () => {
  const authDir = path.join(process.cwd(), '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
};

// Extended test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Context fixture - runs before page
  page: async ({ page }, use, testInfo) => {
    logTest(testInfo.title);
    
    // Setup: Attach console listener
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logger.error(`Console Error: ${msg.text()}`);
      }
    });

    // Setup: Attach page error listener
    page.on('pageerror', error => {
      logger.error(`Page Error: ${error.message}`);
    });

    // Use the page in test
    await use(page);

    // Teardown: Capture failure state
     if (testInfo.status !== testInfo.expectedStatus) {

      // generate unique filename
      const fileName = `${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`;

      // Playwright-managed output path
      const screenshotPath = testInfo.outputPath(fileName);

      // take screenshot
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // attach to report
      await testInfo.attach('screenshot', {
        path: screenshotPath,
        contentType: 'image/png'
      });

      console.log(`🔥 Screenshot saved → ${screenshotPath}`);
    }
  },

  // HomePage fixture
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    logger.debug('HomePage instance created');
    await use(homePage);
  },

  // LoginPage fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    logger.debug('LoginPage instance created');
    await use(loginPage);
  },

  // RegisterPage fixture
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    logger.debug('RegisterPage instance created');
    await use(registerPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    logger.debug('CartPage instance created');
    await use(cartPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    logger.debug('ProductPage instance created');
    await use(productPage);
  },

  // Test data fixture
  testData: async ({}, use) => {
    logger.debug('Generating test data');
    
    const data = {
      randomUser: TestDataManager.generateRandomUser(),
      validUser: TestDataManager.getValidUser(),
      invalidUsers: TestDataManager.getInvalidUsers()
    };

    logger.debug('Test data generated', {
      randomUserEmail: data.randomUser.email,
      validUserEmail: TestDataManager.maskSensitiveData(data.validUser.email)
    });

    await use(data);
  },

  // Authenticated page fixture
  authenticatedPage: async ({ browser }, use) => {
    logger.info('Setting up authenticated session');
    ensureAuthDirectory();

    // Check if we have saved auth state
    let context: BrowserContext;
    
    if (fs.existsSync(authFile)) {
      logger.debug('Loading existing auth state');
      context = await browser.newContext({ storageState: authFile });
    } else {
      logger.debug('Creating new auth state');
      context = await browser.newContext();
      const page = await context.newPage();
      
      const loginPage = new LoginPage(page);
      const credentials = envConfig.getCredentials('user');
      
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(credentials.email, credentials.password);
      
      // Wait for login to complete
      await page.waitForURL(url => !url.toString().includes('Login'), { timeout: 10000 });
      
      // Save auth state
      await context.storageState({ path: authFile });
      logger.info('Auth state saved');
      
      await page.close();
    }

    const authenticatedPage = await context.newPage();
    logger.info('Authenticated page ready');

    await use(authenticatedPage);

    // Cleanup
    await authenticatedPage.close();
    await context.close();
  },

  // Authenticated context fixture
  authenticatedContext: async ({ browser }, use) => {
    logger.info('Setting up authenticated context');
    ensureAuthDirectory();

    let context: BrowserContext;
    
    if (fs.existsSync(authFile)) {
      context = await browser.newContext({ storageState: authFile });
    } else {
      context = await browser.newContext();
      const page = await context.newPage();
      
      const loginPage = new LoginPage(page);
      const credentials = envConfig.getCredentials('user');
      
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(credentials.email, credentials.password);
      await page.waitForURL(url => !url.toString().includes('Login'));
      
      await context.storageState({ path: authFile });
      await page.close();
    }

    await use(context);
    await context.close();
  }
});

export { expect } from '@playwright/test';

// Test groups/tags
export const tags = {
  smoke: '@smoke',
  regression: '@regression',
  e2e: '@e2e',
  api: '@api',
  ui: '@ui',
  critical: '@critical',
  slow: '@slow'
};

// // Helper to skip tests in certain environments
// export const skipInProduction = () => {
//   if (envConfig.isProduction()) {
//     test.skip();
//   }
// };

// Helper to run only in specific environment
export const onlyInEnvironment = (env: string) => {
  if (envConfig.env !== env) {
    test.skip();
  }
};