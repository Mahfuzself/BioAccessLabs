import { test, expect } from '../../../src/fixtures/testFixture';
import { logger } from '../../../src/utils/logger';

/**
 * END-TO-END TESTS
 * Complete user journey tests
 */

test.describe('@e2e User Journey Tests', () => {
  
  test('@e2e @critical TC_E2E_001: Complete user registration and login journey', async ({ 
    homePage, 
    loginPage, 
    registerPage, 
    testData 
  }) => {
    // Step 1: Start from homepage
    await test.step('Navigate to homepage', async () => {
      await homePage.navigateToHomePage();
      await homePage.verifyHomePageLoaded();
    });

    // Step 2: Navigate to login
    await test.step('Go to login page', async () => {
      await homePage.clickLoginButton();
      await loginPage.verifyLoginPageURL();
    });

    // Step 3: Go to registration
    await test.step('Go to registration page', async () => {
      await loginPage.clickCreateAccount();
      await registerPage.verifyPageURL(/.*register.*/);
    });

    // Step 4: Fill registration form
    await test.step('Fill registration form', async () => {
      await registerPage.fillRegistrationForm(testData.randomUser);
    });

    // Step 5: Navigate back to login
    await test.step('Return to login', async () => {
      await registerPage.clickLoginLink();
      await loginPage.verifyLoginPageURL();
    });

    // Step 6: Perform login
    await test.step('Login with user credentials', async () => {
      await loginPage.login(testData.validUser);
      await loginPage.verifySuccessfulLogin();
    });

    logger.info('✓ TC_E2E_001 PASSED');
  });

  test('@e2e TC_E2E_002: Navigation consistency across pages', async ({ 
    homePage, 
    loginPage, 
    registerPage 
  }) => {
    // Verify logo navigation from all pages
    await test.step('Test logo from login page', async () => {
      await loginPage.navigateToLoginPage();
      await loginPage.clickLogo();
      await homePage.verifyPageURL(homePage.baseURL);
    });

    await test.step('Test logo from registration page', async () => {
      await registerPage.navigateToRegisterPage();
      await registerPage.clickLogo();
      await homePage.verifyPageURL(homePage.baseURL);
    });

    logger.info('✓ TC_E2E_002 PASSED');
  });
});