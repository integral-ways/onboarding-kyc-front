import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  taxResidencies: Array<{country: string, tin: string}> = [];

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
      // US Status
      usCitizen: [false],
      usGreenCard: [false],
      usBirthCity: [''],
      usBirthState: [''],
      usTaxResident: [false],
      usTin: [''],
      noUsTin: [false],
      
      // Tax Residency
      taxResidencyCountries: [[]],
      taxResidencyTins: [[]],
      
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
          this.form.patchValue(data);
          
          // Initialize tax residencies from loaded data
          if (data.taxResidencyCountries && data.taxResidencyTins) {
            this.taxResidencies = [];
            const maxLength = Math.max(
              data.taxResidencyCountries.length, 
              data.taxResidencyTins.length
            );
            for (let i = 0; i < maxLength; i++) {
              this.taxResidencies.push({
                country: data.taxResidencyCountries[i] || '',
                tin: data.taxResidencyTins[i] || ''
              });
            }
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

      this.kycService.saveFatcaInfo(this.form.value).subscribe({
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
  
  // Tax Residency Management
  addTaxResidency() {
    this.taxResidencies.push({ country: '', tin: '' });
  }
  
  removeTaxResidency(index: number) {
    this.taxResidencies.splice(index, 1);
    this.updateTaxResidencyForm();
  }
  
  updateTaxResidencyForm() {
    const countries = this.taxResidencies.map(r => r.country).filter(c => c);
    const tins = this.taxResidencies.map(r => r.tin).filter(t => t);
    this.form.patchValue({
      taxResidencyCountries: countries,
      taxResidencyTins: tins
    });
  }
  
  // Computed properties
  get hasUsIndicators(): boolean {
    return this.form.get('usCitizen')?.value || 
           this.form.get('usGreenCard')?.value || 
           this.form.get('usTaxResident')?.value;
  }
  
  get showUsBirthPlace(): boolean {
    return this.form.get('usCitizen')?.value === true;
  }
  
  get showUsTin(): boolean {
    return this.hasUsIndicators && !this.form.get('noUsTin')?.value;
  }
}
