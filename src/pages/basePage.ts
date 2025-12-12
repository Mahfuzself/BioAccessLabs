import { Page, Locator, expect } from '@playwright/test';
import { logger, logStep } from '../utils/logger';
import { envConfig } from '../config/environment.config';
import path from 'path';
import fs from 'fs';

/**
 * BasePage - Foundation class for all page objects
 * Provides common functionality, elements, and utilities
 * NO CODE DUPLICATION - All reusable logic lives here
 */
export class BasePage {
  readonly page: Page;
  readonly baseURL: string;
  
  // ==================== COMMON HEADER ELEMENTS ====================
  logo!: Locator;
  homeLink!: Locator;
  aboutUsLink!: Locator;
  contactUsLink!: Locator;
  loginButton!: Locator;
  logoutButton!: Locator;
  userProfileIcon!: Locator;
  cartButton!: Locator;
  cartCount!: Locator;
  searchBox!: Locator;
  searchButton!: Locator;
  profileMenu!: Locator;
  
  // ==================== COMMON FOOTER ELEMENTS ====================
  footerLogo!: Locator;
  instagramLink!: Locator;
  facebookLink!: Locator;
  twitterLink!: Locator;
  linkedinLink!: Locator;
  contactUsFooter!: Locator;
  termsLink!: Locator;
  privacyLink!: Locator;
  refundPolicyLink!: Locator;
  copyrightText!: Locator;
  limitationOfLiabilityHeading!: Locator;
  newsletterInput!: Locator;
  newsletterSubmit!: Locator;
  
  // ==================== COMMON ALERT/MESSAGE ELEMENTS ====================
  successMessage!: Locator;
  errorMessage!: Locator;
  warningMessage!: Locator;
  infoMessage!: Locator;
  loadingSpinner!: Locator;
  modalOverlay!: Locator;
  modalCloseButton!: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = envConfig.baseURL;
    
