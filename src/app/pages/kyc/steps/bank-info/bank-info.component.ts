import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';
import { detectBankFromIban, getBankName, formatIban, getIbanValidationError } from '../../../../utils/iban-bank-detector';
import { saudiIbanValidator } from '../../../../validators/iban.validator';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.scss']
})
export class BankInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  currentLanguage: 'en' | 'ar' = 'en';
  customerFullName = '';

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCurrentLanguage();
    this.initForm();
    this.loadCustomerNameAndData();
  }

  getCurrentLanguage() {
    this.currentLanguage = (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  }

  loadCustomerNameAndData() {
    // Get customer name from personal info first, then load bank data
    this.kycService.getPersonalInfo().subscribe({
      next: (data) => {
        console.log('Personal info data:', data);
        console.log('Current language:', this.currentLanguage);
        
        if (data) {
          // Use fullNameAr or fullNameEn based on current language
          if (this.currentLanguage === 'ar' && data.fullNameAr) {
            this.customerFullName = data.fullNameAr;
          } else if (data.fullNameEn) {
            this.customerFullName = data.fullNameEn;
          } else {
            // Fallback: construct from name parts
            const firstName = data.firstName || '';
            const fatherName = data.fatherName || '';
            const familyName = data.familyName || '';
            this.customerFullName = `${firstName} ${fatherName} ${familyName}`.trim();
          }

          console.log('Customer full name set to:', this.customerFullName);

          // Set account holder name immediately after getting it
          this.form.get('accountHolderName')?.setValue(this.customerFullName);
          console.log('Account holder name field value:', this.form.get('accountHolderName')?.value);

          // Now load bank info data
          this.loadData();
        }
      },
      error: (err) => {
        console.error('Failed to load customer name', err);
        // Still try to load bank data even if personal info fails
        this.loadData();
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      bankName: [{ value: '', disabled: true }, Validators.required],
      iban: ['', [Validators.required, saudiIbanValidator()]],
      accountHolderName: [{ value: '', disabled: true }, Validators.required]
    });

    // Listen to IBAN changes to auto-detect bank
    this.form.get('iban')?.valueChanges.subscribe((iban) => {
      this.onIbanChange(iban);
    });
  }

  getIbanError(): string {
    const ibanControl = this.form.get('iban');
    
    if (!ibanControl?.touched || !ibanControl?.errors) {
      return '';
    }

    if (ibanControl.errors['required']) {
      return this.currentLanguage === 'ar' ? 'رقم الآيبان مطلوب' : 'IBAN is required';
    }

    if (ibanControl.errors['invalidCountry']) {
      return this.currentLanguage === 'ar' ? 'يجب أن يبدأ الآيبان بـ SA' : 'IBAN must start with SA';
    }

    if (ibanControl.errors['invalidLength']) {
      const error = ibanControl.errors['invalidLength'];
      return this.currentLanguage === 'ar' 
        ? `الآيبان يجب أن يكون 24 حرف (SA + 22 رقم). الطول الحالي: ${error.actual}`
        : `IBAN must be 24 characters (SA + 22 digits). Current length: ${error.actual}`;
    }

    if (ibanControl.errors['invalidFormat']) {
      return this.currentLanguage === 'ar' 
        ? 'الآيبان يجب أن يحتوي على أرقام فقط بعد SA'
        : 'IBAN must contain only digits after SA';
    }

    if (ibanControl.errors['invalidChecksum']) {
      return this.currentLanguage === 'ar' 
        ? 'رقم الآيبان غير صحيح. يرجى التحقق من الرقم'
        : 'Invalid IBAN checksum. Please verify the number';
    }

    return '';
  }

  onIbanChange(iban: string) {
    if (!iban) {
      this.form.patchValue({ bankName: '' }, { emitEvent: false });
      return;
    }

    // Remove spaces for validation
    const cleanIban = iban.replace(/\s/g, '');

    // Detect bank from IBAN
    const bankName = getBankName(cleanIban, this.currentLanguage);
    
    if (bankName) {
      this.form.patchValue({ bankName }, { emitEvent: false });
    } else if (cleanIban.match(/^SA\d{22}$/)) {
      // Valid IBAN format but bank not recognized
      this.form.patchValue({ bankName: 'Unknown Bank' }, { emitEvent: false });
    }
  }

  loadData() {
    this.kycService.getBankInfo().subscribe({
      next: (data) => {
        if (data && data.iban) {
          // Load existing bank info
          this.form.get('iban')?.setValue(data.iban, { emitEvent: true });
          
          // Set bank name if available
          if (data.bankName) {
            this.form.get('bankName')?.setValue(data.bankName);
          }
          
          // Keep account holder name from personal info (don't override)
          // Only use saved accountHolderName if customerFullName is not available
          if (!this.customerFullName && data.accountHolderName) {
            this.form.get('accountHolderName')?.setValue(data.accountHolderName);
          }
        }
        // If no bank data exists, account holder name is already set from personal info
      },
      error: (err) => console.error('Failed to load bank data', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      // Include disabled fields in submission
      const formData = {
        ...this.form.value,
        bankName: this.form.get('bankName')?.value,
        accountHolderName: this.form.get('accountHolderName')?.value
      };

      this.kycService.saveBankInfo(formData).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/account-credentials']).then(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }, 1000);
        },
        error: (err) => {
          console.error('Save error:', err);
          this.error = err.error?.message || err.message || 'Failed to save';
          this.loading = false;
        }
      });
    }
  }

  formatIbanDisplay() {
    const ibanControl = this.form.get('iban');
    if (ibanControl?.value) {
      const formatted = formatIban(ibanControl.value);
      ibanControl.setValue(formatted, { emitEvent: false });
    }
  }

  goBack() {
    this.router.navigate(['/kyc/fatca-info']);
  }
}
