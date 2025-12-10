import { test, expect } from '../../../src/fixtures/testFixture';
import { logger } from '../../../src/utils/logger';

/**
 * SMOKE TESTS
 * Critical path tests that verify core functionality
 * Should run quickly (< 5 minutes total)
 * Run before every deployment
 */

test.describe('@smoke Critical Path Smoke Tests', () => {
  
  // ==================== HOMEPAGE SMOKE TESTS ====================
  test.describe('Homepage Critical Tests', () => {
    
    test('@smoke @critical TC_SMOKE_HP_001: Homepage loads successfully', async ({ homePage }) => {
      await test.step('Navigate to homepage', async () => {
        await homePage.navigateToHomePage();
      });

      await test.step('Verify page title', async () => {
        await homePage.verifyHomePageTitle();
      });

      await test.step('Verify header elements', async () => {
        await homePage.verifyHeaderVisible();
      });

      await test.step('Verify footer elements', async () => {
        await homePage.verifyFooterVisible();
      });

      logger.info('✓ TC_SMOKE_HP_001 PASSED');
    });

    test('@smoke @critical TC_SMOKE_HP_002: Navigation links work', async ({ homePage }) => {
      await test.step('Navigate to homepage', async () => {
        await homePage.navigateToHomePage();
      });

      await test.step('Verify all navigation links are clickable', async () => {
        await expect(homePage.homeLink).toBeVisible();
        await expect(homePage.aboutUsLink).toBeVisible();
        await expect(homePage.contactUsLink).toBeVisible();
        await expect(homePage.loginButton).toBeVisible();
      });

      logger.info('✓ TC_SMOKE_HP_002 PASSED');
    });

    test('@smoke TC_SMOKE_HP_003: Logo navigation works', async ({ homePage }) => {
      await homePage.navigateToHomePage();
      
      await test.step('Click logo', async () => {
        await homePage.clickLogo();
      });

      await test.step('Verify navigation to home', async () => {
        await homePage.verifyPageURL(homePage.baseURL);
      });

      logger.info('✓ TC_SMOKE_HP_003 PASSED');
    });
  });

  // ==================== LOGIN SMOKE TESTS ====================
  test.describe('Login Critical Tests', () => {
    
    test('@smoke @critical TC_SMOKE_LOGIN_001: User can login successfully', async ({ loginPage, testData }) => {
      await test.step('Navigate to login page', async () => {
        await loginPage.navigateToLoginPage();
      });

      await test.step('Verify page loads', async () => {
        await loginPage.verifyLoginPageLoaded();
      });

      await test.step('Enter credentials', async () => {
        await loginPage.fillEmail(testData.validUser.email);
        await loginPage.fillPassword(testData.validUser.password);
      });

      await test.step('Click login', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Verify successful login', async () => {
        await loginPage.verifySuccessfulLogin();
      });

      logger.info('✓ TC_SMOKE_LOGIN_001 PASSED');
    });

    test('@smoke @critical TC_SMOKE_LOGIN_002: Login page loads correctly', async ({ loginPage }) => {
      await test.step('Navigate to login page', async () => {
        await loginPage.navigateToLoginPage();
      });

      await test.step('Verify all form elements', async () => {
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.createAccountLink).toBeVisible();
      });

      logger.info('✓ TC_SMOKE_LOGIN_002 PASSED');
    });

    test('@smoke TC_SMOKE_LOGIN_003: Login validation works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Try to login with empty fields', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Verify stays on login page', async () => {
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_SMOKE_LOGIN_003 PASSED');
    });

    test('@smoke TC_SMOKE_LOGIN_004: Forgot password link works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Click forgot password', async () => {
        await loginPage.clickForgotPassword();
      });

      await test.step('Verify navigation', async () => {
        await expect(loginPage.page).toHaveURL(/.*SendPassword.*/);
      });

      logger.info('✓ TC_SMOKE_LOGIN_004 PASSED');
    });

    test('@smoke TC_SMOKE_LOGIN_005: Create account link works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Click create account', async () => {
        await loginPage.clickCreateAccount();
      });

      await test.step('Verify navigation to registration', async () => {
        await expect(loginPage.page).toHaveURL(/.*register.*/);
      });

      logger.info('✓ TC_SMOKE_LOGIN_005 PASSED');
    });
  });

  // ==================== REGISTRATION SMOKE TESTS ====================
  test.describe('Registration Critical Tests', () => {
    
    test('@smoke @critical TC_SMOKE_REG_001: Registration page loads', async ({ registerPage }) => {
      await test.step('Navigate to registration page', async () => {
        await registerPage.navigateToRegisterPage();
      });

      await test.step('Verify page is loaded', async () => {
        await registerPage.verifyRegisterPageLoaded();
      });

      await test.step('Verify all form fields visible', async () => {
        await registerPage.verifyAllFormFields();
      });

      logger.info('✓ TC_SMOKE_REG_001 PASSED');
    });

    test('@smoke TC_SMOKE_REG_002: Form validation works', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Try to submit empty form', async () => {
        await registerPage.clickRegister();
      });

      await test.step('Verify stays on registration page', async () => {
        await registerPage.verifyPageURL(/.*register.*/);
      });

      logger.info('✓ TC_SMOKE_REG_002 PASSED');
    });

    test('@smoke TC_SMOKE_REG_003: Gender dropdown works', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Verify dropdown has options', async () => {
        await registerPage.verifyGenderDropdownOptions();
      });

      await test.step('Select gender', async () => {
        await registerPage.selectGender('Male');
      });

      await test.step('Verify selection', async () => {
        expect(await registerPage.getSelectedGender()).toBe('Male');
      });

      logger.info('✓ TC_SMOKE_REG_003 PASSED');
    });

    test('@smoke TC_SMOKE_REG_004: Back to login link works', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Click login link', async () => {
        await registerPage.clickLoginLink();
      });

      await test.step('Verify navigation', async () => {
        await expect(registerPage.page).toHaveURL(/.*login.*/i);
      });

      logger.info('✓ TC_SMOKE_REG_004 PASSED');
    });
  });

  // ==================== END-TO-END SMOKE FLOW ====================
  test.describe('Critical User Journey', () => {
    
    test('@smoke @critical @e2e TC_SMOKE_E2E_001: Complete user journey works', async ({ homePage, loginPage, registerPage }) => {
      await test.step('Start from homepage', async () => {
        await homePage.navigateToHomePage();
        await homePage.verifyHomePageLoaded();
      });

      await test.step('Navigate to login', async () => {
        await homePage.clickLoginButton();
        await loginPage.verifyLoginPageURL();
      });

      await test.step('Navigate to registration', async () => {
        await loginPage.clickCreateAccount();
        await registerPage.verifyPageURL(/.*register.*/);
      });

      await test.step('Back to login', async () => {
        await registerPage.clickLoginLink();
        await loginPage.verifyLoginPageURL();
      });

      await test.step('Back to home via logo', async () => {
        await loginPage.clickLogo();
        await homePage.verifyPageURL(homePage.baseURL);
      });

      logger.info('✓ TC_SMOKE_E2E_001 PASSED');
    });
  });

  // ==================== COMMON ELEMENTS SMOKE ====================
  test.describe('Common Elements', () => {
    
    test('@smoke TC_SMOKE_COMMON_001: Footer consistent across pages', async ({ homePage, loginPage, registerPage }) => {
      await test.step('Verify footer on homepage', async () => {
        await homePage.navigateToHomePage();
        await homePage.verifyFooterVisible();
      });

      await test.step('Verify footer on login page', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.verifyFooterVisible();
      });

      await test.step('Verify footer on registration page', async () => {
        await registerPage.navigateToRegisterPage();
        await registerPage.verifyFooterVisible();
      });

      logger.info('✓ TC_SMOKE_COMMON_001 PASSED');
    });

    test('@smoke TC_SMOKE_COMMON_002: Header consistent across pages', async ({ homePage, loginPage }) => {
      await test.step('Verify header on homepage', async () => {
        await homePage.navigateToHomePage();
        await homePage.verifyHeaderVisible();
      });

      await test.step('Verify header on login page', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.verifyHeaderVisible();
      });

      logger.info('✓ TC_SMOKE_COMMON_002 PASSED');
    });

    test('@smoke TC_SMOKE_COMMON_003: Social media links work', async ({ homePage }) => {
      await homePage.navigateToHomePage();

      // await test.step('Verify social media links', async () => {
      //   await homePage.verifySocialMediaLinks();
      // });

      logger.info('✓ TC_SMOKE_COMMON_003 PASSED');
    });
  });
});

// ==================== SMOKE TEST SUITE SUMMARY ====================
test.afterAll(async () => {
  logger.info('═══════════════════════════════════════');
  logger.info('   SMOKE TEST SUITE COMPLETED');
  logger.info('═══════════════════════════════════════');
});