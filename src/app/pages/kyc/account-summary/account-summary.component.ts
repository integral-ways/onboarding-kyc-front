import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { KycService } from '../../../services/kyc.service';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit {
  accountData: any = null;
  loading = true;
  sendingEmail = false;
  emailSent = false;
  emailError: string | null = null;
  currentLang: 'en' | 'ar' = 'en';

  constructor(
    private kycService: KycService,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {
    this.currentLang = (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  }

  ngOnInit() {
    this.loadAccountSummary();
  }

  loadAccountSummary() {
    this.kycService.getAccountSummary().subscribe({
      next: (data: any) => {
        this.accountData = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load account summary', err);
        this.loading = false;
      }
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  goToDashboard() {
    // Navigate to dashboard or home page
    this.router.navigate(['/dashboard']);
  }

  sendDetailsToEmail() {
    this.sendingEmail = true;
    this.emailError = null;
    this.emailSent = false;

    this.kycService.sendAccountDetailsEmail().subscribe({
      next: (response: any) => {
        this.sendingEmail = false;
        this.emailSent = true;
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.emailSent = false;
        }, 5000);
      },
      error: (err: any) => {
        this.sendingEmail = false;
        this.emailError = err.error?.message || 'Failed to send email. Please try again.';
        
        // Reset error message after 5 seconds
        setTimeout(() => {
          this.emailError = null;
        }, 5000);
      }
    });
  }
}
