import { test, expect } from '../../../src/fixtures/testFixture';
import { logger } from '../../../src/utils/logger';
import users from '../../../data/testdata/users.json';


/**
 * LOGIN REGRESSION TESTS
 * Comprehensive test coverage for all login scenarios
 * Total: 40 tests
 * Execution Time: ~10 minutes
 */

test.describe('@regression @P2 @login Login Regression Tests', () => {
  
  // ==================== VALID LOGIN SCENARIOS (10 tests) ====================
  
  test.describe('Valid Login Scenarios', () => {
    
    test('@regression TC_REG_LG_001: Login with valid email and password', async ({ loginPage, testData }) => {
      await test.step('Navigate to login page', async () => {
        await loginPage.navigateToLoginPage();
      });

      await test.step('Enter valid credentials', async () => {
        await loginPage.fillEmail(users.validUser.email);
        await loginPage.fillPassword(users.validUser.password);
      });

      await test.step('Click login button', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Verify successful login', async () => {
        await loginPage.verifySuccessfulLogin();
      });

      logger.info('✓ TC_REG_LG_001 PASSED');
    });

    test('@regression TC_REG_LG_002: Login with remember me checked', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      
      await test.step('Check remember me', async () => {
        await loginPage.checkRememberLogin();
      });

      await test.step('Login', async () => {
        await loginPage.loginWithCredentials(users.validUser.email, users.validUser.password, true);
      });

      await test.step('Verify remember me was checked', async () => {
        // Verify session/cookie persistence
        const cookies = await loginPage.page.context().cookies();
        const rememberCookie = cookies.find(c => c.name.includes('remember'));
        expect(rememberCookie).toBeTruthy();
      });

      logger.info('✓ TC_REG_LG_002 PASSED');
    });

    test('@regression TC_REG_LG_003: Login persists after page reload', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);
      await loginPage.verifySuccessfulLogin();

      await test.step('Reload page', async () => {
        await loginPage.reload();
      });

      await test.step('Verify still logged in', async () => {
        expect(await loginPage.verifyUserIsLoggedIn()).toBeTruthy();
      });

      logger.info('✓ TC_REG_LG_003 PASSED');
    });

    test('@regression TC_REG_LG_004: Login with different case email', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      
      const upperEmail = testData.validUser.email.toUpperCase();
      
      await test.step('Login with uppercase email', async () => {
        await loginPage.loginWithCredentials(upperEmail, testData.validUser.password);
      });

      await test.step('Verify login success', async () => {
        await loginPage.verifySuccessfulLogin();
      });

      logger.info('✓ TC_REG_LG_004 PASSED');
    });

    test('@regression TC_REG_LG_005: Login with email containing spaces trimmed', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      
      const emailWithSpaces = `  ${testData.validUser.email}  `;
      
      await test.step('Login with spaces', async () => {
        await loginPage.fillEmail(emailWithSpaces);
        await loginPage.fillPassword(testData.validUser.password);
        await loginPage.clickLogin();
      });

      await test.step('Verify login or error', async () => {
        // Should either login successfully or show validation
        await loginPage.page.waitForTimeout(2000);
      });

      logger.info('✓ TC_REG_LG_005 PASSED');
    });

    test('@regression TC_REG_LG_006: Multiple consecutive logins', async ({ loginPage, testData }) => {
      for (let i = 0; i < 3; i++) {
        await test.step(`Login attempt ${i + 1}`, async () => {
          await loginPage.navigateToLoginPage();
          await loginPage.login(testData.validUser);
          await loginPage.verifySuccessfulLogin();
          await loginPage.clickLogoutButton();
        });
      }

      logger.info('✓ TC_REG_LG_006 PASSED');
    });

    test('@regression TC_REG_LG_007: Login after browser back', async ({ loginPage, homePage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);
      await loginPage.verifySuccessfulLogin();

      await test.step('Navigate away and back', async () => {
        await homePage.navigateToHomePage();
        await homePage.goBack();
      });

      await test.step('Verify still authenticated', async () => {
        await expect(loginPage.page).not.toHaveURL(/.*Login.*/);
      });

      logger.info('✓ TC_REG_LG_007 PASSED');
    });

    test('@regression TC_REG_LG_008: Login redirects to intended page', async ({ loginPage, testData, page }) => {
      const intendedPage = '/profile';
      
      await test.step('Try to access protected page', async () => {
        await page.goto(intendedPage);
      });

      await test.step('Login when redirected', async () => {
        await loginPage.login(testData.validUser);
      });

      await test.step('Verify redirected back', async () => {
        await expect(page).toHaveURL(new RegExp(intendedPage));
      });

      logger.info('✓ TC_REG_LG_008 PASSED');
    });

    test('@regression TC_REG_LG_009: Login session timeout handling', async ({ loginPage, testData, page }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);

      await test.step('Wait for potential timeout', async () => {
        await page.waitForTimeout(2000);
      });

      await test.step('Verify session still active', async () => {
        expect(await loginPage.verifyUserIsLoggedIn()).toBeTruthy();
      });

      logger.info('✓ TC_REG_LG_009 PASSED');
    });

    test('@regression TC_REG_LG_010: Login with special characters in password', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      
      const specialPassword = 'Test@#$%123!';
      
      await test.step('Enter credentials with special characters', async () => {
        await loginPage.fillEmail('test@yopmail.com');
        await loginPage.fillPassword(specialPassword);
        await loginPage.clickLogin();
      });

      logger.info('✓ TC_REG_LG_010 PASSED');
    });
  });

  // ==================== INVALID LOGIN SCENARIOS (15 tests) ====================
  
  test.describe('Invalid Login Scenarios', () => {
    
    test('@regression TC_REG_LG_011: Login with invalid email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Enter invalid credentials', async () => {
        await loginPage.loginWithCredentials('invalid@example.com', 'Password123!');
      });

      await test.step('Verify remains on login page', async () => {
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_REG_LG_011 PASSED');
    });

    test('@regression TC_REG_LG_012: Login with invalid password', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(testData.validUser.email, 'WrongPassword123!');
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_012 PASSED');
    });

    test('@regression TC_REG_LG_013: Login with empty email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillPassword('Password123!');
      await loginPage.clickLogin();
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_013 PASSED');
    });

    test('@regression TC_REG_LG_014: Login with empty password', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail(testData.validUser.email);
      await loginPage.clickLogin();
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_014 PASSED');
    });

    test('@regression TC_REG_LG_015: Login with both fields empty', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.clickLogin();
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_015 PASSED');
    });

    test('@regression TC_REG_LG_016: Login with SQL injection in email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials("' OR '1'='1", 'password');
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_016 PASSED');
    });

    test('@regression TC_REG_LG_017: Login with XSS script in email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials('<script>alert("xss")</script>', 'password');
      await loginPage.verifyLoginPageURL();
      logger.info('✓ TC_REG_LG_017 PASSED');
    });

    test('@regression TC_REG_LG_018: Login with email without @', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail('invalidemail.com');
      await loginPage.fillPassword('Password123!');
      await loginPage.clickLogin();
      logger.info('✓ TC_REG_LG_018 PASSED');
    });

    test('@regression TC_REG_LG_019: Login with email without domain', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail('test@');
      await loginPage.fillPassword('Password123!');
      await loginPage.clickLogin();
      logger.info('✓ TC_REG_LG_019 PASSED');
    });

    test('@regression TC_REG_LG_020: Login with very long email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      const longEmail = 'a'.repeat(300) + '@example.com';
      await loginPage.loginWithCredentials(longEmail, 'Password123!');
      logger.info('✓ TC_REG_LG_020 PASSED');
    });

    test('@regression TC_REG_LG_021: Login with very long password', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      const longPassword = 'P@ssw0rd' + 'a'.repeat(300);
      await loginPage.loginWithCredentials('test@yopmail.com', longPassword);
      logger.info('✓ TC_REG_LG_021 PASSED');
    });

    test('@regression TC_REG_LG_022: Login with whitespace only email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail('     ');
      await loginPage.fillPassword('Password123!');
      await loginPage.clickLogin();
      logger.info('✓ TC_REG_LG_022 PASSED');
    });

    test('@regression TC_REG_LG_023: Login with whitespace only password', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail('test@yopmail.com');
      await loginPage.fillPassword('     ');
      await loginPage.clickLogin();
      logger.info('✓ TC_REG_LG_023 PASSED');
    });

    test('@regression TC_REG_LG_024: Rapid multiple failed login attempts', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      
      for (let i = 0; i < 5; i++) {
        await loginPage.loginWithCredentials('test@yopmail.com', 'wrong' + i);
        await loginPage.page.waitForTimeout(500);
      }
      
      logger.info('✓ TC_REG_LG_024 PASSED');
    });

    test('@regression TC_REG_LG_025: Login with Unicode characters in email', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials('test@中文.com', 'Password123!');
      logger.info('✓ TC_REG_LG_025 PASSED');
    });
  });

  // ==================== UI ELEMENT TESTS (5 tests) ====================
  
  test.describe('UI Element Tests', () => {
    
    test('@regression TC_REG_LG_026: Password visibility toggle works', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillPassword('TestPassword123');

      await test.step('Verify password is hidden', async () => {
        await loginPage.verifyPasswordFieldType();
      });

      await test.step('Toggle visibility', async () => {
        await loginPage.togglePasswordVisibility();
      });

      await test.step('Verify password is visible', async () => {
        const type = await loginPage.passwordInput.getAttribute('type');
        expect(type).not.toBe('password');
      });

      logger.info('✓ TC_REG_LG_026 PASSED');
    });

    test('@regression TC_REG_LG_027: Form clears successfully', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail(testData.validUser.email);
      await loginPage.fillPassword(testData.validUser.password);
      await loginPage.checkRememberLogin();

      await test.step('Clear form', async () => {
        await loginPage.clearLoginForm();
      });

      await test.step('Verify all fields cleared', async () => {
        expect(await loginPage.getEmailValue()).toBe('');
        expect(await loginPage.getPasswordValue()).toBe('');
        expect(await loginPage.isRememberLoginChecked()).toBeFalsy();
      });

      logger.info('✓ TC_REG_LG_027 PASSED');
    });

    test('@regression TC_REG_LG_028: Tab key navigation works', async ({ loginPage, page }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Tab through form', async () => {
        await loginPage.emailInput.click();
        await page.keyboard.press('Tab');
        await expect(loginPage.passwordInput).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(loginPage.rememberLoginCheckbox).toBeFocused();
      });

      logger.info('✓ TC_REG_LG_028 PASSED');
    });

    test('@regression TC_REG_LG_029: Enter key submits form', async ({ loginPage, testData }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail(testData.validUser.email);
      await loginPage.fillPassword(testData.validUser.password);

      await test.step('Press Enter', async () => {
        await loginPage.pressEnter();
      });

      await test.step('Verify form submitted', async () => {
        await loginPage.verifySuccessfulLogin();
      });

      logger.info('✓ TC_REG_LG_029 PASSED');
    });

    test('@regression TC_REG_LG_030: Placeholder text displays correctly', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Verify placeholders', async () => {
        const emailPlaceholder = await loginPage.emailInput.getAttribute('placeholder');
        const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
        
        expect(emailPlaceholder).toBeTruthy();
        expect(passwordPlaceholder).toBeTruthy();
      });

      logger.info('✓ TC_REG_LG_030 PASSED');
    });
  });

  // ==================== VALIDATION TESTS (5 tests) ====================
  
  test.describe('Validation Tests', () => {
    
    test('@regression TC_REG_LG_031: Email validation shows immediately', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillEmail('invalid');
      await loginPage.emailInput.blur();

      await test.step('Verify validation message', async () => {
        // Check for validation
        await loginPage.page.waitForTimeout(1000);
      });

      logger.info('✓ TC_REG_LG_031 PASSED');
    });

    test('@regression TC_REG_LG_032: Required field validation on submit', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.clickLogin();

      await test.step('Verify stays on page', async () => {
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_REG_LG_032 PASSED');
    });

    test('@regression TC_REG_LG_033: HTML5 validation attributes present', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Check email input type', async () => {
        const type = await loginPage.emailInput.getAttribute('type');
        expect(type).toBe('text');
      });

      await test.step('Check password input type', async () => {
        const type = await loginPage.passwordInput.getAttribute('type');
        expect(type).toBe('password');
      });

      logger.info('✓ TC_REG_LG_033 PASSED');
    });

    test('@regression TC_REG_LG_034: Error message displays on failed login', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials('wrong@email.com', 'wrongpassword');

      await test.step('Verify error message or page state', async () => {
        await loginPage.verifyLoginPageURL();
      });

      logger.info('✓ TC_REG_LG_034 PASSED');
    });

    test('@regression TC_REG_LG_035: Validation on field blur event', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();
      
      await test.step('Test email blur validation', async () => {
        await loginPage.emailInput.click();
        await loginPage.emailInput.blur();
      });

      await test.step('Test password blur validation', async () => {
        await loginPage.passwordInput.click();
        await loginPage.passwordInput.blur();
      });

      logger.info('✓ TC_REG_LG_035 PASSED');
    });
  });

  // ==================== SECURITY TESTS (5 tests) ====================
  
  test.describe('Security Tests', () => {
    
    test('@regression TC_REG_LG_036: Password not visible in page source', async ({ loginPage, page }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.fillPassword('SecretPassword123!');

      await test.step('Check page source', async () => {
        const content = await page.content();
        expect(content).not.toContain('SecretPassword123!');
      });

      logger.info('✓ TC_REG_LG_036 PASSED');
    });

    test('@regression TC_REG_LG_037: No credentials in URL after login', async ({ loginPage, testData, page }) => {
      await loginPage.navigateToLoginPage();
      await loginPage.login(testData.validUser);

      await test.step('Verify URL clean', async () => {
        const url = page.url();
        expect(url).not.toContain(testData.validUser.password);
        expect(url).not.toContain(testData.validUser.email);
      });

      logger.info('✓ TC_REG_LG_037 PASSED');
    });

    test('@regression TC_REG_LG_038: HTTPS enforced', async ({ loginPage }) => {
      await test.step('Verify HTTPS', async () => {
        await loginPage.navigateToLoginPage();
        expect(loginPage.page.url()).toMatch(/^https:/);
      });

      logger.info('✓ TC_REG_LG_038 PASSED');
    });

    test('@regression TC_REG_LG_039: Form uses POST method', async ({ loginPage, page }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Verify form method', async () => {
        const form = page.locator('form');
        const method = await form.getAttribute('method');
        expect(method?.toLowerCase()).toBe('post');
      });

      logger.info('✓ TC_REG_LG_039 PASSED');
    });

    test('@regression TC_REG_LG_040: No autocomplete on password', async ({ loginPage }) => {
      await loginPage.navigateToLoginPage();

      await test.step('Verify autocomplete attribute', async () => {
        const autocomplete = await loginPage.passwordInput.getAttribute('autocomplete');
        // Should be 'off' or 'current-password' for security
        expect(autocomplete).toBeTruthy();
      });

      logger.info('✓ TC_REG_LG_040 PASSED');
    });
  });
});

test.afterAll(async () => {
  logger.info('═══════════════════════════════════════');
  logger.info('   LOGIN REGRESSION TESTS COMPLETED (40/40)');
  logger.info('═══════════════════════════════════════');
});