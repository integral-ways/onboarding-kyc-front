# KYC Steps Implementation Guide

## Overview
All 7 KYC steps have been implemented with full CRUD functionality.

## Implemented Steps

### 1. Personal Info (`/kyc/personal-info`)
- Fields: title, firstName, secondName, lastName, familyName, numOfDependents, netWorth, netGrowth, incomeSource
- Next: Address Info

### 2. Address Info (`/kyc/address-info`)
- Fields: country, city, district, street, buildingNumber
- Next: Contact Info

### 3. Contact Info (`/kyc/contact-info`)
- Fields: countryCode, primaryContact, altMobile
- Validation: 10-digit phone numbers
- Next: Employment Info

### 4. Employment Info (`/kyc/employment-info`)
- Fields: employmentType, employerName, jobTitle, occupation, employmentYears, monthlyIncome
- Employment types: EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, RETIRED, STUDENT
- Next: General Info

### 5. General Info (`/kyc/general-info`)
- Fields: investmentExperience, investmentKnowledge, riskTolerance
- Options for experience: NONE, BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- Options for knowledge: NONE, BASIC, GOOD, EXCELLENT
- Options for risk: LOW, MEDIUM, HIGH
- Next: FATCA Info

### 6. FATCA Info (`/kyc/fatca-info`)
- Fields: usCitizen (checkbox), usTaxResident (checkbox), tin (conditional)
- TIN field shows only if either checkbox is true
- Next: Bank Info

### 7. Bank Info (`/kyc/bank-info`)
- Fields: bankName, iban, accountHolderName
- IBAN validation: SA followed by 22 digits
- Next: Review (to be implemented)

## Features

### Each Component Includes:
- ✅ Form validation
- ✅ Load existing data on init
- ✅ Save functionality with API integration
- ✅ Success/error messages
- ✅ Loading states
- ✅ Back navigation
- ✅ Bilingual support (EN/AR)
- ✅ Responsive design

### API Integration:
- All components use `KycService` which automatically extracts data from unified API responses
- Error handling with automatic logout on 401
- Proper null checks for data safety

### Navigation Flow:
```
Personal Info → Address Info → Contact Info → Employment Info → 
General Info → FATCA Info → Bank Info → Review
```

## Translation Keys

All components use i18n with keys under `kyc.*`:
- `kyc.personalInfo.*`
- `kyc.addressInfo.*`
- `kyc.contactInfo.*`
- `kyc.employmentInfo.*`
- `kyc.generalInfo.*`
- `kyc.fatcaInfo.*`
- `kyc.bankInfo.*`
- `kyc.buttons.*`
- `kyc.messages.*`
- `kyc.validation.*`

## Styling

All components share common styles from `styles.scss`:
- Consistent form layouts
- Error states
- Success/error alerts
- Button styles
- Responsive design

## Auto-Redirect Feature

The KYC layout now automatically redirects users to their current step based on progress:

### How it works:
1. After login, user is redirected to `/kyc`
2. Layout component calls `/api/kyc/progress` to get current progress
3. Finds the first incomplete step from the response
4. Automatically redirects to that step

### Example Flow:
- User completes steps 1-4
- Logs out and logs back in
- Automatically redirected to step 5 (General Info)

### Progress Response Structure:
```json
{
  "currentStep": 5,
  "totalSteps": 7,
  "allStepsCompleted": false,
  "steps": {
    "personalInfo": { "stepNumber": 1, "completed": true },
    "addressInfo": { "stepNumber": 2, "completed": true },
    "contactInfo": { "stepNumber": 3, "completed": true },
    "employmentInfo": { "stepNumber": 4, "completed": true },
    "generalInfo": { "stepNumber": 5, "completed": false },
    "fatcaInfo": { "stepNumber": 6, "completed": false },
    "bankInfo": { "stepNumber": 7, "completed": false }
  }
}
```

## Next Steps

To complete the KYC flow:
1. Create Review component to show all entered data
2. Implement final submission
3. Add progress indicator in layout
4. Add step navigation in sidebar
