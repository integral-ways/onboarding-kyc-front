/**
 * Saudi IBAN Bank Detector
 * Detects bank name from Saudi IBAN based on bank code (positions 4-6)
 */

export interface BankInfo {
  code: string;
  nameEn: string;
  nameAr: string;
}

export const SAUDI_BANKS: { [key: string]: BankInfo } = {
  '10': { code: '10', nameEn: 'National Commercial Bank (NCB)', nameAr: 'البنك الأهلي التجاري' },
  '15': { code: '15', nameEn: 'Bank AlBilad', nameAr: 'بنك البلاد' },
  '20': { code: '20', nameEn: 'Riyad Bank', nameAr: 'بنك الرياض' },
  '30': { code: '30', nameEn: 'Banque Saudi Fransi', nameAr: 'البنك السعودي الفرنسي' },
  '40': { code: '40', nameEn: 'Saudi British Bank (SABB)', nameAr: 'البنك السعودي البريطاني' },
  '45': { code: '45', nameEn: 'Saudi Investment Bank', nameAr: 'البنك السعودي للاستثمار' },
  '50': { code: '50', nameEn: 'Alinma Bank', nameAr: 'مصرف الإنماء' },
  '55': { code: '55', nameEn: 'Bank AlJazira', nameAr: 'بنك الجزيرة' },
  '60': { code: '60', nameEn: 'Al Rajhi Bank', nameAr: 'مصرف الراجحي' },
  '65': { code: '65', nameEn: 'Saudi Hollandi Bank', nameAr: 'البنك السعودي الهولندي' },
  '71': { code: '71', nameEn: 'Arab National Bank', nameAr: 'البنك العربي الوطني' },
  '75': { code: '75', nameEn: 'Samba Financial Group', nameAr: 'مجموعة سامبا المالية' },
  '76': { code: '76', nameEn: 'Bank Albilad', nameAr: 'بنك البلاد' },
  '80': { code: '80', nameEn: 'Al Rajhi Banking', nameAr: 'مصرف الراجحي' },
  '81': { code: '81', nameEn: 'Gulf International Bank', nameAr: 'بنك الخليج الدولي' },
  '82': { code: '82', nameEn: 'Deutsche Bank', nameAr: 'دويتشه بنك' },
  '83': { code: '83', nameEn: 'BNP Paribas', nameAr: 'بي إن بي باريبا' },
  '85': { code: '85', nameEn: 'National Bank of Kuwait', nameAr: 'بنك الكويت الوطني' },
  '90': { code: '90', nameEn: 'Gulf International Bank', nameAr: 'بنك الخليج الدولي' },
  '95': { code: '95', nameEn: 'Emirates NBD', nameAr: 'بنك الإمارات دبي الوطني' }
};

/**
 * Extract bank code from Saudi IBAN
 * @param iban - Saudi IBAN (SA + 22 digits)
 * @returns Bank code (2 digits) or null if invalid
 */
export function extractBankCode(iban: string): string | null {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Validate Saudi IBAN format: SA + 22 digits
  if (!cleanIban.match(/^SA\d{22}$/)) {
    return null;
  }
  
  // Extract bank code (positions 4-5, 0-indexed)
  return cleanIban.substring(4, 6);
}

/**
 * Detect bank from Saudi IBAN
 * @param iban - Saudi IBAN
 * @returns BankInfo object or null if not found
 */
export function detectBankFromIban(iban: string): BankInfo | null {
  const bankCode = extractBankCode(iban);
  
  if (!bankCode) {
    return null;
  }
  
  return SAUDI_BANKS[bankCode] || null;
}

/**
 * Get bank name in specified language
 * @param iban - Saudi IBAN
 * @param language - 'en' or 'ar'
 * @returns Bank name or empty string if not found
 */
export function getBankName(iban: string, language: 'en' | 'ar' = 'en'): string {
  const bankInfo = detectBankFromIban(iban);
  
  if (!bankInfo) {
    return '';
  }
  
  return language === 'ar' ? bankInfo.nameAr : bankInfo.nameEn;
}

/**
 * Format IBAN with spaces for better readability
 * @param iban - IBAN string
 * @returns Formatted IBAN (SA00 0000 0000 0000 0000 0000)
 */
export function formatIban(iban: string): string {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  if (!cleanIban.match(/^SA\d{22}$/)) {
    return iban;
  }
  
  // Format: SA00 0000 0000 0000 0000 0000
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validate Saudi IBAN using mod-97 checksum algorithm
 * @param iban - Saudi IBAN to validate
 * @returns true if valid, false otherwise
 */
export function validateSaudiIban(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Check basic format: SA + 22 digits
  if (!cleanIban.match(/^SA\d{22}$/)) {
    return false;
  }
  
  // Perform mod-97 checksum validation
  // Move first 4 characters to end: SA00... -> ...SA00
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  
  // Replace letters with numbers: S=28, A=10
  // S = 28, A = 10 (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/g, (char) => {
    return (char.charCodeAt(0) - 55).toString();
  });
  
  // Calculate mod 97
  const remainder = mod97(numericString);
  
  // Valid IBAN has remainder of 1
  return remainder === 1;
}

/**
 * Calculate mod 97 for large numbers (as string)
 * @param numericString - Numeric string representation
 * @returns Remainder after mod 97
 */
function mod97(numericString: string): number {
  let remainder = 0;
  
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }
  
  return remainder;
}

/**
 * Get IBAN validation error message
 * @param iban - IBAN to validate
 * @param language - 'en' or 'ar'
 * @returns Error message or empty string if valid
 */
export function getIbanValidationError(iban: string, language: 'en' | 'ar' = 'en'): string {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Empty check
  if (!cleanIban) {
    return language === 'ar' ? 'رقم الآيبان مطلوب' : 'IBAN is required';
  }
  
  // Country code check
  if (!cleanIban.startsWith('SA')) {
    return language === 'ar' ? 'يجب أن يبدأ الآيبان بـ SA' : 'IBAN must start with SA';
  }
  
  // Length check
  if (cleanIban.length !== 24) {
    return language === 'ar' 
      ? `الآيبان يجب أن يكون 24 حرف (SA + 22 رقم). الطول الحالي: ${cleanIban.length}`
      : `IBAN must be 24 characters (SA + 22 digits). Current length: ${cleanIban.length}`;
  }
  
  // Format check (only digits after SA)
  if (!cleanIban.match(/^SA\d{22}$/)) {
    return language === 'ar' 
      ? 'الآيبان يجب أن يحتوي على أرقام فقط بعد SA'
      : 'IBAN must contain only digits after SA';
  }
  
  // Checksum validation
  if (!validateSaudiIban(cleanIban)) {
    return language === 'ar' 
      ? 'رقم الآيبان غير صحيح. يرجى التحقق من الرقم'
      : 'Invalid IBAN checksum. Please verify the number';
  }
  
  return '';
}
