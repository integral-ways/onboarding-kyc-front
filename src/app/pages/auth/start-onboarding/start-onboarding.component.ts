import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { JwtService } from '../../../services/jwt.service';
import { NafathStatusResponse } from '../../../services/nafath.service';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-start-onboarding',
  templateUrl: './start-onboarding.component.html',
  styleUrls: ['./start-onboarding.component.scss']
})
export class StartOnboardingComponent implements OnInit, OnDestroy {
  startForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  error: string | null = null;
  otpSent = false;
  mobile = '';
  trxRef = '';
  currentLang = 'en';
  showNafathDialog = false;
  nafathTransactionId = '';
  nafathRequestId = '';
  private destroy$ = new Subject<void>();
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit() {
    this.startForm = this.fb.group({
      idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });

    // Subscribe to auth state for OTP verification
    this.store.select(selectAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.store.select(selectAuthError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.error = error;
          this.loading = false;
          this.autoHideError();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  private autoHideError() {
    // Clear any existing timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    
    // Set new timeout to hide error after 5 seconds
    this.errorTimeout = setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  onSubmitStart() {
    if (this.startForm.valid) {
      this.loading = true;
      this.error = null;

      this.authService.startOnboarding(this.startForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.mobile = this.startForm.value.mobile;
          this.trxRef = response.data.trxRef || '';
          this.otpSent = true;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to start onboarding';
          this.loading = false;
          this.autoHideError();
        }
      });
    }
  }

  onSubmitOtp() {
    if (this.otpForm.valid) {
      this.loading = true;
      this.error = null;

      const otp = this.otpForm.value.otp;
      const initiateNafath = true; // Enable Nafath authentication
      
      this.authService.verifyOtp(this.mobile, otp, this.trxRef, initiateNafath).subscribe({
        next: (response) => {
          this.loading = false;
          
          // Store JWT token in localStorage
          this.jwtService.saveToken(response.data.token);
          
          // Store JWT token in NgRx store (for AuthInterceptor)
          this.store.dispatch(AuthActions.setToken({ token: response.data.token }));
          
          // Check if Nafath was initiated
          if (response.data.nafathInitiated && response.data.nafathTransactionId) {
            // Show Nafath dialog
            this.nafathTransactionId = response.data.nafathTransactionId;
            this.nafathRequestId = response.data.nafathRequestId || '';
            this.showNafathDialog = true;
          } else {
            // Navigate to KYC dashboard
            this.router.navigate(['/kyc']);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to verify OTP';
          this.loading = false;
          this.autoHideError();
        }
      });
    }
  }

  onNafathCompleted(response: NafathStatusResponse) {
    console.log('Nafath completed event received:', response);
    
    if (!response.token) {
      console.error('No token in completed response');
      this.error = 'Authentication completed but no token received';
      this.showNafathDialog = false;
      this.autoHideError();
      return;
    }
    
    this.loading = true;
    const customerId = this.jwtService.getCustomerId();
    
    console.log('Customer ID from JWT:', customerId);
    
    if (!customerId) {
      this.error = 'Failed to get customer ID from token';
      this.showNafathDialog = false;
      this.loading = false;
      return;
    }
    
    // Complete Nafath authentication by calling /auth/nafath/complete
    console.log('Calling /auth/nafath/complete with token:', response.token);
    
    this.authService.completeNafathAuth(response.token, customerId).subscribe({
      next: (result) => {
        console.log('Nafath authentication completed successfully');
        console.log('User profile received:', result.data.profile);
        
        this.loading = false;
        this.showNafathDialog = false;
        
        // Navigate to KYC dashboard
        console.log('Navigating to /kyc dashboard');
        this.router.navigate(['/kyc']);
      },
      error: (err) => {
        console.error('Failed to complete Nafath authentication:', err);
        this.error = err.error?.message || 'Failed to complete Nafath authentication';
        this.loading = false;
        this.showNafathDialog = false;
        this.autoHideError();
      }
    });
  }

  onNafathCancelled() {
    this.showNafathDialog = false;
    // User cancelled - allow them to continue without Nafath
    this.router.navigate(['/kyc']);
  }

  onNafathFailed(message: string) {
    this.error = message;
    this.showNafathDialog = false;
    this.autoHideError();
    // Dialog will handle redirect to login if needed
    // No navigation here - let the dialog component handle it
  }

  goBack() {
    this.otpSent = false;
    this.otpForm.reset();
    this.error = null;
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(newLang);
    this.currentLang = newLang;
    
    // Update document direction for RTL
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  }
}
