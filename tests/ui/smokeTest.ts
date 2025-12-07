import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/homePage';
import { LoginPage } from '../../src//pages/loginPage';
import { RegisterPage, RegistrationData } from '../../src//pages/registerPage';

test.describe('Bio Access Labs - Smoke Tests with Page Object Model', () => {
  
  // ==================== HOMEPAGE SMOKE TESTS ====================
  test.describe('@smoke Homepage Tests', () => {
    
    test.only('@smoke TC_HP_01: Verify homepage loads with all elements', async ({ page }) => {
      const homePage = new HomePage(page);
      
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      // Verify page title
      await homePage.verifyHomePageTitle();
      
      // Verify logo is visible
      await homePage.verifyLogoVisible();
      
      // Verify all header elements
      await homePage.verifyAllHeaderElements();
      
      // Verify footer elements
      await homePage.verifyFooterElements();
      
      // Verify footer links
      await homePage.verifyFooterLinks();
      
      // Verify social media links
      await homePage.verifySocialMediaLinks();
    });

    test('@smoke TC_HP_02: Verify homepage navigation to login page', async ({ page }) => {
      const homePage = new HomePage(page);
      
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      // Verify homepage loaded
      await homePage.verifyHomePageLoaded();
      
      // Click login button
      await homePage.clickLoginButton();
      
      // Verify navigation to login page
      await expect(page).toHaveURL(/.*Login.*/);
      await expect(page).toHaveTitle('User Log In');
    });

    test('@smoke TC_HP_03: Verify homepage header navigation links', async ({ page }) => {
      const homePage = new HomePage(page);
      
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      // Get and verify navigation links
      const navLinks = await homePage.getHeaderNavigationLinks();
      
      expect(navLinks.length).toBeGreaterThan(0);
      expect(navLinks).toContain('Home');
      expect(navLinks).toContain('About Us');
      expect(navLinks).toContain('Contact Us');
    });
  });

  // ==================== LOGIN PAGE SMOKE TESTS ====================
  test.describe('@smoke Login Page Tests', () => {
    
    test('@smoke TC_LP_01: Verify login page loads with all elements', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Verify page is loaded completely
      await loginPage.verifyLoginPageLoaded();
      
      // Verify all form fields
      await loginPage.verifyFormFields();
      
      // Verify all links
      await loginPage.verifyLinks();
      
      // Verify form labels
      await loginPage.verifyFormLabels();
      
      // Verify password field type
      await loginPage.verifyPasswordFieldType();
    });

    test('@smoke TC_LP_02: Verify login page email input is auto-focused', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Verify email input is focused
      await loginPage.verifyEmailInputFocused();
    });

    test('@smoke TC_LP_03: Verify login form can be filled with valid data', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Fill email
      await loginPage.fillEmail('testuser@example.com');
      
      // Fill password
      await loginPage.fillPassword('TestPassword123!');
      
      // Check remember login
      await loginPage.checkRememberLogin();
      
      // Verify values using utility methods
      expect(await loginPage.getEmailValue()).toBe('testuser@example.com');
      expect(await loginPage.getPasswordValue()).toBe('TestPassword123!');
      expect(await loginPage.isRememberLoginChecked()).toBeTruthy();
    });

    test('@smoke TC_LP_04: Verify login with credentials method', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Use loginWithCredentials method
      await loginPage.fillEmail('user@test.com');
      await loginPage.fillPassword('Pass123!');
      await loginPage.checkRememberLogin();
      
      // Verify form is filled
      await expect(loginPage.emailInput).toHaveValue('user@test.com');
      await expect(loginPage.passwordInput).toHaveValue('Pass123!');
      await expect(loginPage.rememberLoginCheckbox).toBeChecked();
    });

    test('@smoke TC_LP_05: Verify login page navigation to registration', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Verify login page URL
      await loginPage.verifyLoginPageURL();
      
      // Click create account
      await loginPage.clickCreateAccount();
      
      // Verify navigation to registration page
      await expect(page).toHaveURL(/.*register.*/);
      await expect(page).toHaveTitle('Bio Access Labs');
    });

    test('@smoke TC_LP_06: Verify forgot password link functionality', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Click forgot password
      await loginPage.clickForgotPassword();
      
      // Verify navigation
      await expect(page).toHaveURL(/.*SendPassword.*/);
    });

    test('@smoke TC_LP_07: Verify logo navigation from login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Click logo
      await loginPage.clickLogo();
      
      // Verify navigation to homepage
      await homePage.verifyPageURL('https://bioal.thrivewellrx.com/');
      await homePage.verifyHomePageTitle();
    });

    test('@smoke TC_LP_08: Verify clear login form functionality', async ({ page }) => {
      const loginPage = new LoginPage(page);
      
      // Navigate to login page
      await loginPage.navigateToLoginPage();
      
      // Fill form
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');
      await loginPage.checkRememberLogin();
      
      // Clear form
      await loginPage.clearLoginForm();
      
      // Verify form is cleared
      expect(await loginPage.getEmailValue()).toBe('');
      expect(await loginPage.getPasswordValue()).toBe('');
      expect(await loginPage.isRememberLoginChecked()).toBeFalsy();
    });
  });

  // ==================== REGISTRATION PAGE SMOKE TESTS ====================
  test.describe('@smoke Registration Page Tests', () => {
    
    test('@smoke TC_RP_01: Verify registration page loads with all elements', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Verify page is loaded completely
      await registerPage.verifyRegisterPageLoaded();
      
      // Verify all form fields enabled
      await registerPage.verifyFormFieldsEnabled();
      
      // Verify buttons
      await registerPage.verifyButtons();
      
      // Verify required field labels
      await registerPage.verifyRequiredFieldLabels();
    });

    test('@smoke TC_RP_02: Verify gender dropdown has correct options', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Verify gender dropdown options
      await registerPage.verifyGenderDropdownOptions();
    });

    test('@smoke TC_RP_03: Verify registration form can be filled with valid data', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Prepare test data
      const testData: RegistrationData = {
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'JohnDoe2024',
        dob: '01/15/1990',
        mobile: '5551234567',
        gender: 'Male',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };
      
      // Fill registration form using method
      await registerPage.fillRegistrationForm(testData);
      
      // Verify fields using utility methods
      expect(await registerPage.getEmailValue()).toBe(testData.email);
      expect(await registerPage.getFirstNameValue()).toBe(testData.firstName);
      expect(await registerPage.getLastNameValue()).toBe(testData.lastName);
      expect(await registerPage.getDisplayNameValue()).toBe(testData.displayName);
      expect(await registerPage.getDOBValue()).toBe(testData.dob);
      expect(await registerPage.getMobileValue()).toBe(testData.mobile);
      expect(await registerPage.getSelectedGender()).toBe(testData.gender);
    });

    test('@smoke TC_RP_04: Verify individual field filling methods', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Fill each field individually
      await registerPage.fillEmail('individual@test.com');
      await registerPage.fillFirstName('Jane');
      await registerPage.fillLastName('Smith');
      await registerPage.fillDisplayName('JaneSmith');
      await registerPage.fillDOB('05/20/1995');
      await registerPage.fillMobile('1234567890');
      await registerPage.selectGender('Female');
      await registerPage.fillPassword('MyPassword123!');
      await registerPage.fillConfirmPassword('MyPassword123!');
      
      // Verify each field
      await expect(registerPage.emailInput).toHaveValue('individual@test.com');
      await expect(registerPage.firstNameInput).toHaveValue('Jane');
      await expect(registerPage.lastNameInput).toHaveValue('Smith');
      await expect(registerPage.displayNameInput).toHaveValue('JaneSmith');
    });

    test('@smoke TC_RP_05: Verify registration page navigation to login', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Click login link
      await registerPage.clickLoginLink();
      
      // Verify navigation to login page
      await expect(page).toHaveURL(/.*login.*/);
      await expect(page).toHaveTitle('User Log In');
    });

    test('@smoke TC_RP_06: Verify logo navigation from registration page', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const homePage = new HomePage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Click logo
      await registerPage.clickLogo();
      
      // Verify navigation to homepage
      await homePage.verifyPageURL('https://bioal.thrivewellrx.com/');
      await homePage.verifyHomePageTitle();
    });

    test('@smoke TC_RP_07: Verify clear registration form functionality', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Fill form
      const testData: RegistrationData = {
        email: 'clear@test.com',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'TestUser',
        dob: '01/01/2000',
        mobile: '9999999999',
        gender: 'Male',
        password: 'Test123!',
        confirmPassword: 'Test123!'
      };
      
      await registerPage.fillRegistrationForm(testData);
      
      // Clear form
      await registerPage.clearRegistrationForm();
      
      // Verify form is cleared
      expect(await registerPage.getEmailValue()).toBe('');
      expect(await registerPage.getFirstNameValue()).toBe('');
      expect(await registerPage.getLastNameValue()).toBe('');
    });

    test('@smoke TC_RP_08: Verify register button is enabled', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      
      // Navigate to registration page
      await registerPage.navigateToRegisterPage();
      
      // Verify register button is enabled
      expect(await registerPage.isRegisterButtonEnabled()).toBeTruthy();
    });
  });

  // ==================== END-TO-END USER FLOW SMOKE TEST ====================
  test.describe('@smoke End-to-End Flow Tests', () => {
    
    test('@smoke TC_E2E_01: Verify complete user journey flow', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      // Step 1: Navigate to homepage
      await homePage.navigateToHomePage();
      await homePage.verifyHomePageLoaded();

      // Step 2: Navigate to login page
      await homePage.clickLoginButton();
      await loginPage.verifyLoginPageURL();
      await loginPage.verifyLoginPageTitle();

      // Step 3: Navigate to registration page
      await loginPage.clickCreateAccount();
      await registerPage.verifyPageURL(/.*register.*/);
      await registerPage.verifyPageHeading();

      // Step 4: Navigate back to login page
      await registerPage.clickLoginLink();
      await loginPage.verifyLoginPageURL();

      // Step 5: Navigate back to homepage via logo
      await loginPage.clickLogo();
      await homePage.verifyPageURL('https://bioal.thrivewellrx.com/');
      await homePage.verifyHomePageTitle();
    });

    test('@smoke TC_E2E_02: Verify footer links are consistent across pages', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      // Verify footer on homepage
      await homePage.navigateToHomePage();
      await homePage.verifyFooterElements();
      await homePage.verifyFooterLinks();

      // Verify footer on login page
      await loginPage.navigateToLoginPage();
      await loginPage.verifyFooterElements();
      await loginPage.verifyFooterLinks();

      // Verify footer on registration page
      await registerPage.navigateToRegisterPage();
      await registerPage.verifyFooterElements();
      await registerPage.verifyFooterLinks();
    });

    test('@smoke TC_E2E_03: Verify logo navigation works from all pages', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const registerPage = new RegisterPage(page);

      // From login page
      await loginPage.navigateToLoginPage();
      await loginPage.clickLogo();
      await homePage.verifyPageURL('https://bioal.thrivewellrx.com/');

      // From registration page
      await registerPage.navigateToRegisterPage();
      await registerPage.clickLogo();
      await homePage.verifyPageURL('https://bioal.thrivewellrx.com/');
    });
  });
});