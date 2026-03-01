/**
 * Production-Safe Logger Utility
 * 
 * Automatically disables debug logging in production
 * Keeps error logging always active
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Error logging - always active in all environments
   */
  error: (...args: any[]) => {
    console.error(...args)
  },

  /**
   * Warning logging - only in development
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },

  /**
   * Debug logging - only in development
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },

  /**
   * Info logging - only in development
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },

  /**
   * Debug logging with context - only in development
   */
  debug: (context: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[${context}]`, ...args)
    }
  }
}

export default logger

