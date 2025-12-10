import { test, expect } from '../../../src/fixtures/testFixture';
import { logger } from '../../../src/utils/logger';

/**
 * REGRESSION TESTS - Registration Functionality
 */

test.describe('@regression Registration Regression Tests', () => {
  
  test('@regression TC_REG_REG_001: Complete registration form fills correctly', async ({ registerPage, testData }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm(testData.randomUser);
    
    expect(await registerPage.getEmailValue()).toBe(testData.randomUser.email);
    expect(await registerPage.getFirstNameValue()).toBe(testData.randomUser.firstName);
    expect(await registerPage.getLastNameValue()).toBe(testData.randomUser.lastName);
    
    logger.info('✓ TC_REG_REG_001 PASSED');
  });

  test('@regression TC_REG_REG_002: Gender selection works correctly', async ({ registerPage }) => {
    await registerPage.navigateToRegisterPage();
    
    await registerPage.selectGender('Male');
    expect(await registerPage.getSelectedGender()).toBe('Male');
    
    await registerPage.selectGender('Female');
    expect(await registerPage.getSelectedGender()).toBe('Female');
    
    logger.info('✓ TC_REG_REG_002 PASSED');
  });

  test('@regression TC_REG_REG_003: Form clear functionality works', async ({ registerPage, testData }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm(testData.randomUser);
    await registerPage.clearRegistrationForm();
    
    expect(await registerPage.getEmailValue()).toBe('');
    expect(await registerPage.getFirstNameValue()).toBe('');
    
    logger.info('✓ TC_REG_REG_003 PASSED');
  });
});