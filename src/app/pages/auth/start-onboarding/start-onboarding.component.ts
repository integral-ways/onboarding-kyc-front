import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
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
  private destroy$ = new Subject<void>();
  private errorTimeout: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
      this.store.dispatch(AuthActions.login({ mobile: this.mobile, otp, trxRef: this.trxRef }));
    }
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
