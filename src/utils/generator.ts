/**
 * Test Data Generator - Generates test data and test cases
 * Helps in creating dynamic test data for various test scenarios
 */

import { Logger } from './logger';

export interface UserData {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface TestDataConfig {
  type: 'user' | 'product' | 'order' | 'custom';
  count?: number;
  prefix?: string;
  customFields?: Record<string, any>;
}

export class TestDataGenerator {
  private static readonly FIRST_NAMES = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Olivia',
    'James', 'Sophia', 'William', 'Isabella', 'Daniel', 'Mia', 'Matthew'
  ];

  private static readonly LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson'
  ];

  private static readonly DOMAINS = [
    'example.com', 'test.com', 'demo.com', 'testmail.com'
  ];

  /**
   * Generate random string
   */
  static randomString(length: number = 8, prefix: string = ''): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number in range
   */
  static randomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random email
   */
  static randomEmail(prefix?: string): string {
    const username = prefix || this.randomString(8);
    const domain = this.DOMAINS[Math.floor(Math.random() * this.DOMAINS.length)];
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   */
  static randomPhoneNumber(countryCode: string = '+1'): string {
    const areaCode = this.randomNumber(200, 999);
    const firstPart = this.randomNumber(200, 999);
    const secondPart = this.randomNumber(1000, 9999);
    return `${countryCode}-${areaCode}-${firstPart}-${secondPart}`;
  }

  /**
   * Generate random date in range
   */
  static randomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
  }

  /**
   * Generate user data
   */
  static generateUser(options?: {
    username?: string;
    prefix?: string;
    includeEmail?: boolean;
  }): UserData {
    const firstName = this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)];
    const lastName = this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)];
    const prefix = options?.prefix || 'user';
    
    const userData: UserData = {
      username: options?.username || `${prefix}_${this.randomString(6)}`,
      password: this.randomString(10, 'Pass@'),
      firstName,
      lastName,
      role: 'user'
    };

    if (options?.includeEmail !== false) {
      userData.email = this.randomEmail(`${firstName.toLowerCase()}.${lastName.toLowerCase()}`);
    }

    Logger.info(`Generated user data: ${userData.username}`);
    return userData;
  }

  /**
   * Generate multiple users
   */
  static generateUsers(count: number, options?: {
    prefix?: string;
    includeEmail?: boolean;
  }): UserData[] {
    Logger.info(`Generating ${count} users`);
    const users: UserData[] = [];
    for (let i = 0; i < count; i++) {
      users.push(this.generateUser({
        ...options,
        username: `${options?.prefix || 'user'}_${i + 1}_${this.randomString(4)}`
      }));
    }
    return users;
  }

  /**
   * Generate product data
   */
  static generateProduct(options?: {
    name?: string;
    category?: string;
  }): {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    inStock: boolean;
  } {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
    const category = options?.category || categories[Math.floor(Math.random() * categories.length)];
    
    const product = {
      id: `PROD-${this.randomString(8).toUpperCase()}`,
      name: options?.name || `Product ${this.randomString(6)}`,
      description: `Description for ${options?.name || 'product'}`,
      price: parseFloat((this.randomNumber(10, 1000) + Math.random()).toFixed(2)),
      category,
      sku: `SKU-${this.randomString(10).toUpperCase()}`,
      inStock: Math.random() > 0.3
    };

    Logger.info(`Generated product: ${product.name}`);
    return product;
  }

  /**
   * Generate order data
   */
  static generateOrder(userId?: string): {
    orderId: string;
    userId: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    totalAmount: number;
    status: string;
    orderDate: Date;
  } {
    const itemCount = this.randomNumber(1, 5);
    const items = Array.from({ length: itemCount }, () => ({
      productId: `PROD-${this.randomString(8).toUpperCase()}`,
      quantity: this.randomNumber(1, 5),
      price: parseFloat((this.randomNumber(10, 500) + Math.random()).toFixed(2))
    }));

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const order = {
      orderId: `ORD-${this.randomString(10).toUpperCase()}`,
      userId: userId || `USER-${this.randomString(8)}`,
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      orderDate: this.randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    };

    Logger.info(`Generated order: ${order.orderId}`);
    return order;
  }

  /**
   * Generate test credentials from predefined sets
   */
  static getTestCredentials(type: 'valid' | 'invalid' | 'admin' = 'valid'): UserData {
    const credentials = {
      valid: {
        username: 'Admin',
        password: 'admin123',
        role: 'admin'
      },
      invalid: {
        username: `invalid_${this.randomString(6)}`,
        password: 'wrongpassword',
        role: 'user'
      },
      admin: {
        username: 'Admin',
        password: 'admin123',
        role: 'admin'
      }
    };

    Logger.info(`Getting ${type} test credentials`);
    return credentials[type];
  }

  /**
   * Generate boundary value test data
   */
  static generateBoundaryValues(field: 'string' | 'number', config?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }): any[] {
    if (field === 'string') {
      const minLen = config?.minLength || 0;
      const maxLen = config?.maxLength || 255;
      return [
        '',                                          // Empty
        this.randomString(minLen),                   // Minimum
        this.randomString(minLen + 1),               // Minimum + 1
        this.randomString(maxLen - 1),               // Maximum - 1
        this.randomString(maxLen),                   // Maximum
        this.randomString(maxLen + 1)                // Maximum + 1
      ];
    } else {
      const min = config?.min || 0;
      const max = config?.max || 100;
      return [
        min - 1,      // Below minimum
        min,          // Minimum
        min + 1,      // Minimum + 1
        max - 1,      // Maximum - 1
        max,          // Maximum
        max + 1       // Maximum + 1
      ];
    }
  }

  /**
   * Generate CSV test data
   */
  static generateCSV(headers: string[], rows: number): string {
    let csv = headers.join(',') + '\n';
    
    for (let i = 0; i < rows; i++) {
      const row = headers.map(() => this.randomString(8));
      csv += row.join(',') + '\n';
    }

    Logger.info(`Generated CSV with ${rows} rows`);
    return csv;
  }

  /**
   * Generate test data based on config
   */
  static generateTestData(config: TestDataConfig): any[] {
    const count = config.count || 1;
    const data: any[] = [];

    Logger.info(`Generating ${count} ${config.type} test data items`);

    for (let i = 0; i < count; i++) {
      switch (config.type) {
        case 'user':
          data.push(this.generateUser({ prefix: config.prefix }));
          break;
        case 'product':
          data.push(this.generateProduct());
          break;
        case 'order':
          data.push(this.generateOrder());
          break;
        case 'custom':
          data.push({ ...config.customFields, id: this.randomString(8) });
          break;
      }
    }

    return data;
  }
}

// Export singleton instance
export const generator = TestDataGenerator;
