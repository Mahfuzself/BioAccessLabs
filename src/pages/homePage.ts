import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  // Header navigation elements
  readonly homeLink: Locator;
  readonly aboutUsLink: Locator;
  readonly contactUsLink: Locator;
  readonly loginButton: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header navigation
    this.homeLink = page.getByRole('listitem').filter({ hasText: 'Home' });
    this.aboutUsLink = page.getByRole('listitem').filter({ hasText: 'About Us' });
    this.contactUsLink = page.getByRole('listitem').filter({ hasText: 'Contact Us' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.cartButton = page.getByRole('listitem').locator('button').first();
  }

  // Navigation methods
  async navigateToHomePage() {
    await this.navigateTo('/');
  }

  async clickLoginButton() {
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async clickHomeLink() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  async clickAboutUsLink() {
    await this.aboutUsLink.click();
    await this.waitForPageLoad();
  }

  async clickContactUsLink() {
    await this.contactUsLink.click();
    await this.waitForPageLoad();
  }

  async clickCartButton() {
    await this.cartButton.click();
    await this.waitForPageLoad();
  }

  // Verification methods
  async verifyHomePageTitle() {
    await this.verifyPageTitle('Bio Access Labs');
  }

  async verifyHeaderNavigation() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.aboutUsLink).toBeVisible();
    await expect(this.contactUsLink).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyAllHeaderElements() {
    await this.verifyLogoVisible();
    await this.verifyHeaderNavigation();
    await expect(this.cartButton).toBeVisible();
  }

  async verifyHomePageLoaded() {
    await this.verifyHomePageTitle();
    await this.verifyLogoVisible();
    await this.verifyHeaderNavigation();
  }

  // Utility methods
  async isUserLoggedIn(): Promise<boolean> {
    // Check if login button is visible (if visible, user is not logged in)
    return !(await this.loginButton.isVisible());
  }

  async getHeaderNavigationLinks(): Promise<string[]> {
    const links: string[] = [];
    
    if (await this.homeLink.isVisible()) {
      links.push(await this.homeLink.textContent() || '');
    }
    if (await this.aboutUsLink.isVisible()) {
      links.push(await this.aboutUsLink.textContent() || '');
    }
    if (await this.contactUsLink.isVisible()) {
      links.push(await this.contactUsLink.textContent() || '');
    }
    
    return links;
  }
}