# Quick Start Guide

## Current Status

✅ **Working Components:**
- Login page
- Start onboarding page  
- KYC Layout with progress bar
- Personal Info step (fully functional)

⚠️ **To Complete:**
- Create remaining 6 step components (follow pattern below)

## Fix Applied

The `translate` pipe error has been fixed by:
1. Using `TranslateModule.forChild()` in feature modules
2. Using `TranslateModule.forRoot()` only in AppModule

## Running the Application

```bash
# 1. Install dependencies (if not done)
cd kyc-frontend
npm install

# 2. Start the development server
ng serve

# 3. Open browser
http://localhost:4200
```

## Creating Remaining Components

Use Angular CLI to generate components:

```bash
# Generate all step components
ng generate component pages/kyc/steps/address-info
ng generate component pages/kyc/steps/contact-info
ng generate component pages/kyc/steps/employment-info
ng generate component pages/kyc/steps/general-info
ng generate component pages/kyc/steps/fatca-info
ng generate component pages/kyc/steps/bank-info
ng generate component pages/kyc/completion
```

After generating, update `kyc.module.ts`:

```typescript
import { AddressInfoComponent } from './steps/address-info/address-info.component';
// ... import other components

const routes: Routes = [
  {
    path: '',
    component: KycLayoutComponent,
    children: [
      { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'address-info', component: AddressInfoComponent },
      // ... add other routes
    ]
  }
];

@NgModule({
  declarations: [
    KycLayoutComponent,
    PersonalInfoComponent,
    AddressInfoComponent,
    // ... add other components
  ],
  // ...
})
```

## Component Template (Copy from PersonalInfoComponent)

Each component follows the same pattern:

### TypeScript (.ts)
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycService } from '../../../../services/kyc.service';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit {
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
      country: [''],
      city: ['', Validators.required],
      district: [''],
      street: [''],
      buildingNumber: ['']
    });
  }

  loadData() {
    this.kycService.getAddressInfo().subscribe({
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

      this.kycService.saveAddressInfo(this.form.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/kyc/contact-info']);
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
    this.router.navigate(['/kyc/personal-info']);
  }
}
```

### HTML (.html)
Copy from `personal-info.component.html` and modify:
- Change step number
- Change title translation key
- Update form fields
- Update navigation routes

### SCSS (.scss)
```scss
@import '../personal-info/personal-info.component.scss';
```

## Testing Flow

1. **Start Backend**: `mvn spring-boot:run` (port 8080)
2. **Start Frontend**: `ng serve` (port 4200)
3. **Test Steps**:
   - Go to http://localhost:4200
   - Click "New User? Start Onboarding"
   - Enter ID: 1234567890, Mobile: 0512345678
   - Click "Send OTP"
   - Go back to login
   - Enter Mobile: 0512345678, OTP: 000000 (or actual OTP)
   - Click "Verify OTP"
   - You should see KYC dashboard with progress
   - Fill Personal Info form
   - Click Save → moves to next step

## Features Working

✅ Theme toggle (moon/sun icon)
✅ Language toggle (EN/AR button)
✅ RTL layout for Arabic
✅ Progress bar with step indicators
✅ Form validation
✅ API integration
✅ NgRx state management
✅ Responsive design

## Troubleshooting

### Issue: "No pipe found with name 'translate'"
**Solution**: Already fixed! TranslateModule.forChild() added to feature modules.

### Issue: Component not found
**Solution**: Generate component with `ng generate component` and add to module declarations.

### Issue: API connection failed
**Solution**: 
1. Check backend is running on port 8080
2. Check `environment.ts` has correct API URL
3. Check CORS is enabled in backend

### Issue: Token not persisting
**Solution**: Check browser localStorage for 'token' key. NgRx effects handle this automatically.

## Next Steps

1. Generate remaining components using Angular CLI
2. Copy and modify PersonalInfoComponent code
3. Update kyc.module.ts with new components
4. Test each step
5. Customize styling as needed

## Support

Refer to:
- `COMPONENTS_GUIDE.md` - Detailed component specifications
- `README.md` - Full documentation
- `personal-info.component.*` - Working example to copy from
