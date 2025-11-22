# KYC Components Implementation Guide

All step components follow the same pattern as PersonalInfoComponent. Here's how to create the remaining components:

## Component Structure

Each step component has:
- **HTML Template**: Form with fields specific to that step
- **TypeScript**: Form initialization, data loading, and saving
- **SCSS**: Shared styles from personal-info component

## Remaining Components to Create

### 1. Address Info Component
**Path**: `src/app/pages/kyc/steps/address-info/`

**Fields**:
- country (text)
- city (text, required)
- district (text)
- street (text)
- buildingNumber (text)

**Service Methods**:
- `kycService.getAddressInfo()`
- `kycService.saveAddressInfo(data)`

**Navigation**: Next → `/kyc/contact-info`

---

### 2. Contact Info Component
**Path**: `src/app/pages/kyc/steps/contact-info/`

**Fields**:
- primaryContact (text, required)
- altMobile (text)
- countryCode (text)

**Service Methods**:
- `kycService.getContactInfo()`
- `kycService.saveContactInfo(data)`

**Navigation**: Next → `/kyc/employment-info`

---

### 3. Employment Info Component
**Path**: `src/app/pages/kyc/steps/employment-info/`

**Fields**:
- employmentType (select: EMPLOYED, UNEMPLOYED, SELF_EMPLOYED)
- employerName (text)
- jobTitle (text)
- monthlyIncome (number)

**Service Methods**:
- `kycService.getEmploymentInfo()`
- `kycService.saveEmploymentInfo(data)`

**Navigation**: Next → `/kyc/general-info`

---

### 4. General Info Component
**Path**: `src/app/pages/kyc/steps/general-info/`

**Fields**:
- investmentExperience (select: Beginner, Intermediate, Advanced)
- investmentKnowledge (select: Low, Medium, High)
- riskTolerance (select: Conservative, Moderate, Aggressive)

**Service Methods**:
- `kycService.getGeneralInfo()`
- `kycService.saveGeneralInfo(data)`

**Navigation**: Next → `/kyc/fatca-info`

---

### 5. FATCA Info Component
**Path**: `src/app/pages/kyc/steps/fatca-info/`

**Fields**:
- usCitizen (checkbox/boolean)
- usTaxResident (checkbox/boolean)
- tin (text, required if US citizen/resident)

**Service Methods**:
- `kycService.getFatcaInfo()`
- `kycService.saveFatcaInfo(data)`

**Navigation**: Next → `/kyc/bank-info`

---

### 6. Bank Info Component
**Path**: `src/app/pages/kyc/steps/bank-info/`

**Fields**:
- bankName (text, required)
- iban (text, required, pattern: SA[0-9]{22})
- accountHolderName (text, required)

**Service Methods**:
- `kycService.getBankInfo()`
- `kycService.saveBankInfo(data)`

**Navigation**: Next → `/kyc/completion`

---

### 7. Completion Component
**Path**: `src/app/pages/kyc/completion/`

**Purpose**: Final step showing completion status

**Features**:
- Display all completed steps with checkmarks
- Show success message
- Option to review/edit any step
- Final submit button (if needed)

**Template**:
```html
<div class="completion-container text-center fade-in">
  <div class="success-icon">
    <i class="bi bi-check-circle-fill"></i>
  </div>
  <h2>Congratulations!</h2>
  <p>Your KYC registration is complete</p>
  
  <!-- Steps Review -->
  <div class="steps-review">
    <div class="step-item" *ngFor="let step of steps">
      <i class="bi bi-check-circle-fill text-success"></i>
      {{ step.name }}
    </div>
  </div>
  
  <button class="btn btn-primary-modern" (click)="goToDashboard()">
    Go to Dashboard
  </button>
</div>
```

---

## Quick Component Generation Commands

```bash
# Generate all components at once
ng generate component pages/kyc/steps/address-info
ng generate component pages/kyc/steps/contact-info
ng generate component pages/kyc/steps/employment-info
ng generate component pages/kyc/steps/general-info
ng generate component pages/kyc/steps/fatca-info
ng generate component pages/kyc/steps/bank-info
ng generate component pages/kyc/completion
```

## Component Template Pattern

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-[step-name]',
  templateUrl: './[step-name].component.html',
  styleUrls: ['./[step-name].component.scss']
})
export class [StepName]Component implements OnInit {
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
      // Add your fields here
    });
  }

  loadData() {
    this.kycService.get[StepName]().subscribe({
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

      this.kycService.save[StepName](this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/[next-step]']);
          }, 1000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to save';
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/kyc/[previous-step]']);
  }
}
```

## Styling

All components share the same SCSS:
```scss
@import '../personal-info/personal-info.component.scss';
```

Or copy the styles from personal-info component.

## Testing the Application

1. Start backend: `mvn spring-boot:run`
2. Start frontend: `ng serve`
3. Navigate to: `http://localhost:4200`
4. Test flow:
   - Start onboarding → Enter ID & Mobile
   - Login with OTP
   - Complete all 7 KYC steps
   - View completion page

## Features Working

✅ Dark/Light theme toggle
✅ English/Arabic language toggle
✅ RTL support for Arabic
✅ Progress tracking
✅ Step navigation
✅ Form validation
✅ API integration
✅ NgRx state management
✅ Responsive design
✅ Modern animations
