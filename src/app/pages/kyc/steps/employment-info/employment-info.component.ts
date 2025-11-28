import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-employment-info',
  templateUrl: './employment-info.component.html',
  styleUrls: [
    './employment-info.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class EmploymentInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  employmentYearsOptions = [
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-15', label: '10-15 years' },
    { value: '15-20', label: '15-20 years' },
    { value: '20+', label: 'More than 20 years' }
  ];

  initForm() {
    this.form = this.fb.group({
      employmentType: ['', Validators.required],
      employerName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      employmentYears: ['', Validators.required]
    });
  }

  loadData() {
    this.kycService.getEmploymentInfo().subscribe({
      next: (data) => {
        if (data) {
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

      this.kycService.saveEmploymentInfo(this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/general-info']).then(() => {
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
    this.router.navigate(['/kyc/contact-info']);
  }
}
