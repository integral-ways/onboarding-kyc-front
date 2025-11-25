import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PersonalInfoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  selectedIncomeSources: string[] = [];
  incomeSourceDropdownOpen = false;

  incomeSources = [
    { value: 'SALARY', label: 'Salary' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'INVESTMENTS', label: 'Investments' },
    { value: 'RENTAL', label: 'Rental Income' },
    { value: 'PENSION', label: 'Pension' },
    { value: 'INHERITANCE', label: 'Inheritance' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'OTHER', label: 'Other' }
  ];

  annualIncomeRanges = [
    { value: '0-50000', label: 'Less than 50,000 SAR' },
    { value: '50000-100000', label: '50,000 - 100,000 SAR' },
    { value: '100000-200000', label: '100,000 - 200,000 SAR' },
    { value: '200000-500000', label: '200,000 - 500,000 SAR' },
    { value: '500000-1000000', label: '500,000 - 1,000,000 SAR' },
    { value: '1000000+', label: 'More than 1,000,000 SAR' }
  ];

  netWorthRanges = [
    { value: '0-100000', label: 'Less than 100,000 SAR' },
    { value: '100000-500000', label: '100,000 - 500,000 SAR' },
    { value: '500000-1000000', label: '500,000 - 1,000,000 SAR' },
    { value: '1000000-5000000', label: '1,000,000 - 5,000,000 SAR' },
    { value: '5000000-10000000', label: '5,000,000 - 10,000,000 SAR' },
    { value: '10000000+', label: 'More than 10,000,000 SAR' }
  ];

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadData();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }

  closeDropdownOnClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-dropdown')) {
      this.incomeSourceDropdownOpen = false;
    }
  }

  educationLevels = [
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'DIPLOMA', label: 'Diploma' },
    { value: 'BACHELOR', label: 'Bachelor\'s Degree' },
    { value: 'MASTER', label: 'Master\'s Degree' },
    { value: 'DOCTORATE', label: 'Doctorate' },
    { value: 'OTHER', label: 'Other' }
  ];

  maritalStatuses = [
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' }
  ];

  initForm() {
    this.form = this.fb.group({
      // Personal Information
      // title: ['', Validators.required],
      firstName: ['', Validators.required],
      secondName: [''],
      lastName: [''],
      familyName: ['', Validators.required],
      fullNameAr: [{ value: '', disabled: true }], // Read-only from Nafath
      gender: [{ value: '', disabled: true }], // Read-only from Nafath
      birthDateHijri: [{ value: '', disabled: true }], // Read-only from Nafath
      birthDateGregorian: [{ value: '', disabled: true }], // Read-only from Nafath
      educationLevel: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      
      // Financial Information
      numOfDependents: [0, [Validators.min(0)]],
      approximateAnnualIncome: ['', Validators.required], // Dropdown range
      approximateNetWorth: ['', Validators.required], // Dropdown range
      incomeSource: [[], Validators.required] // Multi-select dropdown
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

  toggleIncomeSourceDropdown() {
    this.incomeSourceDropdownOpen = !this.incomeSourceDropdownOpen;
  }

  onIncomeSourceToggle(value: string) {
    const index = this.selectedIncomeSources.indexOf(value);
    if (index > -1) {
      this.selectedIncomeSources.splice(index, 1);
    } else {
      this.selectedIncomeSources.push(value);
    }
    this.form.patchValue({ incomeSource: this.selectedIncomeSources });
  }

  isIncomeSourceSelected(value: string): boolean {
    return this.selectedIncomeSources.includes(value);
  }

  getSelectedIncomeSourcesLabel(): string {
    if (this.selectedIncomeSources.length === 0) {
      return 'Select income sources';
    }
    if (this.selectedIncomeSources.length === 1) {
      const source = this.incomeSources.find(s => s.value === this.selectedIncomeSources[0]);
      return source ? source.label : '';
    }
    return `${this.selectedIncomeSources.length} sources selected`;
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
        incomeSource: this.selectedIncomeSources  // Send as array
      };

      this.kycService.savePersonalInfo(formData).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/address-info']);
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
