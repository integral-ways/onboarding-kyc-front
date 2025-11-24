import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: [
    './personal-info.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class PersonalInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  selectedIncomeSources: string[] = [];

  incomeSources = [
    { value: 'SALARY', label: 'Salary', icon: 'bi bi-cash-coin' },
    { value: 'BUSINESS', label: 'Business', icon: 'bi bi-shop' },
    { value: 'INVESTMENTS', label: 'Investments', icon: 'bi bi-graph-up' },
    { value: 'RENTAL', label: 'Rental Income', icon: 'bi bi-house-door' },
    { value: 'PENSION', label: 'Pension', icon: 'bi bi-piggy-bank' },
    { value: 'INHERITANCE', label: 'Inheritance', icon: 'bi bi-gift' },
    { value: 'FREELANCE', label: 'Freelance', icon: 'bi bi-laptop' },
    { value: 'OTHER', label: 'Other', icon: 'bi bi-three-dots' }
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
      // Personal Information
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      secondName: [''],
      lastName: [''],
      familyName: ['', Validators.required],
      fullNameAr: [{ value: '', disabled: true }], // Read-only from Nafath
      gender: [{ value: '', disabled: true }], // Read-only from Nafath
      birthDateHijri: [{ value: '', disabled: true }], // Read-only from Nafath
      birthDateGregorian: [{ value: '', disabled: true }], // Read-only from Nafath
      
      // Financial Information
      numOfDependents: [0, [Validators.min(0)]],
      netWorth: [''],
      netGrowth: [''],
      incomeSource: [[]], // Array
      
      // Contact Information
      primaryContact: [{ value: '', disabled: true }], // Read-only from Nafath
      altMobile: [''],
      countryCode: ['+966'],
      
      // Address Information
      country: [''],
      region: [''],
      city: [''],
      district: [''],
      street: [''],
      buildingNumber: [''],
      postalCode: [''],
      unitNumber: ['']
    });
  }

  loadData() {
    this.kycService.getPersonalInfo().subscribe({
      next: (data) => {
        if (data) {
          // Handle income sources - backend returns 'incomeSources' (plural)
          const incomeSources = data.incomeSources || data.incomeSource;
          if (incomeSources) {
            if (typeof incomeSources === 'string') {
              this.selectedIncomeSources = incomeSources.split(',').map((s: string) => s.trim());
            } else if (Array.isArray(incomeSources)) {
              this.selectedIncomeSources = [...incomeSources];
            }
          }
          
          // Patch form with data
          this.form.patchValue({
            ...data,
            incomeSource: this.selectedIncomeSources
          });
        }
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  onIncomeSourceChange(event: any, value: string) {
    if (event.target.checked) {
      this.selectedIncomeSources.push(value);
    } else {
      const index = this.selectedIncomeSources.indexOf(value);
      if (index > -1) {
        this.selectedIncomeSources.splice(index, 1);
      }
    }
    this.form.patchValue({ incomeSource: this.selectedIncomeSources });
  }

  isIncomeSourceSelected(value: string): boolean {
    return this.selectedIncomeSources.includes(value);
  }

  // Helper methods for header display
  getFullName(): string {
    const firstName = this.form.get('firstName')?.value || '';
    const secondName = this.form.get('secondName')?.value || '';
    const familyName = this.form.get('familyName')?.value || '';
    
    if (!firstName && !familyName) {
      return 'Guest'; // Default if no name
    }
    
    return [firstName, secondName, familyName].filter(n => n).join(' ');
  }

  getFullNameAr(): string {
    return this.form.get('fullNameAr')?.value || '';
  }

  getGender(): string {
    return this.form.get('gender')?.value || '';
  }

  getGenderIcon(): string {
    const gender = this.getGender().toLowerCase();
    if (gender === 'male') {
      return 'bi bi-gender-male';
    } else if (gender === 'female') {
      return 'bi bi-gender-female';
    }
    return 'bi bi-person';
  }

  getBirthDate(): string {
    const gregorian = this.form.get('birthDateGregorian')?.value;
    const hijri = this.form.get('birthDateHijri')?.value;
    
    if (gregorian && hijri) {
      return `${gregorian} (${hijri})`;
    } else if (gregorian) {
      return gregorian;
    } else if (hijri) {
      return hijri;
    }
    return '';
  }

  hasNafathData(): boolean {
    return !!(this.form.get('fullNameAr')?.value || this.form.get('gender')?.value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      // Include disabled fields (Nafath data) in submission
      const formData = {
        ...this.form.value,
        fullNameAr: this.form.get('fullNameAr')?.value,
        gender: this.form.get('gender')?.value,
        birthDateHijri: this.form.get('birthDateHijri')?.value,
        birthDateGregorian: this.form.get('birthDateGregorian')?.value,
        primaryContact: this.form.get('primaryContact')?.value,
        incomeSource: this.selectedIncomeSources  // Send as array
      };

      this.kycService.savePersonalInfo(formData).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/employment-info']);
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
    this.router.navigate(['/kyc']);
  }
}
