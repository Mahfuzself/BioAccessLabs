import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { logger } from '../utils/logger';
import { envConfig } from '../config/environment.config';
import path from 'path';
import fs from 'fs';

/**
 * Authentication Fixture
 * Handles user authentication and session management
 * NO CODE DUPLICATION - Single source of truth for auth
 */

const AUTH_DIR = path.join(process.cwd(), '.auth');
const AUTH_FILE_USER = path.join(AUTH_DIR, 'user.json');
const AUTH_FILE_ADMIN = path.join(AUTH_DIR, 'admin.json');

// Ensure auth directory exists
function ensureAuthDirectory(): void {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

// Check if auth file exists and is valid
function isAuthFileValid(filePath: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtimeMs;
    
    return age < maxAge; // Valid for 24 hours by default
  } catch {
    return false;
  }
}

// Clear auth file
function clearAuthFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`✓ Cleared auth file: ${filePath}`);
    }
  } catch (error) {
    logger.warn(`Failed to clear auth file: ${filePath}`, error);
  }
}

// ==================== AUTH FIXTURE TYPES ====================

type AuthRole = 'user' | 'admin' | 'guest';

interface AuthOptions {
  role?: AuthRole;
  forceLogin?: boolean;
  maxAge?: number;
}

type AuthFixtures = {
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
  userPage: Page;
  adminPage: Page;
  authRole: AuthRole;
};

// ==================== AUTH FIXTURE ====================

export const authTest = base.extend<AuthFixtures>({
  // Get authentication role from test metadata
  authRole: [async ({}, use) => {
    await use('user'); // Default role
  }, { option: true }],

  // Authenticated context with storage state
  authenticatedContext: async ({ browser, authRole }, use) => {
    ensureAuthDirectory();
    
    const authFile = authRole === 'admin' ? AUTH_FILE_ADMIN : AUTH_FILE_USER;
    let context: BrowserContext;

    // Check if we have valid saved auth state
    if (isAuthFileValid(authFile)) {
      logger.info(`✓ Using saved auth state for: ${authRole}`);
      context = await browser.newContext({ storageState: authFile });
    } else {
      logger.info(`🔐 Creating new auth session for: ${authRole}`);
      context = await browser.newContext();
      
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const credentials = envConfig.getCredentials(authRole);

      try {
        // Perform login
        await loginPage.navigateToLoginPage();
        await loginPage.loginWithCredentials(credentials.email, credentials.password);
        
        // Wait for successful login (URL change)
        await page.waitForURL(url => !url.toString().includes('Login'), { 
          timeout: 10000 
        });

        // Save auth state
        await context.storageState({ path: authFile });
        logger.info(`✓ Auth state saved for: ${authRole}`);
      } catch (error) {
        logger.error(`Failed to authenticate as: ${authRole}`, error);
        throw error;
      } finally {
        await page.close();
      }
    }

    await use(context);
    await context.close();
  },

  // Authenticated page with loaded auth state
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    logger.info('✓ Authenticated page ready');
    
    await use(page);
    await page.close();
  },

  // Pre-authenticated user page
  userPage: async ({ browser }, use) => {
    ensureAuthDirectory();
    let context: BrowserContext;

    if (isAuthFileValid(AUTH_FILE_USER)) {
      context = await browser.newContext({ storageState: AUTH_FILE_USER });
    } else {
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const credentials = envConfig.getCredentials('user');

      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(credentials.email, credentials.password);
      await page.waitForURL(url => !url.toString().includes('Login'));
      
      await context.storageState({ path: AUTH_FILE_USER });
      await page.close();
    }

    const userPage = await context.newPage();
    await use(userPage);
    
    await userPage.close();
    await context.close();
  },

  // Pre-authenticated admin page
  adminPage: async ({ browser }, use) => {
    ensureAuthDirectory();
    let context: BrowserContext;

    if (isAuthFileValid(AUTH_FILE_ADMIN)) {
      context = await browser.newContext({ storageState: AUTH_FILE_ADMIN });
    } else {
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const credentials = envConfig.getCredentials('admin');

      await loginPage.navigateToLoginPage();
      await loginPage.loginWithCredentials(credentials.email, credentials.password);
      await page.waitForURL(url => !url.includes('Login'));
      
      await context.storageState({ path: AUTH_FILE_ADMIN });
      await page.close();
    }

    const adminPage = await context.newPage();
    await use(adminPage);
    
    await adminPage.close();
    await context.close();
  }
});

