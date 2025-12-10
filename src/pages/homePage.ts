import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { logger, logStep } from '../utils/logger';

export class HomePage extends BasePage {
  // Only page-specific elements
  readonly heroSection: Locator;
  readonly featuredProducts: Locator;

  constructor(page: Page) {
    super(page); // Inherits ALL BasePage methods
    
    // Define only HomePage-specific elements
    this.heroSection = page.locator('.hero-section');
    this.featuredProducts = page.locator('.featured-products');
  }

  // Only HomePage-specific methods
  async verifyHomePageTitle(): Promise<void> {
    await this.verifyPageTitle('Bio Access Labs');
  }

  async verifyHomePageLoaded(): Promise<void> {
    logStep('Verifying homepage loaded');
    await this.verifyHomePageTitle();
    await this.verifyHeaderVisible();
    logger.info('✓ Homepage loaded and verified');
  }
}