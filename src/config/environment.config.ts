import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
export enum Environment {
  DEV = 'dev',
  QA = 'qa',
  STAGING = 'staging',
  PROD = 'prod'
}

export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  public readonly env: Environment;
  public readonly baseURL: string;
  public readonly apiURL: string;
  public readonly timeout: number;
  public readonly retries: number;

  private constructor() {
    const envFile = process.env.TEST_ENV || 'qa';
    const envFileName = `.env.${envFile}`;
    const envPath = path.resolve(envFileName);

    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    } else {
      // fallback to default .env or no-op
      dotenv.config();
    }

    this.env = (process.env.TEST_ENV as Environment) || Environment.QA;
    this.baseURL = process.env.BASE_URL || 'https://bioal.thrivewellrx.com/';
    this.apiURL = process.env.API_URL || 'https://api.bioal.thrivewellrx.com/';
    this.timeout = Number(process.env.TIMEOUT) || 30000;
    this.retries = Number(process.env.RETRIES) || 2;
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  public getCredentials(role: 'admin' | 'user' | 'guest') {
    return {
      email: process.env[`${role.toUpperCase()}_EMAIL`] || '',
      password: process.env[`${role.toUpperCase()}_PASSWORD`] || ''
    };
  }
}

export const envConfig = EnvironmentConfig.getInstance();