import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

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
    this.rememberLoginCheckbox = page.getByRole('checkbox', { name: 'Remember Login' });
    this.rememberLoginLabel = page.getByText('Remember Login');
    this.loginButton = page.getByRole('link', { name: 'Login' });
    
    // Links
    this.createAccountLink = page.getByRole('link', { name: 'Create an account' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.firstTimeVisitorText = page.getByText('First-time Visitor?');
  }

  // Navigation methods
  async navigateToLoginPage() {
    await this.navigateTo('/Login');
  }

  async clickLogin() {
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async clickCreateAccount() {
    await this.createAccountLink.click();
    await this.waitForPageLoad();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.waitForPageLoad();
  }

  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  // Form interaction methods
  async fillEmail(email: string) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async checkRememberLogin() {
    await this.rememberLoginCheckbox.check();
  }

  async uncheckRememberLogin() {
    await this.rememberLoginCheckbox.uncheck();
  }

  async loginWithCredentials(email: string, password: string, remember: boolean = false) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (remember) {
      await this.checkRememberLogin();
    }
    
    await this.clickLogin();
  }

  async clearLoginForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    
    if (await this.rememberLoginCheckbox.isChecked()) {
      await this.uncheckRememberLogin();
    }
  }

  // Verification methods
  async verifyLoginPageTitle() {
    await this.verifyPageTitle('User Log In');
  }

  async verifyLoginPageURL() {
    await this.verifyPageURL(/.*Login.*/);
  }

  async verifyPageElements() {
    await expect(this.returningCustomerHeading).toBeVisible();
    await expect(this.descriptionText).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyFormFields() {
    await expect(this.emailInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.rememberLoginCheckbox).toBeEnabled();
    await expect(this.loginButton).toBeEnabled();
  }

  async verifyLinks() {
    await expect(this.createAccountLink).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.firstTimeVisitorText).toBeVisible();
  }

  async verifyPasswordFieldType() {
    const inputType = await this.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  }

  async verifyEmailInputFocused() {
    await expect(this.emailInput).toBeFocused();
  }

  async verifyFormLabels() {
    await expect(this.emailLabel).toBeVisible();
    await expect(this.passwordLabel).toBeVisible();
    await expect(this.rememberLoginLabel).toBeVisible();
  }

  async verifyLoginPageLoaded() {
    await this.verifyLoginPageTitle();
    await this.verifyLogoVisible();
    await this.verifyPageElements();
  }

  // Utility methods
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async isRememberLoginChecked(): Promise<boolean> {
    return await this.rememberLoginCheckbox.isChecked();
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async getValidationMessage(field: 'email' | 'password'): Promise<string> {
    const locator = field === 'email' ? this.emailInput : this.passwordInput;
    return await locator.getAttribute('validationMessage') || '';
  }
}