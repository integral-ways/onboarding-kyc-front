import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-start-onboarding',
  templateUrl: './start-onboarding.component.html',
  styleUrls: ['./start-onboarding.component.scss']
})
export class StartOnboardingComponent implements OnInit {
  startForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  error: string | null = null;
  otpSent = false;
  mobile = '';
  trxRef = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.startForm = this.fb.group({
      idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });
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
}
