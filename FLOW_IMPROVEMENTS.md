# Flow Improvements - Mobile & TrxRef Handling

## Changes Made

### 1. Mobile Number Pre-fill
**Problem**: User had to re-enter mobile number on login page after starting onboarding.

**Solution**: 
- Store mobile number in `sessionStorage` after successful onboarding start
- Pre-fill mobile field on login page
- Show helpful message "OTP sent to this number"

### 2. TrxRef Handling
**Problem**: Transaction reference from start onboarding wasn't being sent with OTP verification.

**Solution**:
- Capture `trxRef` from start onboarding response
- Store in `sessionStorage`
- Include in verify OTP request
- Clear session storage after login attempt

## Updated Flow

### Start Onboarding Flow
```
User enters ID & Mobile
    ↓
POST /api/auth/start
    ↓
Response: { trxRef: "xxx", message: "OTP sent" }
    ↓
Store in sessionStorage:
  - pendingMobile: "0512345678"
  - trxRef: "xxx"
    ↓
Redirect to Login page
```

### Login Flow
```
Login page loads
    ↓
Check sessionStorage for pendingMobile
    ↓
Pre-fill mobile field (if found)
    ↓
User enters OTP
    ↓
POST /api/auth/verify-otp
Body: {
  mobile: "0512345678",
  otp: "123456",
  trxRef: "xxx"  // ← Now included!
}
    ↓
Clear sessionStorage
    ↓
Redirect to KYC dashboard
```

## Files Modified

### 1. `start-onboarding.component.ts`
```typescript
// Store mobile and trxRef after successful start
sessionStorage.setItem('pendingMobile', mobile);
if (response.trxRef) {
  sessionStorage.setItem('trxRef', response.trxRef);
}
```

### 2. `login.component.ts`
```typescript
// Pre-fill mobile on init
ngOnInit() {
  // ...
  const pendingMobile = sessionStorage.getItem('pendingMobile');
  if (pendingMobile) {
    this.loginForm.patchValue({ mobile: pendingMobile });
  }
}

// Include trxRef in login
onSubmit() {
  const trxRef = sessionStorage.getItem('trxRef') || undefined;
  this.store.dispatch(AuthActions.login({ mobile, otp, trxRef }));
  
  // Clear after use
  sessionStorage.removeItem('pendingMobile');
  sessionStorage.removeItem('trxRef');
}
```

### 3. `auth.service.ts`
```typescript
// Updated to accept optional trxRef
verifyOtp(mobile: string, otp: string, trxRef?: string): Observable<JwtResponse> {
  const payload: any = { mobile, otp };
  if (trxRef) {
    payload.trxRef = trxRef;
  }
  return this.http.post<JwtResponse>(`${this.apiUrl}/verify-otp`, payload);
}
```

### 4. `auth.actions.ts`
```typescript
// Added optional trxRef parameter
export const login = createAction(
  '[Auth] Login',
  props<{ mobile: string; otp: string; trxRef?: string }>()
);
```

### 5. `auth.effects.ts`
```typescript
// Pass trxRef to service
switchMap(({ mobile, otp, trxRef }) =>
  this.authService.verifyOtp(mobile, otp, trxRef).pipe(
    // ...
  )
)
```

### 6. `login.component.html`
```html
<!-- Added helpful message -->
<small class="text-muted" *ngIf="loginForm.get('mobile')?.value">
  <i class="bi bi-info-circle me-1"></i>
  OTP sent to this number
</small>
```

## Benefits

✅ **Better UX**: User doesn't need to re-type mobile number
✅ **Proper Flow**: TrxRef is now sent with OTP verification
✅ **Clear Feedback**: User sees confirmation that OTP was sent to their number
✅ **Clean State**: Session storage is cleared after use
✅ **Backward Compatible**: Works even if trxRef is not provided

## Testing

### Test Scenario 1: Complete Flow
1. Go to "Start Onboarding"
2. Enter ID: 1234567890, Mobile: 0512345678
3. Click "Send OTP"
4. Verify mobile is pre-filled on login page
5. Enter OTP
6. Check network tab - verify-otp request should include trxRef

### Test Scenario 2: Direct Login
1. Go directly to login page
2. Mobile field should be empty
3. User can enter mobile manually
4. OTP verification works without trxRef

### Test Scenario 3: Multiple Attempts
1. Start onboarding with mobile A
2. Go to login, see mobile A pre-filled
3. Go back to start onboarding
4. Start with mobile B
5. Go to login, see mobile B pre-filled (not A)

## API Contract

### Start Onboarding Response
```json
{
  "message": "OTP sent",
  "trxRef": "TRX-123456789"  // Optional
}
```

### Verify OTP Request
```json
{
  "mobile": "0512345678",
  "otp": "123456",
  "trxRef": "TRX-123456789"  // Optional, sent if available
}
```

### Verify OTP Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Notes

- Using `sessionStorage` (not `localStorage`) for temporary data
- Data is cleared after successful login
- Data is cleared on page refresh
- TrxRef is optional - backend should handle both cases
- No sensitive data stored (just mobile number and transaction reference)
