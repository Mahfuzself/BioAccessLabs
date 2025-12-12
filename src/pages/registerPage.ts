import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dob: string;
  mobile: string;
  gender: 'Female' | 'Male';
  password: string;
  confirmPassword: string;
}

export class RegisterPage extends BasePage {
  // Page elements
  readonly pageHeading: Locator;
  
  // Form field labels
  readonly emailLabel: Locator;
  readonly firstNameLabel: Locator;
  readonly lastNameLabel: Locator;
  readonly displayNameLabel: Locator;
  readonly dobLabel: Locator;
  readonly mobileLabel: Locator;
  readonly genderLabel: Locator;
  readonly passwordLabel: Locator;
  readonly confirmPasswordLabel: Locator;
  
  // Form fields
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly displayNameInput: Locator;
  readonly dobInput: Locator;
  readonly mobileInput: Locator;
  readonly genderDropdown: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  
  // Buttons and links
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly alreadyHaveAccountText: Locator;
  readonly showPasswordButton: Locator;
  readonly showConfirmPasswordButton: Locator;
  
  // Help links
  readonly emailHelpLink: Locator;
  readonly firstNameHelpLink: Locator;
  readonly lastNameHelpLink: Locator;
  readonly displayNameHelpLink: Locator;
  readonly dobHelpLink: Locator;
  readonly mobileHelpLink: Locator;
  readonly genderHelpLink: Locator;
  readonly passwordHelpLink: Locator;
  readonly confirmPasswordHelpLink: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageHeading = page.getByRole('heading', { name: "Let's Get You Signed Up" });
    
    // Form labels
    this.emailLabel = page.getByText('Email Address: *');
    this.firstNameLabel = page.getByText('First Name: *');
    this.lastNameLabel = page.getByText('Last Name: *');
    this.displayNameLabel = page.getByText('Display Name: *');
    this.dobLabel = page.getByText('Date of birth *');
    this.mobileLabel = page.getByText('Cell/Mobile: *');
    this.genderLabel = page.getByText('Gender *');
    this.passwordLabel = page.getByText('Password: *');
    this.confirmPasswordLabel = page.getByText('Confirm Password: *');
    
