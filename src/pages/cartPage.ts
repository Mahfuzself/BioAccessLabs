import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { logger, logStep } from '../utils/logger';

/**
 * Cart Page Object Model
 * Handles all cart-related functionality
 */
export class CartPage extends BasePage {
  // Cart elements
  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly cartEmpty: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;
  readonly cartItemQuantity: Locator;
  readonly cartItemSubtotal: Locator;
  
  // Action buttons
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly updateCartButton: Locator;
  readonly clearCartButton: Locator;
  
  // Quantity controls
  readonly quantityInput: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly removeItemButton: Locator;
  
  // Cart summary
  readonly subtotalAmount: Locator;
  readonly taxAmount: Locator;
  readonly shippingAmount: Locator;
  readonly totalAmount: Locator;
  readonly discountCode: Locator;
  readonly applyDiscountButton: Locator;
  
  // Messages
  readonly cartUpdateMessage: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Cart elements
    this.cartTitle = page.locator('h1:has-text("Shopping Cart"), h1:has-text("Cart")');
    this.cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
    this.cartEmpty = page.locator('.cart-empty, [data-testid="empty-cart"]');
    this.cartItemName = page.locator('.cart-item-name, [data-testid="item-name"]');
    this.cartItemPrice = page.locator('.cart-item-price, [data-testid="item-price"]');
    this.cartItemQuantity = page.locator('.cart-item-quantity, [data-testid="item-quantity"]');
    this.cartItemSubtotal = page.locator('.cart-item-subtotal, [data-testid="item-subtotal"]');
    
    // Action buttons
    this.continueShoppingButton = page.getByRole('button', { name: /continue shopping/i });
    this.checkoutButton = page.getByRole('button', { name: /checkout|proceed to checkout/i });
    this.updateCartButton = page.getByRole('button', { name: /update cart/i });
    this.clearCartButton = page.getByRole('button', { name: /clear cart|empty cart/i });
    
    // Quantity controls
    this.quantityInput = page.locator('input[type="number"][name*="quantity"]');
    this.increaseQuantityButton = page.locator('button[aria-label*="increase"], button:has-text("+")');
    this.decreaseQuantityButton = page.locator('button[aria-label*="decrease"], button:has-text("-")');
    this.removeItemButton = page.locator('button:has-text("Remove"), button[aria-label*="remove"]');
    
    // Cart summary
    this.subtotalAmount = page.locator('.subtotal-amount, [data-testid="subtotal"]');
    this.taxAmount = page.locator('.tax-amount, [data-testid="tax"]');
    this.shippingAmount = page.locator('.shipping-amount, [data-testid="shipping"]');
    this.totalAmount = page.locator('.total-amount, [data-testid="total"]');
    this.discountCode = page.locator('input[name="discount"], input[placeholder*="discount"]');
    this.applyDiscountButton = page.getByRole('button', { name: /apply/i });
    
