/**
 * Safely formats a date value, handling both Date objects and date strings
 * @param dateValue - The date value to format (Date object, string, or undefined)
 * @param options - Optional Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (
  dateValue: Date | string | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateValue) return 'N/A'
  
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    
    return date.toLocaleDateString('en-ZA', options)
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'N/A'
  }
}

/**
 * Safely formats a date value with time
 * @param dateValue - The date value to format
 * @returns Formatted date and time string or 'N/A' if invalid
 */
export const formatDateTime = (
  dateValue: Date | string | undefined | null
): string => {
  if (!dateValue) return 'N/A'
  
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
    
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    
    return date.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.warn('Error formatting date time:', error)
    return 'N/A'
  }
}

/**
 * Checks if a value is a valid date
 * @param value - The value to check
 * @returns True if the value is a valid date
 */
export const isValidDate = (value: any): boolean => {
  if (!value) return false
  
  try {
    const date = value instanceof Date ? value : new Date(value)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

/**
 * Converts a value to a Date object safely
 * @param value - The value to convert
 * @returns Date object or null if invalid
 */
export const toDate = (value: any): Date | null => {
  if (!value) return null
  
  try {
    const date = value instanceof Date ? value : new Date(value)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}
