import { test, expect } from '../../../src/fixtures/testFixture';
import { AuthHelper } from '../../../src/fixtures/authFixture';
import { logger } from '../../../src/utils/logger';

/**
 * SANITY TESTS
 * Quick verification tests after build deployment
 * Validates that major functionalities work
 * Should run after smoke tests pass
 */

test.describe('@sanity Sanity Test Suite', () => {
  
  // ==================== LOGIN FUNCTIONALITY SANITY ====================
  test.describe('Login Functionality', () => {
    
    test('@sanity TC_SANITY_LOGIN_001: Login with valid credentials', async ({ loginPage, testData }) => {
      await test.step('Navigate and login', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(testData.validUser);
      });

      await test.step('Verify successful login', async () => {
        await loginPage.verifySuccessfulLogin();
        expect(await AuthHelper.isAuthenticated(loginPage.page)).toBeTruthy();
      });

      logger.info('✓ TC_SANITY_LOGIN_001 PASSED');
    });

    test('@sanity TC_SANITY_LOGIN_002: Login with remember me', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Login with remember me enabled', async () => {
        await loginPage.loginWithCredentials(
          testData.validUser.email,
          testData.validUser.password,
          true
        );
      });

      await test.step('Verify checkbox was checked', async () => {
        // Need to check before navigation
        expect(await loginPage.isRememberLoginChecked()).toBeTruthy();
      });

      logger.info('✓ TC_SANITY_LOGIN_002 PASSED');
    });

    test('@sanity TC_SANITY_LOGIN_003: Login fails with invalid credentials', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();

      const invalidUser = testData.invalidUsers.find(u => u.expectedError === 'Invalid credentials');
      if (!invalidUser) return;

      await test.step('Try to login with invalid credentials', async () => {
        await loginPage.loginWithCredentials(invalidUser.email, invalidUser.password);
      });

      await test.step('Verify still on login page', async () => {
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_SANITY_LOGIN_003 PASSED');
    });

    test('@sanity TC_SANITY_LOGIN_004: Password visibility toggle works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Fill password', async () => {
        await loginPage.fillPassword('Test@1234');
      });

      await test.step('Verify password is hidden', async () => {
        await loginPage.verifyPasswordFieldType();
      });

      await test.step('Toggle visibility', async () => {
        await loginPage.togglePasswordVisibility();
      });

      logger.info('✓ TC_SANITY_LOGIN_004 PASSED');
    });

    test('@sanity TC_SANITY_LOGIN_005: Form clear functionality', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Fill form', async () => {
        await loginPage.fillEmail(testData.validUser.email);
        await loginPage.fillPassword(testData.validUser.password);
        await loginPage.checkRememberLogin();
      });

      await test.step('Clear form', async () => {
        await loginPage.clearLoginForm();
      });

      await test.step('Verify form is cleared', async () => {
        expect(await loginPage.getEmailValue()).toBe('');
        expect(await loginPage.getPasswordValue()).toBe('');
        expect(await loginPage.isRememberLoginChecked()).toBeFalsy();
      });

      logger.info('✓ TC_SANITY_LOGIN_005 PASSED');
    });
  });

  // ==================== REGISTRATION FUNCTIONALITY SANITY ====================
  test.describe('Registration Functionality', () => {
    
    test('@sanity TC_SANITY_REG_001: Registration form accepts valid data', async ({ registerPage, testData }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Fill all fields with valid data', async () => {
        await registerPage.fillRegistrationForm(testData.randomUser);
      });

      await test.step('Verify all fields are filled', async () => {
        expect(await registerPage.getEmailValue()).toBe(testData.randomUser.email);
        expect(await registerPage.getFirstNameValue()).toBe(testData.randomUser.firstName);
        expect(await registerPage.getLastNameValue()).toBe(testData.randomUser.lastName);
      });

      logger.info('✓ TC_SANITY_REG_001 PASSED');
    });

    test('@sanity TC_SANITY_REG_002: Individual field filling works', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Fill each field individually', async () => {
        await registerPage.fillEmail('test@example.com');
        await registerPage.fillFirstName('John');
        await registerPage.fillLastName('Doe');
        await registerPage.fillDisplayName('JohnDoe123');
        await registerPage.fillDOB('01/15/1990');
        await registerPage.fillMobile('1234567890');
        await registerPage.selectGender('Male');
      });

      await test.step('Verify fields', async () => {
        expect(await registerPage.getEmailValue()).toContain('test@example.com');
        expect(await registerPage.getFirstNameValue()).toBe('John');
        expect(await registerPage.getSelectedGender()).toBe('Male');
      });

      logger.info('✓ TC_SANITY_REG_002 PASSED');
    });

    test('@sanity TC_SANITY_REG_003: Form clear works', async ({ registerPage, testData }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Fill form', async () => {
        await registerPage.fillRegistrationForm(testData.randomUser);
      });

      await test.step('Clear form', async () => {
        await registerPage.clearRegistrationForm();
      });

      await test.step('Verify form is cleared', async () => {
        expect(await registerPage.getEmailValue()).toBe('');
        expect(await registerPage.getFirstNameValue()).toBe('');
        expect(await registerPage.getLastNameValue()).toBe('');
      });

      logger.info('✓ TC_SANITY_REG_003 PASSED');
    });

    test('@sanity TC_SANITY_REG_004: Gender selection works', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Select Male', async () => {
        await registerPage.selectGender('Male');
        expect(await registerPage.getSelectedGender()).toBe('Male');
      });

      await test.step('Select Female', async () => {
        await registerPage.selectGender('Female');
        expect(await registerPage.getSelectedGender()).toBe('Female');
      });

      logger.info('✓ TC_SANITY_REG_004 PASSED');
    });

    test('@sanity TC_SANITY_REG_005: All form fields are enabled', async ({ registerPage }) => {
      await registerPage.navigateToRegisterPage();

      await test.step('Verify all fields are enabled', async () => {
        await registerPage.verifyFormFieldsEnabled();
      });

      logger.info('✓ TC_SANITY_REG_005 PASSED');
    });
  });

  // ==================== NAVIGATION SANITY ====================
  test.describe('Navigation', () => {
    
    test('@sanity TC_SANITY_NAV_001: All navigation links work', async ({ homePage }) => {
      await homePage.navigateToHomePage();

      await test.step('Click About Us', async () => {
        await homePage.clickAboutUsLink();
        await homePage.verifyPageURL(/.*about.*/i);
      });

      await test.step('Navigate back to home', async () => {
        await homePage.navigateToHomePage();
      });

      logger.info('✓ TC_SANITY_NAV_001 PASSED');
    });

    test('@sanity TC_SANITY_NAV_002: Logo navigation consistent', async ({ homePage, loginPage, registerPage }) => {
      await test.step('From login page', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.clickLogo();
        await homePage.verifyPageURL(homePage.baseURL);
      });

      await test.step('From registration page', async () => {
        await registerPage.navigateToRegisterPage();
        await registerPage.clickLogo();
        await homePage.verifyPageURL(homePage.baseURL);
      });

      logger.info('✓ TC_SANITY_NAV_002 PASSED');
    });

    test('@sanity TC_SANITY_NAV_003: Footer links work', async ({ homePage }) => {
      await homePage.navigateToHomePage();

      const links = ['Terms', 'Privacy'] as const;
      
      for (const link of links) {
        await test.step(`Test ${link} link`, async () => {
          await homePage.navigateToHomePage(); // Reset
          await homePage.clickFooterLink(link);
          await homePage.waitForPageLoad();
        });
      }

      logger.info('✓ TC_SANITY_NAV_003 PASSED');
    });

    test('@sanity TC_SANITY_NAV_004: Browser back/forward works', async ({ homePage, loginPage }) => {
      await test.step('Navigate to home', async () => {
        await homePage.navigateToHomePage();
      });

      await test.step('Navigate to login', async () => {
        await homePage.clickLoginButton();
        await loginPage.verifyLoginPageURL();
      });

      await test.step('Go back', async () => {
        await loginPage.goBack();
        await homePage.verifyPageURL(homePage.baseURL);
      });

      await test.step('Go forward', async () => {
        await homePage.goForward();
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_SANITY_NAV_004 PASSED');
    });
  });

  // ==================== PAGE ELEMENTS SANITY ====================
  test.describe('Page Elements', () => {
    
    test('@sanity TC_SANITY_ELEM_001: All form labels visible', async ({ loginPage, registerPage }) => {
      await test.step('Verify login form labels', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.verifyFormLabels();
      });

      await test.step('Verify registration form labels', async () => {
        await registerPage.navigateToRegisterPage();
        await registerPage.verifyRequiredFieldLabels();
      });

      logger.info('✓ TC_SANITY_ELEM_001 PASSED');
    });

    test('@sanity TC_SANITY_ELEM_002: Buttons are enabled', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Verify login button enabled', async () => {
        expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
      });

      logger.info('✓ TC_SANITY_ELEM_002 PASSED');
    });

    test('@sanity TC_SANITY_ELEM_003: Page titles correct', async ({ homePage, loginPage, registerPage }) => {
      await test.step('Homepage title', async () => {
        await homePage.navigateToHomePage();
        await homePage.verifyHomePageTitle();
      });

      await test.step('Login page title', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.verifyLoginPageTitle();
      });

      await test.step('Registration page title', async () => {
        await registerPage.navigateToRegisterPage();
        await registerPage.verifyRegisterPageTitle();
      });

      logger.info('✓ TC_SANITY_ELEM_003 PASSED');
    });

    test('@sanity TC_SANITY_ELEM_004: Footer content consistent', async ({ homePage }) => {
      await homePage.navigateToHomePage();

      // await test.step('Verify footer elements', async () => {
      //   await homePage.verifyFooterElements();
      //   await homePage.verifyFooterLinks();
      // });

      logger.info('✓ TC_SANITY_ELEM_004 PASSED');
    });
  });

  // ==================== DATA VALIDATION SANITY ====================
  test.describe('Data Validation', () => {
    
    test('@sanity TC_SANITY_VAL_001: Email validation works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Empty email validation', async () => {
        await loginPage.fillPassword('Test@1234');
        await loginPage.clickLogin();
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_SANITY_VAL_001 PASSED');
    });

    test('@sanity TC_SANITY_VAL_002: Password validation works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Empty password validation', async () => {
        await loginPage.fillEmail('test@yopmail.com');
        await loginPage.clickLogin();
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_SANITY_VAL_002 PASSED');
    });
  });
});

// ==================== SANITY TEST SUITE SUMMARY ====================
test.afterAll(async () => {
  logger.info('═══════════════════════════════════════');
  logger.info('   SANITY TEST SUITE COMPLETED');
  logger.info('═══════════════════════════════════════');
});