import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: [
    './general-info.component.scss',
    '../shared-horizontal-form-styles.scss'
  ]
})
export class GeneralInfoComponent implements OnInit {
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

  initForm() {
    this.form = this.fb.group({
      investmentExperience: ['', Validators.required],
      investmentKnowledge: ['', Validators.required],
      riskTolerance: ['', Validators.required]
    });
  }

  loadData() {
    this.kycService.getGeneralInfo().subscribe({
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

      const payload = {
        ...this.form.value,
        answers: []
      };

      this.kycService.saveGeneralInfo(payload).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/fatca-info']);
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
    this.router.navigate(['/kyc/employment-info']);
  }
}
