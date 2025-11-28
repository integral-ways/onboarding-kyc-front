import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-credentials',
  templateUrl: './account-credentials.component.html',
  styleUrls: [
    './account-credentials.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class AccountCredentialsComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  
  // Username validation
  usernameChecking = false;
  usernameAvailable: boolean | null = null;
  usernameError: string | null = null;
  
  // Password visibility
  showPassword = false;
  showConfirmPassword = false;
  
  // Password strength
  passwordStrength: 'weak' | 'medium' | 'strong' | null = null;
  passwordStrengthPercentage = 0;
  
  private destroy$ = new Subject<void>();
  private usernameCheck$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.setupUsernameValidation();
    this.setupPasswordStrengthCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        this.usernameValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  setupUsernameValidation() {
    // Debounce username input and check availability
    this.usernameCheck$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username => {
        this.usernameChecking = true;
        this.usernameAvailable = null;
        this.usernameError = null;
        return this.kycService.checkUsernameAvailability(username);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.usernameChecking = false;
        this.usernameAvailable = response.available;
        if (!response.available) {
          this.usernameError = 'Username is already taken';
        }
      },
      error: () => {
        this.usernameChecking = false;
        this.usernameAvailable = null;
      }
    });

    // Listen to username changes
    this.form.get('username')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(username => {
      if (username && username.length >= 4 && !this.form.get('username')?.errors) {
        this.usernameCheck$.next(username);
      } else {
        this.usernameAvailable = null;
        this.usernameError = null;
      }
    });
  }

  setupPasswordStrengthCheck() {
    this.form.get('password')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  // Custom Validators
  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // No spaces allowed
    if (/\s/.test(value)) {
      return { hasSpaces: true };
    }

    // Only alphanumeric, underscore, and hyphen allowed
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { invalidCharacters: true };
    }

    // Must start with a letter
    if (!/^[a-zA-Z]/.test(value)) {
      return { mustStartWithLetter: true };
    }

    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};

    // At least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['noUppercase'] = true;
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(value)) {
      errors['noLowercase'] = true;
    }

    // At least one number
    if (!/[0-9]/.test(value)) {
      errors['noNumber'] = true;
    }

    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      errors['noSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  calculatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = null;
      this.passwordStrengthPercentage = 0;
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Character variety
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;

    this.passwordStrengthPercentage = strength;

    if (strength < 50) {
      this.passwordStrength = 'weak';
    } else if (strength < 80) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getUsernameError(): string {
    const control = this.form.get('username');
    if (!control?.touched || !control?.errors) return '';

    if (control.errors['required']) return 'Username is required';
    if (control.errors['minlength']) return 'Username must be at least 4 characters';
    if (control.errors['maxlength']) return 'Username must not exceed 20 characters';
    if (control.errors['hasSpaces']) return 'Username cannot contain spaces';
    if (control.errors['invalidCharacters']) return 'Username can only contain letters, numbers, underscore, and hyphen';
    if (control.errors['mustStartWithLetter']) return 'Username must start with a letter';

    return '';
  }

  getPasswordError(): string {
    const control = this.form.get('password');
    if (!control?.touched || !control?.errors) return '';

    if (control.errors['required']) return 'Password is required';
    if (control.errors['minlength']) return 'Password must be at least 8 characters';

    return '';
  }

  onSubmit() {
    if (this.form.valid && this.usernameAvailable) {
      this.loading = true;
      this.error = null;

      this.kycService.saveAccountCredentials(this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/review']).then(() => {
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

  // Helper methods for template
  usernameMinLength(): boolean {
    return (this.form.get('username')?.value?.length || 0) >= 4;
  }

  usernameStartsWithLetter(): boolean {
    const username = this.form.get('username')?.value;
    return username ? /^[a-zA-Z]/.test(username) : false;
  }

  usernameValidChars(): boolean {
    const username = this.form.get('username')?.value;
    return username ? /^[a-zA-Z0-9_-]+$/.test(username) : false;
  }

  usernameNoSpaces(): boolean {
    const username = this.form.get('username')?.value;
    return username ? !/\s/.test(username) : false;
  }

  passwordMinLength(): boolean {
    return (this.form.get('password')?.value?.length || 0) >= 8;
  }

  passwordHasUppercase(): boolean {
    const password = this.form.get('password')?.value;
    return password ? /[A-Z]/.test(password) : false;
  }

  passwordHasLowercase(): boolean {
    const password = this.form.get('password')?.value;
    return password ? /[a-z]/.test(password) : false;
  }

  passwordHasNumber(): boolean {
    const password = this.form.get('password')?.value;
    return password ? /[0-9]/.test(password) : false;
  }

  hasSpecialChar(): boolean {
    const password = this.form.get('password')?.value;
    if (!password) return false;
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  goBack() {
    this.router.navigate(['/kyc/bank-info']);
  }
}
