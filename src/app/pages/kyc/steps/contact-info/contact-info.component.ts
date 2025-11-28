import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KycService } from '../../../../services/kyc.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: [
    './contact-info.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class ContactInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  loggedInMobile = '';
  currentLanguage = 'en';

  languages = [
    { value: 'en', label: 'English', icon: '🇬🇧' },
    { value: 'ar', label: 'العربية', icon: '🇸🇦' }
  ];

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.getLoggedInMobile();
    this.getCurrentLanguage();
    this.initForm();
    this.loadData();
  }

  getLoggedInMobile() {
    // Get mobile from localStorage or auth service
    const mobile = localStorage.getItem('userMobile') || '';
    this.loggedInMobile = mobile;
  }

  getCurrentLanguage() {
    // Get current language from localStorage or default to 'en'
    this.currentLanguage = localStorage.getItem('language') || 'en';
  }

  initForm() {
    this.form = this.fb.group({
      primaryContact: [{ value: this.loggedInMobile, disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      altMobile: ['', Validators.pattern(/^[0-9]{10}$/)],
      countryCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      preferredLanguage: ['', Validators.required]
    });
  }

  loadData() {
    this.kycService.getContactInfo().subscribe({
      next: (data) => {
        if (data) {
          // Don't override primaryContact if it's from logged-in user
          const patchData = { ...data };
          if (this.loggedInMobile) {
            patchData.primaryContact = this.loggedInMobile;
          }
          this.form.patchValue(patchData);
        } else if (this.loggedInMobile) {
          // If no data, set the logged-in mobile
          this.form.patchValue({ primaryContact: this.loggedInMobile });
        }
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      // Include disabled field value in submission
      const formData = {
        ...this.form.value,
        primaryContact: this.loggedInMobile || this.form.get('primaryContact')?.value
      };

      this.kycService.saveContactInfo(formData).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/employment-info']).then(() => {
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

  goBack() {
    this.router.navigate(['/kyc/address-info']);
  }
}