    // Initialize all common elements
    this.initializeHeaderElements();
    this.initializeFooterElements();
    this.initializeCommonElements();
  }

  // ==================== INITIALIZATION METHODS ====================

  private initializeHeaderElements(): void {
    // Header navigation
    this.logo = this.page.locator('img[alt*="Logo"], .logo, [data-testid="logo"]').first();
    this.homeLink = this.page.getByRole('link', { name: /Home/i });
    this.aboutUsLink = this.page.getByRole('link', { name: /About Us/i });
    this.contactUsLink = this.page.getByRole('link', { name: /Contact Us/i });
    this.loginButton = this.page.getByRole('button', { name: /log in|login|sign in/i });
    this.logoutButton = this.page.getByText('Log Out').first();
    this.userProfileIcon = this.page.locator('[data-testid="user-profile"], .user-profile, .profile-icon');
    this.profileMenu = this.page.getByRole('button', { name: new RegExp('Mahfuz Alam') });    
    
    // Shopping cart
    this.cartButton = this.page.locator('[data-testid="cart"], .cart-icon, button:has-text("Cart")').first();
    this.cartCount = this.page.locator('[data-testid="cart-count"], .cart-count, .badge');
    
    // Search
    this.searchBox = this.page.getByRole('textbox', { name: /search/i });
    this.searchButton = this.page.getByRole('button', { name: /search/i });
  }

  private initializeFooterElements(): void {
    this.footerLogo = this.page.locator('footer img[alt*="Logo"], footer .logo').first();
    this.instagramLink = this.page.locator('a[href*="instagram.com"]');
    this.facebookLink = this.page.locator('a[href*="facebook.com"]');
    this.twitterLink = this.page.locator('a[href*="twitter.com"], a[href*="x.com"]');
    this.linkedinLink = this.page.locator('a[href*="linkedin.com"]');
    this.contactUsFooter = this.page.locator('footer').getByRole('link', { name: /contact/i });
    this.termsLink = this.page.getByRole('link', { name: /terms/i });
    this.privacyLink = this.page.getByRole('link', { name: /privacy/i });
    this.refundPolicyLink = this.page.getByRole('link', { name: /refund/i });
    this.copyrightText = this.page.locator('footer').locator('text=/copyright|©/i');
    this.limitationOfLiabilityHeading = this.page.getByRole('heading', { name: /limitation.*liability/i });
    this.newsletterInput = this.page.locator('footer input[type="email"], footer [placeholder*="email"]');
    this.newsletterSubmit = this.page.locator('footer button:has-text("Subscribe"), footer button[type="submit"]');
  }

  private initializeCommonElements(): void {
    // Alert messages
    this.successMessage = this.page.locator('.alert-success, .success-message, [role="alert"].success');
    this.errorMessage = this.page.locator('.alert-danger, .alert-error, .error-message, [role="alert"].error');
    this.warningMessage = this.page.locator('.alert-warning, .warning-message, [role="alert"].warning');
    this.infoMessage = this.page.locator('.alert-info, .info-message, [role="alert"].info');
    
    // Loading states
    this.loadingSpinner = this.page.locator('.spinner, .loading, [data-testid="loading"]');
    
    // Modals
    this.modalOverlay = this.page.locator('.modal-backdrop, .overlay, [data-testid="modal-overlay"]');
    this.modalCloseButton = this.page.locator('.modal button.close, [data-testid="modal-close"]');
  }

  // ==================== NAVIGATION METHODS ====================

  async navigateTo(path: string = ''): Promise<void> {
    const url = path ? `${this.baseURL}${path}` : this.baseURL;
    logStep(`Navigating to: ${url}`);
    
    try {
      await this.page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: envConfig.timeout 
      });
      await this.waitForPageLoad();
      logger.info(`✓ Successfully navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate to: ${url}`, error);
      throw error;
    }
  }

  async navigateToHomePage(): Promise<void> {
    await this.navigateTo('/');
  }

  async reload(): Promise<void> {
    logStep('Reloading page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async goBack(): Promise<void> {
    logStep('Navigating back');
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    logStep('Navigating forward');
    await this.page.goForward({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  // ==================== WAIT METHODS ====================

  async waitForPageLoad(): Promise<void> {
    try {
      await Promise.race([
        this.page.waitForLoadState('domcontentloaded'),
        this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
      ]);
      
      // Wait for any loading spinners to disappear
      await this.waitForLoadingToComplete();
      
      logger.debug('✓ Page loaded');
    } catch (error) {
      logger.warn('Page load warning (continuing anyway)', error);
    }
  }

  async waitForLoadingToComplete(timeout: number = 10000): Promise<void> {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout });
      logger.debug('✓ Loading complete');
    } catch {
      // Loading spinner might not exist, which is fine
    }
  }

  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    const waitTimeout = timeout || envConfig.timeout;
    await locator.waitFor({ state: 'visible', timeout: waitTimeout });
  }

  async waitForElementToDisappear(locator: Locator, timeout?: number): Promise<void> {
    const waitTimeout = timeout || envConfig.timeout;
    await locator.waitFor({ state: 'hidden', timeout: waitTimeout });
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    logger.debug(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  async waitForURL(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: timeout || envConfig.timeout });
  }

  // ==================== CLICK METHODS ====================

  async click(locator: Locator, description?: string): Promise<void> {
    if (description) logStep(`Clicking: ${description}`);
    // await locator.scrollIntoViewIfNeeded();
    await locator.click();
    await this.waitForLoadingToComplete();
  }

  async clickWithRetry(locator: Locator, maxRetries: number = 3): Promise<void> {
    await this.retryAction(async () => {
      await locator.click();
    }, maxRetries);
  }

  async doubleClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.dblclick();
  }

  async rightClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.click({ button: 'right' });
  }

  // ==================== INPUT METHODS ====================

  async fill(locator: Locator, value: string, description?: string): Promise<void> {
    if (description) logStep(`Filling: ${description}`);
    await locator.scrollIntoViewIfNeeded();
    await locator.clear();
    await locator.fill(value);
    logger.debug(`✓ Filled value: ${value.substring(0, 20)}...`);
  }

  async clearAndFill(locator: Locator, value: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.clear();
    await locator.fill(value);
  }

  async type(locator: Locator, text: string, delay?: number): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.type(text, { delay: delay || 50 });
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async pressEnter(): Promise<void> {
    await this.pressKey('Enter');
  }

  // ==================== SELECT METHODS ====================

  async selectOption(locator: Locator, value: string | string[]): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.selectOption(value);
  }

  async selectByLabel(locator: Locator, label: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.selectOption({ label });
  }

  async selectByIndex(locator: Locator, index: number): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.selectOption({ index });
  }

  // ==================== CHECKBOX/RADIO METHODS ====================

  async check(locator: Locator): Promise<void> {
    if (!await locator.isChecked()) {
      await locator.check();
      logger.debug('✓ Checkbox checked');
    }
  }

  async uncheck(locator: Locator): Promise<void> {
    if (await locator.isChecked()) {
      await locator.uncheck();
      logger.debug('✓ Checkbox unchecked');
    }
  }

  async toggleCheckbox(locator: Locator): Promise<void> {
    const isChecked = await locator.isChecked();
    if (isChecked) {
      await this.uncheck(locator);
    } else {
      await this.check(locator);
    }
  }

  // ==================== HOVER METHODS ====================

  async hover(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.hover();
  }

  // ==================== SCROLL METHODS ====================

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    logger.debug('✓ Scrolled to element');
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // ==================== VERIFICATION METHODS ====================

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    logStep(`Verifying page title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle);
    logger.info(`✓ Page title verified: ${expectedTitle}`);
  }

  async verifyPageURL(urlPattern: string | RegExp): Promise<void> {
    logStep(`Verifying page URL`);
    await expect(this.page).toHaveURL(urlPattern);
    logger.info('✓ Page URL verified');
  }

  async verifyElementVisible(locator: Locator, elementName?: string): Promise<void> {
    const name = elementName || 'Element';
    await expect(locator).toBeVisible();
    logger.debug(`✓ ${name} is visible`);
  }

  async verifyElementHidden(locator: Locator, elementName?: string): Promise<void> {
    const name = elementName || 'Element';
    await expect(locator).toBeHidden();
    logger.debug(`✓ ${name} is hidden`);
  }

  async verifyElementEnabled(locator: Locator, elementName?: string): Promise<void> {
    const name = elementName || 'Element';
    await expect(locator).toBeEnabled();
    logger.debug(`✓ ${name} is enabled`);
  }

  async verifyElementDisabled(locator: Locator, elementName?: string): Promise<void> {
    const name = elementName || 'Element';
    await expect(locator).toBeDisabled();
    logger.debug(`✓ ${name} is disabled`);
  }

  async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
    logger.debug(`✓ Element has text: ${expectedText}`);
  }

  async verifyElementContainsText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
    logger.debug(`✓ Element contains: ${text}`);
  }

  async verifyElementCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
    logger.debug(`✓ Element count is: ${count}`);
  }

  async verifyElementValue(locator: Locator, expectedValue: string): Promise<void> {
    await expect(locator).toHaveValue(expectedValue);
    logger.debug(`✓ Element value is: ${expectedValue}`);
  }

  // ==================== COMMON HEADER ACTIONS ====================

  async clickLogo(): Promise<void> {
    await this.click(this.logo, 'Logo');
    await this.waitForPageLoad();
  }

  async clickHomeLink(): Promise<void> {
    await this.click(this.homeLink, 'Home Link');
    await this.waitForPageLoad();
  }

  async clickAboutUsLink(): Promise<void> {
    await this.click(this.aboutUsLink, 'About Us Link');
    await this.waitForPageLoad();
  }

  async clickContactUsLink(): Promise<void> {
    await this.click(this.contactUsLink, 'Contact Us Link');
    await this.waitForPageLoad();
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton, 'Login Button');
    await this.waitForPageLoad();
  }

  async clickLogoutButton(): Promise<void> {
     await this.page.getByRole('button', { name: 'Mahfuz Alam ' }).click();
    await this.click(this.logoutButton, 'Logout Button');
    await this.waitForPageLoad();
  }

  async clickCartButton(): Promise<void> {
    await this.click(this.cartButton, 'Cart Button');
    await this.waitForPageLoad();
  }

  async performSearch(searchText: string): Promise<void> {
    logStep(`Searching for: ${searchText}`);
    await this.fill(this.searchBox, searchText, 'Search Box');
    await this.click(this.searchButton, 'Search Button');
    await this.waitForPageLoad();
  }

  // ==================== COMMON FOOTER ACTIONS ====================

  async clickFooterLink(
  linkName: 'Contact Us' | 'Terms' | 'Privacy' | 'Refund'
): Promise<void> {
  
  const linkMap: Record<string, Locator> = {
    'Contact Us': this.contactUsFooter,
    'Terms': this.termsLink,
    'Privacy': this.privacyLink,
    'Refund': this.refundPolicyLink
  };

  logStep(`Clicking Footer Link: ${linkName}`);

  const locator = linkMap[linkName];

  await this.click(locator, `${linkName} Footer Link`);
  await this.waitForPageLoad();
}

async subscribeToNewsletter(email: string): Promise<void> {
  logStep(`Subscribing to newsletter: ${email}`);

  await this.fill(this.newsletterInput, email);
  await this.click(this.newsletterSubmit, 'Newsletter Submit');

  // Optional: wait for toast message or success state
  // await this.verifyToastMessage('Subscribed successfully');
}

// ==================== VERIFICATION METHODS ====================

async verifyHeaderVisible(): Promise<void> {
  logStep('Verifying header visibility');

  await this.verifyElementVisible(this.logo, 'Logo');

  logger.info('✓ Header verified successfully');
}

  async verifyFooterVisible(): Promise<void> {
    logStep('Verifying footer elements');
    await this.verifyElementVisible(this.footerLogo, 'Footer Logo');
    await this.verifyElementVisible(this.copyrightText, 'Copyright Text');
    logger.info('✓ Footer verified');
  }

  async verifyUserIsLoggedIn(): Promise<boolean> {
    await this.clickProfile();
    try {
      return await this.logoutButton.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async verifyUserIsLoggedOut(): Promise<boolean> {
    try {
      return await this.loginButton.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  // ==================== ALERT/MESSAGE METHODS ====================

  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage, 5000);
    return await this.successMessage.textContent() || '';
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage, 5000);
    return await this.errorMessage.textContent() || '';
  }

  async verifySuccessMessage(expectedMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.successMessage, 'Success Message');
    if (expectedMessage) {
      await this.verifyElementContainsText(this.successMessage, expectedMessage);
    }
    logger.info('✓ Success message verified');
  }

  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    if (expectedMessage) {
      await this.verifyElementContainsText(this.errorMessage, expectedMessage);
    }
    logger.info('✓ Error message verified');
  }

  async closeModal(): Promise<void> {
    if (await this.modalCloseButton.isVisible()) {
      await this.click(this.modalCloseButton, 'Modal Close Button');
    }
  }

  // ==================== UTILITY METHODS ====================

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async getElementText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async getElementValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return await locator.getAttribute(attribute);
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    try {
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  async isElementChecked(locator: Locator): Promise<boolean> {
    try {
      return await locator.isChecked();
    } catch {
      return false;
    }
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // ==================== SCREENSHOT METHODS ====================

  async takeScreenshot(screenshotName: string): Promise<void> {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(screenshotDir, `${screenshotName}_${timestamp}.png`);
    
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    logger.info(`✓ Screenshot saved: ${screenshotPath}`);
  }

  async takeElementScreenshot(locator: Locator, screenshotName: string): Promise<void> {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(screenshotDir, `${screenshotName}_${timestamp}.png`);
    
    await locator.screenshot({ path: screenshotPath });
    logger.info(`✓ Element screenshot saved: ${screenshotPath}`);
  }

  // ==================== RETRY METHODS ====================

  async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        logger.warn(`Attempt ${attempt}/${maxRetries} failed`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        await this.waitForTimeout(delayMs * attempt);
      }
    }
    throw new Error('Max retries exceeded');
  }

  // ==================== DRAG AND DROP ====================

  async dragAndDrop(sourceLocator: Locator, targetLocator: Locator): Promise<void> {
    logStep('Performing drag and drop');
    await sourceLocator.dragTo(targetLocator);
    logger.debug('✓ Drag and drop completed');
  }

  // ==================== FILE UPLOAD ====================

  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    logStep(`Uploading file: ${filePath}`);
    await locator.setInputFiles(filePath);
    logger.info('✓ File uploaded');
  }

  async uploadMultipleFiles(locator: Locator, filePaths: string[]): Promise<void> {
    logStep(`Uploading ${filePaths.length} files`);
    await locator.setInputFiles(filePaths);
    logger.info(`✓ ${filePaths.length} files uploaded`);
  }

  // ==================== IFRAME HANDLING ====================

  async switchToFrame(frameLocator: string | Locator): Promise<void> {
    logStep('Switching to iframe');
    // Playwright handles iframes automatically with frameLocator
    logger.debug('✓ Frame context switched');
  }

  // ==================== WINDOW/TAB HANDLING ====================

  async getWindowCount(): Promise<number> {
    return this.page.context().pages().length;
  }

  async switchToWindow(index: number): Promise<Page> {
    const pages = this.page.context().pages();
    if (index < pages.length) {
      return pages[index];
    }
    throw new Error(`Window index ${index} not found`);
  }

  async closeCurrentWindow(): Promise<void> {
    await this.page.close();
  }

  // ==================== BROWSER ACTIONS ====================

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
    logger.info('✓ Cookies cleared');
  }

  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  async setCookie(cookie: any): Promise<void> {
    await this.page.context().addCookies([cookie]);
    logger.debug('✓ Cookie set');
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ({ k, v }) => localStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    logger.debug('✓ Local storage cleared');
  }
   async clickProfile(): Promise<void> {
    await this.profileMenu.click();
    logger.debug('✓ Clicked on profile button');
  }
}