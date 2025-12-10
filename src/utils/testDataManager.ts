import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { logger } from './logger';

export interface UserTestData {
  email: string;
  password: string;
  confirmPassword : string;
  firstName: string;
  lastName: string;
  displayName: string;
  dob: string;
  mobile: string;
  gender: 'Male' | 'Female';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class TestDataManager {
  private static dataPath = path.resolve(process.cwd(), 'data/testdata');

  // Ensure data directory exists
  private static ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
      logger.info(`Created test data directory: ${this.dataPath}`);
    }
  }

  // Load data from JSON file
  static loadData<T>(fileName: string): T {
    try {
      const filePath = path.join(this.dataPath, `${fileName}.json`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Test data file not found: ${filePath}`);
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      logger.debug(`Loaded test data from: ${fileName}.json`);
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Failed to load test data: ${fileName}`, error);
      throw error;
    }
  }

  // Save data to JSON file
  static saveData<T>(fileName: string, data: T): void {
    try {
      this.ensureDataDirectory();
      const filePath = path.join(this.dataPath, `${fileName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      logger.debug(`Saved test data to: ${fileName}.json`);
    } catch (error) {
      logger.error(`Failed to save test data: ${fileName}`, error);
      throw error;
    }
  }

  // Generate random user data
  static generateRandomUser(): UserTestData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    
    // Format date as MM/DD/YYYY
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const day = String(birthDate.getDate()).padStart(2, '0');
    const year = birthDate.getFullYear();
    
    return {
      email: faker.internet.email({ firstName, lastName, provider: 'yopmail.com' }),
      password: this.generateStrongPassword(),
      confirmPassword: this.generateStrongPassword(),
      firstName,
      lastName,
      displayName: `${firstName}${lastName}${faker.number.int({ min: 100, max: 999 })}`,
      dob: `${month}/${day}/${year}`,
      mobile: faker.string.numeric(10),
      gender: faker.helpers.arrayElement(['Male', 'Female'])
    };
  }

  // Generate strong password
  static generateStrongPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%';
    
    const all = uppercase + lowercase + numbers + special;
    
    let password = '';
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Generate multiple users
  static generateUsers(count: number): UserTestData[] {
    logger.info(`Generating ${count} random users`);
    return Array.from({ length: count }, () => this.generateRandomUser());
  }

  // Get predefined test users
  static getTestUsers(): any {
    return this.loadData('users');
  }

  // Get specific test scenario data
  static getTestScenario(scenarioName: string): any {
    try {
      return this.loadData(scenarioName);
    } catch (error) {
      logger.warn(`Test scenario not found: ${scenarioName}, returning empty object`);
      return {};
    }
  }

  // Get valid login credentials
  static getValidUser(): LoginCredentials {
    const users = this.getTestUsers();
    return users.validUser;
  }

  // Get invalid test data
  static getInvalidUsers(): any[] {
    const users = this.getTestUsers();
    return users.invalidUsers || [];
  }

  // Generate random email
  static generateRandomEmail(domain: string = 'yopmail.com'): string {
    return faker.internet.email({ provider: domain });
  }

  // Generate random mobile number
  static generateRandomMobile(): string {
    return faker.string.numeric(10);
  }

  // Mask sensitive data for logging
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) return data;
    return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
  }
}