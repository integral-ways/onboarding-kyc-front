import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validateSaudiIban } from '../utils/iban-bank-detector';

/**
 * Custom validator for Saudi IBAN
 * Validates format and checksum
 */
export function saudiIbanValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Allow empty values (use Validators.required separately)
    if (!value) {
      return null;
    }
    
    // Remove spaces for validation
    const cleanIban = value.replace(/\s/g, '').toUpperCase();
    
    // Check if it starts with SA
    if (!cleanIban.startsWith('SA')) {
      return { invalidCountry: { value: control.value, message: 'IBAN must start with SA' } };
    }
    
    // Check length (SA + 22 digits = 24 characters)
    if (cleanIban.length !== 24) {
      return { 
        invalidLength: { 
          value: control.value, 
          expected: 24, 
          actual: cleanIban.length,
          message: `IBAN must be 24 characters (SA + 22 digits)` 
        } 
      };
    }
    
    // Check format (only digits after SA)
    if (!cleanIban.match(/^SA\d{22}$/)) {
      return { invalidFormat: { value: control.value, message: 'IBAN must contain only digits after SA' } };
    }
    
    // Validate checksum using mod-97 algorithm
    if (!validateSaudiIban(cleanIban)) {
      return { invalidChecksum: { value: control.value, message: 'Invalid IBAN checksum' } };
    }
    
    return null;
  };
}
