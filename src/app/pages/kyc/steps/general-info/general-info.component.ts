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
  isBeneficialOwner = true;

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
      // Investment Profile
      investmentExperience: ['', Validators.required],
      investmentKnowledge: ['', Validators.required],
      riskTolerance: ['', Validators.required],
      
      // Beneficial Owner
      isBeneficialOwner: [true, Validators.required],
      beneficialOwnerName: [''],
      
      // Financial Sector Questions
      workedInFinancialSector: [false, Validators.required],
      hasFinancialExperience: [false, Validators.required],
      isBoardMember: [false, Validators.required],
      isConnectedToBoardMember: [false, Validators.required],
      hasPublicPosition: [false, Validators.required],
      hasRelationshipWithPublicOfficial: [false, Validators.required]
    });

    // Listen to beneficial owner changes
    this.form.get('isBeneficialOwner')?.valueChanges.subscribe(value => {
      this.isBeneficialOwner = value;
      this.updateBeneficialOwnerValidation();
    });
  }

  updateBeneficialOwnerValidation() {
    const beneficialOwnerNameControl = this.form.get('beneficialOwnerName');
    
    if (!this.isBeneficialOwner) {
      beneficialOwnerNameControl?.setValidators([Validators.required]);
    } else {
      beneficialOwnerNameControl?.clearValidators();
    }
    
    beneficialOwnerNameControl?.updateValueAndValidity();
  }

  loadData() {
    this.kycService.getGeneralInfo().subscribe({
      next: (data) => {
        if (data) {
          // Set beneficial owner flag
          if (data.isBeneficialOwner !== undefined) {
            this.isBeneficialOwner = data.isBeneficialOwner;
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

      const payload = {
        ...this.form.value,
        answers: []
      };

      this.kycService.saveGeneralInfo(payload).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/fatca-info']).then(() => {
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
    this.router.navigate(['/kyc/employment-info']);
  }
}