    // Messages
    this.cartUpdateMessage = page.locator('.success-message, [role="alert"].success');
    this.emptyCartMessage = page.locator('.empty-cart-message, [data-testid="empty-message"]');
  }

  // ==================== NAVIGATION ====================
  
  async navigateToCart(): Promise<void> {
    await this.navigateTo('/cart');
    await this.waitForPageLoad();
    logger.info('Navigated to cart page');
  }

  async clickContinueShopping(): Promise<void> {
    logStep('Clicking continue shopping');
    await this.click(this.continueShoppingButton, 'Continue Shopping Button');
  }

  async clickCheckout(): Promise<void> {
    logStep('Proceeding to checkout');
    await this.click(this.checkoutButton, 'Checkout Button');
  }

  // ==================== CART OPERATIONS ====================
  
  async getCartItemCount(): Promise<number> {
    try {
      return await this.cartItems.count();
    } catch {
      return 0;
    }
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      return await this.cartEmpty.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async getItemNames(): Promise<string[]> {
    const items = await this.cartItemName.allTextContents();
    return items.map(item => item.trim());
  }

  async getItemPrice(itemIndex: number = 0): Promise<string> {
    const price = await this.cartItemPrice.nth(itemIndex).textContent();
    return price?.trim() || '';
  }

  async getItemQuantity(itemIndex: number = 0): Promise<number> {
    const qty = await this.cartItemQuantity.nth(itemIndex).textContent();
    return parseInt(qty || '0');
  }

  async updateQuantity(itemIndex: number, quantity: number): Promise<void> {
    logStep(`Updating quantity to ${quantity} for item ${itemIndex}`);
    const input = this.quantityInput.nth(itemIndex);
    await input.clear();
    await input.fill(quantity.toString());
    await this.clickUpdateCart();
  }

  async increaseQuantity(itemIndex: number = 0): Promise<void> {
    logStep('Increasing item quantity');
    await this.click(this.increaseQuantityButton.nth(itemIndex), 'Increase Quantity');
  }

  async decreaseQuantity(itemIndex: number = 0): Promise<void> {
    logStep('Decreasing item quantity');
    await this.click(this.decreaseQuantityButton.nth(itemIndex), 'Decrease Quantity');
  }

  async removeItem(itemIndex: number = 0): Promise<void> {
    logStep(`Removing item at index ${itemIndex}`);
    await this.click(this.removeItemButton.nth(itemIndex), 'Remove Item');
    await this.waitForLoadingToComplete();
  }

  async removeItemByName(itemName: string): Promise<void> {
    logStep(`Removing item: ${itemName}`);
    const items = await this.getItemNames();
    const index = items.findIndex(name => name.includes(itemName));
    
    if (index >= 0) {
      await this.removeItem(index);
    } else {
      throw new Error(`Item "${itemName}" not found in cart`);
    }
  }

  async clickUpdateCart(): Promise<void> {
    await this.click(this.updateCartButton, 'Update Cart Button');
    await this.waitForLoadingToComplete();
  }

  async clearCart(): Promise<void> {
    logStep('Clearing entire cart');
    await this.click(this.clearCartButton, 'Clear Cart Button');
    await this.waitForLoadingToComplete();
  }

  // ==================== CART SUMMARY ====================
  
  async getSubtotal(): Promise<string> {
    return await this.getElementText(this.subtotalAmount);
  }

  async getTax(): Promise<string> {
    return await this.getElementText(this.taxAmount);
  }

  async getShipping(): Promise<string> {
    return await this.getElementText(this.shippingAmount);
  }

  async getTotal(): Promise<string> {
    return await this.getElementText(this.totalAmount);
  }

  async applyDiscountCode(code: string): Promise<void> {
    logStep(`Applying discount code: ${code}`);
    await this.fill(this.discountCode, code, 'Discount Code');
    await this.click(this.applyDiscountButton, 'Apply Discount');
    await this.waitForLoadingToComplete();
  }

  // ==================== VERIFICATION ====================
  
  async verifyCartPageTitle(): Promise<void> {
    await this.verifyPageTitle('Shopping Cart');
  }

  async verifyCartPageURL(): Promise<void> {
    await this.verifyPageURL(/.*cart.*/i);
  }

  async verifyItemInCart(itemName: string): Promise<void> {
    logStep(`Verifying item in cart: ${itemName}`);
    const items = await this.getItemNames();
    const found = items.some(name => name.includes(itemName));
    
    if (!found) {
      throw new Error(`Item "${itemName}" not found in cart`);
    }
    
    logger.info(`✓ Item verified in cart: ${itemName}`);
  }

  async verifyItemNotInCart(itemName: string): Promise<void> {
    logStep(`Verifying item NOT in cart: ${itemName}`);
    const items = await this.getItemNames();
    const found = items.some(name => name.includes(itemName));
    
    if (found) {
      throw new Error(`Item "${itemName}" unexpectedly found in cart`);
    }
    
    logger.info(`✓ Item verified NOT in cart: ${itemName}`);
  }

  async verifyCartItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
    logger.info(`✓ Cart item count verified: ${expectedCount}`);
  }

  async verifyCartIsEmpty(): Promise<void> {
    logStep('Verifying cart is empty');
    const isEmpty = await this.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    logger.info('✓ Cart is empty');
  }

  async verifyCartIsNotEmpty(): Promise<void> {
    logStep('Verifying cart is not empty');
    const count = await this.getCartItemCount();
    expect(count).toBeGreaterThan(0);
    logger.info('✓ Cart has items');
  }

  async verifyCheckoutButtonEnabled(): Promise<void> {
    await this.verifyElementEnabled(this.checkoutButton, 'Checkout Button');
  }

  async verifyCheckoutButtonDisabled(): Promise<void> {
    await this.verifyElementDisabled(this.checkoutButton, 'Checkout Button');
  }

  async verifyUpdateMessage(message: string): Promise<void> {
    await this.verifyElementContainsText(this.cartUpdateMessage, message);
  }

  // ==================== UTILITY METHODS ====================
  
  async getCartSummary(): Promise<{
    subtotal: string;
    tax: string;
    shipping: string;
    total: string;
    itemCount: number;
  }> {
    return {
      subtotal: await this.getSubtotal(),
      tax: await this.getTax(),
      shipping: await this.getShipping(),
      total: await this.getTotal(),
      itemCount: await this.getCartItemCount()
    };
  }

  async getAllItemDetails(): Promise<Array<{
    name: string;
    price: string;
    quantity: number;
  }>> {
    const count = await this.getCartItemCount();
    const items = [];
    
    for (let i = 0; i < count; i++) {
      items.push({
        name: (await this.cartItemName.nth(i).textContent())?.trim() || '',
        price: (await this.cartItemPrice.nth(i).textContent())?.trim() || '',
        quantity: parseInt((await this.cartItemQuantity.nth(i).textContent())?.trim() || '0')
      });
    }
    
    return items;
  }

  async calculateExpectedTotal(): Promise<number> {
    const items = await this.getAllItemDetails();
    let total = 0;
    
    for (const item of items) {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      total += price * item.quantity;
    }
    
    return total;
  }

  async waitForCartUpdate(): Promise<void> {
    await this.waitForLoadingToComplete();
    await this.page.waitForTimeout(1000); // Wait for animations
  }
}