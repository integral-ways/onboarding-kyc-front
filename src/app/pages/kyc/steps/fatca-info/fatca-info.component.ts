import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-fatca-info',
  templateUrl: './fatca-info.component.html',
  styleUrls: ['./fatca-info.component.scss']
})
export class FatcaInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success = false;
  
  // Tax residency management
  taxResidencies: Array<{country: string, taxResidencyTin: string, noTinReason?: string}> = [];
  showTaxResidencyDialog = false;
  taxResidencyDialogForm!: FormGroup;
  
  // Countries list
  countries = [
    'United States',
    'Saudi Arabia',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'United Arab Emirates',
    'Kuwait',
    'Bahrain',
    'Qatar',
    'Oman',
    'Egypt',
    'Jordan',
    'Lebanon',
    'India',
    'Pakistan',
    'Bangladesh',
    'Philippines',
    'Indonesia',
    'Malaysia',
    'Singapore',
    'China',
    'Japan',
    'South Korea'
  ];

  constructor(
    private fb: FormBuilder,
    private kycService: KycService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.initTaxResidencyDialogForm();
    this.loadData();
  }

  initForm() {
    this.form = this.fb.group({
      // US Status - Radio button (only one can be selected)
      usStatus: ['none'], // Options: 'none', 'citizen', 'taxResident'
      usTin: [''],
      
      // Tax Residency
      taxResidency: [[]],
      
      // Certifications
      certifyInformationCorrect: [false, Validators.requiredTrue],
      agreeToNotifyChanges: [false, Validators.requiredTrue],
      certificationDate: [new Date().toISOString()]
    });
  }

  loadData() {
    this.kycService.getFatcaInfo().subscribe({
      next: (data) => {
        if (data) {
          // Convert old boolean fields to radio button value
          let usStatus = 'none';
          if (data.usCitizen) {
            usStatus = 'citizen';
          } else if (data.usTaxResident) {
            usStatus = 'taxResident';
          }
          
          this.form.patchValue({
            ...data,
            usStatus: usStatus
          });
          
          // Initialize tax residencies from loaded data
          if (data.taxResidency && data.taxResidency.length > 0) {
            this.taxResidencies = data.taxResidency.map((residency: any) => ({
              country: residency.country,
              taxResidencyTin: residency.taxResidencyTin || '',
              noTinReason: residency.noTinReason
            }));
          }
        }
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;
      
      // Update form with current tax residencies
      this.updateTaxResidencyForm();
      
      // Convert radio button value to boolean fields for backend
      const usStatus = this.form.get('usStatus')?.value;
      const formData = {
        ...this.form.value,
        usCitizen: usStatus === 'citizen',
        usTaxResident: usStatus === 'taxResident'
      };

      this.kycService.saveFatcaInfo(formData).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          
          // Auto-dismiss success message after 5 seconds
          setTimeout(() => {
            this.success = false;
          }, 5000);
          
          setTimeout(() => {
            this.router.navigate(['/kyc/bank-info']);
          }, 1000);
        },
        error: (err) => {
          console.error('Save error:', err);
          this.error = err.error?.message || err.message || 'Failed to save';
          this.loading = false;
          
          // Auto-dismiss error message after 5 seconds
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.error = 'Please complete all required fields and certifications';
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        this.error = null;
      }, 5000);
    }
  }

  goBack() {
    this.router.navigate(['/kyc/general-info']);
  }
  
  // Tax Residency Dialog Form
  initTaxResidencyDialogForm() {
    this.taxResidencyDialogForm = this.fb.group({
      country: ['', Validators.required],
      tin: [''],
      noTinReason: ['']
    });
    
    // Add validation: Either TIN or noTinReason must be provided
    this.taxResidencyDialogForm.setValidators(this.atLeastOneRequired('tin', 'noTinReason'));
  }
  
  // Custom validator: at least one field must have a value
  atLeastOneRequired(...fields: string[]) {
    return (control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const hasValue = fields.some(field => {
        const fieldControl = formGroup.get(field);
        return fieldControl && fieldControl.value && fieldControl.value.toString().trim() !== '';
      });
      return hasValue ? null : { atLeastOneRequired: true };
    };
  }
  
  // Tax Residency Management
  openTaxResidencyDialog() {
    this.showTaxResidencyDialog = true;
    this.taxResidencyDialogForm.reset();
    document.body.classList.add('modal-open');
  }
  
  closeTaxResidencyDialog() {
    this.showTaxResidencyDialog = false;
    this.taxResidencyDialogForm.reset();
    document.body.classList.remove('modal-open');
  }
  
  saveTaxResidency() {
    if (this.taxResidencyDialogForm.valid) {
      const formValue = this.taxResidencyDialogForm.value;
      this.taxResidencies.push({
        country: formValue.country,
        taxResidencyTin: formValue.tin || '',
        noTinReason: formValue.noTinReason || undefined
      });
      this.updateTaxResidencyForm();
      this.closeTaxResidencyDialog();
    }
  }
  
  removeTaxResidency(index: number) {
    this.taxResidencies.splice(index, 1);
    this.updateTaxResidencyForm();
  }
  
  updateTaxResidencyForm() {
    this.form.patchValue({
      taxResidency: this.taxResidencies
    });
  }
  
  // Computed properties
  get hasUsIndicators(): boolean {
    const status = this.form.get('usStatus')?.value;
    return status !== 'none' && status !== null && status !== '';
  }
  
  get showTaxResidency(): boolean {
    return this.form.get('usStatus')?.value === 'taxResident';
  }
}
