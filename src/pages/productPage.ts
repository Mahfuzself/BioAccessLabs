import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { logger, logStep } from '../utils/logger';

/**
 * Product Page Object Model
 * Handles product listing, details, and actions
 */
export class ProductPage extends BasePage {
  // Product listing elements
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly productRating: Locator;
  
  // Product details
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productDetailPrice: Locator;
  readonly productSku: Locator;
  readonly productAvailability: Locator;
  
  // Actions
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly buyNowButton: Locator;
  readonly quantitySelector: Locator;
  readonly viewDetailsButton: Locator;
  
  // Filters and sorting
  readonly categoryFilter: Locator;
  readonly priceFilter: Locator;
  readonly sortDropdown: Locator;
  readonly searchInProducts: Locator;
  
  // Pagination
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly pageNumbers: Locator;

  constructor(page: Page) {
    super(page);
    
    // Product listing
    this.productGrid = page.locator('.product-grid, [data-testid="product-grid"]');
    this.productCards = page.locator('.product-card, [data-testid="product-card"]');
    this.productTitle = page.locator('.product-title, [data-testid="product-title"]');
    this.productPrice = page.locator('.product-price, [data-testid="product-price"]');
    this.productImage = page.locator('.product-image, [data-testid="product-image"]');
    this.productRating = page.locator('.product-rating, [data-testid="product-rating"]');
    
    // Product details
    this.productName = page.locator('h1.product-name, [data-testid="product-name"]');
    this.productDescription = page.locator('.product-description, [data-testid="product-description"]');
    this.productDetailPrice = page.locator('.product-detail-price, [data-testid="detail-price"]');
    this.productSku = page.locator('.product-sku, [data-testid="sku"]');
    this.productAvailability = page.locator('.product-availability, [data-testid="availability"]');
    
    // Actions
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.addToWishlistButton = page.getByRole('button', { name: /add to wishlist|wishlist/i });
    this.buyNowButton = page.getByRole('button', { name: /buy now/i });
    this.quantitySelector = page.locator('input[type="number"][name*="quantity"]');
    this.viewDetailsButton = page.getByRole('button', { name: /view details|details/i });
    
    // Filters
    this.categoryFilter = page.locator('.category-filter, [data-testid="category-filter"]');
    this.priceFilter = page.locator('.price-filter, [data-testid="price-filter"]');
    this.sortDropdown = page.locator('select[name="sort"], [data-testid="sort"]');
    this.searchInProducts = page.locator('input[placeholder*="search products"]');
    
    // Pagination
    this.nextPageButton = page.getByRole('button', { name: /next/i });
    this.previousPageButton = page.getByRole('button', { name: /previous|prev/i });
    this.pageNumbers = page.locator('.page-number, [data-testid="page-number"]');
  }

  // ==================== NAVIGATION ====================
  
  async navigateToProducts(): Promise<void> {
    await this.navigateTo('/products');
    await this.waitForPageLoad();
    logger.info('Navigated to products page');
  }

  async navigateToProductDetail(productId: string): Promise<void> {
    await this.navigateTo(`/product/${productId}`);
    await this.waitForPageLoad();
    logger.info(`Navigated to product detail: ${productId}`);
  }

  async clickViewDetails(index: number = 0): Promise<void> {
    await this.click(this.viewDetailsButton.nth(index), 'View Details');
  }

  // ==================== PRODUCT LISTING ====================
  
  async getProductCount(): Promise<number> {
    try {
      return await this.productCards.count();
    } catch {
      return 0;
    }
  }

  async getProductTitles(): Promise<string[]> {
    const titles = await this.productTitle.allTextContents();
    return titles.map(title => title.trim());
  }

  async getProductPrices(): Promise<string[]> {
    const prices = await this.productPrice.allTextContents();
    return prices.map(price => price.trim());
  }

  async clickProduct(productName: string): Promise<void> {
    logStep(`Clicking product: ${productName}`);
    const product = this.page.locator(`.product-card:has-text("${productName}")`);
    await product.click();
    await this.waitForPageLoad();
  }

  async clickProductByIndex(index: number): Promise<void> {
    logStep(`Clicking product at index: ${index}`);
    await this.productCards.nth(index).click();
    await this.waitForPageLoad();
  }

  // ==================== PRODUCT DETAILS ====================
  
  async getProductName(): Promise<string> {
    return await this.getElementText(this.productName);
  }

  async getProductDescription(): Promise<string> {
    return await this.getElementText(this.productDescription);
  }

  async getProductPrice(): Promise<string> {
    return await this.getElementText(this.productDetailPrice);
  }

  async getProductSKU(): Promise<string> {
    return await this.getElementText(this.productSku);
  }

  async getProductAvailability(): Promise<string> {
    return await this.getElementText(this.productAvailability);
  }

  async isProductInStock(): Promise<boolean> {
    const availability = await this.getProductAvailability();
    return availability.toLowerCase().includes('in stock');
  }

  // ==================== ACTIONS ====================
  
  async addToCart(): Promise<void> {
    logStep('Adding product to cart');
    await this.click(this.addToCartButton, 'Add to Cart');
    await this.waitForLoadingToComplete();
  }

