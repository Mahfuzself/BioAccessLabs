import { test, expect } from '../../../src/fixtures/testFixture';
import { logger } from '../../../src/utils/logger';

/**
 * REGRESSION TESTS - Login Functionality
 * Comprehensive test coverage for all login scenarios
 */

test.describe('@regression Login Regression Tests', () => {
  
  test.describe('Valid Login Scenarios', () => {
    
    test('@regression TC_REG_LOGIN_001: Login with valid user credentials', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);
      await loginPage.verifySuccessfulLogin();
      logger.info('✓ TC_REG_LOGIN_001 PASSED');
    });

    test('@regression TC_REG_LOGIN_002: Login with remember me enabled', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(testData.validUser.email, testData.validUser.password, true);
      expect(await loginPage.isRememberLoginChecked()).toBeTruthy();
      logger.info('✓ TC_REG_LOGIN_002 PASSED');
    });

    test('@regression TC_REG_LOGIN_003: Login persists after page reload', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);
      await loginPage.reload();
      expect(await loginPage.verifyUserIsLoggedIn()).toBeTruthy();
      logger.info('✓ TC_REG_LOGIN_003 PASSED');
    });
  });

  test.describe('Invalid Login Scenarios', () => {
    
    test('@regression TC_REG_LOGIN_004: Login fails with invalid email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials('invalid@email.com', 'ValidPass123!');
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LOGIN_004 PASSED');
    });

    test('@regression TC_REG_LOGIN_005: Login fails with invalid password', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(testData.validUser.email, 'WrongPassword123!');
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LOGIN_005 PASSED');
    });

    test('@regression TC_REG_LOGIN_006: Login fails with empty email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillPassword('ValidPass123!');
      await loginPage.clickLogin();
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LOGIN_006 PASSED');
    });

    test('@regression TC_REG_LOGIN_007: Login fails with empty password', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail(testData.validUser.email);
      await loginPage.clickLogin();
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LOGIN_007 PASSED');
    });
  });

  test.describe('UI Element Tests', () => {
    
    test('@regression TC_REG_LOGIN_008: Password visibility toggle works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillPassword('TestPassword123');
      await loginPage.verifyPasswordFieldType();
      await loginPage.togglePasswordVisibility();
      logger.info('✓ TC_REG_LOGIN_008 PASSED');
    });

    test('@regression TC_REG_LOGIN_009: Form clear functionality works', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail(testData.validUser.email);
      await loginPage.fillPassword(testData.validUser.password);
      await loginPage.checkRememberLogin();
      await loginPage.clearLoginForm();
      
      expect(await loginPage.getEmailValue()).toBe('');
      expect(await loginPage.getPasswordValue()).toBe('');
      expect(await loginPage.isRememberLoginChecked()).toBeFalsy();
      logger.info('✓ TC_REG_LOGIN_009 PASSED');
    });
  });

  test.describe('Navigation Tests', () => {
    
    test('@regression TC_REG_LOGIN_010: Forgot password link works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.clickForgotPassword();
      await expect(loginPage.page).toHaveURL(/.*SendPassword.*/);
      logger.info('✓ TC_REG_LOGIN_010 PASSED');
    });

    test('@regression TC_REG_LOGIN_011: Create account link works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.clickCreateAccount();
      await expect(loginPage.page).toHaveURL(/.*register.*/);
      logger.info('✓ TC_REG_LOGIN_011 PASSED');
    });
  });
});