import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: [
    './address-info.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class AddressInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  liveOutsideKSA = false;

  countries = [
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'KW', label: 'Kuwait' },
    { value: 'BH', label: 'Bahrain' },
    { value: 'QA', label: 'Qatar' },
    { value: 'OM', label: 'Oman' },
    { value: 'EG', label: 'Egypt' },
    { value: 'JO', label: 'Jordan' },
    { value: 'LB', label: 'Lebanon' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'OTHER', label: 'Other' }
  ];

  saudiCities = [
    { value: 'Riyadh', label: 'Riyadh' },
    { value: 'Jeddah', label: 'Jeddah' },
    { value: 'Mecca', label: 'Mecca' },
    { value: 'Medina', label: 'Medina' },
    { value: 'Dammam', label: 'Dammam' },
    { value: 'Khobar', label: 'Khobar' },
    { value: 'Dhahran', label: 'Dhahran' },
    { value: 'Taif', label: 'Taif' },
    { value: 'Tabuk', label: 'Tabuk' },
    { value: 'Buraidah', label: 'Buraidah' },
    { value: 'Khamis Mushait', label: 'Khamis Mushait' },
    { value: 'Hail', label: 'Hail' },
    { value: 'Najran', label: 'Najran' },
    { value: 'Jubail', label: 'Jubail' },
    { value: 'Abha', label: 'Abha' },
    { value: 'Yanbu', label: 'Yanbu' },
    { value: 'Al-Kharj', label: 'Al-Kharj' },
    { value: 'OTHER', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.form = this.fb.group({
      liveOutsideKSA: [false],
      country: ['Saudi Arabia'],
      city: ['', Validators.required],
      district: [''],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      unitNumber: [''],
      additionalNumber: [''],
      postalCode: ['']
    });

    // Listen to checkbox changes
    this.form.get('liveOutsideKSA')?.valueChanges.subscribe(value => {
      this.liveOutsideKSA = value;
      this.updateValidators();
    });
  }

  updateValidators() {
    const countryControl = this.form.get('country');
    const cityControl = this.form.get('city');
    const districtControl = this.form.get('district');
    const additionalNumberControl = this.form.get('additionalNumber');

    if (this.liveOutsideKSA) {
      // Outside KSA: country dropdown required, city text input required, district optional
      countryControl?.setValidators([Validators.required]);
      cityControl?.setValidators([Validators.required]);
      districtControl?.clearValidators();
      additionalNumberControl?.clearValidators();
    } else {
      // Inside KSA: country fixed, city dropdown required, district required
      countryControl?.clearValidators();
      cityControl?.setValidators([Validators.required]);
      districtControl?.setValidators([Validators.required]);
      additionalNumberControl?.setValidators([Validators.required]);
      
      // Set country to Saudi Arabia
      countryControl?.setValue('Saudi Arabia');
    }

    countryControl?.updateValueAndValidity();
    cityControl?.updateValueAndValidity();
    districtControl?.updateValueAndValidity();
    additionalNumberControl?.updateValueAndValidity();
  }

  loadData() {
    this.kycService.getAddressInfo().subscribe({
      next: (data) => {
        if (data) {
          // Check if user lives outside KSA
          if (data.liveOutsideKSA || (data.country && data.country !== 'Saudi Arabia')) {
            this.liveOutsideKSA = true;
          }
          this.form.patchValue(data);
        }
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      this.kycService.saveAddressInfo(this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/contact-info']);
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
    this.router.navigate(['/kyc/personal-info']);
  }
}