    // Form fields
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox').nth(1);
    this.lastNameInput = page.getByRole('textbox').nth(2);
    this.displayNameInput = page.getByRole('textbox', { name: 'DisplayName' });
    this.dobInput = page.getByRole('textbox').nth(4);
    this.mobileInput = page.getByRole('textbox').nth(5);
    this.genderDropdown = page.getByRole('combobox').first();
    this.passwordInput = page.getByRole('textbox', { name: 'Password' }).first();
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'PasswordConfirm' }).last();
    
    // Buttons and links
    this.registerButton = page.getByRole('link', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.alreadyHaveAccountText = page.getByText('Already have an account?');
    this.showPasswordButton = page.locator('button').filter({ hasText: '' }).first();
    this.showConfirmPasswordButton = page.locator('button').filter({ hasText: '' }).last();
    
    // Help links
    this.emailHelpLink = page.getByRole('link', { name: 'Help' }).first();
    this.firstNameHelpLink = page.getByRole('link', { name: 'Help' }).nth(1);
    this.lastNameHelpLink = page.getByRole('link', { name: 'Help' }).nth(2);
    this.displayNameHelpLink = page.getByRole('link', { name: 'Help' }).nth(3);
    this.dobHelpLink = page.getByRole('link', { name: 'Help' }).nth(4);
    this.mobileHelpLink = page.getByRole('link', { name: 'Help' }).nth(5);
    this.genderHelpLink = page.getByRole('link', { name: 'Help' }).nth(6);
    this.passwordHelpLink = page.getByRole('link', { name: 'Help' }).nth(7);
    this.confirmPasswordHelpLink = page.getByRole('link', { name: 'Help' }).nth(8);
  }

  // Navigation methods
  async navigateToRegisterPage() {
    await this.navigateTo('/register');
  }

  async clickRegister() {
    await this.registerButton.click();
    await this.waitForPageLoad();
  }

  async clickLoginLink() {
    await this.loginLink.click();
    await this.waitForPageLoad();
  }

  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  async toggleConfirmPasswordVisibility() {
    await this.showConfirmPasswordButton.click();
  }

  // Form interaction methods
  async fillEmail(email: string) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
  }

  async fillDisplayName(displayName: string) {
    await this.displayNameInput.clear();
    await this.displayNameInput.fill(displayName);
  }

  async fillDOB(dob: string) {
    await this.dobInput.clear();
    await this.dobInput.fill(dob);
  }

  async fillMobile(mobile: string) {
    await this.mobileInput.clear();
    await this.mobileInput.fill(mobile);
  }

  async selectGender(gender: 'Female' | 'Male') {
    await this.genderDropdown.selectOption(gender);
  }

  async fillPassword(password: string) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.clear();
    await this.confirmPasswordInput.fill(password);
  }

  async fillRegistrationForm(data: RegistrationData) {
    await this.fillEmail(data.email);
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillDisplayName(data.displayName);
    await this.fillDOB(data.dob);
    await this.fillMobile(data.mobile);
    await this.selectGender(data.gender);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
  }

  async clearRegistrationForm() {
    await this.emailInput.clear();
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.displayNameInput.clear();
    await this.dobInput.clear();
    await this.mobileInput.clear();
    await this.genderDropdown.selectOption('Select Gender');
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
  }

  async registerUser(data: RegistrationData) {
    await this.fillRegistrationForm(data);
    await this.clickRegister();
  }

  // Verification methods
  async verifyRegisterPageTitle() {
    await this.verifyPageTitle('Bio Access Labs');
  }

  async verifyPageHeading() {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAllFormFields() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.displayNameInput).toBeVisible();
    await expect(this.dobInput).toBeVisible();
    await expect(this.mobileInput).toBeVisible();
    await expect(this.genderDropdown).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  async verifyFormFieldsEnabled() {
    await expect(this.emailInput).toBeEnabled();
    await expect(this.firstNameInput).toBeEnabled();
    await expect(this.lastNameInput).toBeEnabled();
    await expect(this.displayNameInput).toBeEnabled();
    await expect(this.dobInput).toBeEnabled();
    await expect(this.mobileInput).toBeEnabled();
    await expect(this.genderDropdown).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.confirmPasswordInput).toBeEnabled();
  }

  async verifyButtons() {
    await expect(this.registerButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.alreadyHaveAccountText).toBeVisible();
  }

  async verifyRequiredFieldLabels() {
    await expect(this.emailLabel).toBeVisible();
    await expect(this.firstNameLabel).toBeVisible();
    await expect(this.lastNameLabel).toBeVisible();
    await expect(this.displayNameLabel).toBeVisible();
    await expect(this.dobLabel).toBeVisible();
    await expect(this.mobileLabel).toBeVisible();
    await expect(this.genderLabel).toBeVisible();
    await expect(this.passwordLabel).toBeVisible();
    await expect(this.confirmPasswordLabel).toBeVisible();
  }

  async verifyGenderDropdownOptions() {
    await expect(this.genderDropdown).toBeVisible();
    
    const options = await this.genderDropdown.locator('option').allTextContents();
    expect(options).toContain('Select Gender');
    expect(options).toContain('Female');
    expect(options).toContain('Male');
  }

  async verifyRegisterPageLoaded() {
    await this.verifyRegisterPageTitle();
    await this.verifyFooterVisible();
    await this.verifyPageHeading();
    await this.verifyAllFormFields();
  }

  // Utility methods
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getFirstNameValue(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastNameValue(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getDisplayNameValue(): Promise<string> {
    return await this.displayNameInput.inputValue();
  }

  async getDOBValue(): Promise<string> {
    return await this.dobInput.inputValue();
  }

  async getMobileValue(): Promise<string> {
    return await this.mobileInput.inputValue();
  }

  async getSelectedGender(): Promise<string> {
    return await this.genderDropdown.inputValue();
  }

  async isRegisterButtonEnabled(): Promise<boolean> {
    return await this.registerButton.isEnabled();
  }

  async clickHelpLink(field: 'email' | 'firstName' | 'lastName' | 'displayName' | 'dob' | 'mobile' | 'gender' | 'password' | 'confirmPassword') {
    switch(field) {
      case 'email':
        await this.emailHelpLink.click();
        break;
      case 'firstName':
        await this.firstNameHelpLink.click();
        break;
      case 'lastName':
        await this.lastNameHelpLink.click();
        break;
      case 'displayName':
        await this.displayNameHelpLink.click();
        break;
      case 'dob':
        await this.dobHelpLink.click();
        break;
      case 'mobile':
        await this.mobileHelpLink.click();
        break;
      case 'gender':
        await this.genderHelpLink.click();
        break;
      case 'password':
        await this.passwordHelpLink.click();
        break;
      case 'confirmPassword':
        await this.confirmPasswordHelpLink.click();
        break;
    }
  }
}