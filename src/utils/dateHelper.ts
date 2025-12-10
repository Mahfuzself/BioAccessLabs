import { format, addDays, subDays, parseISO, addMonths, addYears } from 'date-fns';

export class DateHelper {
  /**
   * Get current date in specified format
   * @param dateFormat - Date format string (default: MM/dd/yyyy)
   * @returns Formatted date string
   */
  static getCurrentDate(dateFormat: string = 'MM/dd/yyyy'): string {
    return format(new Date(), dateFormat);
  }

  /**
   * Get future date
   * @param days - Number of days in future
   * @param dateFormat - Date format string
   * @returns Formatted future date
   */
  static getFutureDate(days: number, dateFormat: string = 'MM/dd/yyyy'): string {
    return format(addDays(new Date(), days), dateFormat);
  }

  /**
   * Get past date
   * @param days - Number of days in past
   * @param dateFormat - Date format string
   * @returns Formatted past date
   */
  static getPastDate(days: number, dateFormat: string = 'MM/dd/yyyy'): string {
    return format(subDays(new Date(), days), dateFormat);
  }

  /**
   * Format date
   * @param date - Date string or Date object
   * @param dateFormat - Desired format
   * @returns Formatted date
   */
  static formatDate(date: string | Date, dateFormat: string = 'MM/dd/yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, dateFormat);
  }

  /**
   * Get random birthdate for age range
   * @param minAge - Minimum age
   * @param maxAge - Maximum age
   * @returns Random birthdate in MM/dd/yyyy format
   */
  static getRandomBirthdate(minAge: number = 18, maxAge: number = 80): string {
    const today = new Date();
    const minDate = subDays(today, maxAge * 365);
    const maxDate = subDays(today, minAge * 365);
    
    const randomTime = minDate.getTime() + 
      Math.random() * (maxDate.getTime() - minDate.getTime());
    
    return format(new Date(randomTime), 'MM/dd/yyyy');
  }

  /**
   * Get date with added months
   * @param months - Number of months to add
   * @param dateFormat - Date format
   * @returns Formatted date
   */
  static addMonthsToDate(months: number, dateFormat: string = 'MM/dd/yyyy'): string {
    return format(addMonths(new Date(), months), dateFormat);
  }

  /**
   * Get date with added years
   * @param years - Number of years to add
   * @param dateFormat - Date format
   * @returns Formatted date
   */
  static addYearsToDate(years: number, dateFormat: string = 'MM/dd/yyyy'): string {
    return format(addYears(new Date(), years), dateFormat);
  }

  /**
   * Get timestamp for file naming
   * @returns Timestamp string
   */
  static getTimestamp(): string {
    return format(new Date(), 'yyyyMMdd_HHmmss');
  }

  /**
   * Check if date is in past
   * @param date - Date to check
   * @returns True if date is in past
   */
  static isDateInPast(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
  }

  /**
   * Check if date is in future
   * @param date - Date to check
   * @returns True if date is in future
   */
  static isDateInFuture(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
  }
}