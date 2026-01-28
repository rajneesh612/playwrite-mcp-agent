/**
 * Application Constants
 */

export const CONSTANTS = {
  // Timeouts
  DEFAULT_TIMEOUT: 5000,
  WAIT_TIMEOUT: 10000,
  LONG_TIMEOUT: 30000,

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // URLs
  BASE_URL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/',
};
