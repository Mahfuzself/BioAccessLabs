import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL: string = 'https://bioal.thrivewellrx.com';
  
  // Common elements across all pages
  readonly logo: Locator;
  readonly footerLogo: Locator;
  readonly instagramLink: Locator;
  readonly facebookLink: Locator;
  readonly contactUsFooter: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly refundPolicyLink: Locator;
  readonly copyrightText: Locator;
  readonly limitationOfLiabilityHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header
    this.logo = page.locator('img[alt="Bio Access Logo"]').first();
    
    // Footer elements
    this.footerLogo = page.locator('img[alt="Bio Access Logo"]').last();
    this.instagramLink = page.locator('a[href*="instagram.com/bioaccesslabs"]');
    this.facebookLink = page.locator('a[href*="facebook.com"]');
    this.contactUsFooter = page.getByRole('link', { name: 'Contact Us' });
    this.termsLink = page.getByRole('link', { name: 'Terms & Conditions' });
    this.privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.refundPolicyLink = page.getByRole('link', { name: 'Refund Policy' });
    this.copyrightText = page.getByText('Copyright 2025 bioaccesslabs.com');
    this.limitationOfLiabilityHeading = page.getByRole('heading', { name: 'Limitation of Liability' });
  }

  // Common navigation methods
  async navigateTo(path: string = '') {
    const url = path ? `${this.baseURL}${path}` : this.baseURL;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToHomePage() {
    await this.navigateTo('/');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogo() {
    await this.logo.click();
    await this.waitForPageLoad();
  }

  // Common verification methods
  async verifyPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyPageURL(urlPattern: string | RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  async verifyLogoVisible() {
    await expect(this.logo).toBeVisible();
  }

  async verifyFooterElements() {
    await expect(this.footerLogo).toBeVisible();
    await expect(this.instagramLink).toBeVisible();
    await expect(this.facebookLink).toBeVisible();
    await expect(this.copyrightText).toBeVisible();
    await expect(this.limitationOfLiabilityHeading).toBeVisible();
  }

  async verifyFooterLinks() {
    await expect(this.contactUsFooter).toBeVisible();
    await expect(this.termsLink).toBeVisible();
    await expect(this.privacyLink).toBeVisible();
    await expect(this.refundPolicyLink).toBeVisible();
  }

  async verifySocialMediaLinks() {
    const instagramHref = await this.instagramLink.getAttribute('href');
    const facebookHref = await this.facebookLink.getAttribute('href');
    
    expect(instagramHref).toContain('instagram.com/bioaccesslabs');
    expect(facebookHref).toContain('facebook.com');
  }

  async clickFooterLink(linkName: 'Contact Us' | 'Terms & Conditions' | 'Privacy Policy' | 'Refund Policy') {
    switch(linkName) {
      case 'Contact Us':
        await this.contactUsFooter.click();
        break;
      case 'Terms & Conditions':
        await this.termsLink.click();
        break;
      case 'Privacy Policy':
        await this.privacyLink.click();
        break;
      case 'Refund Policy':
        await this.refundPolicyLink.click();
        break;
    }
    await this.waitForPageLoad();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(screenshotName: string) {
    await this.page.screenshot({ path: `screenshots/${screenshotName}.png`, fullPage: true });
  }

  async waitForElement(locator: Locator, timeout: number = 30000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForTimeout(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }
}