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
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      secondName: [''],
      // thirdName: ['', Validators.required],
      familyName: ['', Validators.required],
      numOfDependents: [0, [Validators.min(0)]],
      netWorth: [''],
      netGrowth: [''],
      incomeSource: [[]]  // Changed to array
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

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const formData = {
        ...this.form.value,
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