  async addToCartFromListing(index: number): Promise<void> {
    logStep(`Adding product ${index} to cart from listing`);
    const addToCartBtn = this.productCards.nth(index).locator('button:has-text("Add to Cart")');
    await this.click(addToCartBtn, 'Add to Cart');
    await this.waitForLoadingToComplete();
  }

  async addToWishlist(): Promise<void> {
    logStep('Adding product to wishlist');
    await this.click(this.addToWishlistButton, 'Add to Wishlist');
    await this.waitForLoadingToComplete();
  }

  async buyNow(): Promise<void> {
    logStep('Clicking Buy Now');
    await this.click(this.buyNowButton, 'Buy Now');
    await this.waitForPageLoad();
  }

  async setQuantity(quantity: number): Promise<void> {
    logStep(`Setting quantity to: ${quantity}`);
    await this.quantitySelector.clear();
    await this.quantitySelector.fill(quantity.toString());
  }

  async increaseQuantity(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.page.locator('button[aria-label*="increase"]').click();
    }
  }

  async decreaseQuantity(times: number = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.page.locator('button[aria-label*="decrease"]').click();
    }
  }

  // ==================== FILTERS & SORTING ====================
  
  async selectCategory(category: string): Promise<void> {
    logStep(`Selecting category: ${category}`);
    await this.page.locator(`input[value="${category}"][type="checkbox"]`).check();
    await this.waitForLoadingToComplete();
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    logStep(`Setting price range: ${min} - ${max}`);
    await this.page.locator('input[name="price_min"]').fill(min.toString());
    await this.page.locator('input[name="price_max"]').fill(max.toString());
    await this.waitForLoadingToComplete();
  }

  async sortBy(option: 'price-low' | 'price-high' | 'name' | 'rating' | 'newest'): Promise<void> {
    logStep(`Sorting by: ${option}`);
    await this.selectOption(this.sortDropdown, option);
    await this.waitForLoadingToComplete();
  }

  async searchProducts(query: string): Promise<void> {
    logStep(`Searching products: ${query}`);
    await this.fill(this.searchInProducts, query);
    await this.pressEnter();
    await this.waitForLoadingToComplete();
  }

  async clearFilters(): Promise<void> {
    logStep('Clearing all filters');
    await this.page.locator('button:has-text("Clear Filters")').click();
    await this.waitForLoadingToComplete();
  }

  // ==================== PAGINATION ====================
  
  async goToNextPage(): Promise<void> {
    await this.click(this.nextPageButton, 'Next Page');
    await this.waitForPageLoad();
  }

  async goToPreviousPage(): Promise<void> {
    await this.click(this.previousPageButton, 'Previous Page');
    await this.waitForPageLoad();
  }

  async goToPage(pageNumber: number): Promise<void> {
    logStep(`Going to page: ${pageNumber}`);
    await this.pageNumbers.locator(`text="${pageNumber}"`).click();
    await this.waitForPageLoad();
  }

  // ==================== VERIFICATION ====================
  
  async verifyProductsPageTitle(): Promise<void> {
    await this.verifyPageTitle('Products');
  }

  async verifyProductsPageURL(): Promise<void> {
    await this.verifyPageURL(/.*products.*|.*shop.*/i);
  }

  async verifyProductExists(productName: string): Promise<void> {
    logStep(`Verifying product exists: ${productName}`);
    const titles = await this.getProductTitles();
    const exists = titles.some(title => title.includes(productName));
    expect(exists).toBeTruthy();
    logger.info(`✓ Product verified: ${productName}`);
  }

  async verifyProductCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getProductCount();
    expect(actualCount).toBe(expectedCount);
    logger.info(`✓ Product count verified: ${expectedCount}`);
  }

  async verifyAddToCartButtonVisible(): Promise<void> {
    await this.verifyElementVisible(this.addToCartButton, 'Add to Cart Button');
  }

  async verifyProductInStock(): Promise<void> {
    const inStock = await this.isProductInStock();
    expect(inStock).toBeTruthy();
    logger.info('✓ Product is in stock');
  }

  async verifyProductOutOfStock(): Promise<void> {
    const inStock = await this.isProductInStock();
    expect(inStock).toBeFalsy();
    logger.info('✓ Product is out of stock');
  }

  async verifyAddToCartSuccess(): Promise<void> {
    await this.verifySuccessMessage('added to cart');
  }

  // ==================== UTILITY METHODS ====================
  
  async getRandomProduct(): Promise<string> {
    const titles = await this.getProductTitles();
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
  }

  async getProductDetails(index: number): Promise<{
    title: string;
    price: string;
  }> {
    return {
      title: (await this.productTitle.nth(index).textContent())?.trim() || '',
      price: (await this.productPrice.nth(index).textContent())?.trim() || ''
    };
  }

  async getAllProductDetails(): Promise<Array<{
    title: string;
    price: string;
  }>> {
    const count = await this.getProductCount();
    const products = [];
    
    for (let i = 0; i < count; i++) {
      products.push(await this.getProductDetails(i));
    }
    
    return products;
  }

  async waitForProductsToLoad(): Promise<void> {
    await this.waitForElement(this.productGrid);
    await this.waitForLoadingToComplete();
  }
}