// ==================== AUTH HELPER FUNCTIONS ====================

export class AuthHelper {
  /**
   * Clear all saved auth states
   */
  static clearAllAuthStates(): void {
    logger.info('🧹 Clearing all auth states');
    clearAuthFile(AUTH_FILE_USER);
    clearAuthFile(AUTH_FILE_ADMIN);
  }

  /**
   * Clear specific auth state
   */
  static clearAuthState(role: AuthRole): void {
    logger.info(`🧹 Clearing auth state for: ${role}`);
    const authFile = role === 'admin' ? AUTH_FILE_ADMIN : AUTH_FILE_USER;
    clearAuthFile(authFile);
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    try {
      // Check for common authentication indicators
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")');
      const userProfile = page.locator('[data-testid="user-profile"], .user-profile');
      
      const hasLogout = await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);
      const hasProfile = await userProfile.isVisible({ timeout: 2000 }).catch(() => false);
      
      return hasLogout || hasProfile;
    } catch {
      return false;
    }
  }

  /**
   * Perform login manually
   */
  static async login(page: Page, email: string, password: string): Promise<void> {
    logger.info(`🔐 Logging in as: ${email}`);
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLoginPage();
    await loginPage.loginWithCredentials(email, password);
    await loginPage.waitForLoginComplete();
    
    logger.info('✓ Login successful');
  }

  /**
   * Perform logout
   */
  static async logout(page: Page): Promise<void> {
    logger.info('🚪 Logging out');
    
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")');
    
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForURL(url => url.toString().includes('Login') || url.toString().includes('home'), {
        timeout: 10000
      });
      logger.info('✓ Logout successful');
    } else {
      logger.warn('Logout button not found');
    }
  }

  /**
   * Get current user info from page
   */
  static async getCurrentUser(page: Page): Promise<{ email: string | null; name: string | null }> {
    try {
      const userEmail = page.locator('[data-testid="user-email"], .user-email');
      const userName = page.locator('[data-testid="user-name"], .user-name');
      
      const email = await userEmail.textContent().catch(() => null);
      const name = await userName.textContent().catch(() => null);
      
      return { email, name };
    } catch {
      return { email: null, name: null };
    }
  }

  /**
   * Verify user has specific role/permissions
   */
  static async verifyRole(page: Page, expectedRole: string): Promise<boolean> {
    try {
      const roleIndicator = page.locator(`[data-role="${expectedRole}"], .role-${expectedRole}`);
      return await roleIndicator.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Force refresh authentication
   */
  static async refreshAuth(page: Page, role: AuthRole): Promise<void> {
    logger.info(`🔄 Refreshing auth for: ${role}`);
    
    // Clear saved auth
    this.clearAuthState(role);
    
    // Perform fresh login
    const credentials = envConfig.getCredentials(role);
    await this.login(page, credentials.email, credentials.password);
  }

  /**
   * Wait for authentication to complete
   */
  static async waitForAuthComplete(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForURL(url => !url.includes('Login'), { timeout });
    logger.debug('✓ Authentication complete');
  }
}

// ==================== AUTH TEST DECORATORS ====================

/**
 * Skip test if user is not authenticated
 */
export function requiresAuth() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const page = args[0]?.page || args[0];
      
      if (page && !(await AuthHelper.isAuthenticated(page))) {
        logger.warn(`Test skipped - authentication required: ${propertyKey}`);
        return;
      }
      
      return await originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Skip test in production
 */
// export function skipInProduction() {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;
    
//     descriptor.value = async function (...args: any[]) {
//       if (envConfig.isProduction()) {
//         logger.warn(`Test skipped in production: ${propertyKey}`);
//         return;
//       }
      
//       return await originalMethod.apply(this, args);
//     };
    
//     return descriptor;
//   };
// }

// Export
export { expect } from '@playwright/test';
export const test = authTest;