import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { logger, logStep } from '../utils/logger';
import { TestDataManager } from '../utils/testDataManager';
import { th } from '@faker-js/faker';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export class LoginPage extends BasePage {
  // Page specific elements
  readonly returningCustomerHeading: Locator;
  readonly descriptionText: Locator;
  
  // Form elements
  readonly emailLabel: Locator;
  readonly emailInput: Locator;
  readonly passwordLabel: Locator;
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly rememberLoginCheckbox: Locator;
  readonly rememberLoginLabel: Locator;
  readonly loginButton: Locator;
  
  // Links
  readonly createAccountLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly firstTimeVisitorText: Locator;

  constructor(page: Page) {
    super(page);
    
    // Page headings and text
    this.returningCustomerHeading = page.getByRole('heading', { name: /Returning.*customer/i });
    this.descriptionText = page.getByText('Log in to continue your journey');
    
    // Form labels and inputs
    this.emailLabel = page.locator('text="Email Address:"');
    this.emailInput = page.getByRole('textbox', { name: 'Email Address:' });
    this.passwordLabel = page.locator('text="Password:"');
    this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
    this.showPasswordButton = page.locator('button').filter({ hasText: '' }).nth(1);
    this.rememberLoginCheckbox = page.getByLabel('Remember Login');
    this.rememberLoginLabel = page.getByText('Remember Login');
    this.loginButton = page.getByRole('link', { name: 'Login' });
    
    // Links
    this.createAccountLink = page.getByRole('link', { name: 'Create an account' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.firstTimeVisitorText = page.getByText('First-time Visitor?');
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/Login');
    logger.info('Navigated to login page');
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    logStep('Clicking login button');
    await this.loginButton.click();
    await this.waitForPageLoad();
    logger.info('Login button clicked');
  }

  /**
   * Click create account link
   */
  async clickCreateAccount(): Promise<void> {
    logStep('Clicking create account link');
    await this.createAccountLink.click();
    await this.waitForPageLoad();
    logger.info('Navigated to create account page');
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    logStep('Clicking forgot password link');
    await this.forgotPasswordLink.click();
    await this.waitForPageLoad();
    logger.info('Navigated to forgot password page');
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    logStep('Toggling password visibility');
    await this.showPasswordButton.click();
    logger.debug('Password visibility toggled');
  }

  // ==================== FORM INTERACTION METHODS ====================

  /**
   * Fill email field
   * @param email - Email address
   */
  async fillEmail(email: string): Promise<void> {
    logStep(`Filling email: ${TestDataManager.maskSensitiveData(email)}`);
    await this.clearAndFill(this.emailInput, email);
  }

  /**
   * Fill password field
   * @param password - Password
   */
  async fillPassword(password: string): Promise<void> {
    logStep('Filling password');
    await this.clearAndFill(this.passwordInput, password);
    logger.debug('Password filled (masked)');
  }

  /**
   * Check remember login checkbox
   */
  // async checkRememberLogin(): Promise<void> {
    
  //   await this.rememberLoginCheckbox.scrollIntoViewIfNeeded();
  //   if (!await this.rememberLoginCheckbox.isChecked()) {
  //     await this.rememberLoginCheckbox.click({ force: true });
  //     logger.debug('Remember login checked');
  //   }
  // }
  async checkRememberLogin(): Promise<void> {

  const checkbox = this.rememberLoginCheckbox;
  await checkbox.scrollIntoViewIfNeeded();

  // Force-click instead of check()
  await checkbox.click();
  
  logger.debug('Remember login clicked');
}

  /**
   * Uncheck remember login checkbox
   */
  async uncheckRememberLogin(): Promise<void> {
    if (await this.rememberLoginCheckbox.isChecked()) {
      await this.rememberLoginCheckbox.uncheck();
      logger.debug('Remember login unchecked');
    }
  }

  /**
   * Login with credentials
   * @param email - Email address
   * @param password - Password
   * @param remember - Remember login option
   */
  async loginWithCredentials(email: string, password: string, remember: boolean = false): Promise<void> {
    logStep(`Logging in with email: ${TestDataManager.maskSensitiveData(email)}`);
    
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (remember) {
      await this.checkRememberLogin();
    }
    
    await this.clickLogin();
    logger.info('Login attempted');
  }

  /**
   * Login using credentials object
   * @param credentials - Login credentials object
   */
  async login(credentials: LoginCredentials): Promise<void> {
    await this.loginWithCredentials(
      credentials.email,
      credentials.password,
      credentials.rememberMe || false
    );
  }

  /**
   * Login with valid test user
   */
  async loginWithValidUser(): Promise<void> {
    const validUser = TestDataManager.getValidUser();
    await this.loginWithCredentials(validUser.email, validUser.password);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    logStep('Clearing login form');
    await this.emailInput.clear();
    await this.passwordInput.clear();
    
    if (await this.rememberLoginCheckbox.isChecked()) {
      await this.uncheckRememberLogin();
    }
    logger.info('Login form cleared');
  }

  // ==================== VERIFICATION METHODS ====================

  /**
   * Verify login page title
   */
  async verifyLoginPageTitle(): Promise<void> {
    await this.verifyPageTitle('User Log In');
  }

  /**
   * Verify login page URL
   */
  async verifyLoginPageURL(): Promise<void> {
    await this.verifyPageURL(/.*Login.*/);
  }

  /**
   * Verify page elements are visible
   */
  async verifyPageElements(): Promise<void> {
    logStep('Verifying login page elements');
    await expect(this.returningCustomerHeading).toBeVisible();
    await expect(this.descriptionText).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    logger.info('Login page elements verified');
  }

  /**
   * Verify form fields are enabled
   */
  async verifyFormFields(): Promise<void> {
    logStep('Verifying form fields');
    await expect(this.emailInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.rememberLoginCheckbox).toBeEnabled();
    await expect(this.loginButton).toBeEnabled();
    logger.info('Form fields verified');
  }

  /**
   * Verify links are visible
   */
  async verifyLinks(): Promise<void> {
    logStep('Verifying links');
    await expect(this.createAccountLink).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.firstTimeVisitorText).toBeVisible();
    logger.info('Links verified');
  }

  /**
   * Verify password field type
   */
  async verifyPasswordFieldType(): Promise<void> {
    const inputType = await this.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
    logger.debug('Password field type verified');
  }

  /**
   * Verify email input is focused
   */
  async verifyEmailInputFocused(): Promise<void> {
    await expect(this.emailInput).toBeFocused();
    logger.debug('Email input focus verified');
  }

  /**
   * Verify form labels
   */
  async verifyFormLabels(): Promise<void> {
    logStep('Verifying form labels');
    await expect(this.emailLabel).toBeVisible();
    await expect(this.passwordLabel).toBeVisible();
    await expect(this.rememberLoginLabel).toBeVisible();
    logger.info('Form labels verified');
  }

  /**
   * Verify login page is fully loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    logStep('Verifying login page loaded');
    await this.verifyLoginPageTitle();
    await this.verifyFooterVisible();
    await this.verifyPageElements();
    logger.info('Login page fully loaded and verified');
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - Expected error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorLocator = this.page.locator('.error-message, .alert-danger, [role="alert"]');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(expectedMessage);
    logger.info(`Error message verified: ${expectedMessage}`);
  }

  /**
   * Verify successful login
   */
  async verifySuccessfulLogin(): Promise<void> {
    logStep('Verifying successful login');
    // Check if redirected away from login page
    await expect(this.page).not.toHaveURL(/.*Login.*/);
    logger.info('Successful login verified');
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get email field value
   * @returns Email value
   */
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Get password field value
   * @returns Password value
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if remember login is checked
   * @returns True if checked
   */
  async isRememberLoginChecked(): Promise<boolean> {
    return await this.rememberLoginCheckbox.isChecked();
  }

  /**
   * Check if login button is enabled
   * @returns True if enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Get validation message from field
   * @param field - Field type ('email' or 'password')
   * @returns Validation message
   */
  async getValidationMessage(field: 'email' | 'password'): Promise<string> {
    const locator = field === 'email' ? this.emailInput : this.passwordInput;
    return await locator.getAttribute('validationMessage') || '';
  }

  /**
   * Wait for login to complete
   */
  async waitForLoginComplete(): Promise<void> {
    await this.page.waitForURL(url => !url.toString().includes('Login'), { timeout: 10000 });
    logger.info('Login completed');
  }
}