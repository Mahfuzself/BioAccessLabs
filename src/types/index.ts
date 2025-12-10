/**
 * Common TypeScript types and interfaces
 */

export interface Credentials {
  email: string;
  password: string;
}

export interface UserTestData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dob: string;
  mobile: string;
  gender: 'Male' | 'Female';
}

export interface TestContext {
  randomUser: UserTestData;
  validUser: Credentials;
  invalidUsers: Array<{
    email: string;
    password: string;
    expectedError: string;
  }>;
}

export type TestTags = '@smoke' | '@sanity' | '@regression' | '@e2e' | '@critical' | '@api';

export interface EnvironmentConfig {
  env: 'qa' | 'staging' | 'prod';
  baseURL: string;
  apiURL: string;
  timeout: number;
  retries: number;
  headless: boolean;
}